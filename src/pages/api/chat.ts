import { PROJECTS } from "@/stores/db";
import type { NextApiRequest, NextApiResponse } from "next";

const { OPENAI_API_KEY } = process.env;

const API_URL = "https://api.openai.com/v1/chat/completions";

interface Data {
  error: string;
}

const projectsPrompt = PROJECTS.reduce(
  (acc, project) =>
    acc +
    `\n Nombre de proyecto: '${project.name}'. Descripción de proyecto: '${project.description}'. Fecha de creación del proyecto:'${project.createdDate}'.`,
  ""
);

const messages = [
  {
    role: "system",
    content:
      "Asume que eres un asistente virtual de una aplicación que administra proyectos. El usuario te va a ingresar los nombres, descripciónes y fechas de creacion de los proyectos que se tienen. El usuario también te consultará por estos proyectos, por sus nombres, descripción y fechas de creacion.",
  },
  {
    role: "user",
    content: "Estos son los proyectos que tenemos: " + projectsPrompt,
  },
  {
    role: "assistant",
    content: "Proyecto registrado.",
  },
  {
    role: "user",
    content: "Que proyectos tenemos actualmente?",
  },
  {
    role: "assistant",
    content:
      "Los proyectos que tenemos actualmente son: " +
      PROJECTS.reduce((acc, item) => "\n • " + acc + item.name + ", ", ""),
  },
  {
    role: "user",
    content:
      "Dame la descripcion del proyecto Provida - pedir información de clientes",
  },
  {
    role: "assistant",
    content:
      "La descripcion del proyecto 'Provida - pedir información de clientes' es: " +
      PROJECTS[1].description,
  },
];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== "GET") return res.status(405).end();

  const { prompt } = req.query;

  if (!prompt) return res.status(400).json({ error: "Prompt is required" });

  let promptToSend = prompt;

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [...messages, { role: "user", content: promptToSend }],
      stream: true,
      temperature: 0.0,
      stop: ["\ninfo:"],
    }),
  });

  if (!response.ok) {
    console.error(response.statusText);
    return res.status(500).json({ error: "Something went wrong" });
  }

  res.writeHead(200, {
    "Access-Control-Allow-Origin": "*",
    Connection: "keep-alive",
    "Cache-Control": "no-cache, no-transform",
    "Content-Encoding": "none",
    "Content-Type": "text/event-stream; charset=utf-8",
  });

  const reader = response.body?.getReader();
  const decoder = new TextDecoder("utf-8");

  while (true) {
    const { done, value } = await (reader?.read() || {});
    if (done) {
      return res.end("data: [DONE]\n\n"); // TODO: Devolveremos otra cosa
    }

    const chunk = decoder.decode(value);
    const transformedChunk = chunk
      .split("\n")
      .filter(Boolean)
      .map((line) => line.replace("data: ", "").trim());

    for (const data of transformedChunk) {
      if (data === "[DONE]") {
        return res.end("data: [DONE]\n\n"); // TODO: Devolveremos otra cosa
      }

      try {
        const json = JSON.parse(data);
        const { content } = json.choices?.[0]?.delta;
        content && res.write(`data: ${JSON.stringify(content)}\n\n`);
      } catch (error) {
        console.error(error);
      }
    }
  }
}

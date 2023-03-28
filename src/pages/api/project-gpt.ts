import { NextApiRequest, NextApiResponse } from "next";
import { Configuration, OpenAIApi } from "openai";

const messages = [
  {
    role: "system",
    content:
      "Asume que eres un creador de intrucciones. El usuario te pasará cosas que quiere hacer y tu le respondes con esas instrucciones.",
  },
  {
    role: "user",
    content:
      "Crea un proyecto con el nombre de: BECO y sus amigos. Y con una descripcion: BECO y sus amigos es un proyecto de desarrollo de videojuegos.",
  },
  {
    role: "assistant",
    content:
      "create|BECO y sus amigos|BECO y sus amigos es un proyecto de desarrollo de videojuegos",
  },
  {
    role: "user",
    content:
      "Crea un proyecto con el nombre de: BECO y sus amigos. Y con una descripcion: BECO y sus amigos es un proyecto de desarrollo de videojuegos.",
  },
  {
    role: "assistant",
    content:
      "create|BECO y sus amigos|BECO y sus amigos es un proyecto de desarrollo de videojuegos",
  },
  {
    role: "user",
    content:
      "Crea un proyecto con el nombre hacer demandas para provida cuya descripcion es Provida necesita que le hagamos demandas a sus clientes.",
  },
  {
    role: "assistant",
    content:
      "create|hacer demandas para provida|Provida necesita que le hagamos demandas a sus clientes",
  },
  {
    role: "user",
    content:
      "Nuevo proyecto, nombre: hacer demandas a Consultorio las Polvoras. Descripcion: EL consultorio se ha portado muy mal, tiene muchas quejas.",
  },
  {
    role: "assistant",
    content:
      "create|hacer demandas a Consultorio las Polvoras|EL consultorio se ha portado muy mal, tiene muchas quejas",
  },
] as const;

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export interface Intruccion {
  type: "create" | "update" | "delete";
  name: string;
  description: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{
    instruction?: Intruccion;
  }>
) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }
  const prompt = req.body.prompt;

  if (!prompt) {
    return res.status(400).end();
  }

  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [...messages, { role: "user", content: prompt }],
  });

  const content = completion.data.choices[0].message?.content;
  const project = content?.split("|").filter((x) => x.trim());
  const instruction = {
    type: project?.[0],
    name: project?.[1],
    description: project?.[2],
  };

  if (!instruction.type || !instruction.name || !instruction.description) {
    return res.status(400).end();
  }

  res.status(200).json({ instruction: instruction as Intruccion });
}

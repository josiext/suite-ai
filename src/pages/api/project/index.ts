import { Project, ProjectStore } from "@/stores/db";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Project[] | Project | null>
) {
  if (req.method === "GET") {
    const projects = (await ProjectStore.get()) || [];
    return res.status(200).json(projects);
  }

  if (req.method === "POST") {
    const { name, description, status } = req.body;
    const project = await ProjectStore.create({
      name,
      description,
      status,
    });
    return res.status(201).json(project);
  }

  return res.status(405).end();
}

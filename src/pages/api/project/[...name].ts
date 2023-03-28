import { Project, ProjectStore } from "@/stores/db";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Project | null>
) {
  if (req.method !== "PATCH") return res.status(405).end();

  const data = req.body;
  let { name } = req.query;
  name = Array.isArray(name) ? name[0] : name;

  if (!name || typeof name !== "string") return res.status(400).end();

  const project = await ProjectStore.update(name, data);

  return res.status(200).json(project);
}

import { v4 as uuid } from "uuid";
import storage from "node-persist";

export interface Project {
  id: string;
  name: string;
  description: string;
  status: "backlog" | "activo" | "terminado";
  createdAt: string;
}

const get = async (): Promise<Project[]> => {
  await storage.init();
  const projects = await storage.getItem("projects");
  return projects ? JSON.parse(projects) : [];
};

const create = async (
  project: Pick<Project, "name" | "description" | "status">
): Promise<Project> => {
  await storage.init();

  const newProject = {
    ...project,
    id: uuid(),
    createdAt: new Date().toISOString(),
  };
  await storage.setItem(
    "projects",
    JSON.stringify([...(await get()), newProject])
  );
  return newProject;
};

const update = async (
  name: Project["name"],
  data: Partial<Project>
): Promise<Project | null> => {
  let updatedProject: Project | null = null;
  const projects = (await get()).map((p) => {
    if (p.name === name) {
      updatedProject = { ...p, ...data };
      return updatedProject;
    }
    return p;
  });
  await storage.setItem("projects", JSON.stringify(projects));
  return updatedProject;
};

const remove = async (id: Project["id"]) => {
  const projects = (await get()).filter((project) => project.id !== id);
  await storage.setItem("projects", JSON.stringify(projects));
};

export const ProjectStore = {
  get,
  create,
  update,
  remove,
};

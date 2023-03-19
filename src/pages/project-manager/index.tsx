import { Project } from "@/stores/db";
import {
  Box,
  Text,
  Card,
  Button,
  Modal,
  Input,
  Select,
  Tag,
  TextArea,
} from "@suit-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";

export default function ProjectManager() {
  const [open, setOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [createForm, setCreateForm] = useState<{
    name: string;
    description: string;
    status: Project["status"];
  }>({ name: "", description: "", status: "backlog" });

  const [prompt, setPrompt] = useState("");

  const handleCreateProject = async ({
    name,
    description,
    status,
  }: Pick<Project, "name" | "description" | "status">) => {
    await axios.post("/api/projects", {
      name,
      description,
      status,
    });

    loadProjects();
  };

  const handlePromptGPT = async () => {
    const res = await axios.post("/api/project-gpt", {
      prompt,
    });

    const instruction = res.data.instruction;

    await handleCreateProject({
      name: instruction.name,
      description: instruction.description,
      status: "backlog",
    });

    await loadProjects();
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = () => {
    axios.get("/api/projects").then((res) => {
      setProjects(res.data);
    });
  };

  return (
    <>
      <Box className="flex flex-col h-full">
        <Text as="h1" className="text-3xl font-semibold">
          Project Manager
        </Text>

        <TextArea
          className="w-96 mt-4"
          placeholder="Crea un proyecton con el nombre..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />

        <Button className="w-96" onClick={() => handlePromptGPT()}>
          Procesar
        </Button>

        <Box className="mt-10">
          <Button onClick={() => setOpen(true)}>Crear Proyecto</Button>
          <Box className="mt-4 flex gap-10">
            {projects.map((project) => (
              <Card key={project.id} className="w-96">
                <Card.Header className="font-semibold">
                  <Text className="text-lg">{project.name}</Text>
                </Card.Header>
                <Card.Body>{project.description}</Card.Body>
                <Card.Footer>
                  <Text className="text-sm font-semibold">
                    Creado el {new Date(project.createdAt).toLocaleDateString()}
                    .
                  </Text>
                  <Tag className="mt-2">
                    <Tag.Label>{project.status}</Tag.Label>
                  </Tag>
                </Card.Footer>
              </Card>
            ))}
          </Box>
        </Box>
      </Box>

      <Modal isOpen={open} onClose={() => setOpen(false)}>
        <Modal.Overlay />
        <Modal.Content>
          <Modal.CloseButton />
          <Modal.Header>Crear Proyecto</Modal.Header>
          <Modal.Body>
            <Box className="flex flex-col gap-4">
              <Text as="label" className="text-sm font-semibold">
                Nombre del Proyecto
              </Text>
              <Input
                type="text"
                className="border border-neutral-300 rounded-md p-2"
                value={createForm.name}
                onChange={(e) =>
                  setCreateForm({ ...createForm, name: e.target.value })
                }
              />
              <Text as="label" className="text-sm font-semibold">
                Descripcion
              </Text>
              <Input
                type="text"
                className="border border-neutral-300 rounded-md p-2"
                value={createForm.description}
                onChange={(e) =>
                  setCreateForm({ ...createForm, description: e.target.value })
                }
              />

              <Select
                value={createForm.status}
                onChange={(e: any) =>
                  setCreateForm({ ...createForm, status: e.target.value })
                }
                options={[
                  {
                    label: "Backlog",
                    value: "backlog",
                  },
                  {
                    label: "Activo",
                    value: "activo",
                  },
                  {
                    label: "Terminado",
                    value: "terminado",
                  },
                ]}
              />
            </Box>
          </Modal.Body>
          <Modal.Footer>
            <Button
              className="mt-6"
              onClick={() => {
                handleCreateProject(createForm);
                setOpen(false);
                setCreateForm({ name: "", description: "", status: "backlog" });
              }}
            >
              Crear
            </Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </>
  );
}

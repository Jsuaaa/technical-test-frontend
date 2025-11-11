"use client";

import { useMemo, useState } from "react";
import {
  Button,
  ButtonSet,
  Grid,
  Heading,
  Layer,
  Section,
  Stack,
} from "@carbon/react";
import BoardView from "./BoardView";
import ListView from "./ListView";

export type TaskStatus = "backlog" | "in-progress" | "done";

export type TaskPriority = "Alta" | "Media" | "Baja";

export type Task = {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  owner: string;
  priority: TaskPriority;
};

export const TASK_STATUS_LABEL: Record<TaskStatus, string> = {
  backlog: "Pendiente",
  "in-progress": "En progreso",
  done: "Completada",
};

export const PRIORITY_KIND: Record<TaskPriority, "red" | "magenta" | "cyan"> = {
  Alta: "red",
  Media: "magenta",
  Baja: "cyan",
};

export const mockTasks: Task[] = [
  {
    id: "TASK-001",
    title: "Configurar API base",
    description: "Preparar endpoints iniciales y estructura del servicio.",
    status: "backlog",
    owner: "Ana Martínez",
    priority: "Alta",
  },
  {
    id: "TASK-002",
    title: "Diseño de interfaz",
    description: "Crear mockups para vista de tablero y lista.",
    status: "in-progress",
    owner: "Luis García",
    priority: "Media",
  },
  {
    id: "TASK-003",
    title: "Implementar autenticación",
    description: "Integrar login con proveedor externo y estados.",
    status: "in-progress",
    owner: "Carla Ruiz",
    priority: "Alta",
  },
  {
    id: "TASK-004",
    title: "Pruebas unitarias iniciales",
    description: "Cubrir lógica de negocio del módulo de tareas.",
    status: "done",
    owner: "Jorge Lucero",
    priority: "Baja",
  },
];

const TaskBoard = () => {
  const [view, setView] = useState<"board" | "list">("board");

  const tasksByStatus = useMemo(() => {
    return mockTasks.reduce<Record<TaskStatus, Task[]>>(
      (acc, task) => {
        acc[task.status].push(task);
        return acc;
      },
      { backlog: [], "in-progress": [], done: [] }
    );
  }, []);

  return (
    <Layer level={1} className="flex justify-center">
      <Section level={2} className="max-w-[1200px] mx-auto my-10 w-full">
        <Stack gap={6} className="p-4">
          <Stack gap={3}>
            <div className="flex flex-col gap-4">
              <Heading style={{ fontSize: "1.5rem" }}>
                Tablero de tareas
              </Heading>
              <span
                style={{
                  fontSize: "0.95rem",
                  color: "var(--cds-text-secondary, #525252)",
                }}
              >
                Cambia entre vistas para organizar y seguir el progreso de tu
                equipo.
              </span>
            </div>
            <ButtonSet>
              <Button
                aria-label="Vista tablero"
                kind={view === "board" ? "primary" : "secondary"}
                onClick={() => setView("board")}
              >
                Vista tablero
              </Button>
              <Button
                aria-label="Vista lista"
                kind={view === "list" ? "primary" : "secondary"}
                onClick={() => setView("list")}
              >
                Vista lista
              </Button>
            </ButtonSet>
          </Stack>
          <Grid condensed fullWidth>
            {view === "board" ? (
              <BoardView tasksByStatus={tasksByStatus} />
            ) : (
              <ListView tasks={mockTasks} />
            )}
          </Grid>
        </Stack>
      </Section>
    </Layer>
  );
};

export default TaskBoard;

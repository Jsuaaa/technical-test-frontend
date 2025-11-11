"use client";

import { useState } from "react";
import { Button, Heading, InlineNotification } from "@carbon/react";
import BoardView from "./BoardView";
import ListView from "./ListView";
import CreateTaskButton from "./CreateTaskButton";
import useTaskBoard from "../hooks/useTaskBoard";
import { TaskPriority } from "../types/task";

// * Task priority color mapping, usually this comes from a db
export const PRIORITY_KIND: Record<TaskPriority, "red" | "magenta" | "cyan"> = {
  [TaskPriority.HIGH]: "red",
  [TaskPriority.MEDIUM]: "magenta",
  [TaskPriority.LOW]: "cyan",
};

const TaskBoard = () => {
  const [view, setView] = useState<"board" | "list">("board");
  const { isLoading, isError, error, refetch } = useTaskBoard();

  return (
    <div className="flex justify-center px-4">
      <div className="w-full max-w-[1200px] my-10 space-y-6">
        <div className="flex flex-col gap-4">
          <Heading style={{ fontSize: "1.5rem" }}>Tablero de tareas</Heading>
          <span
            style={{
              fontSize: "0.95rem",
              color: "var(--cds-text-secondary, #525252)",
            }}
          >
            Cambia entre vistas para organizar y seguir el progreso de tu
            equipo.
          </span>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-3">
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
            </div>
            <CreateTaskButton
            />
          </div>
        </div>
        <div className="w-full">
          {isError ? (
            <div className="flex flex-col gap-4">
              <InlineNotification
                kind="error"
                role="alert"
                title="Error al cargar las tareas"
                subtitle={error instanceof Error ? error.message : undefined}
              />
              <Button kind="ghost" size="sm" onClick={() => refetch()}>
                Reintentar
              </Button>
            </div>
          ) : isLoading ? (
            <p className="text-sm text-gray-600">Cargando tareas...</p>
          ) : view === "board" ? (
            <BoardView />
          ) : (
            <ListView />
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskBoard;

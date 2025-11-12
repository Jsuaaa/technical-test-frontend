"use client";

import { Button, Heading, InlineNotification } from "@carbon/react";
import { useState } from "react";

import ListView from "./list/ListView";
import CreateTaskButton from "../../../common/CreateTaskButton";
import BoardView from "./board/BoardView";
import StatusTasks from "./tasksCounts/StatusTasks";
import SearchBar from "../../../common/SearchBar";
import TaskBoardProvider, {
  useTaskBoard,
} from "@/src/core/providers/TaskBoardProvider";

const TaskBoardContent = () => {
  const [view, setView] = useState<"board" | "list">("board");
  const {
    isLoading,
    isError,
    error,
    refetch,
    searchTerm,
    handleSearch,
    clearSearch,
  } = useTaskBoard();

  return (
    <div className="w-full space-y-6 max-w-[1200px]">
      <div className="flex flex-col gap-4">
        <StatusTasks />
        <Heading style={{ fontSize: "3rem", fontWeight: "bold" }}>
          Tablero de tareas
        </Heading>
        <span
          style={{
            fontSize: "0.95rem",
            color: "var(--cds-text-secondary, #525252)",
          }}
        >
          Cambia entre vistas para organizar y seguir tu proceso de trabajo.
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
          <div className="flex flex-wrap items-center gap-3">
            <SearchBar />
            <CreateTaskButton />
          </div>
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
        ) : view === "board" ? (
          <BoardView />
        ) : isLoading ? (
          <p className="text-sm text-gray-600">Cargando tareas...</p>
        ) : (
          <ListView />
        )}
      </div>
    </div>
  );
};

const TaskBoard = () => (
  <TaskBoardProvider>
    <TaskBoardContent />
  </TaskBoardProvider>
);

export default TaskBoard;

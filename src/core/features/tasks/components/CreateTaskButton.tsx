import { useState } from "react";
import { Button } from "@carbon/react";

import TaskEditModal from "./TaskEditModal";
import useTaskBoard from "../hooks/useTaskBoard";
import { Task } from "../types/task";
import { PlusIcon } from "lucide-react";

const CreateTaskButton = () => {
  const { handleCreateTask, isCreating } = useTaskBoard();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = (taskPayload: Omit<Task, "id">) => {
    handleCreateTask(taskPayload, {
      onSuccess: () => setIsModalOpen(false),
    });
  };

  return (
    <>
      <Button
        aria-label="Crear tarea"
        kind="tertiary"
        onClick={() => setIsModalOpen(true)}
        disabled={isCreating}
        className="flex items-center gap-2"
      >
        <PlusIcon className="w-4 h-4" />
        Nueva tarea
      </Button>
      {isModalOpen && (
        <TaskEditModal
          key="create-task"
          mode="create"
          open={true}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmit}
          isSubmitting={isCreating}
        />
      )}
    </>
  );
};

export default CreateTaskButton;

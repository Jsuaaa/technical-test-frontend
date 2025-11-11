import { useState } from "react";
import { Button } from "@carbon/react";

import TaskEditModal from "./TaskEditModal";
import useTaskBoard from "../hooks/useTaskBoard";
import { Task } from "../types/task";

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
        kind="primary"
        onClick={() => setIsModalOpen(true)}
        disabled={isCreating}
      >
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

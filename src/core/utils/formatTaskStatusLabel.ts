import { TaskStatus } from "../domain/task";

export const formatTaskStatusLabel = (status: TaskStatus): string => {
  switch (status) {
    case TaskStatus.BACKLOG:
      return "Backlog";
    case TaskStatus.IN_PROGRESS:
      return "En progreso";
    case TaskStatus.DONE:
      return "Completada";
    default:
      return status;
  }
};

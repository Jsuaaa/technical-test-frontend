import { TaskPriority } from "../domain/task";

export const formatTaskPriorityLabel = (priority: TaskPriority): string =>
  priority;

export type TaskActionCallbacks = {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
};

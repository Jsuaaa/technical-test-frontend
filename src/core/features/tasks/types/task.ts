export type Task = {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
};

export type UpdateTaskVariables = {
  id: string;
  task: Partial<Task>;
};

// * Enums
export enum TaskStatus {
  BACKLOG = "backlog",
  IN_PROGRESS = "in-progress",
  DONE = "done",
}

export enum TaskPriority {
  HIGH = "Alta",
  MEDIUM = "Media",
  LOW = "Baja",
}

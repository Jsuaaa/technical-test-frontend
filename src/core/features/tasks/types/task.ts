export type Task = {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
};

export type UpdateTaskVariables = {
  id: string;
  task: Partial<Task>;
};

import { Heading, Tag, Tile } from "@carbon/react";

import {
  PRIORITY_KIND,
  Task as TaskType,
  TASK_STATUS_LABEL,
} from "./TaskBoard";

const TaskComponent = ({ task }: { task: TaskType }) => {
  return (
    <Tile className="flex min-h-[200px] flex-col gap-2 rounded-lg bg-white/80 p-4 shadow-sm">
      <Tag type={PRIORITY_KIND[task.priority]} className="w-fit">
        {task.priority}
      </Tag>
      <Heading className="text-base font-semibold text-gray-900">
        {task.title}
      </Heading>
      <p className="text-sm text-gray-600">
        {task.description ?? "Sin descripción"}
      </p>
      <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-gray-900">
        <span className="text-sm">
          Responsable: <strong>{task.owner}</strong>
        </span>
        <Tag type="gray" className="w-fit">
          {TASK_STATUS_LABEL[task.status]}
        </Tag>
        <span className="text-xs text-gray-500">{task.id}</span>
      </div>
    </Tile>
  );
};

export default TaskComponent;

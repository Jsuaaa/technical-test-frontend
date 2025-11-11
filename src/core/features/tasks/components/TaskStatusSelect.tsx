import { Select, SelectItem } from "@carbon/react";

import { TaskStatus } from "../types/task";
import { TASK_STATUSES, formatTaskStatusLabel } from "../../../lib/utils";

type TaskStatusSelectProps = {
  id: string;
  value: TaskStatus;
  onChange: (value: TaskStatus) => void;
  hideLabel?: boolean;
  disabled?: boolean;
};

const TaskStatusSelect = ({
  id,
  value,
  onChange,
  hideLabel = false,
  disabled = false,
}: TaskStatusSelectProps) => (
  <Select
    id={id}
    labelText="Estado"
    hideLabel={hideLabel}
    value={value}
    onChange={(event) => onChange(event.target.value as TaskStatus)}
    disabled={disabled}
  >
    {TASK_STATUSES.map((status) => (
      <SelectItem key={status} value={status} text={formatTaskStatusLabel(status)} />
    ))}
  </Select>
);

export default TaskStatusSelect;

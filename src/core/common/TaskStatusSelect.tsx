import { Select, SelectItem } from "@carbon/react";

import { TaskStatus } from "../domain/task";
import { TASK_STATUSES } from "../data/constants";
import { formatTaskStatusLabel } from "../utils/formatTaskStatusLabel";

type TaskStatusSelectProps = {
  id: string;
  value: TaskStatus;
  onChange: (value: TaskStatus) => void;
  hideLabel?: boolean;
  disabled?: boolean;
  invalid?: boolean;
  invalidText?: string;
};

const TaskStatusSelect = ({
  id,
  value,
  onChange,
  hideLabel = false,
  disabled = false,
  invalid = false,
  invalidText,
}: TaskStatusSelectProps) => (
  <Select
    id={id}
    labelText="Estado"
    hideLabel={hideLabel}
    value={value}
    onChange={(event) => onChange(event.target.value as TaskStatus)}
    disabled={disabled}
    invalid={invalid}
    invalidText={invalidText}
  >
    {TASK_STATUSES.map((status) => (
      <SelectItem
        key={status}
        value={status}
        text={formatTaskStatusLabel(status)}
      />
    ))}
  </Select>
);

export default TaskStatusSelect;

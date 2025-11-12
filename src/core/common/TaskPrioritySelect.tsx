import { Select, SelectItem } from "@carbon/react";

import { TaskPriority } from "../domain/task";
import { TASK_PRIORITIES } from "../data/constants";
import { formatTaskPriorityLabel } from "../utils/formatTaskPriorityLabel";

type TaskPrioritySelectProps = {
  id: string;
  value: TaskPriority;
  onChange: (value: TaskPriority) => void;
  hideLabel?: boolean;
  disabled?: boolean;
};

const TaskPrioritySelect = ({
  id,
  value,
  onChange,
  hideLabel = false,
  disabled = false,
}: TaskPrioritySelectProps) => (
  <Select
    id={id}
    labelText="Prioridad"
    hideLabel={hideLabel}
    value={value}
    onChange={(event) => onChange(event.target.value as TaskPriority)}
    disabled={disabled}
  >
    {TASK_PRIORITIES.map((priority) => (
      <SelectItem
        key={priority}
        value={priority}
        text={formatTaskPriorityLabel(priority)}
      />
    ))}
  </Select>
);

export default TaskPrioritySelect;

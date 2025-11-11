import { FormEvent, useMemo, useState } from "react";
import {
  Heading,
  Modal,
  Select,
  SelectItem,
  TextArea,
  TextInput,
  ToastNotification,
} from "@carbon/react";

import TaskStatusSelect from "./TaskStatusSelect";
import { DEFAULT_TASK_PRIORITY, DEFAULT_TASK_STATUS } from "../../../lib/utils";
import { Task, TaskPriority, TaskStatus } from "../types/task";

type TaskFormState = {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
};

type TaskEditModalProps =
  | {
      mode: "edit";
      task: Task;
      open: boolean;
      onClose: () => void;
      onSubmit: (task: Task) => void;
      isSubmitting?: boolean;
    }
  | {
      mode: "create";
      task?: Partial<Omit<Task, "id">>;
      open: boolean;
      onClose: () => void;
      onSubmit: (task: Omit<Task, "id">) => void;
      isSubmitting?: boolean;
    };

const getInitialState = (props: TaskEditModalProps): TaskFormState => {
  if (props.mode === "edit") {
    return {
      title: props.task.title,
      description: props.task.description ?? "",
      status: props.task.status,
      priority: props.task.priority,
    };
  }

  return {
    title: props.task?.title ?? "",
    description: props.task?.description ?? "",
    status: props.task?.status ?? DEFAULT_TASK_STATUS,
    priority: props.task?.priority ?? DEFAULT_TASK_PRIORITY,
  };
};

const TaskEditModal = (props: TaskEditModalProps) => {
  const { open, onClose, isSubmitting } = props;

  const [formState, setFormState] = useState<TaskFormState>(() =>
    getInitialState(props)
  );
  const [formErrors, setFormErrors] = useState<string>();

  const modalHeading = props.mode === "edit" ? "Editar tarea" : "Crear tarea";
  const primaryButtonText =
    props.mode === "edit" ? "Actualizar tarea" : "Crear tarea";
  const fieldIdSuffix = props.mode === "edit" ? props.task.id : "nueva";

  const handleSubmit = (event?: FormEvent) => {
    if (event) {
      event.preventDefault();
    }

    if (!formState.title.trim()) {
      setFormErrors("El título es obligatorio");
      return;
    }

    if (!formState.description.trim()) {
      setFormErrors("La descripción es obligatoria");
      return;
    }

    if (!formState.status) {
      setFormErrors("Selecciona un estado para la tarea");
      return;
    }

    if (!formState.priority) {
      setFormErrors("Selecciona una prioridad");
      return;
    }

    setFormErrors(undefined);

    if (props.mode === "edit") {
      props.onSubmit({
        ...props.task,
        ...formState,
      });
    } else {
      props.onSubmit({
        title: formState.title,
        description: formState.description.trim() ? formState.description : "",
        status: formState.status,
        priority: formState.priority,
      });
    }
  };

  const priorityItems = useMemo(() => Object.values(TaskPriority), []);

  return (
    <Modal
      open={open}
      modalHeading={
        <Heading style={{ fontSize: "2rem", fontWeight: "bold" }}>
          {modalHeading}
        </Heading>
      }
      primaryButtonText={primaryButtonText}
      secondaryButtonText="Cancelar"
      onRequestClose={onClose}
      onRequestSubmit={handleSubmit}
      size="md"
      primaryButtonDisabled={isSubmitting}
    >
      <div className="flex flex-col gap-3">
        {formErrors && (
          <ToastNotification
            kind="error"
            title="Error de validación"
            subtitle={formErrors}
            timeout={3000}
            hideCloseButton={false}
            onClose={() => setFormErrors(undefined)}
          />
        )}
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <TextInput
            id={`task-title-${fieldIdSuffix}`}
            labelText="Título"
            value={formState.title}
            onChange={(event) =>
              setFormState((prev) => ({
                ...prev,
                title: event.target.value,
              }))
            }
            required
            disabled={isSubmitting}
          />
          <TextArea
            id={`task-description-${fieldIdSuffix}`}
            labelText="Descripción"
            value={formState.description}
            onChange={(event) =>
              setFormState((prev) => ({
                ...prev,
                description: event.target.value,
              }))
            }
            rows={4}
            disabled={isSubmitting}
          />
          <TaskStatusSelect
            id={`task-status-${fieldIdSuffix}`}
            value={formState.status}
            onChange={(value) =>
              setFormState((prev) => ({
                ...prev,
                status: value,
              }))
            }
          />
          <Select
            id={`task-priority-${fieldIdSuffix}`}
            labelText="Prioridad"
            value={formState.priority}
            onChange={(event) =>
              setFormState((prev) => ({
                ...prev,
                priority: event.target.value as TaskPriority,
              }))
            }
            disabled={isSubmitting}
          >
            {priorityItems.map((priority) => (
              <SelectItem key={priority} value={priority} text={priority} />
            ))}
          </Select>
        </form>
      </div>
    </Modal>
  );
};

export default TaskEditModal;

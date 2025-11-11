import { Column, Heading } from "@carbon/react";
import { Task, TASK_STATUS_LABEL, TaskStatus } from "./TaskBoard";
import TaskCard from "./Task";
import TaskComponent from "./Task";

const BoardView = ({
  tasksByStatus,
}: {
  tasksByStatus: Record<TaskStatus, Task[]>;
}) => (
  <>
    {(Object.keys(tasksByStatus) as TaskStatus[]).map((status) => (
      <Column
        key={status}
        sm={4}
        md={5}
        lg={4}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.75rem",
          minHeight: "100%",
        }}
      >
        <Heading style={{ fontSize: "1rem" }}>
          {TASK_STATUS_LABEL[status]}
        </Heading>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          {tasksByStatus[status].length ? (
            tasksByStatus[status].map((task) => (
              <TaskComponent key={task.id} task={task} />
            ))
          ) : (
            <TaskCard
              task={{
                id: `${status}-empty`,
                title: "Sin tareas",
                description: "No hay tareas en esta columna.",
                status,
                owner: "—",
                priority: "Baja",
              }}
            />
          )}
        </div>
      </Column>
    ))}
  </>
);

export default BoardView;

"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Column,
  Stack,
  StructuredListBody,
  StructuredListCell,
  StructuredListHead,
  StructuredListRow,
  StructuredListWrapper,
  Tag,
} from "@carbon/react";
import TaskComponent from "../../../../common/Task";
import TaskEditModal from "../../../../common/TaskEditModal";
import TaskActionsDropdown from "../../../../common/TaskActionsDropdown";
import { Task, TaskPriority } from "../../../../domain/task";
import useTaskBoard from "../../../../hooks/useTask";
import { formatTaskStatusLabel } from "@/src/core/utils/formatTaskStatusLabel";
import { PRIORITY_KIND } from "@/src/core/data/constants";

const MOBILE_BREAKPOINT = 768;

const ListView = () => {
  const { tasks, isUpdating, isDeleting, handleUpdateTask } = useTaskBoard();
  const [viewportWidth, setViewportWidth] = useState<number | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  useEffect(() => {
    const handleResize = () => setViewportWidth(window.innerWidth);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = useMemo(
    () => (viewportWidth ?? MOBILE_BREAKPOINT + 1) < MOBILE_BREAKPOINT,
    [viewportWidth]
  );

  return (
    <Column sm={4} md={8} lg={12} style={{ width: "100%" }}>
      {isMobile ? (
        <Stack gap={4}>
          {tasks.map((task) => (
            <TaskComponent key={task.id} task={task} />
          ))}
        </Stack>
      ) : (
        <div
          style={{
            width: "100%",
            overflowX: "auto",
            minHeight: "24rem",
            maxHeight: "550px",
            overflowY: "auto",
          }}
        >
          <StructuredListWrapper selection style={{ minWidth: "720px" }}>
            <StructuredListHead>
              <StructuredListRow head>
                <StructuredListCell head>ID</StructuredListCell>
                <StructuredListCell head>Título</StructuredListCell>
                <StructuredListCell head>Estado</StructuredListCell>
                <StructuredListCell head>Prioridad</StructuredListCell>
                <StructuredListCell head>Acciones</StructuredListCell>
              </StructuredListRow>
            </StructuredListHead>
            <StructuredListBody>
              {tasks.map((task) => (
                <StructuredListRow key={task.id}>
                  <StructuredListCell>FMCR #{task.id}</StructuredListCell>
                  <StructuredListCell>{task.title}</StructuredListCell>
                  <StructuredListCell>
                    <Tag type="gray">{formatTaskStatusLabel(task.status)}</Tag>
                  </StructuredListCell>
                  <StructuredListCell>
                    <Tag type={PRIORITY_KIND[task.priority as TaskPriority]}>
                      {task.priority}
                    </Tag>
                  </StructuredListCell>
                  <StructuredListCell>
                    <TaskActionsDropdown
                      triggerAriaLabel={`Abrir menú de acciones para ${task.title}`}
                      task={task}
                      onEditTask={(item) => setEditingTask(item)}
                      disabled={isUpdating || isDeleting}
                      showPriorityControl
                      showStatusControl
                    />
                  </StructuredListCell>
                </StructuredListRow>
              ))}
            </StructuredListBody>
          </StructuredListWrapper>
        </div>
      )}
      {editingTask && (
        <TaskEditModal
          key={`list-edit-${editingTask.id}-${editingTask.status}-${editingTask.priority}`}
          mode="edit"
          task={editingTask}
          open={true}
          onClose={() => setEditingTask(null)}
          onSubmit={(updatedTask) =>
            handleUpdateTask(updatedTask, {
              onSuccess: () => setEditingTask(null),
            })
          }
          isSubmitting={isUpdating}
        />
      )}
    </Column>
  );
};

export default ListView;

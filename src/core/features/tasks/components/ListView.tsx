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
import { PRIORITY_KIND, Task, TASK_STATUS_LABEL } from "./TaskBoard";
import TaskComponent from "./Task";

const MOBILE_BREAKPOINT = 768;

const ListView = ({ tasks }: { tasks: Task[] }) => {
  const [viewportWidth, setViewportWidth] = useState<number | null>(null);

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
        <div style={{ width: "100%", overflowX: "auto" }}>
          <StructuredListWrapper selection style={{ minWidth: "720px" }}>
            <StructuredListHead>
              <StructuredListRow head>
                <StructuredListCell head>ID</StructuredListCell>
                <StructuredListCell head>Título</StructuredListCell>
                <StructuredListCell head>Estado</StructuredListCell>
                <StructuredListCell head>Responsable</StructuredListCell>
                <StructuredListCell head>Prioridad</StructuredListCell>
              </StructuredListRow>
            </StructuredListHead>
            <StructuredListBody>
              {tasks.map((task) => (
                <StructuredListRow key={task.id}>
                  <StructuredListCell>{task.id}</StructuredListCell>
                  <StructuredListCell>{task.title}</StructuredListCell>
                  <StructuredListCell>
                    <Tag type="gray">{TASK_STATUS_LABEL[task.status]}</Tag>
                  </StructuredListCell>
                  <StructuredListCell>{task.owner}</StructuredListCell>
                  <StructuredListCell>
                    <Tag type={PRIORITY_KIND[task.priority]}>
                      {task.priority}
                    </Tag>
                  </StructuredListCell>
                </StructuredListRow>
              ))}
            </StructuredListBody>
          </StructuredListWrapper>
        </div>
      )}
    </Column>
  );
};

export default ListView;

import { Tile } from "@carbon/react";
import { TasksCountByStatus } from "../types/task";
import { formatTaskStatusLabel } from "@/src/core/lib/utils";

const StatusTaskCard = ({ status, total }: TasksCountByStatus) => {
  return (
    <Tile
      aria-label={`Tareas en ${status}: ${total}`}
      className="status-task-card"
    >
      <span className="cds--label">
        Tareas en {formatTaskStatusLabel(status)}
      </span>
      <p className="cds--heading-03">{total}</p>
    </Tile>
  );
};

export default StatusTaskCard;

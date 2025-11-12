import { useContext } from "react";

import TaskBoardProvider, {
  TaskBoardContext,
  type TaskBoardContextValue,
} from "../providers/TaskBoardProvider";

const useTaskBoard = (): TaskBoardContextValue => {
  const context = useContext(TaskBoardContext);

  if (!context) {
    throw new Error(
      "useTaskBoard debe usarse dentro de un TaskBoardProvider registrado."
    );
  }

  return context;
};

export { TaskBoardProvider };

export default useTaskBoard;

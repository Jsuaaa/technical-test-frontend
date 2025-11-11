import TaskBoard from "../components/TaskBoard";

const TasksPage = () => {
  return (
    <div className="flex flex-col gap-4" style={{ margin: "20px" }}>
      <TaskBoard />
    </div>
  );
};

export default TasksPage;

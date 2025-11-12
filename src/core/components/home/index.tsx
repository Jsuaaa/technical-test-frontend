import TaskBoard from "./taskBoard/TaskBoard";

const HomePage = () => {
  return (
    <div className="size-full flex justify-center" style={{ margin: "20px" }}>
      <TaskBoard />
    </div>
  );
};

export default HomePage;

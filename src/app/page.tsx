import TaskBoard from "../core/features/tasks/components/TaskBoard";
import MainLayout from "../core/shared/layouts/MainLayout";

export default function Home() {
  return (
    <MainLayout>
      <TaskBoard />
    </MainLayout>
  );
}

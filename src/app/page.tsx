import TasksPage from "../core/features/tasks/pages";
import MainLayout from "../core/shared/layouts/MainLayout";

export default function Home() {
  return (
    <MainLayout>
      <TasksPage />
    </MainLayout>
  );
}

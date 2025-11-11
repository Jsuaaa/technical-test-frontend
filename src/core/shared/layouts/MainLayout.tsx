import { ReactNode } from "react";

const MainLayout = ({ children }: { children: ReactNode }) => (
  <div className="w-full min-h-dvh flex justify-center px-4 sm:px-6">
    <div className="w-full max-w-screen-3xl">{children}</div>
  </div>
);

export default MainLayout;

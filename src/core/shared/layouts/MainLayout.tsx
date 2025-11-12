import { ReactNode } from "react";

const MainLayout = ({ children }: { children: ReactNode }) => (
  <div className="w-full min-h-dvh flex justify-center">
    <div className="w-full max-w-7xl">{children}</div>
  </div>
);

export default MainLayout;

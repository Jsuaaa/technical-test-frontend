import { ReactNode } from "react";

const MainLayout = ({ children }: { children: ReactNode }) => (
  <div className="w-full min-h-dvh flex justify-center">{children}</div>
);

export default MainLayout;

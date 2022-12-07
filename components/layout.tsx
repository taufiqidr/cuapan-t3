import { useSession } from "next-auth/react";
import React from "react";
import SidebarLeft from "./sidebarLeft";
import SidebarRight from "./sidebarRight";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { data: session } = useSession();

  return (
    <div className="mx-10 flex flex-row justify-between">
      <SidebarLeft session={session} />
      <main className="w-6/12">{children}</main>
      <SidebarRight session={session} />
    </div>
  );
};

export default Layout;

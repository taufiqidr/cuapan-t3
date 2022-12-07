import { useSession } from "next-auth/react";
import React from "react";
import SidebarLeft from "./sidebarLeft";
import SidebarRight from "./sidebarRight";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { data: session } = useSession();

  return (
    <div className="mx-10 flex flex-row justify-between">
      <SidebarLeft session={session} />
      <main className="min-h-screen w-6/12 border-x border-slate-500">
        {children}
      </main>
      <SidebarRight />
    </div>
  );
};

export default Layout;

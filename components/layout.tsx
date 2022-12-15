import { useSession } from "next-auth/react";
import React from "react";
import Footer from "./footer";
import NavBar from "./navbar";
import SidebarLeft from "./sidebar_left";
import SidebarRight from "./sidebar_right";

const Layout = ({ children }: { children: React.ReactNode }) => {
  // const { data: session } = useSession();
  const { data: session } = useSession();

  return (
    <div className="flex flex-col justify-between sm:mx-10 sm:flex-row">
      <SidebarLeft session={session} />
      <NavBar session={session} />
      <main className="min-h-screen dark:border-slate-500 sm:w-6/12 sm:border-x">
        {children}
      </main>
      <Footer />
      <SidebarRight />
    </div>
  );
};

export default Layout;

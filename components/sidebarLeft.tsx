import React from "react";
import { BsMegaphoneFill } from "react-icons/bs";

import { type Session } from "next-auth";
interface Props {
  session: Session | null;
}
const SidebarLeft = ({ session }: Props) => {
  return (
    <div className="sticky top-0 h-screen w-3/12">
      <div className="mx-auto flex h-full w-11/12 flex-col">
        <h1 className="text mt-1 flex items-center gap-x-3 py-2 text-3xl">
          <BsMegaphoneFill />
        </h1>
        <div className="mt-3 h-60 w-full rounded-lg bg-slate-700">
          {session ? "hello " + session?.user?.email : "Not logged in"}
        </div>
        <div className="mt-auto h-60 w-full rounded-lg bg-slate-700"></div>
      </div>
    </div>
  );
};

export default SidebarLeft;

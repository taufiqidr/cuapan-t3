import { signIn, signOut } from "next-auth/react";
import React from "react";
import { type Session } from "next-auth";
interface Props {
  session: Session | null;
}
const SidebarRight = ({ session }: Props) => {
  return (
    <div className="sticky top-0 h-screen w-3/12">
      <div className="mx-auto mt-1 flex w-11/12 flex-col">
        <input
          type="text"
          className=" w-full rounded-full bg-slate-700 py-2 px-6"
          placeholder="Search"
        />
        <div className="mt-3 h-60 w-full rounded-lg bg-slate-700">
          {!session && (
            <div
              onClick={() => signIn("discord")}
              className="mx-3 mt-3 cursor-pointer rounded-full bg-blue-600 px-3 py-2 text-center text-xl font-semibold hover:bg-blue-500"
            >
              Login with Discord
            </div>
          )}
          {session && (
            <div
              onClick={() => signOut()}
              className="mx-3 mt-3 cursor-pointer rounded-full bg-blue-600 px-3 py-2 text-center text-xl font-semibold hover:bg-blue-500"
            >
              Logout
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SidebarRight;

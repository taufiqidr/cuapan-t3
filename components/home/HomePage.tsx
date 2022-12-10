import { useSession } from "next-auth/react";
import React from "react";
import Feed from "../feed";
import NewStatus from "../newstatus";

const HomePageComp = () => {
  const { status } = useSession();

  return (
    <div>
      <h2 className="mt-1 ml-3 flex items-center gap-x-3  py-1 text-3xl font-semibold">
        Home
      </h2>
      {status === "authenticated" && <NewStatus />}
      <Feed />
    </div>
  );
};

export default HomePageComp;

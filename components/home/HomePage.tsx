import React from "react";
import Feed from "../feed";
import NewStatus from "../newstatus";

const HomePageComp = () => {
  return (
    <div>
      <h2 className="mt-1 ml-3 flex items-center gap-x-3 py-1 text-3xl font-semibold">
        Home
      </h2>
      <NewStatus />
      <Feed />
    </div>
  );
};

export default HomePageComp;

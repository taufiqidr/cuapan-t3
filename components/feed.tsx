import React from "react";
import Status from "./status";

const Feed = () => {
  const n = 20; // Or something else

  return (
    <div className="mt-3">
      {[...Array(n)].map((e, i) => (
        <Status key={i} />
      ))}
    </div>
  );
};

export default Feed;

import React from "react";
import { trpc } from "../src/utils/trpc";
import Loading from "./Loading";
import Status from "./status";

const Feed = () => {
  const { data, isLoading } = trpc.status.getAll.useQuery();

  if (isLoading) return <Loading />;
  return (
    <div className="mt-3">
      {data?.map((status) => (
        <Status
          id={status.id}
          key={status.id}
          name={status.user.name}
          text={status.text}
          username={status.user.username}
          UserImage={status.user.image}
          userId={status.user.id}
          image={status.image}
          time={status.createdAt.toISOString()}
        />
      ))}
    </div>
  );
};

export default Feed;

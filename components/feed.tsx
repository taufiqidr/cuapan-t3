import { useSession } from "next-auth/react";
import React from "react";
import { trpc } from "../src/utils/trpc";
import Loading from "./Loading";
import Status from "./status";

const Feed = () => {
  const { data, isLoading } = trpc.status.getAll.useQuery();
  const { data: session, status: loginStatus } = useSession();

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
          image={status.image}
          time={status.createdAt.toISOString()}
          userLike={Boolean(
            status.like.filter((s) => s.userId === session?.user?.id).length
          )}
          likeData={status.like.filter((s) => s.userId === session?.user?.id)}
          session={loginStatus}
          likeCount={status.like.length}
        />
      ))}
    </div>
  );
};

export default Feed;

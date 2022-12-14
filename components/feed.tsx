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
          likeCount={status.like.length}
          replyCount={status.reply.length}
          session={loginStatus}
          userId={status.user.id}
        />
      ))}
    </div>
  );
};

export default Feed;

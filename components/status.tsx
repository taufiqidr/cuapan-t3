import { formatDistanceToNow, parseISO } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { BsChat, BsHeart, BsHeartFill } from "react-icons/bs";
import { trpc } from "../src/utils/trpc";

interface Props {
  id: string;
  name?: string | null;
  username?: string | null;
  UserImage?: string | null;
  time?: string;
  text?: string;
  image?: string | null;
  userLike: boolean;
  likeData: {
    id: string;
    userId: string;
  }[];
  session: string;
  likeCount: number;
}
const Status = ({
  id,
  name,
  username,
  text,
  time,
  image,
  UserImage,
  userLike,
  likeData,
  session,
  likeCount,
}: Props) => {
  let pic;

  const [like, setLike] = useState(userLike);
  const utils = trpc.useContext();

  const likeStatus = trpc.status.likeStatus.useMutation({
    onMutate: () => {
      utils.status.getAll.cancel();
      const optimisticUpdate = utils.status.getAll.getData();
      if (optimisticUpdate) {
        utils.status.getAll.setData(undefined, [...optimisticUpdate]);
      }
    },
    onSuccess: () => {
      utils.status.getAll.invalidate();
      setLike(true);
    },
  });

  const dislikeStatus = trpc.status.dislikeStatus.useMutation({
    onMutate: () => {
      utils.status.getAll.cancel();
      const optimisticUpdate = utils.status.getAll.getData();

      if (optimisticUpdate) {
        utils.status.getAll.setData(undefined, [...optimisticUpdate]);
      }
    },
    onSuccess: () => {
      utils.status.getAll.invalidate();
      setLike(false);
    },
  });

  let likeGroup;

  if (session === "authenticated") {
    likeGroup = (
      <div
        className={`${like ? "text-red-500" : ""}  `}
        onClick={() => {
          if (!like) {
            likeStatus.mutate({
              statusId: id,
            });
          } else {
            dislikeStatus.mutate({
              id: String(likeData[0]?.id),
            });
          }
        }}
      >
        {like ? <BsHeartFill /> : <BsHeart />}{" "}
      </div>
    );
  } else if (session === "unauthenticated") {
    likeGroup = (
      <div
        className={`${like ? "text-red-500" : ""}  `}
        onClick={() => {
          setLike((prev) => !prev);
        }}
      >
        {like ? <BsHeartFill /> : <BsHeart />}{" "}
      </div>
    );
  }

  if (UserImage?.match(new RegExp("^[https]"))) {
    pic = () => String(UserImage);
  } else {
    pic = () =>
      String(
        `https://wdbzaixlcvmtgkhjlkqx.supabase.co/storage/v1/object/public/cuapan-image/user/${UserImage}`
      );
  }
  let timeAgo = "";
  if (time) {
    const date = parseISO(time);
    const timePeriod = formatDistanceToNow(date);
    timeAgo = `${timePeriod} ago`;
  }
  return (
    // <Link href={"/status/" + id}>
    <div className="flex h-auto w-full cursor-pointer border-t border-slate-500 hover:bg-white/5">
      <div className="mx-3 flex h-full w-full flex-row py-2">
        <div className="h-12 w-12 flex-none rounded-full bg-blue-500">
          <Image
            src={pic()}
            alt="profile pic"
            loader={pic}
            height={60}
            width={60}
            className="m-auto h-full w-full rounded-full object-cover"
            loading="lazy"
            unoptimized={true}
          ></Image>
        </div>
        <div className="ml-3 flex flex-col">
          <div className="flex items-center gap-x-3">
            <div className="hover:text-blue-500">
              <span className=" mr-3 font-bold">{name}</span>
              <span className="text-slate-500">@{username}</span>
            </div>
            <span className="text-slate-500">{timeAgo}</span>
          </div>
          <div className="flex flex-col">
            <p className="break-all">{text}</p>
            <div
              className={`${
                image ? "flex" : "hidden"
              }  mt-3 h-96 w-full rounded-lg bg-red-500`}
            >
              <Image
                src={`https://wdbzaixlcvmtgkhjlkqx.supabase.co/storage/v1/object/public/cuapan-image/status/${image}`}
                alt="status image"
                loader={() =>
                  `https://wdbzaixlcvmtgkhjlkqx.supabase.co/storage/v1/object/public/cuapan-image/status/${image}`
                }
                height={60}
                width={60}
                className="m-auto h-full w-full rounded-lg object-cover"
                loading="lazy"
                unoptimized={true}
              ></Image>
            </div>
          </div>

          <div className="mt-3 flex flex-row items-center gap-x-12 text-sm text-slate-500">
            <div className="flex items-center gap-x-3">
              <div className="">
                <BsChat />
              </div>
              <div className="">9999</div>
            </div>
            <div className={`flex items-center gap-x-3`}>
              {likeGroup}
              <div className=" ">{likeCount}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    // </Link>
  );
};

export default Status;

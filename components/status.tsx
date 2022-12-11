import Image from "next/image";
import Link from "next/link";
import React from "react";
import { BsChat, BsHeart } from "react-icons/bs";

interface Props {
  id: string;
  name?: string | null;
  username?: string | null;
  UserImage?: string | null;

  time?: string;
  text?: string;
  image?: string | null;
}
const Status = ({
  id,
  name,
  username,
  text,
  time,
  image,
  UserImage,
}: Props) => {
  let pic;

  if (UserImage?.match(new RegExp("^[https]"))) {
    pic = () => String(UserImage);
  } else {
    pic = () =>
      String(
        `https://wdbzaixlcvmtgkhjlkqx.supabase.co/storage/v1/object/public/cuapan-image/user/${UserImage}`
      );
  }
  return (
    <Link href={"/status/" + id}>
      <div className="flex h-36 max-h-36 w-full cursor-pointer border-t border-slate-500 hover:bg-white/5">
        <div className="mx-3 mt-3 flex h-full w-full flex-row">
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
              <span className=" font-bold">{name}</span>
              <span className="text-slate-500">@{username}</span>
              <span className="text-slate-500">{time}</span>
            </div>
            <p className="">{text}</p>
            <div className="my-2 flex flex-row gap-x-12">
              <div className="flex items-center gap-x-3">
                <BsChat /> 9999
              </div>
              <div className="flex items-center gap-x-3">
                <BsHeart /> 9999
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default Status;

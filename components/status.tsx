import Link from "next/link";
import React from "react";
import { BsChat, BsHeart } from "react-icons/bs";

const Status = () => {
  return (
    <Link href={"/status/1"}>
      <div className="flex h-36 max-h-36 w-full cursor-pointer border-t border-slate-500 hover:bg-white/5">
        <div className="mx-3 mt-3 flex h-full w-full flex-row">
          <div className="h-16 w-16 flex-none rounded-full bg-blue-500"></div>
          <div className="ml-3 flex flex-col">
            <div className="flex items-center gap-x-3">
              <span className=" font-bold">user.name</span>
              <span className="text-slate-500">@username</span>
              <span className="text-slate-500">1h ago</span>
            </div>
            <p className="">
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ab
              adipisci, praesentium reiciendis sunt laboriosam enim? Animi
              repellat similique voluptatibus voluptas?
            </p>
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

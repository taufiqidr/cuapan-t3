import Link from "next/link";
import React from "react";
import { BsChat, BsHeart } from "react-icons/bs";

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

const Status = () => {
  return (
    <Link href={"status/1"}>
      <div className="flex h-36 max-h-36 w-full cursor-pointer border-y border-slate-500 hover:bg-white/5">
        <div className="mx-3 mt-3 flex h-full w-full flex-row">
          <div className="h-16 w-16 flex-none rounded-full bg-blue-500"></div>
          <div className="ml-3 flex flex-col">
            <span className=" font-bold">user.name</span>
            <p className="">
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ab
              adipisci, praesentium reiciendis sunt laboriosam enim? Animi
              repellat similique voluptatibus voluptas?
            </p>
            <div className="my-2 flex flex-row gap-x-12">
              <BsChat />
              <BsHeart />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

import { useRouter } from "next/router";
import React from "react";
import { BsArrowLeft, BsChat, BsHeart } from "react-icons/bs";

const StatusPage = () => {
  const router = useRouter();
  return (
    <div className="mt-1 flex flex-col py-1 ">
      <div className="mx-3 flex flex-row text-3xl font-semibold">
        <div
          className="flex cursor-pointer flex-row items-center hover:text-blue-500"
          onClick={() => router.back()}
        >
          <BsArrowLeft />
        </div>
        <div className="ml-3">Status</div>
      </div>
      <div className="mx-3 mt-6 flex flex-col ">
        <div className="flex flex-row">
          <div className="h-16 w-16 flex-none rounded-full bg-blue-500"></div>
          <div className="ml-3 flex flex-col">
            <span className=" font-bold">Taufiq</span>
            <span className="text-slate-500">@username</span>
          </div>
        </div>
        <div className="mt-3 flex flex-col font-medium">
          <p className="">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Cumque
            enim suscipit quod explicabo aut? Asperiores, mollitia ullam. Itaque
            iure nam possimus debitis sint voluptatum praesentium voluptatem
            nobis soluta neque rem laborum, veritatis numquam blanditiis
            voluptates. Mollitia ea tempore quam qui ipsam repudiandae ipsum,
            totam quas distinctio maxime magnam provident! Id!
          </p>
          <p className="my-3 text-slate-500">10:32 AM · Nov 29, 2022</p>
          <div className="flex flex-row items-center justify-start gap-x-9 border-t py-3">
            <div className="my-auto">
              9999<span className="text-slate-500"> Reply</span>
            </div>
            <div className="my-auto">
              9999<span className="text-slate-500"> Likes</span>
            </div>
          </div>
          <div className="flex flex-row items-center justify-evenly border-y py-3 ">
            <BsChat />
            <BsHeart />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusPage;

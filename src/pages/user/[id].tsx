import { useRouter } from "next/router";
import React from "react";
import { BsArrowLeft } from "react-icons/bs";
import Status from "../../../components/status";

const UserPage = () => {
  const router = useRouter();
  return (
    <div className="mt-1 flex flex-col">
      <div className="z-20 mb-3 flex flex-row bg-black text-3xl font-semibold">
        <div
          className="ml-3 flex cursor-pointer flex-row items-center hover:text-blue-500"
          onClick={() => router.back()}
        >
          <BsArrowLeft />
        </div>
        <div className="ml-3 text-base">
          <div>Taufiq</div>
          <div className="text-slate-500">9999 status</div>
        </div>
      </div>
      <div className="flex h-64 flex-col">
        <div className="flex h-44 flex-col bg-yellow-500"></div>
        <button
          type="submit"
          className="mt-3 ml-auto mr-3 rounded-full bg-blue-700 py-2 px-8 text-center  font-medium text-white hover:bg-blue-800 focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900"
        >
          Edit Profile
        </button>
        <div className="absolute ml-3 mt-28 h-32 w-32 rounded-full bg-blue-500"></div>
      </div>
      <div className="mx-3 flex flex-col">
        <h1 className="text-2xl font-bold">Taufiq</h1>
        <span className="text-xl text-slate-500">@username</span>
        <p className="mt-3">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Accusantium
          repellat minima aliquam ea odio harum.
        </p>
        <div className="flex flex-row items-center justify-start gap-x-9 py-3">
          <div className="my-auto">
            9999<span className="text-slate-500"> Followers</span>
          </div>
          <div className="my-auto">
            9999<span className="text-slate-500"> Following</span>
          </div>
        </div>
      </div>
      <div className="mx-3 flex flex-row justify-between border-b">
        <div className="w-full py-3 text-center hover:bg-white/5">Status</div>
        <div className="w-full py-3 text-center hover:bg-white/5">Media</div>
      </div>
      {[...Array(20)].map((e, i) => (
        <Status key={i} />
      ))}
    </div>
  );
};

export default UserPage;

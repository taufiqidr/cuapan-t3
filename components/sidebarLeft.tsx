import React, { useState } from "react";
import { BsMegaphoneFill, BsHouseFill, BsPersonFill } from "react-icons/bs";
import { signIn, signOut } from "next-auth/react";

import { type Session } from "next-auth";
import Link from "next/link";
import Image from "next/image";
interface Props {
  session: Session | null;
}
const SidebarLeft = ({ session }: Props) => {
  const [show, setShow] = useState(true);

  let user_menu, pic;
  if (session?.user?.image?.match(new RegExp("^[https]"))) {
    pic = () => String(session.user?.image);
  } else {
    pic = () =>
      String(
        `https://ugulpstombooodglvogg.supabase.co/storage/v1/object/public/tokofication-image/user/${session?.user?.image}`
      );
  }
  if (session) {
    user_menu = (
      <div className="mt-auto mb-3 flex h-14 w-full cursor-pointer items-center rounded-full hover:bg-slate-700">
        <div
          className="ml-5 flex h-full w-full cursor-pointer flex-row items-center rounded-full"
          onClick={() => setShow((prev) => !prev)}
        >
          <div className="h-[36px] w-[36px] rounded-full border bg-slate-500">
            <Image
              src={pic()}
              alt="profile pic"
              loader={pic}
              height={36}
              width={36}
              className="h-full w-full  rounded-full border border-slate-500 object-cover hover:brightness-90"
              id="menu-button"
              aria-expanded="true"
              aria-haspopup="true"
              unoptimized={true}
              loading="lazy"
            ></Image>
          </div>
          <span className="ml-3 text-xl font-semibold">
            {session.user?.name}
          </span>
        </div>
      </div>
    );
  } else {
    user_menu = (
      <div className="mt-auto mb-3 flex h-14 w-full cursor-pointer items-center rounded-full ">
        <div
          onClick={() => signIn("discord")}
          className="mx-auto w-10/12 cursor-pointer rounded-full bg-blue-600 px-3 py-2 text-center text-xl font-semibold "
        >
          Login with Discord
        </div>
      </div>
    );
  }
  return (
    <div className="sticky top-0 h-screen w-3/12">
      <div className="mx-auto flex h-full w-11/12 flex-col ">
        <h1 className="mt-1 flex items-center gap-x-3  py-2 text-3xl">
          <BsMegaphoneFill />
        </h1>
        <div className="mt-4 w-full text-2xl font-semibold">
          <Link href={"/"}>
            <div className="w-full cursor-pointer rounded-full py-2 pl-5 hover:bg-slate-700">
              <span className="my-auto flex items-center gap-x-3">
                <BsHouseFill /> Home
              </span>
            </div>
          </Link>
          <Link href={"/user/1"}>
            <div className="w-full cursor-pointer rounded-full py-2 pl-5 hover:bg-slate-700">
              <span className="my-auto flex items-center gap-x-3">
                <BsPersonFill /> Profile
              </span>
            </div>
          </Link>
        </div>
        <div className="mt-auto flex flex-col justify-end">
          <div
            className="z-10 mx-auto mb-3 w-56 origin-bottom rounded-md bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
            role="menu"
            hidden={show}
            onMouseLeave={() => setShow(true)}
            aria-orientation="vertical"
            aria-labelledby="menu-button"
            tabIndex={-1}
          >
            <div className="py-1" role="none">
              <Link
                href="/me"
                className="block bg-slate-500 px-4 py-2 text-sm font-bold hover:bg-slate-600"
                role="menuitem"
                tabIndex={-1}
                id="menu-item-0"
              >
                {session?.user?.name}
              </Link>
              <Link
                href="/s"
                className="block px-4 py-2 text-sm hover:text-blue-500"
                role="menuitem"
                tabIndex={-1}
                id="menu-item-1"
              >
                Account settings
              </Link>
              <button
                className="block w-full px-4 py-2 text-left text-sm hover:text-blue-500"
                role="menuitem"
                tabIndex={-1}
                id="menu-item-3"
                onClick={() => signOut()}
              >
                Sign out
              </button>
            </div>
          </div>
          {user_menu}
        </div>
      </div>
    </div>
  );
};

export default SidebarLeft;

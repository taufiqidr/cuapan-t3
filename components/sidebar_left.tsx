import React, { useState } from "react";
import {
  BsMegaphoneFill,
  BsHouseFill,
  BsPersonFill,
  BsHouse,
  BsPerson,
} from "react-icons/bs";
import { signIn, signOut } from "next-auth/react";

import { type Session } from "next-auth";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
interface Props {
  session: Session | null | undefined;
}
const SidebarLeft = ({ session }: Props) => {
  const [show, setShow] = useState(true);
  const { pathname } = useRouter();

  let user_menu, pic;
  if (session?.user?.image?.match(new RegExp("^[https]"))) {
    pic = () => String(session.user?.image);
  } else {
    pic = () =>
      String(
        `https://wdbzaixlcvmtgkhjlkqx.supabase.co/storage/v1/object/public/cuapan-image/user/${session?.user?.image}`
      );
  }
  if (session) {
    user_menu = (
      <div className="mt-auto mb-3 flex h-14 w-full cursor-pointer items-center rounded-full border hover:bg-black/5 dark:border-slate-500 dark:hover:bg-white/5">
        <div
          className="ml-5 flex h-full w-full cursor-pointer flex-row items-center rounded-full"
          onClick={() => setShow((prev) => !prev)}
        >
          <div className="h-[36px] w-[36px] flex-none rounded-full border bg-slate-500">
            <Image
              src={pic()}
              alt="profile pic"
              loader={pic}
              height={36}
              width={36}
              className=" h-full w-full rounded-full border border-slate-500 object-cover hover:brightness-90"
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
          className="mx-auto w-10/12 cursor-pointer rounded-full bg-blue-600 px-3 py-2 text-center text-xl font-semibold text-white"
        >
          Login with Discord
        </div>
      </div>
    );
  }
  return (
    <div className="sticky top-0 hidden h-screen sm:flex sm:w-3/12 ">
      <div className="mx-auto flex h-full w-11/12 flex-col ">
        <h1 className="mt-1 flex items-center gap-x-3  py-2 text-3xl">
          <BsMegaphoneFill />
        </h1>
        <div className="mt-4 w-full text-2xl font-semibold">
          <Link href={"/"}>
            <div className="w-full cursor-pointer rounded-full py-2 pl-5 hover:bg-black/5 dark:hover:bg-white/5">
              <span className="my-auto flex items-center gap-x-3">
                {pathname === "/" ? <BsHouseFill /> : <BsHouse />} Home
              </span>
            </div>
          </Link>
          {session?.user?.id && (
            <Link href={"/user/" + session?.user?.id}>
              <div className="w-full cursor-pointer rounded-full py-2 pl-5 hover:bg-black/5 dark:hover:bg-white/5">
                <span className="my-auto flex items-center gap-x-3">
                  {pathname === "/user/[id]" ? <BsPersonFill /> : <BsPerson />}{" "}
                  Profile
                </span>
              </div>
            </Link>
          )}
        </div>
        <div className="mt-auto flex flex-col justify-end">
          <div
            className="z-10 mx-auto mb-3 w-56 origin-bottom rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
            role="menu"
            hidden={show}
            onMouseLeave={() => setShow(true)}
            aria-orientation="vertical"
            aria-labelledby="menu-button"
            tabIndex={-1}
          >
            <div className="py-1" role="none">
              <Link
                href={`/user/${session?.user?.id}`}
                className="block  px-4 py-2 text-sm font-bold hover:text-blue-500"
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

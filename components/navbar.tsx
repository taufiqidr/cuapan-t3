import React, { useState, useEffect } from "react";
interface Props {
  session: Session | null | undefined;
}
import { type Session } from "next-auth";
import { signIn, signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { BsMoonFill, BsPersonFill, BsSunFill } from "react-icons/bs";
import { useTheme } from "next-themes";

const NavBar = ({ session }: Props) => {
  const { systemTheme, theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  const renderThemeChanger = () => {
    if (!mounted) return null;
    const currentTheme = theme === "system" ? systemTheme : theme;

    if (currentTheme === "dark") {
      return (
        <BsSunFill
          className="m-auto  text-yellow-500"
          role="button"
          onClick={() => setTheme("light")}
        />
      );
    } else {
      return (
        <BsMoonFill
          className="m-auto text-gray-900 "
          role="button"
          onClick={() => setTheme("dark")}
        />
      );
    }
  };
  let user_menu, pic, user_image, user_nav;
  const [show, setShow] = useState(true);

  useEffect(() => {
    if (show) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }, [show]);

  if (session?.user?.image?.match(new RegExp("^[https]"))) {
    pic = () => String(session.user?.image);
  } else {
    pic = () =>
      String(
        `https://wdbzaixlcvmtgkhjlkqx.supabase.co/storage/v1/object/public/cuapan-image/user/${session?.user?.image}`
      );
  }
  if (session) {
    user_image = (
      <Image
        src={pic()}
        alt="profile pic"
        loader={pic}
        height={36}
        width={36}
        className=" h-full w-full rounded-full border border-slate-500 object-cover"
        id="menu-button"
        aria-expanded="true"
        aria-haspopup="true"
        unoptimized={true}
        loading="lazy"
      ></Image>
    );

    user_nav = (
      <div className="flex w-full cursor-pointer flex-col">
        <div className="h-8 w-8 rounded-full">
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
        <div className="mt-3 flex flex-col">
          <span className=" font-bold">{session.user?.name}</span>
          <span className=" text-sm text-slate-500">@username</span>
        </div>
        <div className="mt-10 flex border-t">
          <Link href={session?.user?.id ? "/user/" + session?.user?.id : "/"}>
            <div className="w-full py-2 font-bold">
              <span className="my-auto flex items-center gap-x-3">
                <BsPersonFill /> Profile
              </span>
            </div>
          </Link>
        </div>
      </div>
    );
    user_menu = (
      <div
        className="w-full py-2 font-bold"
        onClick={() => {
          setShow(false);
          signOut();
        }}
      >
        <span className="my-auto flex items-center gap-x-3 text-red-500">
          Log Out
        </span>
      </div>
    );
  } else {
    user_nav = (
      <div className="flex w-full cursor-pointer flex-col">
        <div className="h-8 w-8 rounded-full"></div>
        <div className="mt-3 flex flex-col">
          <span className=" font-bold">Not Logged in</span>
        </div>
      </div>
    );
    user_menu = (
      <div
        onClick={() => signIn("discord")}
        className="mx-auto w-full cursor-pointer rounded-lg bg-blue-600 py-2 text-center text-xl font-semibold text-white"
      >
        Login with Discord
      </div>
    );
  }

  return (
    <div className="item-center sticky top-0 flex justify-between border-b bg-white p-3 dark:border-slate-500 dark:bg-black sm:hidden">
      <div>
        <div className="flex w-full cursor-pointer items-center justify-between rounded-full ">
          <div
            className="flex h-full w-full cursor-pointer items-center rounded-full"
            onClick={() => setShow(true)}
          >
            <div className="h-8 w-8 flex-none rounded-full ">{user_image}</div>
          </div>
        </div>
        <div
          id="modal-container"
          aria-hidden="true"
          className={`fixed inset-0 z-50 bg-black/50 backdrop-blur-sm ${
            !show ? "hidden" : "flex"
          }`}
        >
          <div className="relative z-50 flex h-full w-3/4 flex-col bg-white shadow dark:bg-black">
            <div className="item-center m-3 flex justify-between">
              {user_nav}
              <button
                type="button"
                onClick={() => setShow(false)}
                className=" flex items-center justify-center rounded-lg bg-transparent text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-white"
                data-modal-toggle="authentication-modal"
              >
                <svg
                  aria-hidden="true"
                  className="mb-auto h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>
            <div className="m-3 mt-auto mb-14  flex border-t">{user_menu}</div>
          </div>
        </div>
      </div>
      <div className="flex text-3xl">{renderThemeChanger()}</div>
    </div>
  );
};

export default NavBar;

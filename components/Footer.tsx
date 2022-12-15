import Link from "next/link";
import React from "react";
import { BsHouseFill } from "react-icons/bs";

const Footer = () => {
  return (
    <div className="sticky bottom-0 z-0 flex justify-center border-t  bg-white p-3 dark:border-slate-500 dark:bg-black sm:hidden">
      <Link href={"/"}>
        <div className="text-2xl">
          <BsHouseFill />
        </div>
      </Link>
    </div>
  );
};

export default Footer;

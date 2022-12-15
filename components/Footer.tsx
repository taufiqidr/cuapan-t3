import Link from "next/link";
import React from "react";
import { BsHouseFill } from "react-icons/bs";

const Footer = () => {
  return (
    <div className="sticky bottom-0 z-0 flex justify-center border-t border-slate-500 bg-gray-50 p-3 dark:bg-black sm:hidden">
      <Link href={"/"}>
        <div className="text-2xl">
          <BsHouseFill />
        </div>
      </Link>
    </div>
  );
};

export default Footer;

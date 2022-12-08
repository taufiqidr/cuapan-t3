import { useTheme } from "next-themes";
import React, { useEffect, useState } from "react";
import { BsSunFill, BsMoonFill } from "react-icons/bs";

const SidebarRight = () => {
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
          className="h-10 w-10 text-yellow-500 "
          role="button"
          onClick={() => setTheme("light")}
        />
      );
    } else {
      return (
        <BsMoonFill
          className="h-10 w-10 text-gray-900 "
          role="button"
          onClick={() => setTheme("dark")}
        />
      );
    }
  };
  return (
    <div className="sticky top-0 h-screen w-3/12">
      <div className="mx-auto  flex w-11/12 flex-col ">
        <input
          type="text"
          className="mt-2 w-full rounded-full   bg-slate-700 py-2.5 px-6"
          placeholder="Search"
        />
        <div className="mt-3 flex h-60 w-full rounded-lg bg-slate-700">
          <div className="mt-auto flex h-12 w-full cursor-pointer border bg-gray-50 dark:bg-slate-500">
            <div className="m-auto">{renderThemeChanger()}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SidebarRight;

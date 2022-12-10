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
      <div className="mx-auto mt-2 flex w-11/12 flex-col ">
        <label
          htmlFor="search"
          className="sr-only mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Search
        </label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <svg
              aria-hidden="true"
              className="h-5 w-5 text-gray-500 dark:text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="search"
            id="search"
            className="w-full rounded-full border py-2.5 pl-10 dark:border-none dark:bg-slate-700"
            placeholder="Search"
          />
        </div>

        <div className="mt-3 flex h-60 w-full rounded-lg border dark:border-none dark:bg-slate-700">
          <div className="mt-auto flex h-12 w-full cursor-pointer rounded-b-lg border bg-gray-50 dark:border-none dark:bg-slate-500">
            <div className="m-auto">{renderThemeChanger()}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SidebarRight;

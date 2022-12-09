import { signIn } from "next-auth/react";
import React from "react";

const Unauthenticated = () => {
  return (
    <div className="mx-3 flex h-full w-auto flex-col ">
      <div className="flex h-full flex-col items-center justify-center text-center text-5xl">
        <p>You need to login to access this page</p>

        <div className="mt-3 mb-3 flex h-14 w-full cursor-pointer items-center rounded-full ">
          <div
            onClick={() => signIn("discord")}
            className="mx-auto w-10/12 cursor-pointer rounded-full bg-blue-600 px-3 py-2 text-center text-xl font-semibold "
          >
            Login with Discord
          </div>
        </div>
      </div>
    </div>
  );
};

export default Unauthenticated;

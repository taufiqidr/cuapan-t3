import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { BsArrowLeft } from "react-icons/bs";
import Loading from "../../../components/Loading";
import Status from "../../../components/status";
import UserNotFound from "../../../components/UserNotFound";
import { trpc } from "../../utils/trpc";

const UserPage = () => {
  const router = useRouter();
  const [modalHidden, setModalHidden] = useState(true);
  const { data: session } = useSession();
  const id = useRouter().query.id;
  const [userId, setUserId] = useState("");

  const { data, isLoading } = trpc.user.getOne.useQuery({
    id: userId as string,
  });

  useEffect(() => {
    if (id) setUserId(String(id));
  }, [id]);

  if (isLoading) return <Loading />;

  if (!data) return <UserNotFound />;

  let pic;
  if (data?.image?.match(new RegExp("^[https]"))) {
    pic = () => String(data?.image);
  } else {
    pic = () =>
      String(
        `https://ugulpstombooodglvogg.supabase.co/storage/v1/object/public/tokofication-image/user/${data?.image}`
      );
  }
  return (
    <div
      className={`mt-1 flex flex-col ${modalHidden ? "" : "overflow-hidden "}`}
    >
      <div
        id="modal-container"
        tabIndex={-1}
        aria-hidden="true"
        className={`fixed inset-0 z-50 bg-white/50 backdrop-blur-sm ${
          modalHidden ? "hidden" : "flex"
        }`}
      >
        {/* <div className="relative h-full w-full"> */}
        {/* Modal content */}
        <div className="relative m-auto h-5/6 w-1/2 rounded-lg bg-white shadow  dark:bg-black">
          <button
            type="button"
            onClick={() => setModalHidden(true)}
            className="absolute top-3 right-2.5 ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-white"
            data-modal-toggle="authentication-modal"
          >
            <svg
              aria-hidden="true"
              className="h-5 w-5"
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
          <div className="px-6 py-6 lg:px-8">
            <h3 className="mb-4 text-xl font-medium text-gray-900 dark:text-white">
              Sign in to our platform
            </h3>
            <form className="space-y-6" action="#">
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                >
                  Your email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-600 dark:text-white dark:placeholder-gray-400"
                  placeholder="name@company.com"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                >
                  Your password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-600 dark:text-white dark:placeholder-gray-400"
                  required
                />
              </div>
              <div className="flex justify-between">
                <div className="flex items-start">
                  <div className="flex h-5 items-center">
                    <input
                      id="remember"
                      type="checkbox"
                      defaultValue=""
                      className="focus:ring-3 h-4 w-4 rounded border border-gray-300 bg-gray-50 focus:ring-blue-300 dark:border-gray-500 dark:bg-gray-600 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
                      required
                    />
                  </div>
                  <label
                    htmlFor="remember"
                    className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >
                    Remember me
                  </label>
                </div>
                <a
                  href="#"
                  className="text-sm text-blue-700 hover:underline dark:text-blue-500"
                >
                  Lost Password?
                </a>
              </div>
              <button
                type="submit"
                className="w-full rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Login to your account
              </button>
              <div className="text-sm font-medium text-gray-500 dark:text-gray-300">
                Not registered?{" "}
                <a
                  href="#"
                  className="text-blue-700 hover:underline dark:text-blue-500"
                >
                  Create account
                </a>
              </div>
            </form>
          </div>
          {/* </div> */}
        </div>
      </div>

      <div className="z-20 mb-3 flex flex-row  text-3xl font-semibold">
        <div
          className="ml-3 flex cursor-pointer flex-row items-center hover:text-blue-500"
          onClick={() => router.back()}
        >
          <BsArrowLeft />
        </div>
        <div className="ml-3 text-base">
          <div>{data?.name}</div>
          <div className="text-slate-500">9999 status</div>
        </div>
      </div>

      <div className="flex h-64 flex-col">
        <div className="flex h-44 flex-col bg-yellow-500"></div>
        {session?.user?.id === data?.id && (
          <button
            onClick={() => setModalHidden(false)}
            className="mt-3 ml-auto mr-3 rounded-full  py-2 px-8 text-center font-medium ring-1 hover:bg-white/5 dark:text-white"
          >
            Edit Profile
          </button>
        )}

        <div className="absolute ml-3 mt-28 flex h-32 w-32 items-center justify-center rounded-full bg-white">
          <Image
            src={pic()}
            alt="profile pic"
            loader={pic}
            height={240}
            width={240}
            className="m-auto h-[96%] w-[96%] rounded-full object-cover"
            loading="lazy"
            unoptimized={true}
          ></Image>
        </div>
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

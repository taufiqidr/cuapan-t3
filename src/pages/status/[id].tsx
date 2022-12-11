import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import {
  BsArrowLeft,
  BsChat,
  BsHeart,
  BsThreeDotsVertical,
} from "react-icons/bs";
import Loading from "../../../components/Loading";
import NotFound from "../../../components/NotFound";
import { trpc } from "../../utils/trpc";

const StatusPage = () => {
  const router = useRouter();
  const [statusId, setStatusId] = useState("");
  const [text, setText] = useState("");
  const [command, setCommand] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const [show, setShow] = useState(true);
  const [modalHidden, setModalHidden] = useState(true);
  const id = useRouter().query.id;

  const { data, isLoading, isSuccess } = trpc.status.getOne.useQuery({
    id: statusId as string,
  });

  const { data: session } = useSession();

  const utils = trpc.useContext();

  const deleteStatus = trpc.status.deleteStatus.useMutation({
    onMutate: () => {
      utils.status.getAll.cancel();
      const optimisticUpdate = utils.status.getAll.getData();

      if (optimisticUpdate) {
        utils.status.getAll.setData(
          undefined,
          optimisticUpdate.filter((c) => c.id !== id)
        );
      }
    },
    onSuccess: () => {
      router.push("/");
    },
  });

  const updateStatus = trpc.status.updateStatus.useMutation({
    onMutate: () => {
      utils.status.getOne.cancel();
      const optimisticUpdate = utils.status.getOne.getData({
        id: statusId as string,
      });

      if (optimisticUpdate) {
        utils.status.getOne.setData(
          {
            id: statusId as string,
          },
          {
            ...optimisticUpdate,
          }
        );
      }
    },
    onSuccess: () => {
      utils.status.getOne.invalidate({
        id: statusId as string,
      });
      setModalHidden(true);
    },
  });

  useEffect(() => {
    if (id) setStatusId(String(id));
    setIsMounted(true);
  }, [id]);

  useEffect(() => {
    if (data) setText(data.text);
  }, [data]);

  if (isLoading) return <Loading />;

  if (!data && isMounted) return <NotFound message="Status Not Found" />;

  let pic, content, modalContent;

  if (command === "edit") {
    modalContent = (
      <div className="relative m-auto h-5/6 w-1/2 rounded-lg bg-white shadow dark:bg-black">
        <div className="m-5 flex flex-col ">
          <div className="item-center mb-3 flex justify-between">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">
              Edit Status
            </h3>
            <button
              type="button"
              onClick={() => setModalHidden(true)}
              className="items-center rounded-lg bg-transparent text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-white"
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
          </div>
          <form
            className="flex flex-col gap-6"
            onSubmit={(event) => {
              event.preventDefault();
              updateStatus.mutate({
                id: statusId,
                text: String(text),
                image: "",
              });
            }}
          >
            <div>
              <label
                htmlFor="text"
                className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
              >
                Status
              </label>
              <textarea
                id="text"
                className="block w-full resize-none rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                placeholder="Edit this status"
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={3}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 sm:w-auto"
            >
              Save
            </button>
          </form>
        </div>
      </div>
    );
  } else if (command === "delete") {
    modalContent = (
      <div className="relative m-auto h-auto w-1/3 rounded-lg bg-white shadow dark:bg-black">
        <div className="m-5 flex flex-col ">
          <div className="item-center mb-3 flex justify-between">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">
              Delete Status
            </h3>
            <button
              type="button"
              onClick={() => setModalHidden(true)}
              className="items-center rounded-lg bg-transparent text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-white"
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
          </div>
          <div className="flex flex-col gap-6">
            <p>Are you sure you want to delete this status?</p>
            <div className="flex gap-x-3">
              <button
                className="w-full rounded-lg bg-red-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800 sm:w-auto"
                onClick={() => {
                  deleteStatus.mutate({
                    id: statusId,
                  });
                }}
              >
                Yes
              </button>
              <button
                className="w-full rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 sm:w-auto"
                onClick={() => setModalHidden(true)}
              >
                No
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (data?.user.image?.match(new RegExp("^[https]"))) {
    pic = () => String(data?.user.image);
  } else {
    pic = () =>
      String(
        `https://wdbzaixlcvmtgkhjlkqx.supabase.co/storage/v1/object/public/cuapan-image/user/${data?.user.image}`
      );
  }
  if (isSuccess) {
    content = (
      <div className="mt-1 flex flex-col py-1 ">
        <div
          id="modal-container"
          aria-hidden="true"
          className={`fixed inset-0 z-50 bg-white/50 backdrop-blur-sm ${
            modalHidden ? "hidden" : "flex"
          }`}
        >
          {modalContent}
        </div>
        <div className="mx-3 flex flex-row text-3xl font-semibold">
          <div
            className="flex cursor-pointer flex-row items-center hover:text-blue-500"
            onClick={() => router.back()}
          >
            <BsArrowLeft />
          </div>
          <div className="ml-3">Status</div>
        </div>
        <div className="mx-3 mt-6 flex flex-col ">
          <div className="flex flex-row">
            <div className="h-16 w-16 flex-none rounded-full bg-blue-500">
              <Image
                src={pic()}
                alt="profile pic"
                loader={pic}
                height={60}
                width={60}
                className="m-auto h-full w-full rounded-full object-cover"
                loading="lazy"
                unoptimized={true}
              ></Image>
            </div>
            <div className="flex w-full flex-row justify-between">
              <div className="ml-3 flex flex-col">
                <span className=" font-bold">{data?.user.name}</span>
                <span className="text-slate-500">@{data?.user.username}</span>
              </div>
              {session?.user?.id === data?.user.id && (
                <div className="">
                  <div
                    className="cursor-pointer text-xl"
                    onClick={() => setShow((prev) => !prev)}
                  >
                    <BsThreeDotsVertical />
                  </div>
                  <div
                    className="absolute z-10 -ml-36 mt-2 w-40 origin-top-right rounded-md  bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                    role="menu"
                    hidden={show}
                    onMouseLeave={() => setShow(true)}
                    aria-orientation="vertical"
                    aria-labelledby="menu-button"
                    tabIndex={-1}
                  >
                    <div
                      className="cursor-pointer p-2 hover:bg-black/10"
                      onClick={() => {
                        setModalHidden(false);
                        setCommand("edit");
                      }}
                    >
                      Edit Status
                    </div>
                    <div
                      className="cursor-pointer p-2 hover:bg-black/10"
                      onClick={() => {
                        setModalHidden(false);
                        setCommand("delete");
                      }}
                    >
                      Delete Status
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="mt-3 flex flex-col font-medium">
            <p className="">{data?.text}</p>
            <p className="my-3 text-slate-500">
              {data?.createdAt.toDateString()}
            </p>
            <div className="flex flex-row items-center justify-start gap-x-9 border-t py-3">
              <div className="my-auto">
                9999<span className="text-slate-500"> Reply</span>
              </div>
              <div className="my-auto">
                9999<span className="text-slate-500"> Likes</span>
              </div>
            </div>
            <div className="flex flex-row items-center justify-evenly border-y py-3 ">
              <BsChat />
              <BsHeart />
            </div>
          </div>
        </div>
      </div>
    );
  }
  return content;
};

export default StatusPage;

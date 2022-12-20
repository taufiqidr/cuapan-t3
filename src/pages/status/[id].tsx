import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import {
  BsArrowLeft,
  BsChat,
  BsHeart,
  BsHeartFill,
  BsImage,
  BsThreeDotsVertical,
  BsTrashFill,
  BsXLg,
} from "react-icons/bs";
import Loading from "../../../components/Loading";
import NotFound from "../../../components/not_found";
import { trpc } from "../../utils/trpc";
import { v4 as uuidv4 } from "uuid";
import { deleteStatusPic, uploadStatusPic } from "../../utils/image";
import Link from "next/link";
import Head from "next/head";
import { formatDistanceToNow, parseISO } from "date-fns";

const StatusPage = () => {
  const router = useRouter();
  const [statusId, setStatusId] = useState("");
  const [userId, setUserId] = useState("");

  const { data, isLoading, isSuccess } = trpc.status.getOne.useQuery({
    id: statusId as string,
  });

  const { data: session, status } = useSession();

  const [text, setText] = useState("");
  const [userLike, setUserLike] = useState<boolean>(false);
  const [likeData, setLikeData] = useState<
    {
      id: string;
      userId: string;
    }[]
  >([]);
  const [likeCount, setLikeCount] = useState<number>(0);
  const [replyCount, setReplyCount] = useState<number>(0);
  const [image, setImage] = useState<string | null>("");
  const [imageFile, setImageFile] = useState<File | undefined>();
  const image_name = uuidv4() + ".jpg";
  const old_image = data?.image;

  const [command, setCommand] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const [replyMode, setReplyMode] = useState(false);
  const [show, setShow] = useState(true);
  const [modalHidden, setModalHidden] = useState(true);
  const id = useRouter().query.id;

  useEffect(() => {
    if (!modalHidden) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }, [modalHidden]);

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
    if (data) {
      setText(data.text);
      setUserId(data.user.id);
      setLikeData(data.like.filter((s) => s.userId === session?.user?.id));
      setUserLike(
        Boolean(data.like.filter((s) => s.userId === session?.user?.id).length)
      );
      setLikeCount(data.like.length);
      setReplyCount(data.reply.length);

      setImage(data.image);
    }
  }, [data, session?.user?.id]);

  const likeStatus = trpc.status.likeStatus.useMutation({
    onMutate: () => {
      utils.status.getAll.cancel();
      const optimisticUpdate = utils.status.getAll.getData();
      if (optimisticUpdate) {
        utils.status.getAll.setData(undefined, [...optimisticUpdate]);
      }
    },
    onSuccess: () => {
      utils.status.getAll.invalidate();
      setLikeCount(likeCount + 1);
      setUserLike(true);
    },
  });

  const dislikeStatus = trpc.status.dislikeStatus.useMutation({
    onMutate: () => {
      utils.status.getAll.cancel();
      const optimisticUpdate = utils.status.getAll.getData();

      if (optimisticUpdate) {
        utils.status.getAll.setData(undefined, [...optimisticUpdate]);
      }
    },
    onSuccess: () => {
      utils.status.getAll.invalidate();
      setLikeCount(likeCount - 1);
      setUserLike(false);
    },
  });

  let likeGroup;

  if (status === "authenticated") {
    likeGroup = (
      <div
        className={`${userLike ? "text-red-500" : ""} cursor-pointer `}
        onClick={() => {
          if (!userLike) {
            likeStatus.mutate({
              statusId: statusId,
            });
          } else {
            dislikeStatus.mutate({
              id: String(likeData[0]?.id),
            });
          }
        }}
      >
        {userLike ? <BsHeartFill /> : <BsHeart />}{" "}
      </div>
    );
  } else if (status === "unauthenticated") {
    likeGroup = (
      <div
        className={`${userLike ? "text-red-500" : ""} cursor-pointer `}
        onClick={() => {
          setUserLike((prev) => !prev);
        }}
      >
        {userLike ? <BsHeartFill /> : <BsHeart />}{" "}
      </div>
    );
  }

  if (isLoading) return <Loading />;

  if (!data && isMounted) return <NotFound message="Status Not Found" />;

  let pic, statusPic, content, modalContent;

  if (data?.user.image?.match(new RegExp("^[https]"))) {
    pic = () => String(data?.user.image);
  } else {
    pic = () =>
      String(
        `https://wdbzaixlcvmtgkhjlkqx.supabase.co/storage/v1/object/public/cuapan-image/user/${data?.user.image}`
      );
  }

  if (Boolean(image) !== false) {
    statusPic = () =>
      String(
        `https://wdbzaixlcvmtgkhjlkqx.supabase.co/storage/v1/object/public/cuapan-image/status/${image}`
      );
  }
  if (imageFile) {
    statusPic = () => URL.createObjectURL(imageFile);
  }

  if (command === "edit") {
    modalContent = (
      <div className="relative m-auto h-5/6 w-full bg-white shadow dark:bg-black sm:w-1/2 sm:rounded-lg">
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
                image: imageFile ? image_name : image,
              });
              if (image === "") {
                deleteStatusPic(old_image);
              }
              if (imageFile) {
                deleteStatusPic(old_image);
                uploadStatusPic(image_name, imageFile);
              }
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
                className="block w-full resize-none rounded-lg border border-gray-300 bg-gray-50 p-2.5  text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                placeholder="Edit this status"
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={3}
                required
              />
              <div
                className={`${
                  image || imageFile ? "flex" : "hidden"
                } mt-3 h-60 flex-col items-center justify-center rounded-lg`}
              >
                <div className="flex h-full w-full">
                  {statusPic && (
                    <Image
                      src={statusPic()}
                      alt="status pic"
                      loader={statusPic}
                      height={120}
                      width={120}
                      className="h-full w-full rounded-lg object-cover"
                      loading="lazy"
                    ></Image>
                  )}
                  <div
                    className="absolute mt-1 ml-1 cursor-pointer rounded-full border bg-black/50 p-2 hover:bg-black/80"
                    onClick={() => {
                      setImageFile(undefined);
                      setImage("");
                    }}
                  >
                    <BsXLg />
                  </div>
                </div>
              </div>
              <div className="ml-3 mt-3 flex justify-between">
                <div className="flex items-center text-xl">
                  <label
                    htmlFor="file_input"
                    className="flex items-center justify-center"
                  >
                    <div className="absolute mt-3 flex cursor-pointer items-center justify-center">
                      <BsImage />
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      className="absolute hidden"
                      id="file_input"
                      onChange={(e) =>
                        setImageFile(() =>
                          e.target.files ? e.target.files[0] : undefined
                        )
                      }
                    />
                  </label>
                </div>
              </div>
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
      <div className="relative m-auto h-auto w-11/12 rounded-lg bg-white shadow dark:bg-black sm:w-1/3">
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
                  if (old_image) deleteStatusPic(old_image);
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

  if (isSuccess) {
    content = (
      <div className="flex flex-col pb-1 sm:mt-1 ">
        <Head>
          <title>{`${data?.user.username}: ${data?.text}`}</title>
        </Head>
        <div
          id="modal-container"
          aria-hidden="true"
          className={`fixed inset-0 z-50 bg-black/50 backdrop-blur-sm ${
            modalHidden ? "hidden" : "flex"
          }`}
        >
          {modalContent}
        </div>
        <div className="mx-3 flex flex-row text-xl sm:text-3xl">
          <div
            className="flex cursor-pointer flex-row items-center font-extrabold hover:text-blue-500"
            onClick={() => router.back()}
          >
            <BsArrowLeft />
          </div>
          <div className="ml-3">Status</div>
        </div>
        <div className="mx-3 mt-6 flex flex-col ">
          <div className="flex flex-row">
            <div className="h-16 w-16 flex-none rounded-full bg-blue-500">
              <Link href={"/user/" + userId}>
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
              </Link>
            </div>
            <div className="flex w-full flex-row justify-between">
              <Link href={"/user/" + userId}>
                <div className="ml-3 flex flex-col">
                  <span className=" font-bold hover:text-blue-500">
                    {data?.user.name}
                  </span>
                  <span className="text-slate-500">@{data?.user.username}</span>
                </div>
              </Link>
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
            <div className="flex flex-col">
              <p className="break-all">{data?.text}</p>
              <div
                className={`${
                  image ? "flex" : "hidden"
                }  mt-3 h-96 w-full rounded-lg bg-red-500`}
              >
                <Image
                  src={`https://wdbzaixlcvmtgkhjlkqx.supabase.co/storage/v1/object/public/cuapan-image/status/${image}`}
                  alt="status image"
                  loader={() =>
                    `https://wdbzaixlcvmtgkhjlkqx.supabase.co/storage/v1/object/public/cuapan-image/status/${image}`
                  }
                  height={60}
                  width={60}
                  className="m-auto h-full w-full rounded-lg object-cover"
                  priority={true}
                  unoptimized={true}
                ></Image>
              </div>
            </div>
            <p className="my-3 text-slate-500">
              {data?.createdAt.toDateString()}
            </p>
            <div className="flex flex-row items-center justify-start gap-x-9 border-t py-3">
              <div className="my-auto">
                {replyCount}
                <span className="text-slate-500"> Reply</span>
              </div>
              <div className="my-auto">
                {likeCount}
                <span className="text-slate-500"> Likes</span>
              </div>
            </div>
            <div className="flex flex-row items-center justify-evenly border-y py-3 ">
              <div
                className="cursor-pointer"
                onClick={() => setReplyMode((prev) => !prev)}
              >
                <BsChat />
              </div>

              {likeGroup}
            </div>
          </div>
        </div>
        {replyMode && status === "authenticated" && (
          <NewReply statusId={statusId} />
        )}
        <Replies
          statusId={statusId}
          sessionUserId={String(session?.user?.id)}
        />
      </div>
    );
  }
  return content;
};

export default StatusPage;

interface Props {
  statusId: string;
}
const NewReply = ({ statusId }: Props) => {
  const utils = trpc.useContext();
  const [text, setText] = useState("");

  const createReply = trpc.reply.createReply.useMutation({
    onMutate: () => {
      utils.reply.getAll.cancel();
      const optimisticUpdate = utils.reply.getAll.getData({
        statusId: statusId,
      });
      if (optimisticUpdate) {
        utils.reply.getAll.setData(
          {
            statusId: statusId,
          },
          [...optimisticUpdate]
        );
      }
    },
    onSuccess: () => {
      utils.reply.getAll.invalidate();
      setText("");
    },
  });

  return (
    <div className="mx-3 mt-4 flex flex-col">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          createReply.mutate({
            text: String(text),
            statusId: statusId,
          });
          setText("");
        }}
      >
        <textarea
          className="block w-full resize-none overflow-auto border-b bg-inherit py-2.5 outline-0 ring-0"
          placeholder="Write a reply"
          value={text}
          rows={4}
          onChange={(e) => setText(e.target.value)}
          required
        ></textarea>
        <div className="ml-3 mt-3 flex justify-between">
          <button
            type="submit"
            className="my-auto ml-auto w-20 items-center rounded-full bg-blue-700 py-2 px-4 text-center font-medium text-white hover:bg-blue-800 focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900"
          >
            Reply
          </button>
        </div>
      </form>
    </div>
  );
};

interface repliesProps {
  statusId: string;
  sessionUserId: string;
}
const Replies = ({ statusId, sessionUserId }: repliesProps) => {
  const { data, isLoading } = trpc.reply.getAll.useQuery({
    statusId: statusId,
  });
  if (isLoading) return <Loading />;
  return (
    <div className="mt-3">
      {data?.map((reply) => (
        <Reply
          statusId={statusId}
          key={reply.id}
          id={reply.id}
          name={reply.user.name}
          text={reply.text}
          username={reply.user.username}
          UserImage={reply.user.image}
          time={reply.createdAt.toISOString()}
          sameUser={sessionUserId === reply.user.id}
        />
      ))}
    </div>
  );
};

interface replyProps {
  id: string;
  statusId: string;
  sameUser: boolean;
  name?: string | null;
  username?: string | null;
  UserImage?: string | null;
  time?: string;
  text?: string;
}
const Reply = ({
  id,
  name,
  statusId,
  sameUser,
  username,
  text,
  time,
  UserImage,
}: replyProps) => {
  let pic;
  const utils = trpc.useContext();

  const deleteReply = trpc.reply.deleteReply.useMutation({
    onMutate: () => {
      utils.reply.getAll.cancel();
      const optimisticUpdate = utils.reply.getAll.getData({
        statusId: statusId,
      });

      if (optimisticUpdate) {
        utils.reply.getAll.setData(
          { statusId: statusId },
          optimisticUpdate.filter((c) => c.id !== id)
        );
      }
    },
  });

  if (UserImage?.match(new RegExp("^[https]"))) {
    pic = () => String(UserImage);
  } else {
    pic = () =>
      String(
        `https://wdbzaixlcvmtgkhjlkqx.supabase.co/storage/v1/object/public/cuapan-image/user/${UserImage}`
      );
  }
  let timeAgo = "";
  if (time) {
    const date = parseISO(time);
    const timePeriod = formatDistanceToNow(date);
    timeAgo = `${timePeriod} ago`;
  }
  return (
    <div className="flex h-auto w-full border-t border-slate-500 hover:bg-white/5">
      <article className="mx-3 flex h-full w-full flex-row py-4">
        <div className="h-12 w-12 flex-none rounded-full bg-blue-500">
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
        <div className="ml-3 flex flex-col">
          <div className="flex items-start gap-x-3">
            <span className=" mr-3 font-bold">{name}</span>
            <span className="text-slate-500">@{username}</span>
            <span className="text-slate-500">{timeAgo}</span>
          </div>
          <div className="flex flex-col">
            <p className="break-all">{text}</p>
          </div>
        </div>
        {sameUser && (
          <div
            className="ml-auto cursor-pointer"
            onClick={() => {
              deleteReply.mutate({
                id: id,
              });
            }}
          >
            <BsTrashFill />
          </div>
        )}
      </article>
    </div>
  );
};

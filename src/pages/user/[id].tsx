import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { BsArrowLeft, BsCameraFill } from "react-icons/bs";
import Loading from "../../../components/Loading";
import NotFound from "../../../components/notFound";
import { trpc } from "../../utils/trpc";
import { v4 as uuidv4 } from "uuid";
import NewStatus from "../../../components/newStatus";
import Status from "../../../components/status";
import {
  deleteCoverPic,
  deletePic,
  uploadCoverPic,
  uploadPic,
} from "../../utils/image";

const UserPage = () => {
  const [userId, setUserId] = useState("");
  const [media, setMedia] = useState(false);
  const [statuses, setStatuses] = useState<JSX.Element>();
  const id = useRouter().query.id;

  const { data, isLoading } = trpc.user.getOne.useQuery({
    id: userId as string,
  });

  useEffect(() => {
    if (id) setUserId(String(id));
  }, [id]);

  const router = useRouter();
  const [modalHidden, setModalHidden] = useState(true);
  const { data: session } = useSession();

  const [name, setName] = useState<string | null>("");
  const [username, setUsername] = useState<string | null>("");
  const [bio, setBio] = useState<string | null>("");

  const image_name = uuidv4() + ".jpg";
  const old_image = data?.image;
  const [image, setImage] = useState<string | null>("");
  const [imageFile, setImageFile] = useState<File | undefined>();

  const coverImage_name = uuidv4() + ".jpg";
  const old_coverImage = data?.coverImage;
  const [coverImage, setCoverImage] = useState<string | null>("");
  const [coverImageFile, setCoverImageFile] = useState<File | undefined>();

  console.log(statuses?.props?.children);

  useEffect(() => {
    if (data) {
      setName(data.name);
      setUsername(data.username);
      setBio(data.bio);
      setImage(data.image);
      setCoverImage(data.coverImage);
    }
  }, [data]);

  useEffect(() => {
    if (!modalHidden) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }, [modalHidden]);

  useEffect(() => {
    if (!media) {
      setStatuses(
        <div className="mt-3">
          {data?.status
            .map((status) => (
              <Status
                id={status.id}
                key={status.id}
                name={data.name}
                text={status.text}
                username={data.username}
                UserImage={data.image}
                image={status.image}
                time={status.createdAt.toISOString()}
              />
            ))
            .reverse()}
        </div>
      );
    } else {
      setStatuses(
        <div className="mt-3">
          {data?.status
            .filter((s) => Boolean(s.image) !== false)
            .map((status) => (
              <Status
                id={status.id}
                key={status.id}
                name={data.name}
                text={status.text}
                username={data.username}
                UserImage={data.image}
                image={status.image}
                time={status.createdAt.toISOString()}
              />
            ))

            .reverse()}
        </div>
      );
    }
  }, [media, data]);
  const utils = trpc.useContext();

  const updateUser = trpc.user.updateUser.useMutation({
    onMutate: () => {
      utils.user.getOne.cancel();
      const optimisticSession = utils.auth.getSession.getData();
      const optimisticUpdate = utils.user.getOne.getData({
        id: userId as string,
      });

      if (optimisticSession) {
        utils.auth.getSession.setData(undefined, {
          ...optimisticSession,
        });
      }

      if (optimisticUpdate) {
        utils.user.getOne.setData(
          {
            id: userId as string,
          },
          {
            ...optimisticUpdate,
          }
        );
      }
    },
    onSuccess: () => {
      utils.user.getOne.invalidate({
        id: userId as string,
      });
      setModalHidden(true);
    },
  });

  if (isLoading) return <Loading />;

  if (!data) return <NotFound message="User Not Found" />;

  let pic, coverPic;
  if (image?.match(new RegExp("^[https]"))) {
    pic = () => String(image);
  } else {
    pic = () =>
      String(
        `https://wdbzaixlcvmtgkhjlkqx.supabase.co/storage/v1/object/public/cuapan-image/user/${image}`
      );
  }
  if (imageFile) {
    pic = () => URL.createObjectURL(imageFile);
  }

  if (coverImage?.match(new RegExp("^[https]"))) {
    coverPic = () => String(coverImage);
  } else {
    coverPic = () =>
      String(
        `https://wdbzaixlcvmtgkhjlkqx.supabase.co/storage/v1/object/public/cuapan-image/user/${coverImage}`
      );
  }

  if (imageFile) {
    pic = () => URL.createObjectURL(imageFile);
  }
  if (coverImageFile) {
    coverPic = () => URL.createObjectURL(coverImageFile);
  }

  return (
    <div className={`mt-1 flex flex-col `}>
      <div
        id="modal-container"
        aria-hidden="true"
        className={`fixed inset-0 z-50 bg-white/50 backdrop-blur-sm ${
          modalHidden ? "hidden" : "flex"
        }`}
      >
        <div className="relative m-auto h-5/6 w-1/2 overflow-y-scroll rounded-lg bg-white shadow dark:bg-black">
          <div className="m-5 flex flex-col ">
            <div className="item-center mb-3 flex justify-between">
              <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                Edit Profile
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
                updateUser.mutate({
                  name: String(name),
                  bio: String(bio),
                  username: String(username),
                  image: imageFile ? image_name : image,
                  coverImage: coverImageFile ? coverImage_name : coverImage,
                });
                if (imageFile) {
                  deletePic(old_image);
                  uploadPic(image_name, imageFile);
                }
                if (coverImageFile) {
                  deleteCoverPic(old_coverImage);
                  uploadCoverPic(coverImage_name, coverImageFile);
                }
              }}
            >
              <div className="-mb-6 flex h-64 flex-col">
                <div className="flex h-44 flex-col items-center justify-center bg-yellow-500">
                  <div className="h-full w-full" hidden={!Boolean(coverImage)}>
                    <Image
                      src={coverPic()}
                      alt="cover pic"
                      loader={coverPic}
                      height={240}
                      width={240}
                      className={`h-full w-full object-cover`}
                      loading="lazy"
                      unoptimized={true}
                    ></Image>
                  </div>
                  <label
                    htmlFor="cover_file_input"
                    className="absolute flex h-44 w-full items-center justify-center bg-black/50 text-4xl font-medium text-white "
                  >
                    <div className="absolute flex cursor-pointer items-center justify-center">
                      <BsCameraFill />
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      className="absolute hidden"
                      id="cover_file_input"
                      onChange={(e) =>
                        setCoverImageFile(() =>
                          e.target.files ? e.target.files[0] : undefined
                        )
                      }
                    />
                  </label>
                </div>
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
                  <label
                    htmlFor="file_input"
                    className="absolute flex h-full w-full items-center justify-center rounded-full bg-black/50 text-4xl font-medium text-white "
                  >
                    <div className="absolute flex cursor-pointer items-center justify-center">
                      <BsCameraFill />
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
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                  placeholder="Your Name"
                  value={name ? name : ""}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="username"
                  className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                >
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                  placeholder="Enter Username"
                  required
                  value={username ? username : ""}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div>
                <label
                  htmlFor="bio"
                  className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                >
                  About
                </label>
                <textarea
                  id="bio"
                  className="block w-full resize-none rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                  placeholder="About You"
                  value={bio ? bio : ""}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
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
          <div className="text-slate-500">{data.status.length} status</div>
        </div>
      </div>
      <div className={`flex h-80 flex-col`}>
        <div className="flex h-60 flex-col bg-yellow-500">
          <div className="h-full w-full" hidden={!Boolean(coverImage)}>
            <Image
              src={coverPic()}
              alt="cover pic"
              loader={coverPic}
              height={240}
              width={240}
              className={`h-full w-full object-cover`}
              loading="lazy"
              unoptimized={true}
            ></Image>
          </div>
        </div>
        {session?.user?.id === data?.id && (
          <button
            onClick={() => setModalHidden(false)}
            className="mt-3 ml-auto mr-3 rounded-full  py-2 px-8 text-center font-medium ring-1 hover:bg-white/5 dark:text-white"
          >
            Edit Profile
          </button>
        )}

        <div className="absolute ml-3 mt-44 flex h-32 w-32 items-center justify-center rounded-full bg-white">
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
        <h1 className="text-2xl font-bold">{data.name}</h1>
        <span className="text-xl text-slate-500">@{data.username}</span>
        <p className="mt-3">{data.bio}</p>
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
        <div
          className={`${
            !media ? "bg-white/20" : ""
          } w-full cursor-pointer py-3 text-center hover:bg-white/50`}
          onClick={() => setMedia(false)}
        >
          Status
        </div>
        <div
          className={`${
            media ? "bg-white/20" : ""
          } w-full cursor-pointer py-3 text-center hover:bg-white/50`}
          onClick={() => setMedia(true)}
        >
          Media
        </div>
      </div>
      {session?.user?.id === data?.id && <NewStatus />}
      {statuses}
    </div>
  );
};

export default UserPage;

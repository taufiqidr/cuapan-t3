import Image from "next/image";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import { BsArrowLeft } from "react-icons/bs";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "../src/utils/supabase";
import { trpc } from "../src/utils/trpc";

const SettingsPageComp = () => {
  const { data, isLoading } = trpc.user.getProfile.useQuery();
  const image_name = uuidv4() + ".jpg";
  const old_image = data?.image;
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [imageFile, setImageFile] = useState<File | undefined>();

  const Upload = async () => {
    await supabase.storage
      .from("cuapan-image")
      .upload("user/" + image_name, imageFile as File);
  };

  const Delete = async () => {
    await supabase.storage.from("cuapan-image").remove(["user/" + old_image]);
  };

  useEffect(() => {
    if (data) {
      setName(String(data.name));
      setImage(String(data.image));
    }
  }, [data]);

  const disabled = false;

  const router = useRouter();
  const utils = trpc.useContext();

  const updateUser = trpc.user.updateSelfUser.useMutation({
    onMutate: () => {
      utils.user.getAll.cancel();
      const optimisticUpdate = utils.user.getAll.getData();

      if (optimisticUpdate) {
        utils.user.getAll.setData(
          undefined,
          optimisticUpdate.map((t) =>
            t.id === data?.id
              ? {
                  ...t,
                  ...data,
                }
              : t
          )
        );
      }
    },
    onSuccess: () => {
      utils.user.getAll.invalidate();
      router.push(`/me`);
    },
  });

  let pic;

  if (data?.image?.match(new RegExp("^[https]"))) {
    pic = () => String(data?.image);
  } else {
    pic = () =>
      String(
        `https://ugulpstombooodglvogg.supabase.co/storage/v1/object/public/tokofication-image/user/${data?.image}`
      );
  }

  if (imageFile) {
    pic = () => URL.createObjectURL(imageFile);
  }

  if (isLoading) return <div>Loading...</div>;
  return (
    <div className="mt-1 flex flex-col">
      <div className="z-20 mb-3 flex flex-row text-3xl font-semibold">
        <div
          className="ml-3 flex cursor-pointer flex-row items-center hover:text-blue-500"
          onClick={() => router.back()}
        >
          <BsArrowLeft />
        </div>
        <div className="ml-3">
          <div>Settings</div>
        </div>
      </div>
      <form className="mx-3">
        <div className="mb-6 grid gap-6">
          <div>
            <label
              htmlFor="file_input"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              Profile Picture
            </label>
            <div className="flex flex-row items-center">
              <div className=" h-[120px] w-[120px] rounded-full border">
                <Image
                  src={pic()}
                  alt="profile pic"
                  loader={pic}
                  height={120}
                  width={120}
                  className="h-full w-full rounded-full object-cover"
                  loading="lazy"
                ></Image>
              </div>
              <input
                type="file"
                accept="image/*"
                className="mx-3 cursor-pointer rounded-lg border border-gray-300 bg-gray-50 text-sm text-gray-900 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 dark:placeholder-gray-400"
                id="file_input"
                onChange={(e) =>
                  setImageFile(() =>
                    e.target.files ? e.target.files[0] : undefined
                  )
                }
              />
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
              placeholder="You Name"
              value={name}
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
              required
              rows={3}
            />
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
  );
};

export default SettingsPageComp;

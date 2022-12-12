import Image from "next/image";
import React, { useState } from "react";
import { uploadStatusPic } from "../src/utils/image";
import { trpc } from "../src/utils/trpc";
import { v4 as uuidv4 } from "uuid";
import { BsImage, BsXLg } from "react-icons/bs";

const NewStatus = () => {
  const utils = trpc.useContext();
  const [text, setText] = useState("");

  const [imageFile, setImageFile] = useState<File | undefined>();
  const image_name = uuidv4() + ".jpg";

  let pic;
  if (imageFile) {
    pic = () => URL.createObjectURL(imageFile);
  }
  const createStatus = trpc.status.createStatus.useMutation({
    onMutate: () => {
      utils.status.getAll.cancel();
      const optimisticUpdate = utils.status.getAll.getData();
      if (optimisticUpdate) {
        utils.status.getAll.setData(undefined, [...optimisticUpdate]);
      }
    },
    onSuccess: () => {
      utils.status.getAll.invalidate();
      setImageFile(undefined);
    },
  });

  return (
    <div className="mx-3 mt-4 flex flex-col">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          createStatus.mutate({
            text: String(text),
            image: imageFile ? image_name : "",
          });
          if (imageFile) uploadStatusPic(image_name, imageFile);
          setText("");
        }}
      >
        <textarea
          className="block w-full resize-none overflow-auto border-none bg-inherit py-2.5  outline-0 ring-0"
          placeholder="What's on your mind?"
          value={text}
          rows={4}
          onChange={(e) => setText(e.target.value)}
          required
        ></textarea>
        <div
          className={`${
            imageFile ? "flex" : "hidden"
          } mt-3 h-60 flex-col items-center justify-center rounded-lg`}
        >
          <div className="flex h-full w-full">
            {pic && (
              <Image
                src={pic()}
                alt="profile pic"
                loader={pic}
                height={120}
                width={120}
                className="h-full w-full rounded-lg object-cover"
                loading="lazy"
              ></Image>
            )}
            <div
              className="absolute mt-1 ml-1 cursor-pointer rounded-full border bg-black/50 p-2 hover:bg-black/80"
              onClick={() => setImageFile(undefined)}
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
              <div className="absolute flex cursor-pointer items-center justify-center">
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
          <button
            type="submit"
            className="my-auto ml-auto w-20 items-center rounded-full bg-blue-700 py-2 px-4 text-center font-medium text-white hover:bg-blue-800 focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900"
          >
            Post
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewStatus;

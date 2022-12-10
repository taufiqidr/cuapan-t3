import React, { useState } from "react";
import { trpc } from "../src/utils/trpc";

const NewStatus = () => {
  const [text, setText] = useState("");
  const utils = trpc.useContext();

  const createStatus = trpc.status.createStatus.useMutation({
    onMutate: () => {
      utils.status.getAll.cancel();
      const optimisticUpdate = utils.status.getAll.getData();
      if (optimisticUpdate) {
        utils.status.getAll.setData(undefined, [...optimisticUpdate]);
      }
    },
    // onSuccess: () => {
    //   utils.status.getAll.cancel();
    //   const optimisticUpdate = utils.status.getAll.getData();
    //   if (optimisticUpdate) {
    //     utils.status.getAll.setData(undefined, [...optimisticUpdate]);
    //   }
    // },
  });

  return (
    <div className="mx-3 mt-4 flex flex-col">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          createStatus.mutate({
            text: String(text),
            image: String(""),
          });
          setText("");
        }}
      >
        <textarea
          className="block w-full resize-none rounded-lg border border-slate-500 py-2.5 px-3 dark:border-none dark:bg-slate-700"
          placeholder="What's on your mind?"
          rows={4}
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
        />
        <button
          type="submit"
          className="mt-3 ml-auto w-20 items-center rounded-full bg-blue-700 py-2 px-4 text-center  font-medium text-white hover:bg-blue-800 focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900"
        >
          Post
        </button>
      </form>
    </div>
  );
};

export default NewStatus;

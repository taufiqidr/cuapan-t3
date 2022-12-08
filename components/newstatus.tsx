import React from "react";

const NewStatus = () => {
  return (
    <div className="mx-3 mt-4 flex flex-col">
      <textarea
        className="block w-full rounded-lg bg-slate-700 py-2.5 px-3"
        placeholder="What's on your mind?"
        rows={4}
      />
      <button
        type="submit"
        className="mt-3 ml-auto w-20 items-center rounded-full bg-blue-700 py-2 px-4 text-center  font-medium text-white hover:bg-blue-800 focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900"
      >
        Post
      </button>
    </div>
  );
};

export default NewStatus;

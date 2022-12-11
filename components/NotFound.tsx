import React from "react";

const NotFound = ({ message }: { message: string }) => {
  return (
    <div className="flex h-full items-center justify-center text-center text-3xl">
      <p>{message}</p>
    </div>
  );
};

export default NotFound;

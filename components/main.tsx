import React from "react";

const Main = ({ children }: { children: React.ReactNode }) => {
  return <main className="w-6/12">{children}</main>;
};

export default Main;

import { useSession } from "next-auth/react";
import React from "react";
import SettingsPageComp from "../../components/settings";
import Unauthenticated from "./Unauthenticated";

const SettingPage = () => {
  const { status } = useSession();
  let content;
  if (status === "authenticated") {
    content = <SettingsPageComp />;
  } else if (status === "unauthenticated") {
    content = <Unauthenticated />;
  }

  return content;
};

export default SettingPage;

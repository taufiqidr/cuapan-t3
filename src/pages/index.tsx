import { useSession } from "next-auth/react";
import Feed from "../../components/feed";
import NewStatus from "../../components/newStatus";

const Home = () => {
  const { status } = useSession();
  return (
    <div>
      <h2 className="mt-1 ml-3 flex items-center gap-x-3  py-1 text-3xl font-semibold">
        Home
      </h2>
      {status === "authenticated" && <NewStatus />}
      <Feed />
    </div>
  );
};

export default Home;

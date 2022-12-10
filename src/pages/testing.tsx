import { BsCameraFill } from "react-icons/bs";

const testing = () => {
  return (
    <div className="mt-8 flex justify-center">
      <div className="rounded-lg bg-gray-50 shadow-xl lg:w-1/2">
        <div className="m-4">
          <div className="flex w-full items-center justify-center">
            <label className="flex h-32 w-full flex-col border-4 border-dashed hover:border-gray-300 hover:bg-gray-100">
              <div className="flex flex-col items-center justify-center pt-7">
                <BsCameraFill />
              </div>
              <input type="file" className="opacity-0" />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default testing;

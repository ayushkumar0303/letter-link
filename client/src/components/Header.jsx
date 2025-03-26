import { Avatar } from "flowbite-react";
import React from "react";
import { useSelector } from "react-redux";
import OAuth from "./OAuth";

function Header() {
  const { currentUser } = useSelector((state) => state.user);
  // console.log(currentUser);
  return (
    <div className="bg-lime-300 flex w-full justify-between p-3 h-14 items-center">
      <div className="text-xl font-semibold flex  items-center justify-center gap-1 md:text-2xl ">
        Letter
        <span className="text-green-500"></span>
        Link
      </div>
      <div>
        {currentUser && currentUser._id ? (
          <div className="flex justify-center items-center gap-3">
            <span className="cursor-pointer">SignOut</span>
            <Avatar img={currentUser.profilePicture} rounded>
              <div className="space-y-1 font-medium">
                <div>{currentUser.username}</div>
                <div className="text-sm text-gray-500">
                  {`Joined in ${new Date(
                    currentUser.createdAt
                  ).toLocaleDateString("en-US", { month: "long" })} ${new Date(
                    currentUser.createdAt
                  ).getFullYear()}`}
                </div>
              </div>
            </Avatar>
          </div>
        ) : (
          <>
            <OAuth />
          </>
        )}
      </div>
    </div>
  );
}

export default Header;

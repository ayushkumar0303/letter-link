import { Avatar, Dropdown, Navbar } from "flowbite-react";
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import OAuth from "./OAuth";
import { signOutSuccess } from "../store/store";
import { useNavigate, Link } from "react-router-dom";

function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSignOut = async (req, res) => {
    // console.log("handling signout");
    try {
      const res = await fetch("/server/auth/signout", {
        method: "POST",
      });
      const data = await res.json();
      if (res.ok) {
        dispatch(signOutSuccess());
        navigate("/");
      } else {
        console.log(data);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <Navbar className="bg-gray-800 text-gray-100 shadow-md px-4 py-2">
      <Navbar.Brand href="/">
        <span className="text-2xl font-bold text-green-400">
          Letter
          <span className="text-white">Link</span>
        </span>
      </Navbar.Brand>

      <div className="flex items-center gap-4">
        {currentUser && currentUser._id ? (
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar img={currentUser.profilePicture} alt="User" rounded />
            }
          >
            <Dropdown.Header>
              <span className="block text-lg font-semibold">
                {currentUser.username}
              </span>
              <span className="block text-sm text-gray-400">
                Joined in{" "}
                {new Date(currentUser.createdAt).toLocaleDateString("en-US", {
                  month: "long",
                })}{" "}
                {new Date(currentUser.createdAt).getFullYear()}
              </span>
            </Dropdown.Header>
            <Link to="/dashboard?tab=create-letter">
              <Dropdown.Item className="cursor-pointer font-bold">
                Create Letter{" "}
              </Dropdown.Item>
            </Link>
            <Link to="/dashboard?tab=draft">
              <Dropdown.Item className="cursor-pointer">Draft </Dropdown.Item>
            </Link>

            <Link to="/dashboard?tab=drive">
              <Dropdown.Item className="cursor-pointer">Drive </Dropdown.Item>
            </Link>

            <Dropdown.Item
              className="text-red-400 cursor-pointer"
              onClick={handleSignOut}
            >
              Sign Out
            </Dropdown.Item>
          </Dropdown>
        ) : (
          <OAuth />
        )}
      </div>
    </Navbar>
  );
}

export default Header;

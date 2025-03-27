import { Button } from "flowbite-react";
import React from "react";
import { AiFillGoogleCircle } from "react-icons/ai";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
// import { account } from "../appwrite";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { signInError, signInSuccess } from "../store/store";

function OAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleOAuth = async () => {
    const auth = getAuth(app);

    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });

    try {
      const resultsFromGoogle = await signInWithPopup(auth, provider);
      // await account.createOAuth2Session(
      //   "google",
      //   "http://localhost:5173/dashboard",
      //   "http://localhost:5173/"
      // );
      // const resultsFromGoogle = await account.get();
      // console.log(resultsFromGoogle);

      const res = await fetch("/server/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: resultsFromGoogle.user.displayName,
          email: resultsFromGoogle.user.email,
          profilePicture: resultsFromGoogle.user.photoURL,
        }),
      });
      const data = await res.json();
      // console.log(data);
      if (res.ok) {
        dispatch(signInSuccess(data));
        navigate("/");
      }
    } catch (error) {
      // console.log(error);
      dispatch(signInError(error.message));
    }
  };
  return (
    <Button
      className="cursor-pointer"
      type="button"
      color="light"
      onClick={handleOAuth}
      size="xs"
    >
      Login
    </Button>
  );
}

export default OAuth;

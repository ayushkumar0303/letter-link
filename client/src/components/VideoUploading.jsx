import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { Alert, Button, TextInput } from "flowbite-react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";

function VideoUploading() {
  const pathname = useLocation();
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  // console.log(pathname);
  useEffect(() => {
    const urlParams = new URLSearchParams(pathname.search);
    const driveLinked = urlParams.get("driveLinked");

    // console.log(urlParams);
    // console.log(driveLinked);

    if (driveLinked === "true") {
      const savedTitle = localStorage.getItem("draftTitle");
      const savedContent = localStorage.getItem("draftContent");

      if (savedTitle && savedContent) {
        uploadToDrive(savedTitle, savedContent);
        localStorage.removeItem("draftTitle");
        localStorage.removeItem("draftContent");
      }
    }
  }, []);

  const uploadToDrive = async (savedTitle, savedContent) => {
    // console.log(savedContent);
    try {
      setLoading(true);
      const res = await fetch(
        `/server/drive/upload-drive/${currentUser?._id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: savedContent, title: savedTitle }),
        }
      );
      const data = await res.json();
      console.log(data.message);
      if (res.ok) {
        setSuccessMessage(data.message);
        setLoading(false);
      } else {
        setError(data.message);
        setLoading(false);
      }
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <div>
      VideoUploading
      {!loading && error && (
        <Alert className="mt-4 mb-4" color="failure">
          {error}
        </Alert>
      )}
      {!loading && successMessage && (
        <Alert className="mt-4 mb-4" color="success">
          {successMessage}
        </Alert>
      )}
    </div>
  );
}

export default VideoUploading;

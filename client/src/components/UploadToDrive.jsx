import React, { useState, useEffect } from "react";
import { Alert, Button, Spinner } from "flowbite-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { clearDraft, driveConnected } from "../store/store";

function UploadToDrive() {
  const pathname = useLocation();
  const dispatch = useDispatch();
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const { title, content } = useSelector((state) => state.draft);
  const navigate = useNavigate();
  // console.log(pathname.search);

  useEffect(() => {
    const urlParams = new URLSearchParams(pathname.search);
    const driveLinked = urlParams.get("driveLinked");
    // console.log(driveLinked);

    if (driveLinked === "true") {
      if (title && content) {
        uploadToDrive(title, content);
        dispatch(driveConnected({ isConnected: driveConnected }));
        dispatch(clearDraft());
      }
    }
  }, []);

  const uploadToDrive = async (savedTitle, savedContent) => {
    // console.log(savedContent);
    // console.log(savedTitle);
    setError(null);
    setSuccessMessage(null);
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

      if (res.ok) {
        setSuccessMessage(data.message);
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-lg bg-gray-100 p-6 rounded-lg shadow-lg ">
        {loading && (
          <div className="flex justify-center items-center">
            <Spinner size="xl" color="info" />
          </div>
        )}

        {!loading && error && (
          <Alert color="failure" className="mb-4 text-lg">
            {error}
          </Alert>
        )}

        {!loading && successMessage && (
          <Alert color="success" className="mb-4 text-lg">
            {successMessage}
          </Alert>
        )}

        <div className="flex justify-center">
          <Button
            size="sm"
            color="dark"
            onClick={() => navigate("/")}
            className="mt-4"
            disabled={loading}
          >
            Go to Home
          </Button>
        </div>
      </div>
    </div>
  );
}

export default UploadToDrive;

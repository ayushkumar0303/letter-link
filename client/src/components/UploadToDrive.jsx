import React, { useState, useEffect } from "react";
import { Alert, Button, Spinner } from "flowbite-react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";

function UploadToDrive() {
  const pathname = useLocation();
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(pathname.search);
    const driveLinked = urlParams.get("driveLinked");

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
            color="dark"
            size="sm"
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

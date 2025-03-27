import React, { useState, useEffect } from "react";
import { Alert, Button, TextInput, Card, Spinner } from "flowbite-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";

function QuillEditor() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState("");
  const [draftUploading, setDraftUploading] = useState(false);
  const [driveUploading, setDriveUploading] = useState(false);
  const [formSubmissionError, setFormSubmissionError] = useState(null);
  const [editorContent, setEditorContent] = useState("");
  const [title, setTitle] = useState("");
  // const pathname = useLocation();

  // useEffect(() => {
  //   const urlParams = new URLSearchParams(pathname.search);
  //   const driveLinked = urlParams.get("driveLinked");

  //   if (driveLinked === "true") {
  //     const savedTitle = localStorage.getItem("draftTitle");
  //     const savedContent = localStorage.getItem("draftContent");

  //     if (savedTitle && savedContent) {
  //       uploadToDrive(savedTitle, savedContent);
  //       localStorage.removeItem("draftTitle");
  //       localStorage.removeItem("draftContent");
  //     }
  //   }
  // }, []);

  // const uploadToDrive = async (savedTitle, savedContent) => {
  //   try {
  //     setDriveUploading(true);
  //     const res = await fetch(
  //       `/server/drive/upload-drive/${currentUser?._id}`,
  //       {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify({ content: savedContent, title: savedTitle }),
  //       }
  //     );
  //     const data = await res.json();

  //     if (res.ok) {
  //       setSuccessMessage(data.message);
  //     } else {
  //       setError(data.message);
  //     }
  //   } catch (error) {
  //     setError(error.message);
  //   } finally {
  //     setDriveUploading(false);
  //   }
  // };

  const handleFormData = async (event, actionType) => {
    event.preventDefault();
    setFormSubmissionError(null);
    if (!currentUser) {
      setFormSubmissionError("Please login first for this action.");
    } else {
      try {
        if (actionType === "draft") {
          setDraftUploading(true);
          const res = await fetch(
            `/server/letter/save-draft/${currentUser?._id}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ content: editorContent, title }),
            }
          );

          const data = await res.json();
          if (res.ok) {
            setSuccessMessage(data.message);
          } else {
            setFormSubmissionError(data.message);
          }
        } else if (actionType === "upload") {
          localStorage.setItem("draftTitle", title);
          localStorage.setItem("draftContent", editorContent);
          window.location.href = `/server/drive/connect/${currentUser?._id}`;
        }
      } catch (error) {
        setFormSubmissionError(error.message);
        // console.log(error);
      } finally {
        setDraftUploading(false);
      }
    }
  };

  return (
    <div className="flex justify-center items-center bg-gray-100 min-h-screen p-4">
      <Card className="w-full max-w-3xl bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-center text-2xl font-semibold text-green-400">
          Create Letter
        </h1>
        <form className="flex flex-col gap-3 mt-2">
          <TextInput
            placeholder="Enter title here..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <ReactQuill
            theme="snow"
            value={editorContent}
            onChange={setEditorContent}
            placeholder="Write your letter here..."
            className="h-72 mb-12"
          />
          <div className="flex justify-between mt-4 items-center">
            <Button
              type="button"
              pill
              color="light"
              onClick={(e) => handleFormData(e, "draft")}
              disabled={draftUploading | driveUploading}
              size="xs"
            >
              {draftUploading ? "Saving" : "Save as Draft"}
            </Button>
            <Button
              type="button"
              color="dark"
              onClick={(e) => handleFormData(e, "upload")}
              disabled={draftUploading | driveUploading}
              size="sm"
            >
              {driveUploading ? "Uploading" : "Upload to Drive"}
            </Button>
          </div>
        </form>

        {/* Alerts */}
        {!draftUploading && !driveUploading && formSubmissionError && (
          <Alert className="mt-4" color="failure">
            {formSubmissionError}
          </Alert>
        )}
        {!draftUploading && !driveUploading && successMessage && (
          <Alert className="mt-4" color="success">
            {successMessage}
          </Alert>
        )}

        {/* Loading Spinner */}
        {(draftUploading || driveUploading) && (
          <div className="flex justify-center mt-4">
            <Spinner color="gray" size="lg" />
          </div>
        )}
      </Card>
    </div>
  );
}

export default QuillEditor;

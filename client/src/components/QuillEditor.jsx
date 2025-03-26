import React, { useState } from "react";
import { Alert, Button, TextInput } from "flowbite-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";

function QuillEditor() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [formSubmissionError, setFormSubmissionError] = useState(null);
  const [editorContent, setEditorContent] = useState("");
  const [title, setTitle] = useState("");

  // console.log(editorContent)
  // console.log(pathname);

  // console.log(title);

  const handleFormData = async (event, actionType) => {
    event.preventDefault();
    setFormSubmissionError(null);

    try {
      if (actionType === "draft") {
        setLoading(true);
        const res = await fetch(
          `/server/letter/save-draft/${currentUser?._id}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              content: editorContent,
              title,
            }),
          }
        );
        const data = await res.json();

        if (res.ok) {
          setLoading(false);
          setSuccessMessage(data.message);
        } else {
          setLoading(false);
          setFormSubmissionError(data.message);
        }
      } else {
        localStorage.setItem("draftTitle", title);
        localStorage.setItem("draftContent", editorContent);
        window.location.href = `/server/drive/connect/${currentUser?._id}`;

        //   localStorage.setItem("letterTitle", title);
        //   localStorage.setItem("letterContent", editorContent);
        //   window.location.href = `/server/drive/connect/${currentUser?._id}`;
        //   setTimeout(async () => {
        //     const res = await fetch(
        //       `/server/letter/upload-drive/${currentUser?._id}`,
        //       {
        //         method: "POST",
        //         headers: { "Content-Type": "application/json" },
        //         body: JSON.stringify({
        //           content: editorContent,
        //           title,
        //         }),
        //       }
        //     );
        //     const data = await res.json();

        //     // console.log(data);
        //     localStorage.removeItem("letterTitle");
        //     localStorage.removeItem("letterContent");
        //     if (res.ok) {
        //       navigate(`/`);
        //     } else {
        //       setFormSubmissionError(data.message);
        //     }
        //   }, 15000);
      }
    } catch (error) {
      setFormSubmissionError(error.message);
    }
  };

  return (
    <div className="p-3 min-h-screen max-w-3xl mx-auto">
      <h1 className="font-bold text-3xl text-center my-4">Create a Letter</h1>
      <form className="flex flex-col gap-3">
        <TextInput
          placeholder="Title"
          onChange={(e) => setTitle(e.target.value)}
        />
        <ReactQuill
          theme="snow"
          value={editorContent}
          onChange={setEditorContent}
          placeholder="Write something..."
          className="h-72 mb-12"
          required
        />
        <div className="flex justify-between">
          <Button
            type="button"
            color="yellow"
            onClick={(e) => handleFormData(e, "draft")}
            disabled={loading}
            size="xs"
          >
            Save as Draft
          </Button>
          <Button
            type="button"
            color="purple"
            disabled={loading}
            onClick={(e) => handleFormData(e, "upload")}
            size="xs"
          >
            Upload to Drive
          </Button>
        </div>
      </form>

      {!loading && formSubmissionError && (
        <Alert className="mt-4 mb-4" color="failure">
          {formSubmissionError}
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

export default QuillEditor;

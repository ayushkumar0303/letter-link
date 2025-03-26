import React, { useState } from "react";
import { Alert, Button, TextInput } from "flowbite-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function QuillEditor() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [formSubmissionError, setFormSubmissionError] = useState(null);
  const [editorContent, setEditorContent] = useState("");
  const [title, setTitle] = useState("");

  // console.log(editorContent);
  // console.log(title);

  const handleConnect = () => {
    window.location.href = `/server/drive/connect/${currentUser?._id}`;
  };

  const handleFormData = async (event, actionType) => {
    event.preventDefault();
    setFormSubmissionError(null);

    try {
      const url =
        actionType === "draft"
          ? `/server/letter/save-draft/${currentUser?._id}`
          : `/server/letter/upload-drive/${currentUser?._id}`;

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: editorContent,
          title,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        navigate(`/`);
      } else {
        setFormSubmissionError(data.message);
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
            size="xs"
          >
            Save as Draft
          </Button>
          <Button
            type="button"
            color="purple"
            onClick={(e) => handleFormData(e, "upload")}
            size="xs"
          >
            Upload to Drive
          </Button>
        </div>
      </form>

      <Button color="blue" size="sm" onClick={handleConnect}>
        Connect to Google Drive
      </Button>

      {formSubmissionError && (
        <Alert className="mt-4 mb-4" color="failure">
          {formSubmissionError}
        </Alert>
      )}
    </div>
  );
}

export default QuillEditor;

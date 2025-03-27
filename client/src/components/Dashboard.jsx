import { Navigate, useLocation } from "react-router-dom";
import Drafts from "./Drafts";
import Drive from "./Drive";
import QuillEditor from "./QuillEditor";
import NotFound from "../pages/NotFound";

const Dashboard = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const tab = searchParams.get("tab");

  if (!["draft", "drive", "create-letter"].includes(tab)) {
    return <NotFound />;
  }

  return (
    <div>
      {tab === "draft" && <Drafts />}
      {tab === "drive" && <Drive />}
      {tab === "create-letter" && <QuillEditor />}
    </div>
  );
};

export default Dashboard;

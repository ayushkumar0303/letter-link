import { useLocation } from "react-router-dom";
import Drafts from "./Drafts";
import Drive from "./Drive";
import QuillEditor from "./QuillEditor";

const Dashboard = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const tab = searchParams.get("tab");

  return (
    <div>
      {tab === "draft" && <Drafts />}
      {tab === "drive" && <Drive />}
      {tab === "create-letter" && <QuillEditor />}
    </div>
  );
};

export default Dashboard;

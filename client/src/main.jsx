import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { store, persistor } from "./store/store.js";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Dashboard from "./components/Dashboard.jsx";
import PrivateDash from "./components/PrivateDash.jsx";
import UpdatePost from "./components/UpdateLetter.jsx";
import UploadToDrive from "./components/UploadToDrive.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/dashboard",
        element: <PrivateDash />,
        children: [
          {
            path: "/dashboard",
            element: <Dashboard />,
          },
          {
            path: "/dashboard/update-letter/:letterId",
            element: <UpdatePost />,
          },
          {
            path: "/dashboard/uploading-letter",
            element: <UploadToDrive />,
          },
        ],
      },
    ],
  },
  // {
  //   path: "/*",
  //   element: <Error404 />,
  // },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <RouterProvider router={router} />
      </PersistGate>
    </Provider>
  </StrictMode>
);

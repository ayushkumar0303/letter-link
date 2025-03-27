import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

function PrivateDash() {
  const { currentUser } = useSelector((state) => state.user);
  return <> {currentUser ? <Outlet /> : <Navigate to="/" />}</>;
}

export default PrivateDash;

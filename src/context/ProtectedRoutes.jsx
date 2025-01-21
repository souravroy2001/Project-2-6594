import React, { useContext } from "react";
import { LogAuthContext } from "./LogAuth";
import { Navigate } from "react-router-dom";

function ProtectedRoutes({ children }) {
  const { userLogin } = useContext(LogAuthContext);
  return userLogin ? children : <Navigate to={"/login"} />;
}

export default ProtectedRoutes;

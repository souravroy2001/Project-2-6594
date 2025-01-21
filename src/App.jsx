import "./App.css";
import Navbar from "./components/Navbar";
import { Route, Routes } from "react-router-dom";
import LoginForm from "./components/Login";
import Register from "./components/Register";
import Calendar from "./components/Calendar";
import Salary from "./components/Salary";
import Dashboard from "./components/Dashboard";
import People from "./components/People";
import ProtectedRoutes from "./context/ProtectedRoutes";
import NotFound from "./components/NotFound";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoutes>
              <Dashboard />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/people"
          element={
            <ProtectedRoutes>
              <People />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/salary"
          element={
            <ProtectedRoutes>
              <Salary />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/calendar"
          element={
            <ProtectedRoutes>
              <Calendar />
            </ProtectedRoutes>
          }
        />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element = {<NotFound/>} />
      </Routes>
    </>
  );
}

export default App;

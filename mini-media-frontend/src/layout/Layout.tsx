import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../Components/Navbar";
import Sidebar from "../Components/Sidebar";
import useAuth from "../hooks/useAuth";
import socket from "../socket";

function Layout() {
  const { userId } = useAuth();

  useEffect(() => {
    if (userId) {
      socket.connect(); // ✅ Only connect after login
      socket.emit("registerUser", userId);
    }

    return () => {
      socket.disconnect(); // ✅ Disconnect on logout
    };
  }, [userId]);

  return (
    <div className="flex">
      <div className="w-[90px]">
        <Sidebar />
      </div>

      <div className="flex flex-col w-full">
        <Navbar />
        <Outlet />
      </div>
    </div>
  );
}

export default Layout;

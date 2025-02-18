import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { Outlet } from "react-router-dom";
import Navbar from "../Components/Navbar";
import Sidebar from "../Components/Sidebar";
import useAuth from "../hooks/useAuth";
import socket from "../socket";

function Layout() {
  const { userId } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (userId) {
      socket.connect(); // ✅ Only connect after login
      socket.emit("registerUser", userId);
    }

    return () => {
      socket.disconnect(); // ✅ Disconnect on logout
    };
  }, [userId]);

  useEffect(() => {
    socket.on("friendRequestSent", (data) => {
      const newNotification = {
        message: data?.message,
        senderId: data.sender._id,
        receiverId: data.receiver,
      };
      toast.success(data?.message, {
        position: "bottom-left",
      });
      // Update TanStack Query Cache with the new notification
      queryClient.setQueryData(["notifications", userId], (oldData: any) => {
        return [...(oldData || []), newNotification];
      });
    });

    // Listen for online/offline updates
    socket.on("onlineUsers", (data) => {
      // { userId, isOnline }
      console.log("Online users", data);
      // queryClient.setQueryData(
      //   ["onlineUsers"],
      //   (prev: Record<string, boolean> = {}) => ({
      //     ...prev,
      //     [userId]: isOnline,
      //   })
      // );
    });

    return () => {
      socket.off("onlineUsers");
    };
  }, [userId, queryClient]);

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

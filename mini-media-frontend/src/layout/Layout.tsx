import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { Outlet } from "react-router-dom";
import Navbar from "../Components/Navbar";
import Sidebar from "../Components/Sidebar";
import useAuth from "../hooks/useAuth";
import { useSocket } from "../socket/SocketContext";

function Layout() {
  const { userId } = useAuth();
  const queryClient = useQueryClient();
  const { socket } = useSocket();

  useEffect(() => {
    socket?.on("friendRequestSent", (data) => {
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
  }, [userId, queryClient]);

  return (
    <div className="flex">
      <div className="h-screen">
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

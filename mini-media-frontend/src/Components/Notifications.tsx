import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { getUserNotifications } from "../api/auth";
import useAuth from "../hooks/useAuth";
import socket from "../socket";

export default function Notifications() {
  const { userId } = useAuth();
  const queryClient = useQueryClient();
  const { data: userNotifications } = useQuery({
    queryKey: ["notifications", userId],
    queryFn: () => getUserNotifications(userId as string),
    enabled: !!userId,
  });

  useEffect(() => {
    if (!userId) return;
    socket.on("receiveNotification", (newNotification) => {
      toast.success(newNotification?.message, {
        position: "bottom-left",
      });
      // Update TanStack Query Cache with the new notification
      queryClient.setQueryData(["notifications", userId], (oldData: any) => {
        return [...(oldData || []), newNotification];
      });
    });

    return () => {
      socket.off("receiveNotification");
    };
  }, [userId]);

  return (
    <div>
      <h1 className="text-[22px] font-bold mb-3">Notifications</h1>
      <div className="flex items-center flex-col {userNotifications?.length > 5 && <span>see all</span>}">
        <div className="flex flex-col gap-3 max-w-[600px]">
          {userNotifications
            ?.slice(0, 5)
            ?.map((notification: { message: string }, index: number) => (
              <div
                key={index}
                className="flex justify-between items-center gap-6"
              >
                <span>{notification?.message}</span>
              </div>
            ))}
        </div>
        {userNotifications?.length > 5 && (
          <span className="font-semibold mt-5 cursor-pointer bg-green-600 block w-full p-2 text-white rounded text-center">
            See all
          </span>
        )}
      </div>
    </div>
  );
}

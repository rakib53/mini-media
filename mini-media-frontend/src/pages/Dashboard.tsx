import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import {
  fetchFriendRequest,
  getAllUsers,
  sendFriendRequestApi,
  sendNotification,
} from "../api/auth";
import AddFriendButton from "../Components/AddFriendButton";
import useAuth from "../hooks/useAuth";
import { User } from "../utils/types";

export default function Dashboard() {
  const { userId } = useAuth();
  const queryClient = useQueryClient();

  const { data: friendRequests } = useQuery({
    queryKey: ["friendRequest"],
    queryFn: () => fetchFriendRequest(userId),
    enabled: !!userId,
  });

  const { data: allUsers } = useQuery({
    queryKey: ["users", userId],
    queryFn: () => getAllUsers(),
    enabled: !!userId,
  });

  // send notification mutation
  const mutation = useMutation({
    mutationFn: sendNotification,
  });

  const sendNotificationToTheUser = (userInfo: User) => {
    const message = `Sending new notification to ${
      userInfo?.username
    } at ${new Date().toLocaleTimeString()}`;

    const sendNotificationData = {
      senderId: userId as string,
      receiverId: userInfo?._id,
      message: message,
    };

    mutation.mutate(sendNotificationData, {
      onSuccess: (data) => {
        console.log("sendNotificationData", data);
      },
    });
  };

  const sendFriendRequestMutation = useMutation({
    mutationFn: sendFriendRequestApi,
  });

  const sendFriendRequest = (userInfo: User) => {
    const data = {
      sender: userId,
      receiver: userInfo?._id,
    };
    sendFriendRequestMutation.mutate(data, {
      onSuccess: async () => {
        queryClient.setQueryData(["friendRequest", userId], (oldData: any) => {
          console.log("Inside setQueryData callback", "Old Data:", oldData);

          if (!oldData) {
            console.warn("Old data was undefined, initializing...");
            return { incomingRequests: [], outgoingRequests: [] };
          }

          const newReceiver = {
            _id: Date.now(),
            status: "pending",
            sender: userId,
            receiver: {
              _id: userInfo?._id,
              username: userInfo?.username,
              email: userInfo?.email,
            },
          };

          return {
            ...oldData,
            outgoingRequests: [...oldData.outgoingRequests, newReceiver], // New array reference
          };
        });

        // Force UI update by invalidating the query
        queryClient.invalidateQueries(["friendRequest", userId]);
      },
    });
  };

  const userWithoutMySelf =
    allUsers?.users?.filter((user: User) => user?._id !== userId) || [];

  return (
    <div className="p-8">
      <Toaster />

      {/* user list  */}
      <h1 className="text-[25px] font-bold mb-10">User List</h1>
      <div className="flex items-center">
        <div className="grid sm:grid-cols-6 grid-cols-2 gap-5 gap-y-16">
          {userWithoutMySelf.map((user: User) => (
            <div
              key={user?._id}
              className="max-w-[200px] w-[200px] flex flex-col"
            >
              <div className="p-2">
                <img
                  src=""
                  alt={user?.username}
                  className="w-full h-[100px] rounded pb-2 border"
                />
                <span>{user?.username}</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <AddFriendButton
                  sendFriendRequest={sendFriendRequest}
                  friendRequests={friendRequests}
                  user={user}
                />
                <button
                  onClick={() => sendNotificationToTheUser(user)}
                  className="w-full py-1 px-2 rounded bg-[#615EF0] text-white hover:bg-[#4a48ca] duration-200  text-sm"
                >
                  View profile
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

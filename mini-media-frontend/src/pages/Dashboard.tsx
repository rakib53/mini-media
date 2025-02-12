import { useMutation } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { sendNotification } from "../api/auth";
import useAuth from "../hooks/useAuth";

const userList = [
  {
    _id: "67ab6dce455acfd17163f39e",
    name: "Rakib hossen",
    email: "rakib@gmail.com",
  },
  {
    _id: "67ac416ef90c28f0b7693fa4",
    name: "Siam Ahmed",
    email: "siam@gmail.com",
  },
];

export default function Dashboard() {
  const { userId } = useAuth();
  // send notification mutation
  const mutation = useMutation({
    mutationFn: sendNotification,
  });

  const sendNotificationToTheUser = (userInfo: any) => {
    const message = `Sending new notification to ${
      userInfo?.name
    } at ${new Date().toLocaleTimeString()}`;

    const sendNotificationData = {
      senderId: userId as string,
      receiverId: userInfo?._id,
      message: message,
    };

    mutation.mutate(sendNotificationData, {
      onSuccess: (data) => {
        console.log("sendNotificationData", data);
        // socket.emit("sendNotification", { userId: userInfo?._id, message });
      },
    });
  };

  return (
    <div className="p-8">
      <Toaster />

      {/* user list  */}
      <h1 className="text-[25px] font-bold mb-10">User List</h1>
      <div className="flex items-center ">
        <div className="flex gap-3">
          {userList?.map((user) => (
            <div
              key={user?._id}
              className="max-w-[200px] w-[200px] flex flex-col"
            >
              <div className="p-2">
                <img
                  src=""
                  alt={user?.name}
                  className="w-full h-[100px] rounded pb-2 border"
                />
                <span>{user?.name}</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <button
                  onClick={() => sendNotificationToTheUser(user)}
                  className="w-full py-1 px-2 rounded bg-[#1abc9c] hover:bg-green-500 duration-200 text-sm"
                >
                  Add friend
                </button>
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

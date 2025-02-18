import { useMutation, useQuery } from "@tanstack/react-query";
import {
  cancelFriendRequestApi,
  fetchFriendRequest,
  makeFriendApi,
} from "../api/auth";
import useAuth from "../hooks/useAuth";

export default function FriendRequests() {
  const { userId } = useAuth();

  const makeFriendMutation = useMutation({
    mutationFn: makeFriendApi,
  });

  const cancelFriendRequestMutation = useMutation({
    mutationFn: cancelFriendRequestApi,
  });

  const { data: friendRequests } = useQuery({
    queryKey: ["friendRequest", userId],
    queryFn: () => fetchFriendRequest(userId),
    enabled: !!userId,
  });

  const handleMakeFriend = async (senderId: string) => {
    try {
      makeFriendMutation.mutate(
        {
          sender: senderId,
          receiver: userId,
        },
        {
          onSuccess: (data) => console.log(data),
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancelFriendRequest = async (senderId: string) => {
    const cancelReqData = {
      senderId: senderId,
      receiverId: userId,
    };

    cancelFriendRequestMutation.mutate(cancelReqData, {
      onSuccess: (data) => {
        console.log(data);
      },
    });
  };

  return (
    <div className="p-10">
      {/* Incoming requests */}
      <h1 className="text-[25px] font-bold mb-5 mt-10">Incoming requests</h1>
      <div className="flex items-center ">
        <div className="max-w-[500px] w-full">
          {friendRequests?.incomingRequests?.map((user: any) => (
            <div key={user?.sender?._id} className="w-full flex items-center">
              <div className="w-full flex items-center p-2 gap-2">
                <img
                  src=""
                  alt={user?.sender?.username}
                  className="w-[50px] h-[50px] rounded-full pb-2 border"
                />
                <span className="font-semibold">{user?.sender?.username}</span>
              </div>
              <div className="w-[180px] flex flex-col items-center gap-1">
                <button
                  onClick={() => handleCancelFriendRequest(user?.sender?._id)}
                  className="w-full py-1 px-2 rounded bg-[#d14444] text-white hover:bg-[#4a48ca] duration-200  text-sm"
                >
                  Cancel request
                </button>
                <button
                  onClick={() => handleMakeFriend(user?.sender?._id)}
                  className="w-full py-1 px-2 rounded bg-[#615EF0] text-white hover:bg-[#4a48ca] duration-200  text-sm"
                >
                  Confirm
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Outgoing requests  */}
      <h1 className="text-[25px] font-bold mb-5 mt-10">Outgoing requests</h1>
      <div className="flex items-center ">
        <div className="max-w-[500px] w-full">
          {friendRequests?.outgoingRequests?.map((user: any) => (
            <div key={user?.receiver?._id} className="w-full flex items-center">
              <div className="w-full flex items-center p-2 gap-2">
                <img
                  src=""
                  alt={user?.receiver?.username}
                  className="w-[50px] h-[50px] rounded-full pb-2 border"
                />
                <span className="font-semibold">
                  {user?.receiver?.username}
                </span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <button className="w-full py-1 px-2 rounded bg-[#615EF0] text-white hover:bg-[#4a48ca] duration-200  text-sm">
                  Cancel
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

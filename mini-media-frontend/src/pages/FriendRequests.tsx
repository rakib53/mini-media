import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast, { Toaster } from "react-hot-toast";
import {
  cancelOutgoingFriendRequest,
  declineFriendRequest,
  fetchFriendRequest,
  makeFriendApi,
  unfriendAnUser,
} from "../api/auth";
import useAuth from "../hooks/useAuth";

export default function FriendRequests() {
  const { user, userId } = useAuth();
  const queryClient = useQueryClient();

  // Make friend mutation
  const makeFriendMutation = useMutation({
    mutationFn: makeFriendApi,
  });

  // cancel friend request mutation
  const cancelFriendRequestMutation = useMutation({
    mutationFn: declineFriendRequest,
  });

  // Unfriend a user mutation
  const unfriendMutation = useMutation({
    mutationFn: unfriendAnUser,
  });

  // cancel outgoing friend request
  const cancelOutgoingFriendRequestMutation = useMutation({
    mutationFn: cancelOutgoingFriendRequest,
  });

  // getting all the friend requests
  const { data: friendRequests } = useQuery({
    queryKey: ["friendRequest", userId],
    queryFn: () => fetchFriendRequest(userId),
    enabled: !!userId,
  });

  // Confirm a friend request
  const handleMakeFriend = async (sender: {
    _id: string;
    username: string;
  }) => {
    try {
      makeFriendMutation.mutate(
        {
          sender: sender?._id,
          receiver: userId,
        },
        {
          onSuccess: () => {
            // Added this user to the friend list
            queryClient.setQueryData(["user"], (userInfo: any) => {
              if (!userInfo) return userInfo;

              return {
                ...userInfo,
                friends: [
                  ...userInfo?.friends,
                  { _id: sender._id, username: sender.username },
                ],
              };
            });

            // Remove user from the friend request
            queryClient.setQueryData(
              ["friendRequest", userId],
              (friendRequests: any) => {
                if (friendRequests?.incomingRequests?.length === 0)
                  return friendRequests;

                return {
                  ...friendRequests,
                  incomingRequests: friendRequests?.incomingRequests?.filter(
                    (reqSender: any) => reqSender?.sender?._id !== sender?._id
                  ),
                };
              }
            );
          },
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  // Handle cancel a friend request.
  const handleCancelFriendRequest = async (senderId: string) => {
    const cancelReqData = {
      senderId: senderId,
      receiverId: userId,
    };

    cancelFriendRequestMutation.mutate(cancelReqData, {
      onSuccess: () => {
        // Remove user from the friend request
        queryClient.setQueryData(
          ["friendRequest", userId],
          (friendRequests: any) => {
            if (friendRequests?.incomingRequests?.length === 0)
              return friendRequests;

            return {
              ...friendRequests,
              incomingRequests: friendRequests?.incomingRequests?.filter(
                (reqSender: any) => reqSender?.sender?._id !== senderId
              ),
            };
          }
        );
      },
    });
  };

  // handle unfriend function
  const handleUnfriendUser = async (friendId: string) => {
    try {
      unfriendMutation.mutate(
        { userId, friendId },
        {
          onSuccess: () => {
            toast.success("Successfully unfriend a user.", {
              position: "bottom-left",
            });
            queryClient.setQueryData(["user"], (oldUser: any) => {
              if (!oldUser) return oldUser;

              return {
                ...oldUser,
                friends:
                  oldUser.friends?.filter(
                    (friend: { _id: string; username: string }) =>
                      friend._id !== friendId
                  ) || [],
              };
            });
          },
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  // handle cancel outgoing friend request
  const handleOutgoingFriendRequest = async (receiver: {
    _id: string;
    username: string;
  }) => {
    try {
      cancelOutgoingFriendRequestMutation.mutate(
        {
          senderId: userId,
          receiverId: receiver?._id,
        },
        {
          onSuccess: () => {
            // Remove user from the outgoing friend request
            queryClient.setQueryData(
              ["friendRequest", userId],
              (friendRequests: any) => {
                if (friendRequests?.outgoingRequests?.length === 0)
                  return friendRequests;

                return {
                  ...friendRequests,
                  outgoingRequests: friendRequests?.outgoingRequests?.filter(
                    (reqReceiver: any) =>
                      reqReceiver?.receiver?._id !== receiver?._id
                  ),
                };
              }
            );
          },
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="p-10">
      {/* My Friends  */}
      {user?.friends?.length > 0 && (
        <>
          <h1 className="text-[25px] font-bold mb-5 mt-10">Friends</h1>
          <div className="flex items-center ">
            <div className="max-w-[500px] w-full">
              {user?.friends?.map((user: any) => (
                <div key={user?._id} className="w-full flex items-center">
                  <div className="w-full flex items-center p-2 gap-2">
                    <div className="w-[60px] h-[60px] overflow-hidden">
                      <div className="w-[60px] h-[60px] font-Asap text-xl font-semibold flex justify-center items-center rounded-full bg-stone-300">
                        {user?.username?.charAt(0)}
                      </div>
                    </div>
                    <span className="font-semibold">{user?.username}</span>
                  </div>
                  <div className="w-[180px] flex flex-col items-center gap-1">
                    <button
                      onClick={() => handleUnfriendUser(user?._id)}
                      className="w-full py-1 px-2 rounded bg-[#615EF0] text-white hover:bg-[#4a48ca] duration-200  text-sm"
                    >
                      Unfriend
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Incoming requests */}
      {friendRequests?.incomingRequests?.length > 0 && (
        <>
          <h1 className="text-[25px] font-bold mb-5 mt-10">
            Incoming requests
          </h1>
          <div className="flex items-center ">
            <div className="max-w-[500px] w-full">
              {friendRequests?.incomingRequests?.map((user: any) => (
                <div
                  key={user?.sender?._id}
                  className="w-full flex items-center"
                >
                  <div className="w-full flex items-center p-2 gap-2">
                    <div className="w-[60px] h-[60px] overflow-hidden">
                      <div className="w-[60px] h-[60px] font-Asap text-xl font-semibold flex justify-center items-center rounded-full bg-stone-300">
                        {user?.sender?.username?.charAt(0)}
                      </div>
                    </div>
                    <span className="font-semibold">
                      {user?.sender?.username}
                    </span>
                  </div>
                  <div className="w-[180px] flex flex-col items-center gap-1">
                    <button
                      onClick={() =>
                        handleCancelFriendRequest(user?.sender?._id)
                      }
                      className="w-full py-1 px-2 rounded bg-[#d14444] text-white hover:bg-[#4a48ca] duration-200  text-sm"
                    >
                      Cancel request
                    </button>
                    <button
                      onClick={() => handleMakeFriend(user?.sender)}
                      className="w-full py-1 px-2 rounded bg-[#615EF0] text-white hover:bg-[#4a48ca] duration-200  text-sm"
                    >
                      Confirm
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Outgoing requests  */}
      {friendRequests?.outgoingRequests?.length > 0 && (
        <>
          <h1 className="text-[25px] font-bold mb-5 mt-10">
            Outgoing requests
          </h1>
          <div className="flex items-center ">
            <div className="max-w-[500px] w-full">
              {friendRequests?.outgoingRequests?.map((user: any) => (
                <div
                  key={user?.receiver?._id}
                  className="w-full flex items-center"
                >
                  <div className="w-full flex items-center p-2 gap-2">
                    <div className="w-[60px] h-[60px] overflow-hidden">
                      <div className="w-[60px] h-[60px] font-Asap text-xl font-semibold flex justify-center items-center rounded-full bg-stone-300">
                        {user?.receiver?.username?.charAt(0)}
                      </div>
                    </div>
                    <span className="font-semibold">
                      {user?.receiver?.username}
                    </span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <button
                      onClick={() =>
                        handleOutgoingFriendRequest(user?.receiver)
                      }
                      className="w-full py-1 px-2 rounded bg-[#615EF0] text-white hover:bg-[#4a48ca] duration-200  text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      <Toaster />
    </div>
  );
}

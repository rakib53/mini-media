import React from "react";
import useAuth from "../hooks/useAuth";

interface AddFriendButtonProps {
  sendFriendRequest: (user: any) => void;
  friendRequests: any;
  user: any;
}

const AddFriendButton: React.FC<AddFriendButtonProps> = ({
  sendFriendRequest,
  friendRequests,
  user,
}) => {
  const { user: selfInfo } = useAuth();
  const isRequestSent = friendRequests?.outgoingRequests?.some(
    (req: any) => req?.receiver?._id === user?._id
  );

  const isUserSendFriendRequest = friendRequests?.incomingRequests?.some(
    (req: any) => req?.sender._id === user?._id && req?.status === "pending"
  );

  const isUserAlreadyFriend = user?.friends?.some(
    (user: any) => user === selfInfo?._id
  );

  let renderButtonState;

  if (isUserSendFriendRequest) {
    renderButtonState = "Confirm request";
  } else if (isRequestSent) {
    renderButtonState = "Request sent";
  } else if (isUserAlreadyFriend) {
    renderButtonState = "Already friend";
  } else {
    renderButtonState = "Add friend";
  }

  return (
    <button
      onClick={() => sendFriendRequest(user)}
      className="w-full py-1 px-2 rounded bg-[#1abc9c] hover:bg-green-500 duration-200 text-sm text-white"
    >
      {renderButtonState}
    </button>
  );
};

export default AddFriendButton;

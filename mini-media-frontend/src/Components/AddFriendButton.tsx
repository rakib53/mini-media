import React from "react";

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
  const isRequestSent = friendRequests?.outgoingRequests?.some(
    (req: any) => req.receiver._id === user._id
  );

  return (
    <button
      onClick={() => sendFriendRequest(user)}
      className="w-full py-1 px-2 rounded bg-[#1abc9c] hover:bg-green-500 duration-200 text-sm text-white"
    >
      {isRequestSent ? "Request sent" : "Add friend"}
    </button>
  );
};

export default AddFriendButton;

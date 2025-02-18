import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { getSingleConversationMessages } from "../../api/auth";
import useAuth from "../../hooks/useAuth";
import socket from "../../socket";
import { User } from "../../utils/types";

export default function ParticipantAndMessages({
  participant,
}: {
  participant: User;
}) {
  const { userId } = useAuth();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<
    { _id: String; senderId: string; receiverId: string; content: string }[]
  >([]);

  const {
    data: participantMessages,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["messages", userId, participant?._id],
    queryFn: () =>
      getSingleConversationMessages({
        userId,
        friendId: participant?._id,
      }),
    enabled: !!participant?._id,
  });

  // On change set the messages
  const handleSetMessages = (value: string) => {
    setMessage(value);
  };

  // send message to the current participant through socket.
  const handleSendMessage = () => {
    if (!message.trim()) return;

    try {
      const sendMessageData = {
        _id: Date.now().toString(),
        senderId: userId,
        receiverId: participant?._id,
        content: message,
      };

      setMessages((prev) => [...prev, sendMessageData]);
      socket.emit("sendMessage", sendMessageData);
      setMessage("");
    } catch (error) {
      console.log("error", error);
    }
  };

  // when the enter key will hit then the message will send also.
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage();
      e.preventDefault();
    }
  };

  // Listen socket for receiving message form current participant.
  useEffect(() => {
    if (participantMessages) {
      setMessages(participantMessages);
    }

    const handleReceiveMessage = (data: any) => {
      console.log("Receiving message from socket", data);
      setMessages((prev) => [...prev, data]);
    };

    socket.on("receiveMessage", handleReceiveMessage);

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
    };
  }, [participantMessages]);

  // If current participant message is loading show loading indicator.
  if (isLoading) {
    return (
      <div className="w-2/4 border-r border-r-[#EBEBEB] relative max-h-screen">
        <div className="flex justify-center items-center h-screen">
          <h1>Loading...</h1>
        </div>
      </div>
    );
  }

  // if loading the current participant message or gets any errors messages
  if (!isLoading && isError) {
    return (
      <div className="w-2/4 border-r border-r-[#EBEBEB] relative max-h-screen">
        <div className="flex justify-center items-center h-screen">
          <h1>Something went wrong!</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="w-2/4 border-r border-r-[#EBEBEB] relative max-h-screen">
      {/* Participant details */}
      <div className="flex justify-between items-center border-b border-b-[#EBEBEB] px-6 py-5">
        <div className="flex gap-2 items-center">
          <div className="w-[60px] h-[60px] overflow-hidden">
            {/* <img
              src={ClientImage}
              alt=""
              className="w-full h-full object-cover rounded-full"
            /> */}
            <div className="w-[60px] h-[60px] font-Asap text-xl font-semibold flex justify-center items-center rounded-full bg-stone-300">
              {participant?.username.charAt(0)}
            </div>
          </div>
          <div>
            <h3 className="font-Asap text-lg font-medium">
              {participant?.username}
            </h3>
            <div className="flex items-center gap-1">
              <span className="block min-w-[8px] min-h-[8px] bg-green-500 rounded-full"></span>
              <span className="font-Inter text-sm">Online</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* calls icons  */}
          <span>
            <svg
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              viewBox="0 0 512 512"
              height="1.2em"
              width="1.2em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M426.666 330.667a250.385 250.385 0 0 1-75.729-11.729c-7.469-2.136-16-1.073-21.332 5.333l-46.939 46.928c-60.802-30.928-109.864-80-140.802-140.803l46.939-46.927c5.332-5.333 7.462-13.864 5.332-21.333-8.537-24.531-12.802-50.136-12.802-76.803C181.333 73.604 171.734 64 160 64H85.333C73.599 64 64 73.604 64 85.333 64 285.864 226.136 448 426.666 448c11.73 0 21.334-9.604 21.334-21.333V352c0-11.729-9.604-21.333-21.334-21.333z"></path>
            </svg>
          </span>
          <span>
            <svg
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              viewBox="0 0 24 24"
              height="1.2em"
              width="1.2em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path fill="none" d="M0 0h24v24H0zm0 0h24v24H0z"></path>
              <path d="m21 6.5-4 4V7c0-.55-.45-1-1-1H9.82L21 17.18V6.5zM3.27 2 2 3.27 4.73 6H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.21 0 .39-.08.54-.18L19.73 21 21 19.73 3.27 2z"></path>
            </svg>
          </span>
        </div>
      </div>

      {/* Conversations */}
      <div className="max-h-screen h-[calc(100vh-215px)] overflow-y-scroll flex flex-col gap-2 p-6">
        {messages?.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message?.senderId === userId ? "justify-end" : "justify-start"
            }`}
          >
            <span className="w-max bg-slate-200 px-3 py-1 text-base rounded-full">
              {message?.content}
            </span>
          </div>
        ))}
      </div>

      {/* send message input  */}
      <div className="absolute bottom-0 right-0 max-w-full w-full flex items-center gap-2 bg-slate-300 py-4 px-6">
        <input
          type="text"
          placeholder="Type here..."
          value={message}
          onChange={(e) => handleSetMessages(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full py-1 px-2 rounded-full"
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
}

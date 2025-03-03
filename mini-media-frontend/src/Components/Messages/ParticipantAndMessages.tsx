import { useQuery, useQueryClient } from "@tanstack/react-query";
import { MoreVertical, Phone, Send, Video } from "lucide-react";
import { useEffect, useState } from "react";
import { getSingleConversationMessages } from "../../api/auth";
import useAuth from "../../hooks/useAuth";
import { useSocket } from "../../socket/SocketContext";
import { User } from "../../utils/types";

export default function ParticipantAndMessages({
  participant,
  conversations,
}: {
  participant: User;
  conversations: any;
}) {
  const { userId } = useAuth();
  const { socket, onlineUsers } = useSocket();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<
    { _id: String; senderId: string; receiverId: string; content: string }[]
  >([]);
  const [isOpenActions, setIsOpenActions] = useState(false);

  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const queryClient = useQueryClient();

  const handleTyping = () => {
    if (!typing) {
      setTyping(true);
      socket?.emit("typing", {
        conversationId: participant?._id,
        senderId: userId,
      });

      setTimeout(() => {
        setTyping(false);
        socket?.emit("stopTyping", {
          conversationId: participant?._id,
          senderId: userId,
        });
      }, 3000); // Stop typing after 3 seconds of inactivity
    }
  };

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
    handleTyping();
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
      socket?.emit("sendMessage", sendMessageData);
      queryClient.setQueryData(["getMessages", userId], (oldData: any) => {
        return {
          ...oldData,
          conversations: conversations?.map((conversation: any) => {
            if (conversation?.user?._id === participant?._id) {
              return {
                ...conversation,
                lastMessage: {
                  sender: userId,
                  message: message,
                  timestamp: Date.now(),
                },
              };
            } else {
              return conversation;
            }
          }),
        };
      });
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

  // update the last message and the timestamp of the current participant.
  const findParticipantAndUpdateLastMessage = (data: any) => {
    queryClient.setQueryData(["getMessages", userId], (oldData: any) => {
      return {
        ...oldData,
        conversations: conversations?.map((conversation: any) => {
          if (conversation?.user?._id === data?.senderId) {
            return {
              ...conversation,
              lastMessage: {
                sender: data?.senderId,
                message: data?.content,
                timestamp: Date.now(),
              },
            };
          } else {
            return conversation;
          }
        }),
      };
    });
  };

  // Listen socket for receiving message form current participant.
  useEffect(() => {
    if (participantMessages) {
      setMessages(participantMessages);
    }

    const handleReceiveMessage = (data: any) => {
      setIsTyping(false);
      setMessages((prev) => [...prev, data]);
      findParticipantAndUpdateLastMessage(data);
    };

    socket?.on("receiveMessage", handleReceiveMessage);
    return () => {
      socket?.off("receiveMessage", handleReceiveMessage);
    };
  }, [participantMessages]);

  useEffect(() => {
    socket?.on("userTyping", ({ senderId }) => {
      if (senderId !== userId) setIsTyping(true);
    });

    socket?.on("userStoppedTyping", ({ senderId }) => {
      if (senderId !== userId) setIsTyping(false);
    });

    return () => {
      socket?.off("userTyping");
      socket?.off("userStoppedTyping");
    };
  }, [userId]);

  // If current participant message is loading show loading indicator.
  if (isLoading) {
    return (
      <div className="w-full border-r border-r-[#EBEBEB] relative max-h-screen">
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
    <div className="w-full flex">
      {/* Chat Area */}
      <div className="w-full flex flex-col border-r border-r-[#EBEBEB]">
        {/* Participant details */}
        <div className="flex gap-2 items-center justify-between p-[17px] border-b">
          <div className="flex gap-2 items-center">
            <div className="w-[60px] h-[60px] overflow-hidden">
              <div className="w-[60px] h-[60px] font-Asap text-xl font-semibold flex justify-center items-center rounded-full bg-stone-300">
                {participant?.username.charAt(0)}
              </div>
            </div>
            <div>
              <h3 className="font-Asap text-lg font-medium">
                {participant?.username}
              </h3>
              <div className="flex items-center gap-1">
                {!!onlineUsers[participant?._id] ? (
                  <>
                    <span className="block min-w-[10px] min-h-[10px] bg-green-500 rounded-full"></span>
                    <span className="font-Inter text-sm">Online</span>
                  </>
                ) : (
                  <>
                    <span className="block min-w-[10px] min-h-[10px] bg-gray-500 rounded-full"></span>
                    <span className="font-Inter text-sm">Inactive</span>
                  </>
                )}
              </div>
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-4">
              <Phone className="w-5 h-5 text-gray-600 cursor-pointer hover:text-blue-500" />
              <Video className="w-5 h-5 text-gray-600 cursor-pointer hover:text-blue-500" />
              <MoreVertical
                onClick={() => setIsOpenActions(!isOpenActions)}
                className="w-5 h-5 text-gray-600 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="w-full flex-1 overflow-y-auto p-4 space-y-4">
          {messages?.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message?.senderId === userId ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`w-2/3 flex ${
                  message?.senderId === userId ? "justify-end" : "justify-start"
                }`}
              >
                <span className="w-max bg-slate-200 px-3 py-1 text-base rounded-full">
                  {message?.content}
                </span>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex items-center gap-5">
              <p className="text-gray-500">{participant?.username} is typing</p>
              <div className="chat_loader mt-1"></div>
            </div>
          )}
        </div>

        {/* Message Input */}
        <div className="p-4 border-t bg-white">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={message}
              onChange={(e) => handleSetMessages(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className="flex-1 rounded-full border border-gray-300 px-4 py-2 focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              onClick={handleSendMessage}
              className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 focus:outline-none"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* other actions */}
      {isOpenActions && (
        <div className="max-w-[300px] w-full p-6">
          <div className="flex justify-between items-center">
            <span>Make group</span>
            <button className="py-1 px-3 bg-slate-500 rounded-md text-white ml-2">
              Create
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

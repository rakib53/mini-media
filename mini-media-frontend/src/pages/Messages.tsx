import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import {
  addConversation,
  getCurrentUserConversations,
  searchUser,
} from "../api/auth";
import ParticipantAndMessages from "../Components/Messages/ParticipantAndMessages";
import Modal, { ModalRef } from "../Components/Modal";
import Navbar from "../Components/Navbar";
import useAuth from "../hooks/useAuth";
import { useSocket } from "../socket/SocketContext";
import { formatShortTimeAgo } from "../utils/helper";
import { User } from "../utils/types";

export default function Messages() {
  const { user } = useAuth();
  const { onlineUsers } = useSocket();
  const [selectedParticipant, setSelectParticipant] = useState<User | null>(
    null
  );
  const [searchParticipant, setSearchParticipant] = useState<string>("");
  const [isShowSearchParticipant, setIsShowSearchParticipant] = useState(false);
  const [addNewParticipant, setAddNewParticipant] = useState<User | null>(null);
  const searchShowUserRef = useRef<HTMLDivElement | null>(null);
  const addConversationRef = useRef<ModalRef | null>(null);
  const queryClient = useQueryClient();

  const addConversationMutation = useMutation({
    mutationFn: addConversation,
  });

  const { data: searchedUsers } = useQuery({
    queryKey: ["users", searchParticipant],
    queryFn: () => searchUser(searchParticipant || ""),
    enabled: !!searchParticipant,
  });

  const { data: getAllConversations } = useQuery({
    queryKey: ["getMessages", user?._id],
    queryFn: () => getCurrentUserConversations(user?._id),
    enabled: !!user?._id,
  });

  // select a participant
  const handleSelectParticipant = (user: User) => {
    setSelectParticipant(user);
  };

  // handle add conversation
  const handleAddConversation = async () => {
    if (!addNewParticipant) return;

    addConversationMutation.mutate(
      {
        senderId: user?._id,
        receiverId: addNewParticipant?._id,
      },
      {
        onSuccess: (data) => {
          queryClient.setQueryData(
            ["getMessages", user?._id],
            (oldData: any) => {
              const newConversation = {
                ...data?.conversation,
                user: {
                  ...addNewParticipant,
                },
              };

              return {
                ...oldData,
                conversations: [newConversation, ...oldData?.conversations],
              };
            }
          );
          // adding a new participant to the selected participant to start chatting
          setSelectParticipant(addNewParticipant);
          // close the add participant modal
          addConversationRef.current?.toggleModal();
        },
      }
    );
  };

  // set the search participant value
  const handleSearchParticipant = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchParticipant(e.target.value);
  };

  // select a new participant from the search
  const handleSelectNewParticipant = (user: User) => {
    setAddNewParticipant(user);
    setIsShowSearchParticipant(false);
    setSearchParticipant("");
  };

  // set true to show the search participant
  useEffect(() => {
    if (searchedUsers?.users?.length > 0) {
      setIsShowSearchParticipant(true);
    }
  }, [searchedUsers]);

  // checking if the user click outside of the time popup will disappear
  useEffect(() => {
    function handleClickOutSide(event: MouseEvent) {
      if (
        searchShowUserRef.current &&
        !searchShowUserRef.current.contains(event.target as Node)
      ) {
        setIsShowSearchParticipant(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutSide);
    return () => {
      document.removeEventListener("mousedown", handleClickOutSide);
    };
  }, [setIsShowSearchParticipant]);

  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      <main className="flex flex-1 overflow-hidden">
        {/* Messages header and the conversations */}
        <div className="w-1/4 border-r border-b-[#EBEBEB] overflow-hidden">
          <div className="w-full flex justify-between items-center p-[22px] border-b border-b-[#EBEBEB]">
            <div className="flex items-center gap-2.5">
              <div className="flex items-center gap-1.5">
                <h3 className="font-Inter text-xl leading-[150%] font-semibold text-black">
                  Messages
                </h3>
                <span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="7"
                    viewBox="0 0 14 7"
                    fill="none"
                  >
                    <path
                      d="M12.28 0.966675L7.93333 5.31334C7.42 5.82668 6.58 5.82668 6.06667 5.31334L1.72 0.966675"
                      stroke="black"
                      strokeWidth="1.5"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </div>
              <span className="font-Inter text-[12px] font-semibold inline-block py-1 px-3 bg-[#EDF2F7] rounded-full">
                {getAllConversations?.conversations?.length}
              </span>
            </div>

            {/* add new conversation */}
            <div>
              <Modal
                ref={addConversationRef}
                modalTitle="Search participant"
                ModalTrigger={
                  <button className="bg-primary hover:bg-indigo-700 outline-none rounded-full p-3">
                    <svg
                      stroke="#fff"
                      fill="#fff"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      height="1.6em"
                      width="1.6em"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                  </button>
                }
                children={
                  <div className="h-auto">
                    <h3 className="text-center font-Asap font-semibold">
                      Search participant
                    </h3>
                    <div>
                      <div className="relative">
                        <label
                          htmlFor="email"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Your email
                        </label>
                        <input
                          type="text"
                          name="text"
                          id="text"
                          onChange={handleSearchParticipant}
                          value={searchParticipant}
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                          placeholder="John doe"
                          required
                        />
                        {/* all participants */}
                        {isShowSearchParticipant &&
                          searchedUsers?.users?.length > 0 && (
                            <div
                              className="max-h-[200px] h-auto overflow-y-auto absolute top-full w-full bg-white mt-2 p-2 rounded-lg shadow-lg"
                              ref={searchShowUserRef}
                            >
                              {searchedUsers?.users?.map((user: User) => (
                                <div
                                  key={user?._id}
                                  onClick={() =>
                                    handleSelectNewParticipant(user)
                                  }
                                  className="flex items-center gap-2.5 p-2.5 rounded-lg hover:bg-gray-100 cursor-pointer"
                                >
                                  <div className="relative max-w-[50px] max-h-[50px] rounded-full">
                                    <div className="w-[50px] h-[50px] font-Asap text-xl font-semibold flex justify-center items-center rounded-full bg-stone-300">
                                      {user?.username.charAt(0)}
                                    </div>
                                  </div>
                                  <div>
                                    <h3 className="font-Inter font-semibold text-sm">
                                      {user?.username}
                                    </h3>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                      </div>

                      {addNewParticipant?._id && (
                        <div>
                          <span className="inline-block pt-4 font-medium text-gray-500">
                            Selected participant:
                          </span>
                          <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-gray-100">
                            <div className="max-w-[50px] max-h-[50px] rounded-full">
                              <div className="w-[50px] h-[50px] font-Asap text-xl font-semibold flex justify-center items-center rounded-full bg-stone-300">
                                {addNewParticipant?.username.charAt(0)}
                              </div>
                            </div>
                            <div>
                              <h3 className="font-Inter font-semibold text-sm">
                                {addNewParticipant?.username}
                              </h3>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* add participant button */}
                    <div>
                      <button
                        type="submit"
                        disabled={addConversationMutation?.isPending}
                        onClick={handleAddConversation}
                        className="bg-blue-500 text-white rounded-lg px-4 py-2 mt-4"
                      >
                        {addConversationMutation?.isPending
                          ? "Adding..."
                          : "Add participant"}
                      </button>
                    </div>
                  </div>
                }
              />
            </div>
          </div>
          {/* Search conversation  */}
          <div className="py-2 px-6 pt-3">
            <input
              type="text"
              placeholder="search conversation"
              className="w-full bg-gray-200 px-4 py-2 rounded-md outline-none"
            />
          </div>

          {/* all participants  */}
          <div className="w-full flex flex-col gap-2 p-3">
            {getAllConversations?.conversations?.map((conversation: any) => (
              <div
                key={conversation?.user?._id}
                className="w-full flex justify-between gap-2 p-3 cursor-pointer rounded-md hover:bg-[#F6F6FE] transition-all duration-200"
                onClick={() => handleSelectParticipant(conversation?.user)}
              >
                <div className="w-full flex items-center gap-3">
                  <div className="relative max-w-[60px] max-h-[60px] rounded-full">
                    <div className="w-[60px] h-[60px] font-Asap text-xl font-semibold flex justify-center items-center rounded-full bg-stone-300">
                      {conversation?.user?.username.charAt(0)}
                    </div>

                    {!!onlineUsers[conversation?.user?._id] && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 z-20 bg-green-500 rounded-full"></span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-Inter font-semibold text-base">
                      {conversation?.user?.username}
                    </h3>
                    <p className="text-gray-400 font-semibold">
                      {conversation?.lastMessage?.message
                        ? conversation?.lastMessage?.message
                        : "You are now connected on Messenger."}
                    </p>
                  </div>
                </div>

                <div>
                  <span className="text-gray-400 font-semibold">
                    {formatShortTimeAgo(conversation?.lastMessage?.timestamp)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Participant details and conversations */}
        <div className="w-3/4 flex-1 flex">
          {selectedParticipant ? (
            <ParticipantAndMessages
              participant={selectedParticipant}
              conversations={getAllConversations?.conversations}
            />
          ) : (
            <div className="w-full border-r border-r-[#EBEBEB] max-h-screen h-screen">
              <div className="flex justify-center items-center h-screen">
                <h1>Select a participant to chat</h1>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

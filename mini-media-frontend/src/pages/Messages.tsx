import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import ParticipantAndMessages from "../Components/Messages/ParticipantAndMessages";
import useAuth from "../hooks/useAuth";
import { User } from "../utils/types";

export default function Messages() {
  const { user } = useAuth();
  const [selectedParticipant, setSelectParticipant] = useState<User | null>(
    null
  );

  const { data: onlineUsers } = useQuery<{ [key: string]: boolean }>({
    queryKey: ["onlineUsers"],
    queryFn: () => ({}), // Placeholder query, we only update via socket events
    initialData: {},
  });

  // select a participant
  const handleSelectParticipant = (user: User) => {
    setSelectParticipant(user);
  };

  return (
    <div className="blog-editor-interface">
      <div className="flex">
        {/* Messages header and the conversations */}
        <div className="w-1/4 min-h-full h-full border-r border-b-[#EBEBEB]">
          <div className="flex justify-between items-center p-6 border-b border-b-[#EBEBEB]">
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
                12
              </span>
            </div>

            <div>
              <button className="bg-primary outline-none rounded-full p-3">
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

          {/* all conversations  */}
          <div className="flex flex-col gap-2 p-3">
            {user?.friends?.map((user: User) => (
              <div
                key={user?._id}
                className="flex justify-between gap-2 p-3 cursor-pointer rounded-md hover:bg-[#F6F6FE] transition-all duration-200"
                onClick={() => handleSelectParticipant(user)}
              >
                <div className="flex items-center gap-3">
                  <div className="relative max-w-[60px] max-h-[60px] rounded-full">
                    <div className="w-[60px] h-[60px] font-Asap text-xl font-semibold flex justify-center items-center rounded-full bg-stone-300">
                      {user?.username.charAt(0)}
                    </div>
                    {onlineUsers[user?._id] && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 z-20 bg-green-500 rounded-full"></span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-Inter font-semibold text-base">
                      {user?.username}
                    </h3>
                    <p className="text-gray-400 font-semibold">
                      Haha oh man 🔥
                    </p>
                  </div>
                </div>

                <div>
                  <span className="text-gray-400 font-semibold">12m</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Participant details and conversation */}
        {selectedParticipant ? (
          <ParticipantAndMessages participant={selectedParticipant} />
        ) : (
          <div className="w-2/4 border-r border-r-[#EBEBEB] max-h-screen h-screen">
            <div className="flex justify-center items-center h-screen">
              <h1>Select a participant to chat</h1>
            </div>
          </div>
        )}

        {/* Participant and conversation information */}
        <div className="w-1/4 p-6">
          {/* Participant details */}
          <div className="flex justify-between items-center">
            <div>
              <span>Directory</span>
            </div>
            <div>
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import ParticipantAndMessages from "../Components/Messages/ParticipantAndMessages";
import Navbar from "../Components/Navbar";
import useAuth from "../hooks/useAuth";
import { useSocket } from "../socket/SocketContext";
import { User } from "../utils/types";

export default function Messages() {
  const { user } = useAuth();
  const { onlineUsers } = useSocket();
  const [selectedParticipant, setSelectParticipant] = useState<User | null>(
    null
  );

  // select a participant
  const handleSelectParticipant = (user: User) => {
    setSelectParticipant(user);
  };

  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        {/* Messages header and the conversations */}
        <div className="w-1/4 border-r border-b-[#EBEBEB]">
          <div className="flex justify-between items-center p-[22px] border-b border-b-[#EBEBEB]">
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
                {user?.friends?.length}
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

          {/* all participants  */}
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

                    {!!onlineUsers[user?._id] && (
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

        {/* Participant details and conversations */}
        {selectedParticipant ? (
          <ParticipantAndMessages participant={selectedParticipant} />
        ) : (
          <div className="w-2/4 border-r border-r-[#EBEBEB] max-h-screen h-screen">
            <div className="flex justify-center items-center h-screen">
              <h1>Select a participant to chat</h1>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

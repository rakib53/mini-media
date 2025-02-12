import { useEffect, useRef, useState } from "react";
import useAuth from "../hooks/useAuth";
import Notifications from "./Notifications";

export default function Navbar() {
  const { user } = useAuth();
  const [isShowNotification, setIsShowNotification] = useState(false);
  const showNotificationRef = useRef<HTMLDivElement | null>(null);

  // checking if the user click outside of the time popup will disappear
  useEffect(() => {
    function handleClickOutSide(event: MouseEvent) {
      if (
        showNotificationRef.current &&
        !showNotificationRef.current.contains(event.target as Node)
      ) {
        setIsShowNotification(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutSide);
    return () => {
      document.removeEventListener("mousedown", handleClickOutSide);
    };
  }, [setIsShowNotification]);

  return (
    <div className="flex justify-between px-10 py-4 bg-[#2c3e50]">
      <h2 className="text-white">Welcome back, {user?.username}</h2>

      <div className="flex items-center gap-2">
        <div className="relative" ref={showNotificationRef}>
          <span onClick={() => setIsShowNotification(!isShowNotification)}>
            <svg
              stroke="#ffff"
              fill="#ffff"
              strokeWidth="0"
              viewBox="0 0 512 512"
              height="1.5em"
              width="1.5em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M256 464c22.779 0 41.411-18.719 41.411-41.6h-82.823c0 22.881 18.633 41.6 41.412 41.6zm134.589-124.8V224.8c0-63.44-44.516-117.518-103.53-131.041V79.2c0-17.682-13.457-31.2-31.059-31.2s-31.059 13.518-31.059 31.2v14.559c-59.015 13.523-103.53 67.601-103.53 131.041v114.4L80 380.8v20.8h352v-20.8l-41.411-41.6z"></path>
            </svg>
          </span>

          <div
            className={`absolute top-full right-0 bg-white rounded-md p-5 max-w-[300px] w-[300px] shadow-lg  ${
              isShowNotification
                ? "opacity-100"
                : "opacity-0 pointer-events-none"
            }`}
          >
            <Notifications />
          </div>
        </div>

        <span>
          <svg
            stroke="#ffff"
            fill="#ffff"
            strokeWidth="0"
            viewBox="0 0 448 512"
            height="1.2em"
            width="1.2em"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4z"></path>
          </svg>
        </span>
      </div>
    </div>
  );
}

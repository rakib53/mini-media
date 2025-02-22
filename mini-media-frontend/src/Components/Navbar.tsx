import { Bell, MessageCircle, UserRound } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
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
    <div className="h-[60px] bg-white border-b flex items-center justify-between px-4 shadow-sm">
      <h2 className="text-black font-Asap text-base font-semibold">
        Welcome back, {user?.username}
      </h2>

      <div className="flex items-center gap-4">
        {/* notifications icons  */}
        <div className="relative" ref={showNotificationRef}>
          <span onClick={() => setIsShowNotification(!isShowNotification)}>
            <Bell className="cursor-pointer" />
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
        {/* messenger icon */}
        <NavLink to="/messages">
          <MessageCircle className="cursor-pointer" />
        </NavLink>
        {/* user icons  */}
        <span>
          <UserRound className="cursor-pointer" />
        </span>
      </div>
    </div>
  );
}

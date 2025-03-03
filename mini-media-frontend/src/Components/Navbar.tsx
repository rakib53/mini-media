import {
  Bell,
  House,
  MessageCircle,
  MessageSquare,
  UserRound,
  Users,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Notifications from "./Notifications";

export default function Navbar() {
  const { user } = useAuth();
  const [isShowNotification, setIsShowNotification] = useState(false);
  const showNotificationRef = useRef<HTMLDivElement | null>(null);
  const isMessageTab = window.location.pathname === "/messages";

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
    <div className="h-[60px] bg-white border-b flex items-center justify-between py-6 px-4 shadow-sm">
      <h2 className="text-black font-Asap text-base font-semibold">
        Welcome back, {user?.username}
      </h2>
      {isMessageTab && (
        <div className="flex items-center gap-2">
          <NavLink
            to="/"
            className={`p-3 rounded-xl ${
              window.location.pathname === "/"
                ? "bg-blue-100 text-blue-600"
                : "hover:bg-gray-200"
            } `}
          >
            <House className="w-5 h-5" />
          </NavLink>
          <NavLink
            to="/messages"
            className={`p-3 rounded-xl ${
              window.location.pathname === "/messages"
                ? "bg-blue-100 text-blue-600"
                : "hover:bg-gray-200"
            } `}
          >
            <MessageSquare className="w-5 h-5" />
          </NavLink>
          <NavLink
            to="/friend-requests"
            className={`p-3 rounded-xl ${
              window.location.pathname === "/friend-requests"
                ? "bg-blue-100 text-blue-600"
                : "hover:bg-gray-200"
            } `}
          >
            <Users className="w-5 h-5" />
          </NavLink>
        </div>
      )}

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

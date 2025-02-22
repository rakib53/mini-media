import { House, MessageSquare, Users } from "lucide-react";
import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="w-[100px] h-full bg-gray-50 border-r flex flex-col items-center py-4">
      <div className="flex flex-col items-center space-y-6">
        <NavLink to="/" className="p-3 rounded-xl bg-blue-100 text-blue-600">
          <House className="w-6 h-6" />
        </NavLink>
        <NavLink to="/messages" className="p-3 rounded-xl hover:bg-gray-200">
          <MessageSquare className="w-6 h-6" />
        </NavLink>
        <NavLink
          to="/friend-requests"
          className="p-3 rounded-xl hover:bg-gray-200"
        >
          <Users className="w-6 h-6 text-gray-600" />
        </NavLink>
      </div>
    </aside>
  );
}

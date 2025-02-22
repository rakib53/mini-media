import { createBrowserRouter } from "react-router-dom";
import Layout from "../layout/Layout";
import Dashboard from "../pages/Dashboard";
import FriendRequests from "../pages/FriendRequests";
import Login from "../pages/Login";
import Messages from "../pages/Messages";
import Registration from "../pages/Registration";
import Settings from "../pages/Settings";
import PrivateRoute from "./PrivateRoute";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/registration",
    element: <Registration />,
  },
  {
    path: "/",
    element: (
      <PrivateRoute>
        <Layout />
      </PrivateRoute>
    ),
    children: [
      {
        path: "/",
        element: (
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        ),
      },
      {
        path: "/friend-requests",
        element: (
          <PrivateRoute>
            <FriendRequests />
          </PrivateRoute>
        ),
      },
      {
        path: "/settings",
        element: (
          <PrivateRoute>
            <Settings />
          </PrivateRoute>
        ),
      },
    ],
  },
  {
    path: "/messages",
    element: (
      <PrivateRoute>
        <Messages />
      </PrivateRoute>
    ),
  },
]);

export default router;

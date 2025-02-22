import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { UserProvider } from "./Context/UserContext";
import "./index.css";
import router from "./routes/routes";
import { SocketProvider } from "./socket/SocketContext";

// Create a client
const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <SocketProvider>
      <UserProvider>
        <RouterProvider router={router} />
      </UserProvider>
    </SocketProvider>
  </QueryClientProvider>
);

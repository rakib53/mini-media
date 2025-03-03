import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function PrivateRoute({ children }: { children: ReactNode }) {
  const { isLoading, isError, error, userId } = useAuth();
  const navigate = useNavigate();

  // Redirect to login if there is an error
  if (!isLoading && !userId) {
    navigate("/login");
    return null;
  }

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loader"></div>
      </div>
    );

  if (isError) return <p>Error: {(error as Error).message}</p>;

  if (userId) return children;
}

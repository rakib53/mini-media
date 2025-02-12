import { useQuery } from "@tanstack/react-query";
import { useUserProvider } from "../Context/UserContext";
import { getUser } from "../api/auth";

export default function useAuth() {
  const { userId } = useUserProvider();
  const token = localStorage.getItem("token");

  // Fetch user data
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => getUser({ token: token || "" }),
    enabled: !!token,
  });

  return { user: data, isLoading, isError, error, userId: data?._id };
}

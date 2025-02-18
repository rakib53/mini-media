import { useQuery } from "@tanstack/react-query";
import { getUser } from "../api/auth";

export default function useAuth() {
  const token = localStorage.getItem("token");

  // Fetch user data
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["user"],
    queryFn: () => getUser({ token: token || "" }),
    enabled: !!token,
  });

  return { user: data, isLoading, isError, error, userId: data?._id };
}

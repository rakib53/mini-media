import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../api/auth";
import { useUserProvider } from "../Context/UserContext";

export default function Login() {
  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });
  const { setUserId } = useUserProvider();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Login Mutation
  const mutation = useMutation({
    mutationFn: loginUser,
  });

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userData?.email) {
      toast.error("Please enter your email before logging in.");
      return;
    }
    mutation.mutate(userData, {
      onSuccess: (data) => {
        if (data?.token) {
          localStorage.setItem("token", data?.token);
          setUserId(data?._id);
          queryClient.invalidateQueries({ queryKey: ["user", userData.email] });
          toast.success("Logged in successfully!");
          navigate("/");
        }
      },
      onError: (data: any) => {
        toast.error(
          data?.response?.data?.message ?? "Login failed. Please try again."
        );
      },
    });
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <Toaster />
      <form
        onSubmit={handleLogin}
        className="max-w-[500px] w-full flex flex-col gap-3"
      >
        <h1 className="text-center font-semibold text-xl">
          Login to dashboard
        </h1>
        <input
          type="email"
          placeholder="Enter your email"
          value={userData?.email}
          className="border p-2 rounded-md outline-none"
          disabled={mutation.isPending}
          onChange={(e) =>
            setUserData({
              ...userData,
              email: e.target.value,
            })
          }
        />
        <input
          type="password"
          placeholder="Enter your password"
          value={userData?.password}
          className="border p-2 rounded-md outline-none"
          disabled={mutation.isPending}
          onChange={(e) =>
            setUserData({
              ...userData,
              password: e.target.value,
            })
          }
        />
        <button
          type="submit"
          disabled={mutation.isPending}
          className={`py-1 px-2 rounded text-white duration-150 ${
            mutation.isPending
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-green-700 hover:bg-green-800"
          }`}
        >
          {mutation.isPending ? "Logging in..." : "Login"}
        </button>
        <span>
          Don't have an account?{" "}
          <Link to={"/registration"} className="text-indigo-500">
            create one
          </Link>
        </span>
      </form>
    </div>
  );
}

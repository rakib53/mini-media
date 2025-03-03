import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../api/auth";

export default function Registration() {
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    password: "",
  });
  // Access the client
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Registration Mutations
  const mutation = useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
  });

  const handleRegistration = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userData?.email) {
      toast.error("Please enter your email before logging in.");
      return;
    }
    mutation.mutate(userData, {
      onSuccess: () => {
        // Redirect to login page
        navigate("/login");
        toast.success("Registration successful! Please login.");
      },
      onError: (data: any) => {
        // Show error message
        toast.error(
          data?.response?.data?.message ??
            "Registration failed. Please try again."
        );
      },
    });
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form
        onSubmit={handleRegistration}
        className="max-w-[500px] w-full flex flex-col gap-3"
      >
        <h1 className="text-center font-semibold text-xl">Registration</h1>
        <input
          type="text"
          required
          placeholder="Enter your username"
          value={userData?.username}
          className="border p-2 rounded-md outline-none"
          onChange={(e) =>
            setUserData({
              ...userData,
              username: e.target.value,
            })
          }
        />
        <input
          type="email"
          required
          placeholder="Enter your email"
          value={userData?.email}
          className="border p-2 rounded-md outline-none"
          onChange={(e) =>
            setUserData({
              ...userData,
              email: e.target.value,
            })
          }
        />
        <input
          required
          type="password"
          placeholder="Enter your password"
          value={userData?.password}
          className="border p-2 rounded-md outline-none"
          onChange={(e) =>
            setUserData({
              ...userData,
              password: e.target.value,
            })
          }
        />
        <button
          type="submit"
          disabled={mutation?.isPending}
          className={`py-1 px-2 rounded bg-green-700 text-white hover:bg-green-800 duration-150 ${
            mutation?.isPending ? "bg-gray-500 cursor-not-allowed" : ""
          }`}
        >
          {mutation?.isPending ? "Loading..." : "Registration"}
        </button>{" "}
        <span>
          Already have an account?{" "}
          <Link to={"/login"} className="text-indigo-500">
            login
          </Link>
        </span>
      </form>
      <Toaster />
    </div>
  );
}

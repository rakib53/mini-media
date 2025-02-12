import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "react-router-dom";
import { registerUser } from "../api/auth";

export default function Registration() {
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    password: "",
  });
  // Access the client
  const queryClient = useQueryClient();

  // Registration Mutations
  const mutation = useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
  });

  const handleRegistration = () => {
    mutation.mutate(userData);
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="max-w-[500px] w-full flex flex-col gap-3">
        <h1 className="text-center font-semibold text-xl">Registration</h1>
        <input
          type="text"
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
          onClick={handleRegistration}
          className="py-1 px-2 rounded bg-green-700 text-white hover:bg-green-800 duration-150"
        >
          Registration
        </button>{" "}
        <span>
          Already have an account?{" "}
          <Link to={"/login"} className="text-indigo-500">
            login
          </Link>
        </span>
      </div>
    </div>
  );
}

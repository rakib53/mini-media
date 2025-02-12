import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
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
  // Access the client
  const queryClient = useQueryClient();

  // Login Mutations
  const mutation = useMutation({
    mutationFn: loginUser,
  });

  const handleLogin = () => {
    if (!userData?.email) {
      alert("Please set an user ID before login.");
      return;
    }
    mutation.mutate(userData, {
      onSuccess: (data) => {
        if (data?.token) {
          localStorage.setItem("token", data?.token);
          setUserId(data?._id);
          queryClient.invalidateQueries({ queryKey: ["user", userData.email] });
          navigate("/");
        }
      },
    });
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="max-w-[500px] w-full flex flex-col gap-3">
        <h1 className="text-center font-semibold text-xl">
          Login to dashboard
        </h1>
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
          onClick={handleLogin}
          className="py-1 px-2 rounded bg-green-700 text-white hover:bg-green-800 duration-150"
        >
          Login
        </button>
        <span>
          Don't have an account?{" "}
          <Link to={"/registration"} className="text-indigo-500">
            create one
          </Link>
        </span>
      </div>
    </div>
  );
}

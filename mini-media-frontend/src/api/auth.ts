import axios from "axios";

export interface sendNotificationProps {
  senderId: string;
  receiverId: string;
  message: string;
}

const API_URL = "http://localhost:5000/api";

export const registerUser = async (userData: {
  username: string;
  email: string;
  password: string;
}) => {
  const response = await axios.post(`${API_URL}/registration`, userData);
  return response.data;
};

export const loginUser = async (userData: {
  email: string;
  password: string;
}) => {
  const response = await axios.post(`${API_URL}/login`, userData);
  return response.data;
};

export const getUser = async (userData: { token: string }) => {
  const response = await axios.get(`${API_URL}/get-user`, {
    headers: {
      Authorization: `Bearer ${userData.token}`,
    },
  });
  return response.data;
};

export const sendNotification = async (
  sendNotification: sendNotificationProps
) => {
  const response = await axios.post(
    `${API_URL}/send-notification`,
    sendNotification
  );
  return response.data;
};

export const getUserNotifications = async (userId: string) => {
  const token = localStorage.getItem("token");
  const response = await axios.get(`${API_URL}/get-notification/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

import axios from "axios";

export interface sendNotificationProps {
  senderId: string;
  receiverId: string;
  message: string;
}

// base API URL
const API_URL = "https://mini-media-3s6a.onrender.com/api";

// // base API URL
// const API_URL = "http://localhost:5000/api";

// get register api
export const registerUser = async (userData: {
  username: string;
  email: string;
  password: string;
}) => {
  const response = await axios.post(`${API_URL}/registration`, userData);
  return response.data;
};

// login user api
export const loginUser = async (userData: {
  email: string;
  password: string;
}) => {
  const response = await axios.post(`${API_URL}/login`, userData);
  return response.data;
};

// get user details api
export const getUser = async (userData: { token: string }) => {
  const response = await axios.get(`${API_URL}/get-user`, {
    headers: {
      Authorization: `Bearer ${userData.token}`,
    },
  });
  return response.data;
};

// send notification api
export const sendNotification = async (
  sendNotification: sendNotificationProps
) => {
  const response = await axios.post(
    `${API_URL}/send-notification`,
    sendNotification
  );
  return response.data;
};

// fetch user notifications api
export const getUserNotifications = async (userId: string) => {
  const token = localStorage.getItem("token");
  const response = await axios.get(`${API_URL}/get-notification/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// fetch all user api
export const getAllUsers = async () => {
  const token = localStorage.getItem("token");
  const response = await axios.get(`${API_URL}/get-all-users`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// send friend request api
export const sendFriendRequestApi = async ({
  sender,
  receiver,
}: {
  sender: string;
  receiver: string;
}) => {
  const token = localStorage.getItem("token");
  const response = await axios.post(
    `${API_URL}/send-friend-request`,
    { sender, receiver },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

// cancel friend request api
export const declineFriendRequest = async ({
  senderId,
  receiverId,
}: {
  senderId: string;
  receiverId: string;
}) => {
  const token = localStorage.getItem("token");
  const response = await axios.post(
    `${API_URL}/decline-friend-request`,
    { senderId, receiverId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

// cancel outgoing friend request
export const cancelOutgoingFriendRequest = async ({
  senderId,
  receiverId,
}: {
  senderId: string;
  receiverId: string;
}) => {
  const token = localStorage.getItem("token");
  const response = await axios.post(
    `${API_URL}/cancel-friend-request`,
    { senderId, receiverId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

// make friend api
export const makeFriendApi = async ({
  sender,
  receiver,
}: {
  sender: string;
  receiver: string;
}) => {
  const token = localStorage.getItem("token");
  const response = await axios.post(
    `${API_URL}/make-friend`,
    { sender, receiver },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

// Unfriend an user
export const unfriendAnUser = async ({
  userId,
  friendId,
}: {
  userId: string;
  friendId: string;
}) => {
  const token = localStorage.getItem("token");
  const response = await axios.post(
    `${API_URL}/unfriend/${userId}`,
    { userId, friendId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

// fetch friend requests api
export const fetchFriendRequest = async (userId: string) => {
  const token = localStorage.getItem("token");
  const response = await axios.get(`${API_URL}/friend-requests/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// get all the messages for a participant
export const getSingleConversationMessages = async ({
  userId,
  friendId,
}: {
  userId: string;
  friendId: string;
}) => {
  const token = localStorage.getItem("token");
  const response = await axios.get(
    `${API_URL}/get-messages/${userId}/${friendId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

// add a conversation
export const addConversation = async ({
  senderId,
  receiverId,
}: {
  senderId: string;
  receiverId: string;
}) => {
  const token = localStorage.getItem("token");
  const response = await axios.post(
    `${API_URL}/add-conversation`,
    { senderId, receiverId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

// search an user
export const searchUser = async (search: string) => {
  const token = localStorage.getItem("token");
  const response = await axios.get(`${API_URL}/search-users/${search}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getCurrentUserConversations = async (userId: string) => {
  const token = localStorage.getItem("token");
  const response = await axios.get(`${API_URL}/get-conversations/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getUserFriendList = async (userId: string) => {
  const token = localStorage.getItem("token");
  const response = await axios.get(`${API_URL}/get-friends/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

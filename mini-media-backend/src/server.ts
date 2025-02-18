import { Server } from "http";
import mongoose from "mongoose";
import { Server as SocketIOServer } from "socket.io";
import app from "./app";
import config from "./app/config";
import { MessageModel } from "./app/modules/messages/messages.models";

let server: Server;
let io: SocketIOServer;
const userList: Record<string, string> = {}; // Store userId -> socketId mapping

const main = async () => {
  try {
    const mongoUrl =
      config.node_env === "production" ? config.remote_url : config.local_url;

    if (!mongoUrl) {
      throw new Error("MongoDB connection URL is missing! Check your config.");
    }

    console.log(
      `🔄 Connecting to MongoDB at: ${mongoUrl.replace(/:\/\/.*@/, "://****@")}`
    );

    await mongoose.connect(mongoUrl);

    console.log("✅ MongoDB connection established successfully.");

    server = app.listen(config.port, () => {
      console.log(`🚀 Server is running at: http://localhost:${config.port}`);
    });

    // 🔥 Initialize Socket.IO with CORS
    io = new SocketIOServer(server, {
      cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
      },
    });

    io.on("connection", (socket) => {
      // when a new users has connect register in memory
      socket.on("registerUser", async (userId: string) => {
        console.log("🔹 Registering user:", userId);
        userList[userId] = socket.id;
      });

      socket.on("sendMessage", async (data) => {
        console.log("first");
        const { senderId, receiverId, content } = data;
        const newMessage = new MessageModel({ senderId, receiverId, content });
        await newMessage.save();

        // socket ID to send latest messages.
        const receiverSocketId = userList[receiverId];
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("receiveMessage", newMessage);
        }
      });

      // when disconnect an user
      socket.on("disconnect", async () => {
        Object.keys(userList).forEach((key) => {
          if (userList[key] === socket.id) {
            delete userList[key];
          }
        });
      });
    });

    console.log("🔥 Socket.IO is running...");
  } catch (err: any) {
    console.error("❌ MongoDB connection error:", err.message);
    setTimeout(main, 5000);
  }
};

// ✅ Export io for use in other files
export { io, userList };

main();

// // Function to get only online friends
// const getOnlineFriends = async (userId: string) => {
//   const userFriends = await getUserFriendsFromDB(userId); // Fetch user's friends from DB
//   return userFriends.filter((friendId: string | number) => userList[friendId]); // Filter only online friends
// };

// async function getUserFriendsFromDB(userId: string): Promise<string[]> {
//   try {
//     const user = await User.findById(userId).populate("friends");
//     if (!user || !user.friends) {
//       return [];
//     }
//     return user.friends.map((friend: any) => friend._id.toString());
//   } catch (error) {
//     console.error("Error fetching user friends from DB:", error);
//     return [];
//   }
// }

// if (userId) {
//   delete userList[userId];
//   console.log("❌ User disconnected:", socket.id);
//   // Update DB to mark user as offline
//   await User.findByIdAndUpdate(userId, { isOnline: false });
//   // Notify friends that this user is offline
//   // io.emit("onlineUsers", { userId, isOnline: false });
// }

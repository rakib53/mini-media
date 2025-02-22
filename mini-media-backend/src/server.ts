import { Server } from "http";
import mongoose from "mongoose";
import { Server as SocketIOServer } from "socket.io";
import app from "./app";
import config from "./app/config";
import { User } from "./app/modules/auth/auth.models";
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
        console.log("🔹 Registering user:", userId, socket.id);
        userList[userId] = socket.id;
        const userInfo = await User.findById(userId).select("friends").lean();
        // Notify only the user's friends that they are online
        if (userInfo && userInfo?.friends?.length > 0) {
          let onlineFriends: string[] = [];
          userInfo?.friends?.forEach((friendId) => {
            const friendSocketId = userList[friendId.toString()];
            if (friendSocketId) {
              onlineFriends.push(friendId.toString());
              io.to(userList[friendId.toString()]).emit("userOnline", userId);
            }
          });

          // Send the list of currently online friends to the user
          socket.emit("onlineFriends", onlineFriends);
        }
      });

      socket.on("sendMessage", async (data) => {
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
        let disconnectedUserId: string | null = null;
        Object.keys(userList).forEach((key) => {
          if (userList[key] === socket.id) {
            disconnectedUserId = key;
            delete userList[key];
          }
        });
        if (disconnectedUserId) {
          // Notify all users that this user is offline
          io.emit("userOffline", disconnectedUserId);
          console.log(`❌ User ${disconnectedUserId} went offline.`);
        }
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

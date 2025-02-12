import { Server } from "http";
import mongoose from "mongoose";
import { Server as SocketIOServer } from "socket.io";
import app from "./app";
import config from "./app/config";

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
      console.log("A user connected:", socket.id);

      socket.on("registerUser", (userId: string) => {
        console.log("🔹 Registering user:", userId);
        userList[userId] = socket.id;
      });

      socket.on("disconnect", () => {
        console.log("❌ User disconnected:", socket.id);
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

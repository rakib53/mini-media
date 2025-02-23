import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join((process.cwd(), ".env")) });

const config = {
  node_env: process.env.NODE_ENV, // development
  port: process.env.PORT,
  local_url: "mongodb://127.0.0.1:27017/learning-socket",
  remote_url:
    "mongodb+srv://learning_socket:jFacE3xmEzn3Ptwi@simple-node-app.ybb3hyi.mongodb.net/learning-socket",
};
export default config;

import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application } from "express";
import globalErrorHandler from "./app/middlewares/GlobalErrorHandling";
import notFound from "./app/middlewares/notFound";
import router from "./app/routers";
const app: Application = express();

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Other middleware
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:5173"],
  })
);

app.use("/api/", router);

app.get("/", (req, res) => {
  res.send("Hello this server has been connected.");
});

app.use(globalErrorHandler);
app.use(notFound);
export default app;

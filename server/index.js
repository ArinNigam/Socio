import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import mongoose from "mongoose";
import morgan from "morgan";
import { Server } from "socket.io";
import { authenticationMiddleware } from "./middlewares/auth.js";
import { register, login, update,sendRegistrationMail} from "./controllers/auth.js";
import { createPost } from "./controllers/posts.js";

import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";

const app = express();
dotenv.config();

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use((req, res, next) => {
  res.append("Access-Control-Allow-Origin", ["*"]);
  res.append("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,PATCH");
  res.append("Access-Control-Allow-Headers", "Content-Type,Authorization");
  res.append("Access-Control-Allow-Credentials", "true");
  next();
});

app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(
  cors({
    origin: "https://socio-client-five.vercel.app/",
    methods: ["GET", "POST", "PATCH", "DELETE"],
    credentials: true,
  })
);

app.post("/auth/register", register);
app.post("/auth/login", login);
app.post("/posts", authenticationMiddleware, createPost);
app.patch("/auth/update/:id", update);
app.post("/auth/register/otp", sendRegistrationMail);


app.use("/users", userRoutes);
app.use("/posts", postRoutes);
app.use("/message", messageRoutes);


const port = process.env.PORT || 8000;

const start = async () => {
  try {
    await mongoose
      .connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => console.log("Connected"));

    const server = app.listen(port, () => {
      console.log(`Server is listening on port ${port}`);
    });

   const io = new Server(server, {
     cors: {
       origin: "*",
       credentials: true,
     },
   });
    global.onlineUsers = new Map();
    io.on("connection", (socket) => {
      global.chatsocket = socket;
      socket.on("addUser", (id) => {
        onlineUsers.set(id, socket.id);
      });

      socket.on("send-msg", (data) => {
        const sendUserSocket = onlineUsers.get(data.to);
        if (sendUserSocket) {
          socket.to(sendUserSocket).emit("msg-recieve", data.message);
        }
      });
    });
      
  } catch (error) {
    console.log(error);
  }
};

start();

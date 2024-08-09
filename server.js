import "express-async-errors";
import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
const app = express();
import morgan from "morgan";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cloudinary from 'cloudinary';

//custom imports
//routers
import jobRouter from "./routes/jobRouter.js";
import authRouter from "./routes/authRouter.js";
import userRouter from "./routes/userRouter.js"

//public 
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import path from 'path';


//middleware
import errorHandleMiddleware from "./middleware/errorHandlerMiddleware.js";
import { authenticateUser } from "./middleware/authMiddleware.js";


cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const __dirname = dirname(fileURLToPath(import.meta.url));//ES6 MODULE FORMAT


if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev")); // so that dotenv only run in development but not production
}
app.use(express.static(path.resolve(__dirname, './public')));
app.use(cookieParser()); // invoke cookie parser
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get('/api/v1/test', (req, res) => {
  res.json({ msg: 'test route' });
});

app.use("/api/v1/jobs", authenticateUser, jobRouter); // authenticateUser from authMiddleware secures all job routes if user is not logged in yet
app.use("/api/v1/users", authenticateUser, userRouter); // authenticateUser from authMiddleware secures all job routes if user is not logged in yet
app.use("/api/v1/auth", authRouter);


//if none of the above routes match, send not found
// invalid request
app.use("*", (req, res) => {
  res.status(404).json({ msg: "not found" });
});

//error middleware has to be last one
//gets triggered by the existing request
app.use(errorHandleMiddleware);

const port = process.env.PORT || 5100;

try {
  await mongoose.connect(process.env.MONGO_URL);
  app.listen(port, () => {
    console.log(`server running on PORT ${port}....`);
  });
} catch (error) {
  console.log(error);
  process.exit(1);
}

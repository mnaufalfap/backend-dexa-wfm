import express, { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import router from "./routes/Routes";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();
const app = express();

app.use(
  cors({
    origin: "http://localhost:4000",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(router);

app.get("/", (req: Request, res: Response) => {
  return res.status(200).send({
    response: "express tsc",
  });
});

app.listen(process.env.APP_PORT, () => {
  console.log(
    `${process.env.APP_NAME} running on port ${process.env.APP_PORT}`
  );
});

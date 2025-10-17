import express, { Request, Response } from "express";
import cors from "cors";
import { router } from "./app/modules/routes";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
import NotFound from "./app/middlewares/notFound";
import cookieParser from "cookie-parser";
import expressSession from "express-session"
import passport from "passport";
import "./app/config/passport";

const app = express();

app.use(expressSession({
  secret: "Your Secret",
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());
app.use(express.json());
app.use(cors());

app.use("/api/v1", router);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Welcome to Tour Management Backend System",
  });
});

app.use(globalErrorHandler);

app.use(NotFound);

export default app;

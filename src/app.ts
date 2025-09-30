import express, { Request, Response } from "express";
import cors from "cors";
import { router } from "./app/modules/routes";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
import NotFound from "./app/middlewares/notFound";

const app = express();

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

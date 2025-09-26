/* eslint-disable no-console */
import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";

let server: Server;

const startServer = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://mongooseDb:mongooseDb@cluster0.0yxll.mongodb.net/tour_management?retryWrites=true&w=majority&appName=Cluster0"
    );
    console.log("Connect to DB!");
    server = app.listen(5000, () => {
      console.log("Server is listening port 5000");
    });
  } catch (error) {
    console.log(error);
  }
};

startServer();

process.on("unhandledRejection", (err) => {
  console.log("Unhandled rejection detected... Server Shutting Down...", err);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

process.on("uncaughtException", (err) => {
  console.log("Uncaught exception detected... Server Shutting Down...", err);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});


process.on("SIGTERM", () => {
  console.log("SIGTERM signal received... Server Shutting Down..." );
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});


process.on("SIGINT", () => {
  console.log("SIGINT signal received... Server Shutting Down..." );
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

// unhandled rejection error
// Promise.reject(new Error("I Forgot to catch this promise"))

// uncaught exception error
// throw new Error("I forgot to handle this local error");

/**
 * unhandled rejection error
 * uncaught exception error
 * signal termination error
 */

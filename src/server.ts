import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import database from "./config/dataBase";

import userRouter from "./api/routes/userRouter";
import { logger } from "./util/logger";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.use("/api/v2/user", userRouter.router);

const startServer = async () => {
  try {

    await database.connectDatabase();

    app.listen(PORT, () => {
      logger.info(`🚀 Server running on port ${PORT}`);
    });

  } catch (err: any) {
    logger.error("❌ Failed to start server: " + err.message);
    process.exit(1);
  }
};

startServer();

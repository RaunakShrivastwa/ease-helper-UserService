import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import database from "./config/dataBase";

import userRouter from "./api/routes/userRouter";
import { logger } from "./util/logger";
import { startUserAuthConsumer } from "./event/consumer";
import { connectProducer } from "./event/producer";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.use("/api/v2/user", userRouter.router);


app.listen(PORT, (err) => {
      if(err){
        logger.error(`there is error with service ${err}`)
      }
      startServer();
    });

async function startServer(){
  logger.info(`server running on ${PORT}`)
   await database.connectDatabase();
    await startUserAuthConsumer();
    await connectProducer();
};

startServer();

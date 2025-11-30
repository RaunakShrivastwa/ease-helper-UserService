import { Router } from "express";
import { UserController } from "../controllers/userController";
import { logger } from "../../util/logger";
import { UserRepository } from "../repo/userRepo";
import { UserValidators } from "../validators/userValidator";

class userRouter {
  public router: Router;
  constructor() {
    this.router = Router();
    logger.info("User Router Initialized");
    new UserRepository("users")
      .createTable()
      .then((msg) => {
        logger.info(msg);
      })
      .catch((err) => {
        logger.warn("Error creating user table: " + err.message);
      });
      
    this.routes();
  }

  public routes(): void {
    this.router.post("/", UserValidators.useValidators,UserController.create);
    this.router.get("/", UserController.getAll);
    this.router.get("/:id", UserController.getById);
    this.router.delete("/:id", UserController.delete);
    this.router.put("/:id", UserController.update);
  }
}

export default new userRouter();

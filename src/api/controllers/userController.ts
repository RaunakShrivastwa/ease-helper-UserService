import { Request, Response } from "express";
import { UserServiceImpl } from "../service/userServiceImpl";
import { connectProducer, publishProfileEvent } from "../../event/producer";

const userService = new UserServiceImpl();

export class UserController {

  static async create(user:any) {
    try{
      user =  await userService.createUser(user);
      await publishProfileEvent(user);
      
    }catch(error){
      console.error("Error creating user:", error);
      // res.status(500).json({ msg: `Internal server error ${error}` });
      return;
    }
  }

  static async getAll(req: Request, res: Response) {
    const users = await userService.getUsers();
    res.json(users);
  }

  static async getById(req: Request, res: Response) {
    const id = Number(req.params.id);
    const user = await userService.getUserById(id);
    user ? res.json(user) : res.status(404).json({ msg: "User not found" });
  }

  static async update(req: Request, res: Response) {
    const id = Number(req.params.id);

    const updated = await userService.updateUser(id, req.body);
    updated ? res.json(updated) : res.status(404).json({ msg: "User not found" });
  }

  static async delete(req: Request, res: Response) {
    const id = Number(req.params.id);
    const deleted = await userService.deleteUser(id);
    deleted
      ? res.json({ msg: "User deleted" })
      : res.status(404).json({ msg: "User not found" });
  }

  static async getByEmail(req: Request, res: Response) {
    const email = req.params.email;
    const user = await userService.getUserByEmail(email);
    user ? res.status(200).json(user) : res.status(404).json({ msg: "User not found" });
  }



}

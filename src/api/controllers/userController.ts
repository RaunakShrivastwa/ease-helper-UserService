import { Request, Response } from "express";
import { UserServiceImpl } from "../service/userServiceImpl";
import { User } from "../model/User";

const userService = new UserServiceImpl();

export class UserController {

  static async create(req: Request, res: Response) {
    const { name, email } = req.body;
    // const user = new User(name, email,"abcd1234","Delhi");
    const result = await userService.createUser(req.body);
    res.json(result);
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



}

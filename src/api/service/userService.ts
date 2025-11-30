import { User } from "../model/User.js";

export interface UserService {
  createUser(user: User): Promise<User>;
  getUsers(): Promise<User[]>;
  getUserById(id: number): Promise<User | null>;
  updateUser(id: number, user: User): Promise<User | null>;
  deleteUser(id: number): Promise<boolean>;
}

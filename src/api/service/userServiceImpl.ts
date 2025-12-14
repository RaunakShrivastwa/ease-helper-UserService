import { UserRepository } from "../repo/userRepo";
import { UserService } from "./userService";
import { User } from "../model/User";


export class UserServiceImpl implements UserService {
  private userRepo: UserRepository;

  constructor() {
    this.userRepo = new UserRepository("users");
  }

  createUser(user: User): Promise<User> {
    return this.userRepo.createUser(user);
  }

  getUsers(): Promise<User[]> {
    return this.userRepo.getAllUsers();
  }

  getUserById(id: number): Promise<User | null> {
    return this.userRepo.getUserById(id);
  }

  updateUser(id: number, user: User): Promise<User | null> {
    return this.userRepo.updateById(id, user);
  }

  deleteUser(id: number): Promise<boolean> {
    return this.userRepo.deleteUser(id);
  }

  getUserByEmail(email: string): Promise<User | null> {
    return (this.userRepo as UserRepository).findByEmail(email);
  }
}

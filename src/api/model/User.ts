
import { statusType, UserRole } from "../validators/roleType";

export class User {
  userID: number;
  name: string = "";
  email: string = "";
  address: string = "";
  phone: string = "";
  role: UserRole = UserRole.USER;
  status: statusType = statusType.ACTIVE;
  discription :string;
  createdAt: Date = new Date();
  updatedAt: Date = new Date();
}

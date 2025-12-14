import dataBase from "../../config/dataBase";
import { User } from "../model/User.js";

export class UserRepository {
  private tableName: string;
  private pool: any;

  constructor(tableName: string) {
    this.tableName = tableName;
    this.pool = dataBase.getPool(); // ✅ Get pool here
    
  }

  // create table methods
  async createTable(): Promise<string> {
    try {
      const query = ` create table ${this.tableName} (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(100) NOT NULL,
      address VARCHAR(255),
      phone VARCHAR(15),
      role VARCHAR(20) DEFAULT 'USER',
      status VARCHAR(20) DEFAULT 'ACTIVE',
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ); `;

      await this.pool.query(query);
      return "User table created successfully";
    } catch (err: any) {
      return `Error creating ${this.tableName} table: ${err.message}`;
    }
  }

  async createUser(user: User): Promise<User> {
   // ✅ Get pool here inside the method

    const columns: string[] = [];
    const placeholders: string[] = [];
    const values: any[] = [];

    for (const key in user) {
      columns.push(key);
      placeholders.push(`$${columns.length}`);
      values.push((user as any)[key]);
    }

    const query = `
      INSERT INTO ${this.tableName} (${columns.join(", ")})
      VALUES (${placeholders.join(", ")})
      RETURNING *;
    `;

    const result = await this.pool.query(query, values);
    return result.rows[0];
  }

  async getAllUsers(): Promise<User[]> {
  
    const query = `SELECT * FROM ${this.tableName};`;
    const result = await this.pool.query(query);
    return result.rows;
  }

  async getUserById(id: number): Promise<User | null> {
  
    const query = `SELECT * FROM ${this.tableName} WHERE id = $1;`;
    const result = await this.pool.query(query, [id]);
    return result.rows.length ? result.rows[0] : null;
  }

   async updateById(id : number, user:User) : Promise<User | null>  {
    const fields = Object.keys(user);
    const set = fields.map((field, i) => `${field} = $${i + 1}`).join(', ');
    const query = `UPDATE ${this.tableName} SET ${set} WHERE id = ${id} RETURNING *`;
    return (await this.pool.query(query, Object.values(user))).rows[0];
  }

  async deleteUser(id: number): Promise<boolean> {
  
    const query = `DELETE FROM ${this.tableName} WHERE id = $1;`;
    const result = await this.pool.query(query, [id]);
    return result.rowCount > 0;
  }

   async findByEmail(email: string): Promise<User | null> {
    const query = `SELECT * FROM ${this.tableName} WHERE email = $1;`;  
    return this.pool.query(query, [email]).then((result: any) => {
      return result.rows.length ? result.rows[0] : null;
    });
  }

}

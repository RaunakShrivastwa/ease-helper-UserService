import { Request, Response } from "express";
import { UserServiceImpl } from "../service/userServiceImpl";
import { connectProducer, publishDeleteProfileEvent, publishProfileEvent } from "../../event/producer";
import esClient from "../../config/elastick";

const userService = new UserServiceImpl();

export class UserController {

  static async create(user: any) {
    try {
      user = await userService.createUser(user);
      await esClient.index({
        index: 'users',
        id: user.id.toString(),
        document: {
          name: user.name,
          email: user.email,
          address: user.address,
          role: user.role,
          description: user.description,
          location: user.location,
          status: user.status,
          createdAt: user.createdAt
        }
      });
      await publishProfileEvent(user);

    } catch (error) {
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
    if (req.body.description && req.body.description.length > 255) {
      return res.status(500).json({ Error: 'Description field is to long it should be lest than 255' });
    }
    const updated = await userService.updateUser(id, req.body);
    if (!updated) {
      return res.status(404).json({ Error: 'User Not Found' });
    }
    await esClient.update({
      index: 'users',
      id: id.toString(),
      doc: req.body,        // 🔥 ONLY provided fields
    });
    return res.status(200).json(updated)
  }

  static async delete(req: Request, res: Response) {
    const id = Number(req.params.id);
    const deleted = await userService.deleteUser(id);
    if (deleted) {
      await publishDeleteProfileEvent(id);
      return res.json({ msg: "User deleted" })

    } else {
      res.status(404).json({ msg: "User not found" });
    }
  }

  static async getByEmail(req: Request, res: Response) {
    const email = req.params.email;
    const user = await userService.getUserByEmail(email);
    user ? res.status(200).json(user) : res.status(404).json({ msg: "User not found" });
  }


 static async textSearchUsers(req: Request, res: Response) {
  try {
    const text = req.query.text as string;
    console.log('search text:', text);

    if (!text || text.trim().length === 0) {
      return res.status(400).json({
        message: 'Search text is required'
      });
    }

    const result = await esClient.search({
      index: 'users',
      query: {
        multi_match: {
          query: text,
          fields: [
            'name^3',
            'role^2',
            'description'
          ],
          operator: 'or'
        }
      }
    });

    return res.json(
      result.hits.hits.map(hit => ({
        score: hit._score,
        data: hit._source
      }))
    );
  } catch (error) {
    console.error('Elastic search error:', error);
    return res.status(500).json({
      message: 'Search failed'
    });
  }
}



}

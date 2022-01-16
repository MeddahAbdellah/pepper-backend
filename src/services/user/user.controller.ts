import { Request, Response } from 'express';
import Joi from 'joi';
import { validation } from 'helpers/helpers';

export class UserController {
  @validation(Joi.object({
    body: Joi.object({
      phoneNumber: Joi.string().required(),
    }),
  }))
  public static async login(req: Request, res: Response): Promise<Response> {
    console.log(req);
    return res.json({ data: 'nothing for now' });
  }
}
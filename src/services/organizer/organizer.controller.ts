import { Request, Response } from 'express';
import Joi from 'joi';
import { validation } from 'helpers/helpers';
import { auth, AUTH_NAMES } from 'acls/base.acl';

export class OrganizerController {
  @validation({
    body: {
      phoneNumber: Joi.string().required(),
    },
  })
  @auth.For([AUTH_NAMES.IsOrganizer])
  public static async login(req: Request, res: Response): Promise<Response> {
    console.log(req);
    return res.json({ date: 'nothing for now' });
  }
}
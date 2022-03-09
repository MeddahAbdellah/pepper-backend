import { Request, Response } from 'express';
import Joi from 'joi';
import { validation } from 'helpers/helpers';
import { User, Party, Organizer } from 'orms';
import httpStatus from 'http-status';
import _ from 'lodash';
import { UserService } from 'services/user/user.service';
import 'dotenv/config';
import { PartyService } from './party.service';
import { IParty } from 'models/types';

interface UserRequest extends Request {
  user: User
};

interface OrganizerRequest extends Request {
  organizer: Organizer
};

export class PartyController {
  // TODO: add pagination
  @validation(Joi.object({}))
  public static async getPartiesThatUserCanGoTo(req: UserRequest, res: Response): Promise<Response<{ parties: IParty[] }>> {
    const user = await User.findOne({ where: { id: req.user.id }});

    if (!user) {
      res.status(httpStatus.NOT_FOUND);
      return res.json({ message: 'User does not exist' });
    }
    const normalizedParties = await UserService.getPartiesUserCanGoTo(user);
    return res.json({ parties: normalizedParties });
  }


  @validation(Joi.object({
    theme: Joi.string().required(),
    date: Joi.date().required(),
    price: Joi.number().required(),
    people: Joi.number().required(),
    minAge: Joi.number().required(),
    maxAge: Joi.number().required(),
  }))
  public static async createNewparty(req: OrganizerRequest, res: Response): Promise<Response<{ parties: IParty[] }>> {
    const organizer = await Organizer.findOne({ where: { id: req.organizer.id }});

    if (!organizer) {
      res.status(httpStatus.NOT_FOUND);
      return res.json({ message: 'User does not exist' });
    }

    const party = await Party.create({
      theme: req.body.theme,
      date: req.body.date,
      price: req.body.price,
      people: req.body.people,
      minAge: req.body.minAge,
      maxAge: req.body.maxAge,
    });

    await organizer.addParty(party);
    const normalizedParties = await PartyService.getOrganizerParties(organizer)
    return res.json({ parties: normalizedParties });
  }

  @validation(Joi.object({}))
  public static async getOrganizerParties(req: OrganizerRequest, res: Response): Promise<Response<{ parties: IParty[] }>> {
    const organizer = await Organizer.findOne({ where: { id: req.organizer.id }});

    if (!organizer) {
      res.status(httpStatus.NOT_FOUND);
      return res.json({ message: 'User does not exist' });
    }

    const normalizedParties = await PartyService.getOrganizerParties(organizer)
    return res.json({ parties: normalizedParties });
  }
}
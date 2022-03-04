import { Request, Response } from 'express';
import Joi from 'joi';
import { validation } from 'helpers/helpers';
import { Organizer } from 'orms';
import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';
import { SHA256 } from 'crypto-js';
import { IOrganizer, OrganizerStatus } from 'models/types';
import 'dotenv/config';
import _ from 'lodash';

interface OrganizerRequest extends Request {
  organizer: Organizer
};

export class OrganizerController {

  @validation(Joi.object({
    userName:  Joi.string().required(),
    phoneNumber: Joi.string().required(),
    password: Joi.string().required(),
    title: Joi.string().required(),
    location: Joi.string().required(),
    description: Joi.string().required(),
    imgs: Joi.array().items({ uri: Joi.string() }),
    foods:Joi.array().items({ name: Joi.string(), price: Joi.number() }),
    drinks:Joi.array().items({ name: Joi.string(), price: Joi.number() }),
  }))
  
  public static async subscribe(req: Request, res: Response): Promise<Response<{ token: string }>> {

    // TO-DO : Add other tests such as phoneNumber and location
    const organizerTest = await Organizer.findOne({ where: { userName: req.body.userName }, raw: true})

    if (organizerTest !== null) {
      res.status(httpStatus.UNAUTHORIZED);
      return res.json({ message: 'UserName already exists' });
    }

    // TO-DO: set status to be pending and validate user later through web App

    await Organizer.create({
      userName: req.body.userName,
      password: SHA256(req.body.password).toString(),
      phoneNumber: req.body.phoneNumber,
      title: req.body.title,
      location: req.body.location,
      description: req.body.description,
      imgs: req.body.imgs,
      foods: req.body.foods,
      drinks: req.body.drinks,
      status: OrganizerStatus.Pending
    });

    const organizer = await Organizer.findOne({ 
      where: { userName: req.body.userName }, 
      attributes: {exclude: ['password','createdAt','updatedAt','deletedAt']},
      raw: true,
    });
    
    if (organizer === null) {
      res.status(httpStatus.INTERNAL_SERVER_ERROR);
      return res.json({ message: 'Organizer could not be created!' });
    }

    if (!process.env.JWT_KEY) {
      throw 'JWT key not provided';
    }

    const token = jwt.sign(organizer, process.env.JWT_KEY);
    return res.json({ token });
  }

  @validation(Joi.object({
    userName: Joi.string().required(),
    password: Joi.string().required(),
  }))
  public static async login(req: Request, res: Response): Promise<Response<{ token: string }>> {
    const organizer = await Organizer.findOne({ where: { userName: req.body.userName, password: SHA256(req.body.password).toString() }, raw: true});
    if (!organizer) {
      res.status(httpStatus.UNAUTHORIZED);
      return res.json({ message: 'Organizer does not exist' });
    }

    // TO-DO : update policy for allowed logins (maybe pending or Accepted)
    const isAuthorized = organizer.status !== OrganizerStatus.Rejected;

    if (!isAuthorized) {
      res.status(httpStatus.UNAUTHORIZED);
      return res.json({ message: 'Organizer not validated yet' });
    }

    if (!process.env.JWT_KEY) {
      throw 'JWT key not provided';
    }
    const token = jwt.sign(organizer, process.env.JWT_KEY);
    return res.json({ token });
  }

  @validation(Joi.object({}))
  public static async getOrganizer(req: OrganizerRequest, res: Response): Promise<Response<{ organizer: IOrganizer }>> {
    const organizer = await Organizer.findOne({ where: { id: req.organizer.id }, raw: true });
    if (!organizer) {
      res.status(httpStatus.NOT_FOUND);
      return res.json({ message: 'Organizer does not exist' });
    }
    return res.json({ organizer: _.omit(organizer, ['createdAt', 'updatedAt', 'deletedAt','password']) });
  }

} 
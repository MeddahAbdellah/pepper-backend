import { Request, Response } from 'express';
import Joi from 'joi';
import { validation } from 'helpers/helpers';
import { Organizer, Party } from 'orms';
import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';
import { IOrganizer, IParty, OrganizerStatus } from 'models/types';
import 'dotenv/config';
import _ from 'lodash';
import { OrganizerService } from 'services/organizer/organizer.service';

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
      password: req.body.password,
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
      attributes: { exclude: ['password','createdAt','updatedAt','deletedAt'] },
      raw: true,
    });
    
    if (organizer === null) {
      res.status(httpStatus.NOT_FOUND);
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
    const organizer = await Organizer.findOne({ where: { userName: req.body.userName, password: req.body.password }, raw: true});
    if (!organizer) {
      res.status(httpStatus.NOT_FOUND);
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


  @validation(Joi.object({
    title: Joi.string().optional(),
    location: Joi.string().optional(),
    description: Joi.string().optional(),
    imgs: Joi.array().items({ uri: Joi.string() }).optional(),
    foods: Joi.array().items({ name: Joi.string(), price: Joi.number() }).optional(),
    drinks: Joi.array().items({ name: Joi.string(), price: Joi.number() }).optional()
  }))
  public static async updateOrganizer(req: OrganizerRequest, res: Response): Promise<Response<{ organizer: IOrganizer }>> {
    await Organizer.update({ ...req.body }, { where:  { id: req.organizer.id }});
    const organizer = await Organizer.findOne({ where: { id: req.organizer.id }, raw: true });
    return res.json({ organizer: _.omit(organizer, ['createdAt', 'updatedAt', 'deletedAt','password']) });
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
    const normalizedParties = await OrganizerService.getOrganizerParties(organizer)
    return res.json({ parties: normalizedParties });
  }

  @validation(Joi.object({}))
  public static async getOrganizerParties(req: OrganizerRequest, res: Response): Promise<Response<{ parties: IParty[] }>> {
    const organizer = await Organizer.findOne({ where: { id: req.organizer.id }});

    if (!organizer) {
      res.status(httpStatus.NOT_FOUND);
      return res.json({ message: 'User does not exist' });
    }

    const normalizedParties = await OrganizerService.getOrganizerParties(organizer)
    return res.json({ parties: normalizedParties });
  }

  @validation(Joi.object({
    partyId: Joi.number().required(),
  }))
  public static async deleteParty(req: OrganizerRequest, res: Response): Promise<Response<{ parties: IParty[] }>> {
    const organizer = await Organizer.findOne({ where: { id: req.organizer.id }});


    const party = await Party.findByPk(req.body.partyId);
    
    const partyOrganizer = await party?.getOrganizer();

    if ((partyOrganizer != undefined) && (party != null) && (partyOrganizer.id == req.organizer.id)){
      await party.destroy();
    }

    if (!organizer) {
      res.status(httpStatus.NOT_FOUND);
      return res.json({ message: 'User does not exist' });
    }
    const normalizedParties = await OrganizerService.getOrganizerParties(organizer)
    return res.json({ parties: normalizedParties });
  }

} 
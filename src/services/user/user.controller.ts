import { Request, Response } from 'express';
import Joi from 'joi';
import { validation } from 'helpers/helpers';
import { User, Party, UserParty, Organizer } from 'orms';
import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';
import { IUser, Gender, IParty, UserPartyStatus } from 'models/types';
import _ from 'lodash';
import { UserService } from 'services/user/user.service';
import 'dotenv/config';
import AuthHelper from 'helpers/auth';
import { Op } from 'sequelize';
import moment from 'moment';

interface UserRequest extends Request {
  user: User
};

export class UserController {
  @validation(Joi.object({
    phoneNumber: Joi.string().required(),
  }))
  public static async createLoginVerificationAndCheckIfUserExisits(req: Request, res: Response): Promise<Response<{ userExists: boolean }>> {
    const user = await User.findOne({ where: { phoneNumber: req.query.phoneNumber }, raw: true});
    // FIX: fix type
    await AuthHelper.createVerification(req.query.phoneNumber as string);
    return res.json({ userExists: !!user });
  }

  @validation(Joi.object({
    phoneNumber: Joi.string().required(),
    code: Joi.string().required(),
    name: Joi.string().required(),
    gender: Joi.string().valid(...Object.values(Gender)).required(),
    address: Joi.string().optional(),
    description: Joi.string().optional(),
    job: Joi.string().optional(),
    imgs: Joi.array().items({ uri: Joi.string() }),
    interests: Joi.array().items(Joi.string()).optional(),
    facebook: Joi.string().optional(),
    instagram: Joi.string().optional(),
    snapchat: Joi.string().optional(),
  }))
  public static async subscribe(req: Request, res: Response): Promise<Response<{ token: string }>> {
    const isVerified = await AuthHelper.checkVerification(req.body.phoneNumber, req.body.code);

    if (!isVerified) {
      res.status(httpStatus.UNAUTHORIZED);
      return res.json({ message: 'Verification code not valid' });
    }

    await User.create({
      name: req.body.name,
      gender: req.body.gender,
      phoneNumber: req.body.phoneNumber,
      address: req.body.address,
      description: req.body.description,
      job: req.body.job,
      imgs: req.body.imgs,
      interests: req.body.interests,
      facebook: req.body.facebook,
      instagram: req.body.instagram,
      snapchat: req.body.snapchat,
    });

    const user = await User.findOne({ where: { phoneNumber: req.body.phoneNumber }, raw: true});
    
    if (!user) {
      res.status(httpStatus.INTERNAL_SERVER_ERROR);
      return res.json({ message: 'User could not be created!' });
    }

    if (!process.env.JWT_KEY) {
      throw 'JWT key not provided';
    }

    const token = jwt.sign(user, process.env.JWT_KEY);
    return res.json({ token });
  }

  @validation(Joi.object({
    phoneNumber: Joi.string().required(),
    code: Joi.string().required(),
  }))
  public static async login(req: Request, res: Response): Promise<Response<{ token: string }>> {
    const user = await User.findOne({ where: { phoneNumber: req.body.phoneNumber }, raw: true});
    if (!user) {
      res.status(httpStatus.UNAUTHORIZED);
      return res.json({ message: 'User does not exist' });
    }


    const isVerified = await AuthHelper.checkVerification(req.body.phoneNumber, req.body.code);

    if (!isVerified) {
      res.status(httpStatus.UNAUTHORIZED);
      return res.json({ message: 'Verification code not valid' });
    }

    if (!process.env.JWT_KEY) {
      throw 'JWT key not provided';
    }
    const token = jwt.sign(user, process.env.JWT_KEY);
    return res.json({ token });
  }

  @validation(Joi.object({}))
  public static async getUser(req: UserRequest, res: Response): Promise<Response<{ user: IUser }>> {
    const user = await User.findOne({ where: { id: req.user.id }, raw: true });
    if (!user) {
      res.status(httpStatus.NOT_FOUND);
      return res.json({ message: 'User does not exist' });
    }
    return res.json({ user: _.omit(user, ['createdAt', 'updatedAt', 'deletedAt']) });
  }

  @validation(Joi.object({
    address: Joi.string().optional(),
    description: Joi.string().optional(),
    job: Joi.string().optional(),
    imgs: Joi.array().items({ uri: Joi.string() }).optional(),
    interests: Joi.array().items(Joi.string()).optional(),
    facebook: Joi.string().optional(),
    instagram: Joi.string().optional(),
    snapchat: Joi.string().optional(),
  }))
  public static async updateUser(req: UserRequest, res: Response): Promise<Response<{ user: IUser }>> {
    await User.update({ ...req.body }, { where:  { id: req.user.id }});
    const user = await User.findOne({ where: { id: req.user.id }, raw: true });
    return res.json({ user: _.omit(user, ['createdAt', 'updatedAt', 'deletedAt']) });
  }

  @validation(Joi.object({}))
  public static async getMatches(req: UserRequest, res: Response): Promise<Response<{ matches: User[] }>> {
    const user = await User.findOne({ where: { id: req.user.id }});

    if (!user) {
      res.status(httpStatus.NOT_FOUND);
      return res.json({ message: 'User does not exist' });
    }

    const normalizedMatches = await UserService.getUserMatches(user);
    return res.json({ matches: normalizedMatches });
  }

  // TODO: test adding match removing it and add it again
  @validation(Joi.object({
    matchId: Joi.number().required(),
  }))
  public static async addMatch(req: UserRequest, res: Response): Promise<Response<{ matches: User[] }>> {
    const match = await User.findOne({ where: { id: req.body.matchId } });
    const user = await User.findOne({ where: { id: req.user.id }});
    if (!match || !user) {
      res.status(httpStatus.NOT_FOUND);
      return res.json({ message: 'Match or User does not exist' });
    }
    await user.addMatch(match);
    await UserService.updateUserMatchStatus(user, match);
    const normalizedMatches = await UserService.getUserMatches(user);
    return res.json({ matches: normalizedMatches });
  }

  // TODO: Test this route
  @validation(Joi.object({
    matchId: Joi.number().required(),
  }))
  public static async deleteMatch(req: UserRequest, res: Response): Promise<Response<{ matches: User[] }>> {
    const user = await User.findOne({ where: { id: req.user.id } });
    const match = await User.findOne({ where: { id: req.body.matchId } });

    if (!user || !match) {
      res.status(httpStatus.NOT_FOUND);
      return res.json({ message: 'User or Match does not exist' });
    }

    user.removeMatch(match);
    match.removeMatch(user);

    const normalizedMatches = await UserService.getUserMatches(user);
    return res.json({ matches: normalizedMatches });
  }

  @validation(Joi.object({}))
  public static async getParties(req: UserRequest, res: Response): Promise<Response<{ parties: IParty[] }>> {
    const user = await User.findOne({ where: { id: req.user.id }});

    if (!user) {
      res.status(httpStatus.NOT_FOUND);
      return res.json({ message: 'User does not exist' });
    }
    const normalizedParties = await UserService.getUserParties(user);
    return res.json({ parties: normalizedParties });
  }

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
    partyId: Joi.number().required(),
  }))
  public static async addParty(req: UserRequest, res: Response): Promise<Response<{ parties: IParty[] }>> {
    const party = await Party.findOne({ where: { id: req.body.partyId } });
    const user = await User.findOne({ where: { id: req.user.id }});

    if (!party || !user) {
      res.status(httpStatus.NOT_FOUND);
      return res.json({ message: 'Party or User does not exist' });
    }
    await UserService.addParty(user, party);
    const normalizedParties = await UserService.getUserParties(user);
    return res.json({ parties: normalizedParties });
  }

  @validation(Joi.object({
    organizerId: Joi.number().required(),
  }))
  public static async attendParty(req: UserRequest, res: Response): Promise<Response<{ parties: IParty[] }>> {
    const organizer = await Organizer.findOne({ where: { id: req.body.organizerId } });
    console.log('attendParty organizer', organizer);

    // get today's party
    const organizerParties = await organizer?.getParties({ where:
      {
        // is today
        date: {
          [Op.gte]: moment().startOf('day').toDate(),
          [Op.lte]: moment().endOf('day').toDate(),
        },
      },
    });

    if (!organizerParties) {
      res.status(httpStatus.NOT_FOUND);
      return res.json({ message: 'Party does not exist' });
    }
    const user = await User.findOne({ where: { id: req.user.id }});
    const party = organizerParties[0];
    if (!party || !user) {
      res.status(httpStatus.NOT_FOUND);
      return res.json({ message: 'Party or User does not exist' });
    }

    const hasUserBeenAcceptedToAttend = await UserParty.findOne(
      { where: { 
        [Op.and]: [
          { UserId: user.id },
          { PartyId: party.id },
          { status: UserPartyStatus.ACCEPTED },
        ],
        },
      },
    );
    if (!hasUserBeenAcceptedToAttend) {
      res.status(httpStatus.UNAUTHORIZED);
      return res.json({ message: 'User has not been accepted to attend the party' });
    }
    // TODO: test this logic
    await UserParty.update(
      { status: UserPartyStatus.ATTENDED },
      { where: { 
        [Op.and]: [
          { UserId: user.id },
          { PartyId: party.id },
        ],
        },
      },
    );
    const normalizedParties = await UserService.getUserParties(user);
    return res.json({ parties: normalizedParties });
  }

  @validation(Joi.object({
    partyId: Joi.number().required(),
  }))
  public static async cancelParty(req: UserRequest, res: Response): Promise<Response<{ parties: IParty[] }>> {
    const party = await Party.findOne({ where: { id: req.body.partyId } });
    const user = await User.findOne({ where: { id: req.user.id }});

    if (!party || !user) {
      res.status(httpStatus.NOT_FOUND);
      return res.json({ message: 'Party or User does not exist' });
    }

    await user.removeParty(party);
    const normalizedParties = await UserService.getUserParties(user);
    return res.json({ parties: normalizedParties });
  }
}
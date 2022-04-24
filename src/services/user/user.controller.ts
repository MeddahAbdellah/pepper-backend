import { Request, Response } from 'express';
import Joi from 'joi';
import { validation } from 'helpers/helpers';
import { User, Party, UserParty } from 'orms';
import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';
import { IUser, MatchStatus, Gender, IParty, UserPartyStatus } from 'models/types';
import _ from 'lodash';
import { UserService } from 'services/user/user.service';
import 'dotenv/config';
import AuthHelper from 'helpers/auth';
import { Op } from 'sequelize';

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
    address: Joi.string().required(),
    description: Joi.string().required(),
    job: Joi.string().required(),
    imgs: Joi.array().items({ uri: Joi.string() }),
    interests: Joi.array().items(Joi.string()),
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
    await match.addMatch(user);
    const normalizedMatches = await UserService.getUserMatches(user);
    return res.json({ matches: normalizedMatches });
  }

  @validation(Joi.object({
    matchId: Joi.number().required(),
    status: Joi.string().valid(...Object.values(MatchStatus)).invalid(MatchStatus.ACCEPTED).invalid(MatchStatus.UNCHECKED).required(),
  }))
  public static async updateMatch(req: UserRequest, res: Response): Promise<Response<{ matches: User[] }>> {
    const user = await User.findOne({ where: { id: req.user.id } });
    const match = await User.findOne({ where: { id: req.body.matchId } });

    
    if (!user || !match) {
      res.status(httpStatus.NOT_FOUND);
      return res.json({ message: 'User or Match does not exist' });
    }
    
    if (user.id === match.id) {
      res.status(httpStatus.BAD_REQUEST);
      return res.json({ message: 'User cant match with himself' });
    }

    try{
      await UserService.updateUserMatchStatus(user, match, req.body.status);
    } catch(message){
      res.status(httpStatus.NOT_FOUND);
      return res.json({ message });
    }

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
    partyId: Joi.number().required(),
  }))
  public static async attendParty(req: UserRequest, res: Response): Promise<Response<{ parties: IParty[] }>> {
    const party = await Party.findOne({ where: { id: req.body.partyId } });
    const user = await User.findOne({ where: { id: req.user.id }});

    if (!party || !user) {
      res.status(httpStatus.NOT_FOUND);
      return res.json({ message: 'Party or User does not exist' });
    }
    console.log('HERE', party.id);
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
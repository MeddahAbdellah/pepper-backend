import { Request, Response } from 'express';
import Joi from 'joi';
import { validation } from 'helpers/helpers';
import { User, Party, UserMatch } from 'orms';
import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';
import { IUser, MatchStatus } from 'models/types';
import _ from 'lodash';
import { UserService } from 'services/user/user.service';
import { Op } from 'sequelize/dist';

interface UserRequest extends Request {
  user: User
};

export class UserController {
  @validation(Joi.object({
    phoneNumber: Joi.string().required(),
  }))
  public static async login(req: Request, res: Response): Promise<Response<{ token: string }>> {
    const user = await User.findOne({ where: { phoneNumber: req.body.phoneNumber }, raw: true});
    if (!user) {
      res.sendStatus(httpStatus.UNAUTHORIZED);
      return res.json({ message: 'User does not exist' });
    }
    const token = jwt.sign(user, 'testKey');
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
    status: Joi.string().valid(...Object.values(MatchStatus)).invalid(MatchStatus.ACCEPTED).required(),
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

  @validation(Joi.object({
    matchId: Joi.number().required(),
  }))
  public static async deleteMatch(req: UserRequest, res: Response): Promise<Response<{ matches: User[] }>> {
    const user = await User.findOne({ where: { id: req.user.id } });

    if (!user) {
      res.status(httpStatus.NOT_FOUND);
      return res.json({ message: 'User does not exist' });
    }

    await UserMatch.update({ status: MatchStatus.ACCEPTED }, { where: { [Op.and]: [{ UserId: req.user.id }, { MatchId: req.body.matchId }] } });

    const normalizedMatches = await UserService.getUserMatches(user);
    return res.json({ matches: normalizedMatches });
  }

  @validation(Joi.object({}))
  public static async getParties(req: UserRequest, res: Response): Promise<Response<{ parties: Party[] }>> {
    const user = await User.findOne({ where: { id: req.user.id }});

    if (!user) {
      res.status(httpStatus.NOT_FOUND);
      return res.json({ message: 'User does not exist' });
    }
    const normalizedParties = await UserService.getUserParties(user);
    return res.json({ parties: normalizedParties });
  }

  @validation(Joi.object({
    partyId: Joi.number().required(),
  }))
  public static async addParty(req: UserRequest, res: Response): Promise<Response<{ parties: Party[] }>> {
    const party = await Party.findOne({ where: { id: req.body.partyId } });
    const user = await User.findOne({ where: { id: req.user.id }});

    if (!party || !user) {
      res.status(httpStatus.NOT_FOUND);
      return res.json({ message: 'Party or User does not exist' });
    }
    await user.addParty(party);
    const normalizedParties = await UserService.getUserParties(user);
    return res.json({ parties: normalizedParties });
  }

  @validation(Joi.object({
    partyId: Joi.number().required(),
  }))
  public static async cancelParty(req: UserRequest, res: Response): Promise<Response<{ parties: Party[] }>> {
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
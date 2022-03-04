import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import 'dotenv/config';
import { IOrganizer, IUser } from 'models/types';

const authorizeForUser = async (req: any, res: any, next: any) => {
  let user;
  try {
    if (!process.env.JWT_KEY) {
      throw 'JWT key not provided';
    }

    user = jwt.verify(req.headers.authorization, process.env.JWT_KEY) as IUser;

    if (!user?.id) {
      throw 'Does not contain user';
    }
    req.user = user;
    next();
  } catch (e) {
    res.status(httpStatus.UNAUTHORIZED);
    res.json({
      message: `Invalid token: ${e}`,
    });
  }
}

const authorizeForOrganize = async (req: any, res: any, next: any) => {
  let organizer;
  try {
    if (!process.env.JWT_KEY) {
      throw 'JWT key not provided';
    }

    organizer = jwt.verify(req.headers.authorization, process.env.JWT_KEY) as IOrganizer;

    if (!organizer?.id) {
      throw 'Does not contain organizer';
    }
    req.organizer = organizer;
    next();
  } catch (e) {
    res.status(httpStatus.UNAUTHORIZED);
    res.json({
      message: `Invalid token: ${e}`,
    });
  }
}

export { authorizeForUser, authorizeForOrganize };

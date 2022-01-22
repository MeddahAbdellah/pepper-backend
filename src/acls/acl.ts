import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import { User } from 'orms';

const authorizeForUser = async (req: any, res: any, next: any) => {
  let user;
  try {
    user = jwt.verify(req.headers.authorization, 'testKey') as User;
    if (!user?.id) {
      throw 'Does not contain user';
    }
  } catch (e) {
    res.status(httpStatus.UNAUTHORIZED);
    res.json({
      message: `Invalid token: ${e}`,
    });
  }

  req.user = user;
  next();
}

export { authorizeForUser };

import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { parseFiles, uploadToS3 } from 'helpers/helpers';

export class ProxyController {
  public static async uploadImageToS3(req: Request, res: Response): Promise<Response<{ uri: string }>> {
    try {
      const body = await parseFiles(req);
      const blob = Buffer.from(body.img,"base64");;
      const uri = await uploadToS3(blob);
      return res.json({ uri });
    } catch (err) {
      res.status(err.httpCode || httpStatus.BAD_REQUEST);
      return res.json({ message: `Invalid token: ${err}` });
    }
  }
}
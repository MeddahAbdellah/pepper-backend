import { Request, Response } from 'express';
import { parseFiles, uploadToS3, validation } from 'helpers/helpers';
import Joi from 'joi';

export class ProxyController {
  @validation(Joi.object({}))
  public static async uploadImageToS3(req: Request, res: Response): Promise<Response<{ uri: string }>> {
      const body = await parseFiles(req);
      const blob = Buffer.from(body.img, 'base64');
      const uri = await uploadToS3(blob);
      return res.json({ uri });
  }
}
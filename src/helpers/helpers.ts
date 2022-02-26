import 'dotenv/config';
import { RequestHandler, Request } from 'express';
import Joi from 'joi';
import httpStatus from 'http-status';
import _ from 'lodash';
import formidable from 'formidable';
import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

export function validation(schema: Joi.Schema) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return (target: any, property: any) => {
    // eslint-disable-next-line no-param-reassign
    target[property].schema = schema;
  };
}

function getValidationHandler(schema: Joi.Schema): RequestHandler {
  return (req: any, res: any, next: any) => {
    const isValid = schema.validate(_.isEmpty(req.body) ? req.query : req.body);
    if (isValid.error) {
      console.log('Error at Validation', isValid.error.details[0].message);
      res.status(httpStatus.BAD_REQUEST);
      res.json({
        message: isValid.error.details[0].message,
      });
      return;
    }
    next();
  }
}

export function checkParametersAndCallRoute(method: any): RequestHandler[] {
  const validation = method.schema ? getValidationHandler(method.schema): (_req: any, _res: any, next: any) => next();

  const methodCall = (req: any, res: any, next: any): void => {
    Promise.resolve(method.call(null, req, res, next)).catch((e) => next(e));
  };

  return [validation, methodCall];
}

export function parseFiles(req: Request): Promise<any> {
  return new Promise((resolve) => {
    const form = formidable({ multiples: true });
    form.parse(req, (err: any, fields: any, _files: any) => {
      if (err) {
        throw err;
      }
      resolve(fields);
    });
  });
}

export function uploadToS3(file: any): Promise<any> {
  return new Promise((resolve) => {
    const s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    });
    if (!process.env.AWS_BUCKET) {
      throw 'Bucket not specified';
    }
    const params = {
      Bucket: process.env.AWS_BUCKET,
      Key: uuidv4(),
      ContentType: 'image/jpeg',
      Body: file,
    };
    s3.upload(params, (s3Err: any, data: any) => {
      if (s3Err) throw s3Err;
      console.log('File uploaded successfully at', data);
      resolve(data.Location)
    });
  });
}

import { RequestHandler } from 'express';
import Joi from 'joi';
import httpStatus from 'http-status';
import _ from 'lodash';

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

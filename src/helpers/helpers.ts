import { RequestHandler } from 'express';

export function validation(conf: any) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return (target: any, property: any) => {
      // eslint-disable-next-line no-param-reassign
      target[property].validation = conf;
    };
  }

// Legacy Decorator
export function routeTo(method: any): RequestHandler[] {
  const middlewares = getRouteToMiddlewares(method);

  middlewares.push((req: any, res: any, next: any): void => {
    Promise.resolve(method.call(null, req, res, next)).catch((e) => next(e));
  });

  return middlewares;
}

function getRouteToMiddlewares(method: any): RequestHandler[] {
  console.log('Method', method);

  return [];
}

import express, { Router } from 'express';
import { checkParametersAndCallRoute } from 'helpers/helpers';
import { ProxyController } from './proxy.controller';

class ProxyRoutes {
  public _router: Router = express.Router();

  public build() {
    this._assignRoute();
    return this._router;
  }

  private _assignRoute() {
    // TODO: Add ACL also for S3
    this._router.route('/s3').post(checkParametersAndCallRoute(ProxyController.uploadImageToS3));
  }
}

export default new ProxyRoutes().build();

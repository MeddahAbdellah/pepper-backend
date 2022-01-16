import express, { Router } from 'express';
import { UserController } from 'services/user/user.controller';
import { checkParametersAndCallRoute } from 'helpers/helpers';

class UserRoutes {
  public _router: Router = express.Router();

  public build() {
    this._assignRoute();
    return this._router;
  }

  private _assignRoute() {
    this._router.route('/login').post(checkParametersAndCallRoute(UserController.login));
  }
}

export default new UserRoutes().build();

import express, { Router } from 'express';
import { UserController } from 'services/user/user.controller';
import { checkParametersAndCallRoute } from 'helpers/helpers';
import { authorizeForUser } from 'acls/acl';

class UserRoutes {
  public _router: Router = express.Router();

  public build() {
    this._assignRoute();
    return this._router;
  }

  private _assignRoute() {
    this._router.route('/').get(authorizeForUser,checkParametersAndCallRoute(UserController.getUser));
    this._router.route('/').put(authorizeForUser,checkParametersAndCallRoute(UserController.updateUser));
    this._router.route('/login').get(checkParametersAndCallRoute(UserController.createLoginVerificationAndCheckIfUserExisits));
    this._router.route('/login').put(checkParametersAndCallRoute(UserController.subscribe));
    this._router.route('/login').post(checkParametersAndCallRoute(UserController.login));
    this._router.route('/matches').get(authorizeForUser,checkParametersAndCallRoute(UserController.getMatches));
    this._router.route('/matches').post(authorizeForUser,checkParametersAndCallRoute(UserController.addMatch));
    this._router.route('/matches').delete(authorizeForUser,checkParametersAndCallRoute(UserController.deleteMatch));
    this._router.route('/parties').get(authorizeForUser,checkParametersAndCallRoute(UserController.getParties));
    this._router.route('/parties').post(authorizeForUser,checkParametersAndCallRoute(UserController.addParty));
    this._router.route('/parties').put(authorizeForUser,checkParametersAndCallRoute(UserController.attendParty));
    this._router.route('/parties').delete(authorizeForUser,checkParametersAndCallRoute(UserController.cancelParty));
  }
}

export default new UserRoutes().build();

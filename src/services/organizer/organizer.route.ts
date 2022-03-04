import express, { Router } from 'express';
import { OrganizerController } from 'services/organizer/organizer.controller';
import { checkParametersAndCallRoute } from 'helpers/helpers';
import { authorizeForOrganize } from 'acls/acl';

class OrganizerRoutes {
  public _router: Router = express.Router();

  public build() {
    this._assignRoute();
    return this._router;
  }

  private _assignRoute() {
    this._router.route('/').get(authorizeForOrganize,checkParametersAndCallRoute(OrganizerController.getOrganizer));
    this._router.route('/login').put(checkParametersAndCallRoute(OrganizerController.subscribe));
    this._router.route('/login').post(checkParametersAndCallRoute(OrganizerController.login));
  }
}

export default new OrganizerRoutes().build();

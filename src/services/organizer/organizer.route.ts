import express, { Router } from 'express';
import { OrganizerController } from './organizer.controller';
import { routeTo } from 'helpers/helpers';

class OrganizerRoutes {
  public _router: Router = express.Router();

  build() {
    this._assignAmtRoute();
    return this._router;
  }

  _assignAmtRoute() {
    this._router.route('/').get(routeTo(OrganizerController.login));
  }
}

export default new OrganizerRoutes().build();

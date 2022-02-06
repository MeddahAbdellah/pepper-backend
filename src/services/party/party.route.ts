import express, { Router } from 'express';
import { PartyController } from 'services/party/party.controller';
import { checkParametersAndCallRoute } from 'helpers/helpers';
import { authorizeForUser } from 'acls/acl';

class PartyRoutes {
  public _router: Router = express.Router();

  public build() {
    this._assignRoute();
    return this._router;
  }

  private _assignRoute() {
    this._router.route('/').get(authorizeForUser,checkParametersAndCallRoute(PartyController.getPartiesThatUserCanGoTo));
  }
}

export default new PartyRoutes().build();

import express, { Router } from 'express';
import { PartyController } from 'services/party/party.controller';
import { checkParametersAndCallRoute } from 'helpers/helpers';
import { authorizeForOrganize, authorizeForUser } from 'acls/acl';

class PartyRoutes {
  public _router: Router = express.Router();

  public build() {
    this._assignRoute();
    return this._router;
  }

  private _assignRoute() {
    this._router.route('/').get(authorizeForUser,checkParametersAndCallRoute(PartyController.getPartiesThatUserCanGoTo));
    this._router.route('/create').post(authorizeForOrganize,checkParametersAndCallRoute(PartyController.createNewparty));
    this._router.route('/organizer').get(authorizeForOrganize,checkParametersAndCallRoute(PartyController.getOrganizerParties));
  }
}

export default new PartyRoutes().build();

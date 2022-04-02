import express, { Router } from 'express';
import { AdminController } from 'services/admin/admin.controller';
import { checkParametersAndCallRoute } from 'helpers/helpers';

class AdminRoutes {
  public _router: Router = express.Router();

  public build() {
    this._assignRoute();
    return this._router;
  }

  private _assignRoute() {
    this._router.route('/organizer').put(checkParametersAndCallRoute(AdminController.updateStatus));
  }
}

export default new AdminRoutes().build();

import express from 'express';
import organizerRoutes from 'services/organizer/organizer.route';
import userRoutes from 'services/user/user.route';
import partyRoutes from 'services/party/party.route';

const routes = express.Router(); // eslint-disable-line new-cap
routes.use('/organizer', organizerRoutes);
routes.use('/user', userRoutes);
routes.use('/party', partyRoutes);

export default routes;
import express from 'express';
import organizerRoutes from 'services/organizer/organizer.route';
import userRoutes from 'services/user/user.route';
import partyRoutes from 'services/party/party.route';
import proxyRoutes from 'services/proxy/proxy.route';

const routes = express.Router(); // eslint-disable-line new-cap
routes.use('/organizer', organizerRoutes);
routes.use('/user', userRoutes);
routes.use('/party', partyRoutes);
routes.use('/proxy', proxyRoutes);

export default routes;
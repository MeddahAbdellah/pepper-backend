import express from 'express';
import organizerRoutes from 'services/organizer/organizer.route';
import userRoutes from 'services/user/user.route';

const routes = express.Router(); // eslint-disable-line new-cap
routes.use('/organizer', organizerRoutes);
routes.use('/user', userRoutes);

export default routes;
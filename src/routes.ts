import express from 'express';
import organizerRoutes from 'services/organizer/organizer.route';

const routes = express.Router(); // eslint-disable-line new-cap
routes.use('/organizer', organizerRoutes);
//router.use('/user', userRoutes);

export default routes;
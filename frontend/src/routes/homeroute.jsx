import { createRoute,redirect } from '@tanstack/react-router';
import { appLayoutRoute } from './Applayout';
import HomePage from '../Pages/Home';
import { authenticateUser } from '../middlewares/Auth';

export const homeRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: '/',
   beforeLoad: async () => {
        const authuser = await authenticateUser();

        if (!authuser) {
            throw redirect({ to: "/login" });
        }
    },
  component: HomePage,
});
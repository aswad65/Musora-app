import { createRoute,redirect } from '@tanstack/react-router';
import { appLayoutRoute } from './Applayout';
import HomePage from '../Pages/Home';
import { authenticateUser } from '../middlewares/Auth';

export const homeRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: '/',
   beforeLoad: async () => {
        try {
            const authuser = await authenticateUser();

            if (!authuser) {
                throw redirect({ to: "/login" });
            }
        } catch (err) {
            if (err?.to) throw err;
            console.warn("Auth check failed on home route, redirecting to login:", err?.message);
            throw redirect({ to: "/login" });
        }
    },
  component: HomePage,
});
import { redirect,Route } from '@tanstack/react-router'
import { rootRoute } from './root'
import {Register} from '../Pages/Register'
import { authenticateUser } from '../middlewares/Auth'

export const RegisterRoute = new Route({
    getParentRoute: () => rootRoute,
    path: "/register",
    beforeLoad: async () => {
        try {
            const authuser = await authenticateUser();
            if (authuser) {
                throw redirect({to:'/'});
            }
        } catch (err) {
            if (err?.to) throw err;
            console.warn("Auth check failed on register route, treating as unauthenticated:", err?.message);
        }
    },
    component: Register,
})

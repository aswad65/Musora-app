import { redirect,Route } from '@tanstack/react-router'
import { rootRoute } from './root'
import {Login} from '../Pages/Login'
import { authenticateUser } from '../middlewares/Auth'


export const LoginRoute = new Route({
    getParentRoute: () => rootRoute,
    path: "/login",
    beforeLoad: async () => {
        try {
            const authuser = await authenticateUser();
            if (authuser) {
                throw redirect({to:'/'});
            }
        } catch (err) {
            if (err?.to) throw err;
            console.warn("Auth check failed on login route, treating as unauthenticated:", err?.message);
        }
    },
    component: Login

})

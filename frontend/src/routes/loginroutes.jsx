import { redirect,Route } from '@tanstack/react-router'
import { rootRoute } from './root'
import {Login} from '../Pages/Login'
import { authenticateUser } from '../middlewares/Auth'


export const LoginRoute = new Route({
    getParentRoute: () => rootRoute,
    path: "/login",
    beforeLoad: async () => {
        const authuser = await authenticateUser();
        if (authuser) {
            throw redirect({to:'/'});
        }
    },
    component: Login

})

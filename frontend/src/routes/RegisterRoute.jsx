import { redirect,Route } from '@tanstack/react-router'
import { rootRoute } from './root'
import {Register} from '../Pages/Register'
import { authenticateUser } from '../middlewares/Auth'

export const RegisterRoute = new Route({
    getParentRoute: () => rootRoute,
    path: "/register",
    beforeLoad: async () => {
        const authuser = await authenticateUser();
        if (authuser) {
            throw redirect({to:'/'});
        }
    },
    component: Register,
})

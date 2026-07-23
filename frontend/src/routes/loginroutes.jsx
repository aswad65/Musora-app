import { createRoute } from '@tanstack/react-router'
import { rootRoute } from './root'
import {Login} from '../Pages/Login'

export const LoginRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/login",
    component: Login
})

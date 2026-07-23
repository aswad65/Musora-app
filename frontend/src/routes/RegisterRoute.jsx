import { createRoute } from '@tanstack/react-router'
import { rootRoute } from './root'
import {Register} from '../Pages/Register'

export const RegisterRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/register",
    component: Register
})

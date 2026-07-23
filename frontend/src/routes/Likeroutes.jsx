import { createRoute } from '@tanstack/react-router'
import { libraryLayoutRoute } from './Libraryroute'
import LikedPage from '../Pages/Liked'

export const Likeroutes = createRoute({
    getParentRoute: () => libraryLayoutRoute,
    path: "liked", // '/library/liked'
    component: LikedPage
})

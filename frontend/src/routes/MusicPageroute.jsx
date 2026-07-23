import MusicPlayerPage from "../Pages/MusicPage";
import { createRoute } from '@tanstack/react-router'
import { appLayoutRoute } from './Applayout'

export const MusicPageRoute = createRoute({
    getParentRoute: () => appLayoutRoute,
    path: "/musicpage",
    component: MusicPlayerPage
})

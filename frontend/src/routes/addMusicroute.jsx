import { createRoute } from '@tanstack/react-router'
import { appLayoutRoute } from './Applayout'
import CreateMusic from '../Pages/AddMusic'

export const CreateMusicRoute = createRoute({
    getParentRoute: () => appLayoutRoute,
    path: "/Create",
    component: CreateMusic
})

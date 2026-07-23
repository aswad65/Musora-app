
import { createRoute } from '@tanstack/react-router'
import { appLayoutRoute } from './Applayout'
import CreateKaraoke from '../Pages/CreateKaraoke'


export const CreateKaraokeRoute = createRoute({
    getParentRoute: () => appLayoutRoute,
    path: "/create-karaoke",
      component: CreateKaraoke,
})

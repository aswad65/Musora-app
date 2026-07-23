import { createRoute } from '@tanstack/react-router'

import AlbumCreationPage from '../Pages/CreateAlbum'
import { appLayoutRoute } from './Applayout'

export const createAlbumRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: '/CreateAlbum',
  component: AlbumCreationPage,
})

import PlaylistPage from '../Pages/Playlist'
import { createRoute } from '@tanstack/react-router'
import { libraryLayoutRoute } from './Libraryroute'

export const playlistRoute = createRoute({
  getParentRoute: () => libraryLayoutRoute,
  path: 'playlist',
  component: PlaylistPage,
})
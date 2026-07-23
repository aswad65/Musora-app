
import PlaylistMusicpage from '../Pages/PlaylistMusicpage'
import { createRoute } from '@tanstack/react-router'
import { libraryLayoutRoute } from './Libraryroute'

export const playlistMusicRoute = createRoute({
  getParentRoute: () => libraryLayoutRoute,
  path: 'playlistMusic',
  component: PlaylistMusicpage,
})
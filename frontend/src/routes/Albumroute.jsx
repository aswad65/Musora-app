import { createRoute } from '@tanstack/react-router';
import AlbumPage from '../Pages/Album';
import { appLayoutRoute } from './Applayout';

export const albumRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: '/album',
  component: AlbumPage,
});
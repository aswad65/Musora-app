import ProfilePage from '../Pages/Profile';
import { createRoute } from '@tanstack/react-router';
import { appLayoutRoute } from './Applayout';

export const ProfileRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: '/Profile',
  component: ProfilePage,
});

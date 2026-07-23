import { createRoute } from '@tanstack/react-router';
import { appLayoutRoute } from './Applayout';
import MyProfilePage from '../Pages/Myprofile';

export const MyProfileRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: '/myprofile',

  component: MyProfilePage,
});
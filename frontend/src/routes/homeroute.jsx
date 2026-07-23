import { createRoute } from '@tanstack/react-router';
import { appLayoutRoute } from './Applayout';
import HomePage from '../Pages/Home';

export const homeRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: '/',

  component: HomePage,
});
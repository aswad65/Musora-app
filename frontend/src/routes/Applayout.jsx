import { createRoute, Outlet } from '@tanstack/react-router';
import { rootRoute } from './root';
import AppLayout from '../Components/AppLayout';

export const appLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: '_app',

  component: () => (
    <AppLayout>
      <Outlet />
    </AppLayout>
  ),
});
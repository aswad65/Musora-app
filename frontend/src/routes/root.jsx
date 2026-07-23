import { createRootRoute, Outlet } from '@tanstack/react-router';

export const rootRoute = createRootRoute({
  component: () => <Outlet />,

  notFoundComponent: () => (
    <div className="h-screen flex items-center justify-center text-white">
      <h1 className="text-2xl font-bold">404 - Page Not Found</h1>
    </div>
  ),
});
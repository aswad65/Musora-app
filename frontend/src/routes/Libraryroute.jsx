import { createRoute } from '@tanstack/react-router'
import { appLayoutRoute } from './Applayout'
import { Outlet } from "@tanstack/react-router";
import Libraryheader from "../Components/LibraryHeader";

export const libraryLayoutRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: 'library',
  component: () => (
    <div>
      <Libraryheader />
      <Outlet />
    </div>
  ),
})

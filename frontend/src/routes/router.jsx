import { createRouter } from '@tanstack/react-router';
import { rootRoute } from './root';
import { appLayoutRoute } from './Applayout';
import { homeRoute } from './homeroute';
import { RegisterRoute } from './RegisterRoute';
import { LoginRoute } from './loginroutes';
import { libraryLayoutRoute } from './Libraryroute';
import { playlistRoute } from './Playlistroute';
import { Likeroutes } from './Likeroutes';
import { ProfileRoute } from './Profileroutes';
import { albumRoute } from './Albumroute';
import { playlistMusicRoute } from './PlaylistMusicroutes';
import { CreateMusicRoute } from './addMusicroute';
import { MyProfileRoute } from './MyProfileroutes';
import { MusicPageRoute } from './MusicPageroute';
import { createAlbumRoute } from './CreatealbumPageroute';
import { CreateKaraokeRoute } from './CreateKaraokeroute';



const routeTree = rootRoute.addChildren([LoginRoute, RegisterRoute, appLayoutRoute]);

appLayoutRoute.addChildren([
  homeRoute,
  libraryLayoutRoute,
  albumRoute,
  CreateMusicRoute,
  MyProfileRoute,
  createAlbumRoute,
  MusicPageRoute,
  CreateKaraokeRoute,
  ProfileRoute,
]);

libraryLayoutRoute.addChildren([playlistRoute, playlistMusicRoute, Likeroutes]);

const router = createRouter({ routeTree });

export default router;

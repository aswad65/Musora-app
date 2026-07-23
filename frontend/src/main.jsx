import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import router from './routes/router.jsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { UserProvider } from './Context/UserContext.jsx'
import {MusicProvider} from './Context/MusicContext.jsx'
import {PlayerProvider} from './Context/PlayerContext.jsx'
import { NotificationListener } from './Components/notifiction.jsx'
import { AIMusicProvider } from './Context/AI-Context.jsx'
const queryClient = new QueryClient()



createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}>
    <UserProvider>
      <MusicProvider>
        <AIMusicProvider>
        <PlayerProvider>
          <NotificationListener />
          <RouterProvider router={router} />
        </PlayerProvider>
        </AIMusicProvider>
      </MusicProvider>
    </UserProvider>
  </QueryClientProvider>
)

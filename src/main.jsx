import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { router } from './router/routes'
import { RouterProvider } from 'react-router/dom'
import { AuthProvider } from './contexts/AuthContext'
import { SocketProvider } from './contexts/SocketContext'
import { NotificationProvider } from './contexts/NotificationContext'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <SocketProvider>
        <NotificationProvider>
          <RouterProvider router={router} />
        </NotificationProvider>
      </SocketProvider>
    </AuthProvider>
  </StrictMode>,
)

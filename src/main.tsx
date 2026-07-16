import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'

import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { BookingProvider } from './contexts/BookingContext'
import { MessageProvider } from './contexts/MessageContext'
import { ForumProvider } from './contexts/ForumContext'
import { NotificationProvider } from './contexts/NotificationContext'
import { WalletProvider } from './contexts/WalletContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
      <NotificationProvider>
        <WalletProvider>
          <BookingProvider>
            <MessageProvider>
              <ForumProvider>
                <BrowserRouter>
                  <App />
                </BrowserRouter>
              </ForumProvider>
            </MessageProvider>
          </BookingProvider>
        </WalletProvider>
      </NotificationProvider>
    </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
)

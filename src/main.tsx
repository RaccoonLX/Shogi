import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { PlayerStyleProvider } from './contexts/PlayerStyleContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PlayerStyleProvider>
      <App />
    </PlayerStyleProvider>
  </StrictMode>,
)

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { PieceStyleProvider } from './contexts/PieceStyleContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PieceStyleProvider>
      <App />
    </PieceStyleProvider>
  </StrictMode>,
)

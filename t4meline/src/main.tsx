import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import Pioche from './components/pioche.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Pioche />
  </StrictMode>,
)

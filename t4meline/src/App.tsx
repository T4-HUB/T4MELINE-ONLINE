import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Accueil from './components/acceuil.tsx'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Accueil /> 
    </>
  )
}

export default App

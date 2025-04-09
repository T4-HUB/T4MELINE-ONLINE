import { useState } from 'react'
import './acceuil.css'

function acceuil() {
  const [inputValue, setInputValue] = useState('')
  const [items, setItems] = useState<string[]>([]) 
  const [showSettings, setShowSettings] = useState(false)
  const [numCards, setNumCards] = useState(10)
  const [maxPoints, setMaxPoints] = useState(5)

  const handleAddItem = () => {
    if (inputValue.trim() !== '') {
      setItems([...items, inputValue])
      setInputValue('')
    }
  }

  const handlePlay = () => {
    alert('Play button clicked!')
  }

  const handleSaveSettings = () => {
    setShowSettings(false)
    alert(`Partie configurée : ${numCards} cartes, ${maxPoints} points maximum.`)
  }

  return (
    <div className={`app-container ${showSettings ? 'sidebar-open' : ''}`}>
     <div className="top-bar">
        <button
          className="settings-button"
          onClick={() => setShowSettings(!showSettings)}
        >
          Configurer la page
        </button>
      </div>

      {/* Barre latérale pour les paramètres */}
      {showSettings && (
        <div className="sidebar">
          <h2>Paramètres de la partie</h2>
          <div className="slider-container">
            <label>
              Nombre de cartes :
              <input
                type="range"
                min="1"
                max={items.length > 0 ? items.length : 100}
                value={numCards}
                onChange={(e) => setNumCards(Number(e.target.value))}
              />
              <input
                type="number"
                value={numCards}
                onChange={(e) => setNumCards(Number(e.target.value))}
              />
            </label>
          </div>
          <div className="slider-container">
            <label>
              Points maximum :
              <input
                type="range"
                min="1"
                max="10"
                value={maxPoints}
                onChange={(e) => setMaxPoints(Number(e.target.value))}
              />
              <input
                type="number"
                value={maxPoints}
                onChange={(e) => setMaxPoints(Number(e.target.value))}
              />
            </label>
          </div>
          <div className="modal-buttons">
            <button onClick={handleSaveSettings}>Sauvegarder</button>
            <button onClick={() => setShowSettings(false)}>
              Annuler
            </button>
          </div>
        </div>
      )}

      <div className="main-content">
        <div className="input-section">
          <h1>T4meline</h1>
          <div className="input- boutton">
          <input
            type="text"
            placeholder="Enter your name"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)} 
          />
          <button className = "boutton_plus" onClick={handleAddItem}>+</button>
          </div>
          
        </div>

        <ul className="items-list">
          {items.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>
      <div className="bottom-bar">
      <div className="play-button">
          <button onClick={handlePlay}>Play</button>
          </div>
      </div>
    </div>
  )
}

export default acceuil

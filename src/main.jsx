import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles.css'
import 'leaflet/dist/leaflet.css'

ReactDOM.createRoot(document.getElementById('root')).render(<App />)

// Hide loading screen after React mounts
setTimeout(() => {
  const ls = document.getElementById('loading-screen')
  if (ls) { ls.classList.add('fade-out'); setTimeout(() => ls.remove(), 300) }
}, 100)

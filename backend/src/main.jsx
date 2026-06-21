import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Flush all previously seeded mock localStorage data on startup.
// db_* keys were written by the old mockDb.js seed functions and must not
// persist now that all services call live backend APIs exclusively.
const MOCK_DB_VERSION = '2';
if (localStorage.getItem('_mock_db_cleared') !== MOCK_DB_VERSION) {
  Object.keys(localStorage)
    .filter(k => k.startsWith('db_'))
    .forEach(k => localStorage.removeItem(k));
  localStorage.setItem('_mock_db_cleared', MOCK_DB_VERSION);
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

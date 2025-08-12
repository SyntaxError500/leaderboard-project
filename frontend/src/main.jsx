import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import ShopContextProvider from './context/ShopContext';
import './index.css'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ShopContextProvider>
      <App />
    </ShopContextProvider>
  </StrictMode>,
)

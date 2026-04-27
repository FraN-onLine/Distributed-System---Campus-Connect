import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Routes from '../Router/Routes.jsx'
import { BrowserRouter } from 'react-router-dom'
import './Css/theme.css'



createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter basename="/CCIS_CONNECT">
          <Routes/>
    </BrowserRouter>
  </StrictMode>
)

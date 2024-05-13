import React from 'react'
import ReactDOM from 'react-dom/client'
import { NextUIProvider } from '@nextui-org/react'
import App from './App.tsx'
import './index.css'
import { ThemeProvider } from 'next-themes'
import {GetTheme} from './components/App/handleFunctions.tsx'
import { BrowserRouter } from 'react-router-dom'
import AppProvider from './utils/AppContext.tsx'


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider  defaultTheme={GetTheme()}>
      <NextUIProvider>
        <BrowserRouter>
          <AppProvider>
            <App />
          </AppProvider>
        </BrowserRouter>
      </NextUIProvider>
    </ThemeProvider>
  </React.StrictMode>
)
4
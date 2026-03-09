import React from 'react'
import ReactDOM from 'react-dom/client'
import { SpeedInsights } from '@vercel/speed-insights/react'
import { Analytics } from '@vercel/analytics/react'
import ErrorBoundary from './components/ErrorBoundary'
import App from './App'
import '@fontsource-variable/inter'
import '@fontsource/fira-code/400.css'
import '@fontsource/fira-code/500.css'
import '@fontsource-variable/caveat'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
    <ErrorBoundary fallback="silent">
      <SpeedInsights />
      <Analytics />
    </ErrorBoundary>
  </React.StrictMode>,
)

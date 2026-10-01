/**
 * App.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Root application component for MPIndustry / MPMSME Portal.
 * Wraps the app in BrowserRouter, AuthProvider, I18nProvider, and AppRoutes.
 */

import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { I18nProvider } from './context/InternationalizationContext'
import AppRoutes from './routes/AppRoutes'

export default function App() {
  return (
    <BrowserRouter>
      <I18nProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </I18nProvider>
    </BrowserRouter>
  )
}

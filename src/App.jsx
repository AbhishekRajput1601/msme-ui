/**
 * App.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Root application component for MPIndustry / MPMSME Portal.
 * Wraps the app in BrowserRouter, AuthProvider, I18nProvider, and AppRoutes.
 */

import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { AuthProvider } from './context/AuthContext'
import { I18nProvider } from './context/InternationalizationContext'
import AppRoutes from './routes/AppRoutes'

export default function App() {
  return (
    <BrowserRouter>
      <I18nProvider>
        <AuthProvider>
          <AppRoutes />
          <ToastContainer
            position="top-right"
            autoClose={3500}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
            limit={5}
          />
        </AuthProvider>
      </I18nProvider>
    </BrowserRouter>
  )
}


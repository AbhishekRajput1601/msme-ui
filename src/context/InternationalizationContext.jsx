/**
 * I18nContext.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Lightweight frontend internationalization context supporting English and Hindi.
 */

import React, { createContext, useContext, useState, useCallback, useMemo } from 'react'
import { translations } from '../internationalization/translations'

const I18nContext = createContext(null)

export function I18nProvider({ children, initialLocale = 'en' }) {
  const [locale, setLocale] = useState(initialLocale)

  /**
   * Looks up a nested key in the translation dictionary.
   * e.g. t('common.login') or t('table.searchPlaceholder')
   */
  const t = useCallback(
    (path, fallback = '') => {
      if (!path) return ''
      const keys = path.split('.')
      let current = translations[locale] || translations.en

      for (const k of keys) {
        if (current && typeof current === 'object' && k in current) {
          current = current[k]
        } else {
          // Fallback to English if missing in Hindi
          let enCurrent = translations.en
          for (const ek of keys) {
            if (enCurrent && typeof enCurrent === 'object' && ek in enCurrent) {
              enCurrent = enCurrent[ek]
            } else {
              return fallback || path
            }
          }
          return enCurrent || fallback || path
        }
      }

      return typeof current === 'string' ? current : fallback || path
    },
    [locale],
  )

  const toggleLocale = useCallback(() => {
    setLocale((prev) => (prev === 'en' ? 'hi' : 'en'))
  }, [])

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      toggleLocale,
      t,
      isHindi: locale === 'hi',
    }),
    [locale, toggleLocale, t],
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useTranslation() {
  const context = useContext(I18nContext)
  if (!context) {
    // Graceful fallback if used outside Provider
    return {
      locale: 'en',
      setLocale: () => {},
      toggleLocale: () => {},
      t: (key, fallback) => fallback || key,
      isHindi: false,
    }
  }
  return context
}

export default I18nContext

/**
 * DatePicker.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Accessible, robust date input wrapper supporting:
 * - disablePast (prevents picking dates in the past)
 * - disableFuture (prevents picking dates in the future)
 * - startDate / endDate constraints (ensures start date <= end date)
 * - Custom min / max bounds
 * - Built-in validation message and shortcuts
 */

import React, { useId, useMemo } from 'react'
import {
  getTodayString,
  toISODateString,
  isPastDate,
  isFutureDate,
  isStartDateAfterEndDate
} from '../../utils/dateUtils'

export default function DatePicker({
  label,
  id: customId,
  name,
  value,
  onChange,
  min,
  max,
  startDate, // If this picker is an End Date, startDate sets the minimum bound
  endDate,   // If this picker is a Start Date, endDate sets the maximum bound
  disablePast = false,
  disableFuture = false,
  showShortcuts = false,
  placeholder,
  error,
  helperText,
  required = false,
  disabled = false,
  className = '',
  inputClassName = '',
  ...props
}) {
  const generatedId = useId()
  const dateId = customId || generatedId
  const errorId = `${dateId}-error`
  const helperId = `${dateId}-helper`

  // Format today's string
  const todayStr = useMemo(() => getTodayString(), [])

  // Calculate effective minimum date
  const effectiveMin = useMemo(() => {
    const candidates = []
    if (disablePast) candidates.push(todayStr)
    if (min) candidates.push(toISODateString(min))
    if (startDate) candidates.push(toISODateString(startDate))
    if (candidates.length === 0) return undefined
    // Pick the latest min date
    return candidates.reduce((latest, current) => (!latest || current > latest ? current : latest), '')
  }, [disablePast, min, startDate, todayStr])

  // Calculate effective maximum date
  const effectiveMax = useMemo(() => {
    const candidates = []
    if (disableFuture) candidates.push(todayStr)
    if (max) candidates.push(toISODateString(max))
    if (endDate) candidates.push(toISODateString(endDate))
    if (candidates.length === 0) return undefined
    // Pick the earliest max date
    return candidates.reduce((earliest, current) => (!earliest || current < earliest ? current : earliest), '')
  }, [disableFuture, max, endDate, todayStr])

  // Automatic validation message if no explicit error prop is passed
  const calculatedError = useMemo(() => {
    if (error) return error
    if (!value) return null

    const isoVal = toISODateString(value)
    if (disablePast && isPastDate(isoVal)) {
      return 'Date cannot be in the past.'
    }
    if (disableFuture && isFutureDate(isoVal)) {
      return 'Date cannot be in the future.'
    }
    if (effectiveMin && isoVal < effectiveMin) {
      if (startDate) return 'End date cannot be earlier than start date.'
      return `Date cannot be earlier than ${effectiveMin}.`
    }
    if (effectiveMax && isoVal > effectiveMax) {
      if (endDate) return 'Start date cannot be later than end date.'
      return `Date cannot be later than ${effectiveMax}.`
    }
    if (startDate && isStartDateAfterEndDate(startDate, isoVal)) {
      return 'End date cannot be earlier than start date.'
    }
    if (endDate && isStartDateAfterEndDate(isoVal, endDate)) {
      return 'Start date cannot be later than end date.'
    }
    return null
  }, [error, value, disablePast, disableFuture, effectiveMin, effectiveMax, startDate, endDate])

  const hasError = Boolean(calculatedError)
  const ariaDescribedBy = hasError
    ? errorId
    : helperText
    ? helperId
    : undefined

  const handleChange = (e) => {
    if (onChange) {
      onChange(e)
    }
  }

  const handleSetToday = (e) => {
    e.preventDefault()
    if (onChange) {
      onChange({ target: { name, value: todayStr } })
    }
  }

  const handleClear = (e) => {
    e.preventDefault()
    if (onChange) {
      onChange({ target: { name, value: '' } })
    }
  }

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <div className="flex items-center justify-between mb-1.5">
          <label
            htmlFor={dateId}
            className="block text-xs font-semibold uppercase tracking-wider text-gray-700"
          >
            {label}
            {required && (
              <span className="text-red-500 ml-1" aria-hidden="true">
                *
              </span>
            )}
          </label>
          {showShortcuts && !disabled && (
            <div className="flex items-center gap-1.5 text-xs">
              <button
                type="button"
                onClick={handleSetToday}
                className="text-indigo-600 hover:text-indigo-800 font-medium cursor-pointer"
                title="Select today's date"
              >
                Today
              </button>
              {value && (
                <>
                  <span className="text-gray-300">|</span>
                  <button
                    type="button"
                    onClick={handleClear}
                    className="text-gray-500 hover:text-red-600 cursor-pointer"
                    title="Clear selected date"
                  >
                    Clear
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      )}

      <div className="relative rounded-lg shadow-xs">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>

        <input
          id={dateId}
          name={name}
          type="date"
          value={value ? toISODateString(value) : ''}
          onChange={handleChange}
          min={effectiveMin}
          max={effectiveMax}
          disabled={disabled}
          required={required}
          placeholder={placeholder}
          aria-invalid={hasError}
          aria-describedby={ariaDescribedBy}
          className={`block w-full rounded-lg text-sm border transition-colors duration-150 py-2.5 pl-10 pr-3.5
            disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
            focus:outline-none focus:ring-2 focus:ring-offset-0
            ${
              hasError
                ? 'border-red-300 text-red-900 focus:border-red-500 focus:ring-red-200 bg-red-50/20'
                : 'border-gray-300 text-gray-900 focus:border-indigo-600 focus:ring-indigo-100 bg-white'
            }
            ${inputClassName}`}
          {...props}
        />
      </div>

      {hasError && (
        <p id={errorId} role="alert" className="mt-1.5 text-xs text-red-600 flex items-center gap-1 font-medium">
          <svg className="h-3.5 w-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {calculatedError}
        </p>
      )}

      {!hasError && helperText && (
        <p id={helperId} className="mt-1.5 text-xs text-gray-500">
          {helperText}
        </p>
      )}
    </div>
  )
}

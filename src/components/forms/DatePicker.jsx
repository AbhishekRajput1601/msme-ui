/**
 * DatePicker.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Accessible date input wrapper supporting min/max dates and calendar icon styling.
 */

import React, { useId } from 'react'

export default function DatePicker({
  label,
  id: customId,
  name,
  value,
  onChange,
  min,
  max,
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

  const hasError = Boolean(error)
  const ariaDescribedBy = hasError
    ? errorId
    : helperText
    ? helperId
    : undefined

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label
          htmlFor={dateId}
          className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5"
        >
          {label}
          {required && (
            <span className="text-red-500 ml-1" aria-hidden="true">
              *
            </span>
          )}
        </label>
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
          value={value || ''}
          onChange={onChange}
          min={min}
          max={max}
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
          {error}
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

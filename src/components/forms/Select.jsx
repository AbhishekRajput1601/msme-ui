/**
 * Select.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Accessible dropdown select component with support for objects and primitive arrays.
 */

import React, { useId } from 'react'

export default function Select({
  label,
  id: customId,
  name,
  value,
  onChange,
  options = [],
  placeholder = '-- Select an option --',
  error,
  helperText,
  required = false,
  disabled = false,
  className = '',
  selectClassName = '',
  ...props
}) {
  const generatedId = useId()
  const selectId = customId || generatedId
  const errorId = `${selectId}-error`
  const helperId = `${selectId}-helper`

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
          htmlFor={selectId}
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
        <select
          id={selectId}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          aria-invalid={hasError}
          aria-describedby={ariaDescribedBy}
          className={`block w-full appearance-none rounded-lg text-sm border transition-colors duration-150 py-2.5 pl-3.5 pr-10
            disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
            focus:outline-none focus:ring-2 focus:ring-offset-0
            ${
              hasError
                ? 'border-red-300 text-red-900 focus:border-red-500 focus:ring-red-200 bg-red-50/20'
                : 'border-gray-300 text-gray-900 focus:border-indigo-600 focus:ring-indigo-100 bg-white'
            }
            ${selectClassName}`}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt, idx) => {
            const val = typeof opt === 'object' && opt !== null ? opt.value : opt
            const text = typeof opt === 'object' && opt !== null ? opt.label || opt.name || opt.value : opt
            const isDisabled = typeof opt === 'object' && opt !== null ? Boolean(opt.disabled) : false

            return (
              <option key={`${val}-${idx}`} value={val} disabled={isDisabled}>
                {text}
              </option>
            )
          })}
        </select>

        {/* Custom Chevron Icon */}
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
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

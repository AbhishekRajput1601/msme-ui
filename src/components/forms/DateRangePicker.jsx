/**
 * DateRangePicker.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Paired Start Date & End Date picker component with:
 * - Built-in enforcement that start date cannot be after end date (start <= end)
 * - Built-in enforcement that end date cannot be before start date (end >= start)
 * - Optional disablePast to ensure dates cannot be in the past
 * - Coordinated validation and clear visual error messages
 */

import React, { useMemo } from 'react'
import DatePicker from './DatePicker'
import { validateDateRange } from '../../utils/dateUtils'

export default function DateRangePicker({
  startLabel = 'Start Date',
  endLabel = 'End Date',
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  disablePast = false,
  disableFuture = false,
  minDate,
  maxDate,
  required = false,
  disabled = false,
  className = '',
  errorMessage,
  showShortcuts = true,
  helperText
}) {
  const rangeValidation = useMemo(() => {
    return validateDateRange(startDate, endDate, { disablePast })
  }, [startDate, endDate, disablePast])

  const calculatedError = errorMessage || (!rangeValidation.valid ? rangeValidation.error : null)

  const handleStartChange = (e) => {
    if (onStartDateChange) {
      onStartDateChange(e.target.value, e)
    }
  }

  const handleEndChange = (e) => {
    if (onEndDateChange) {
      onEndDateChange(e.target.value, e)
    }
  }

  return (
    <div className={`w-full ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <DatePicker
            label={startLabel}
            value={startDate}
            onChange={handleStartChange}
            endDate={endDate}
            disablePast={disablePast}
            disableFuture={disableFuture}
            min={minDate}
            max={maxDate}
            required={required}
            disabled={disabled}
            showShortcuts={showShortcuts}
            error={calculatedError && startDate && endDate ? calculatedError : undefined}
          />
        </div>

        <div>
          <DatePicker
            label={endLabel}
            value={endDate}
            onChange={handleEndChange}
            startDate={startDate}
            disablePast={disablePast}
            disableFuture={disableFuture}
            min={minDate}
            max={maxDate}
            required={required}
            disabled={disabled}
            showShortcuts={showShortcuts}
            error={calculatedError && startDate && endDate ? calculatedError : undefined}
          />
        </div>
      </div>

      {helperText && !calculatedError && (
        <p className="mt-1.5 text-xs text-gray-500">{helperText}</p>
      )}
    </div>
  )
}

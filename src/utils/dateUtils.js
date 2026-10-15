/**
 * dateUtils.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Centralized date utility functions for format conversion, validation,
 * range checking, and date constraints across the application.
 */

/**
 * Returns today's date formatted as YYYY-MM-DD in local time zone.
 * Avoids the UTC-shift bug of Date#toISOString().
 */
export function getTodayString() {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * Formats a Date object or date string into YYYY-MM-DD.
 */
export function toISODateString(date) {
  if (!date) return ''
  const parsed = parseDateSafe(date)
  if (!parsed || isNaN(parsed.getTime())) return ''
  const year = parsed.getFullYear()
  const month = String(parsed.getMonth() + 1).padStart(2, '0')
  const day = String(parsed.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * Safely parses various date formats (YYYY-MM-DD, DD/MM/YYYY, DD-MM-YYYY, Date object)
 * into a Date object at local midnight (00:00:00).
 */
export function parseDateSafe(value) {
  if (!value) return null
  if (value instanceof Date) {
    if (isNaN(value.getTime())) return null
    return new Date(value.getFullYear(), value.getMonth(), value.getDate())
  }
  if (typeof value !== 'string') return null

  const trimmed = value.trim()
  if (!trimmed) return null

  // DD/MM/YYYY or DD-MM-YYYY
  const slashMatch = trimmed.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/)
  if (slashMatch) {
    const day = parseInt(slashMatch[1], 10)
    const month = parseInt(slashMatch[2], 10) - 1
    const year = parseInt(slashMatch[3], 10)
    const d = new Date(year, month, day)
    return isNaN(d.getTime()) ? null : d
  }

  // YYYY-MM-DD or YYYY/MM/DD
  const isoMatch = trimmed.match(/^(\d{4})[/-](\d{1,2})[/-](\d{1,2})$/)
  if (isoMatch) {
    const year = parseInt(isoMatch[1], 10)
    const month = parseInt(isoMatch[2], 10) - 1
    const day = parseInt(isoMatch[3], 10)
    const d = new Date(year, month, day)
    return isNaN(d.getTime()) ? null : d
  }

  // Fallback to standard Date parse
  const fallback = new Date(trimmed)
  if (isNaN(fallback.getTime())) return null
  return new Date(fallback.getFullYear(), fallback.getMonth(), fallback.getDate())
}

/**
 * Formats a date value into human readable DD/MM/YYYY.
 */
export function formatDisplayDate(value) {
  const d = parseDateSafe(value)
  if (!d) return ''
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()
  return `${day}/${month}/${year}`
}

/**
 * Checks if a date is strictly in the past (before today).
 */
export function isPastDate(value) {
  const d = parseDateSafe(value)
  if (!d) return false
  const today = parseDateSafe(getTodayString())
  return d.getTime() < today.getTime()
}

/**
 * Checks if a date is in the future (after today).
 */
export function isFutureDate(value) {
  const d = parseDateSafe(value)
  if (!d) return false
  const today = parseDateSafe(getTodayString())
  return d.getTime() > today.getTime()
}

/**
 * Checks if startDate is strictly greater than endDate (i.e. invalid range).
 */
export function isStartDateAfterEndDate(startDate, endDate) {
  const start = parseDateSafe(startDate)
  const end = parseDateSafe(endDate)
  if (!start || !end) return false
  return start.getTime() > end.getTime()
}

/**
 * Validates a start and end date range.
 * Returns { valid: boolean, error: string | null }
 */
export function validateDateRange(startDate, endDate, { disablePast = false } = {}) {
  if (!startDate && !endDate) return { valid: true, error: null }

  if (disablePast && startDate && isPastDate(startDate)) {
    return { valid: false, error: 'Start date cannot be in the past.' }
  }

  if (disablePast && endDate && isPastDate(endDate)) {
    return { valid: false, error: 'End date cannot be in the past.' }
  }

  if (startDate && endDate && isStartDateAfterEndDate(startDate, endDate)) {
    return {
      valid: false,
      error: 'Start date cannot be after end date (End date cannot be before start date).'
    }
  }

  return { valid: true, error: null }
}

/**
 * Validates a single date based on constraints.
 */
export function validateDate(value, {
  label = 'Date',
  disablePast = false,
  disableFuture = false,
  min = null,
  max = null,
  required = false
} = {}) {
  if (!value) {
    if (required) return { valid: false, error: `${label} is required.` }
    return { valid: true, error: null }
  }

  const d = parseDateSafe(value)
  if (!d) {
    return { valid: false, error: `Invalid ${label.toLowerCase()} format.` }
  }

  if (disablePast && isPastDate(d)) {
    return { valid: false, error: `${label} cannot be in the past.` }
  }

  if (disableFuture && isFutureDate(d)) {
    return { valid: false, error: `${label} cannot be in the future.` }
  }

  if (min) {
    const minD = parseDateSafe(min)
    if (minD && d.getTime() < minD.getTime()) {
      return { valid: false, error: `${label} cannot be before ${formatDisplayDate(minD)}.` }
    }
  }

  if (max) {
    const maxD = parseDateSafe(max)
    if (maxD && d.getTime() > maxD.getTime()) {
      return { valid: false, error: `${label} cannot be after ${formatDisplayDate(maxD)}.` }
    }
  }

  return { valid: true, error: null }
}

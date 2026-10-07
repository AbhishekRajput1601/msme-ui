export function readPath(object, path) {
  return String(path).split('.').reduce((value, key) => value?.[key], object)
}

export function writePath(scope, path, value) {
  const parts = path.replace(/\[([^\]]+)\]/g, (_, key) => `.${key in scope ? scope[key] : key.replace(/['"]/g, '')}`).split('.')
  if (parts.some(key => ['__proto__', 'constructor', 'prototype'].includes(key))) throw new Error('Invalid field path')
  let target = scope
  for (const key of parts.slice(0, -1)) target = target[key] ??= {}
  target[parts.at(-1)] = value
}

export function parseDate(value) {
  if (!value) return null
  if (value instanceof Date) return value
  const match = String(value).match(/^(\d{2})[/-](\d{2})[/-](\d{4})$/)
  const date = match ? new Date(+match[3], +match[2] - 1, +match[1]) : new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

export function filter(name, value, pattern) {
  if (name === 'date') {
    const date = parseDate(value)
    if (!date) return ''
    const parts = { yyyy: date.getFullYear(), MM: String(date.getMonth() + 1).padStart(2, '0'), dd: String(date.getDate()).padStart(2, '0') }
    return (pattern || 'dd/MM/yyyy').replace(/yyyy|MM|dd/g, token => parts[token])
  }
  if (name === 'number' || name === 'currency') return Number(value || 0).toLocaleString('en-IN', { maximumFractionDigits: Number(pattern ?? 2) })
  if (name === 'uppercase') return String(value ?? '').toUpperCase()
  if (name === 'lowercase') return String(value ?? '').toLowerCase()
  if (name === 'orderObjectBy') return Object.values(value || {}).sort((a,b) => String(a[pattern]).localeCompare(String(b[pattern])))
  return value
}

export const faPath = hash => {
  const path = String(hash).replace(/^#\/?/, '')
  const profiles = { updateindustryprofileapplicant: '/applicant/industry-profile', updateprofileapplicant: '/applicant/profile', dashboard: '/applicant/dashboard' }
  return profiles[path] || `/applicant/financial-assistance/${path.replace(/^fa\//, '')}`
}

export const backendPath = value => {
  if (/^https?:\/\//.test(value)) return value
  if (value.startsWith('/mpmsme/')) return value
  return '/mpmsme/applicant/' + value.replace(/^\/?(?:applicant\/)?/, '')
}

export function businessError(data) {
  const errors = [data?.errorMessage, ...(data?.errorMsgList || []).map(error => typeof error === 'string' ? error : error.errorMessage || error.message)].filter(Boolean)
  if (errors.length) throw new Error(errors.join('\n'))
  return data
}

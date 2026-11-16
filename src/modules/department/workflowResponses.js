import { jsonData } from '../../api/responseData'

export function workflowList(value) {
  if (value == null || (typeof value === 'string' && !value.trim())) return []
  const data = jsonData(value)
  if (!Array.isArray(data)) throw new Error('The server did not return a valid record list. Please retry.')
  return data
}

export function workflowSuccess(value) {
  const data = jsonData(value)
  if (typeof data.successMessage !== 'string' || !data.successMessage.trim()) {
    throw new Error('The server did not confirm the operation. Refresh the records before retrying.')
  }
  return data
}

const dateFields = new Set(['dob', 'poaDob', 'udyamRegDate', 'factoryActLicNoDoi', 'factoryActLicNoValidUpto', 'pcbRegNoEstablishedDoi', 'pcbRegNoEstablishedValidUpto', 'pcbRegNoOperateDoi', 'pcbRegNoOperateValidUpto', 'cinDoi', 'certiValidUpto'])

export function profileDates(data, toServer = false) {
  if (Array.isArray(data)) return data.map(value => profileDates(value, toServer))
  if (!data || typeof data !== 'object' || data instanceof Blob) return data
  return Object.fromEntries(Object.entries(data).map(([key, value]) => {
    if (dateFields.has(key) && typeof value === 'string') {
      const match = toServer ? value.match(/^(\d{4})-(\d{2})-(\d{2})$/) : value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/)
      if (match) value = toServer ? `${match[3]}/${match[2]}/${match[1]}` : `${match[3]}-${match[2]}-${match[1]}`
    } else value = profileDates(value, toServer)
    return [key, value]
  }))
}

export function profileMultipart(data) {
  const entries = data instanceof FormData ? [...data.entries()] : Object.entries(data)
  const body = new FormData()
  for (const [key, value] of entries) {
    // Partners and NOCs are saved by their JSON endpoints, never as [object Object].
    if (value == null || (typeof value === 'object' && !(value instanceof Blob))) continue
    body.append(key, profileDates({ [key]: value }, true)[key])
  }
  return body
}

export function profileUploadError(name, file, industrial = false) {
  if (!file) return ''
  if (!/\.(pdf|jpe?g)$/i.test(file.name)) return 'Please select a PDF or JPEG file.'
  let limit = 500 * 1024
  if (industrial) {
    if (['proofOfIdentityUpload', 'categoryUpload', 'deedUpload', 'aoaUpload', 'moaUpload', 'pcbEstUpload', 'pcbOperateUpload'].includes(name)) limit = 5 * 1024 * 1024
    if (['udyamUpload', 'factoryUpload', 'gstUpload', 'cinUpload'].includes(name)) limit = 2 * 1024 * 1024
  }
  return file.size > limit ? `File size should not exceed ${limit >= 1024 * 1024 ? limit / (1024 * 1024) + ' MB' : '500 KB'}.` : ''
}

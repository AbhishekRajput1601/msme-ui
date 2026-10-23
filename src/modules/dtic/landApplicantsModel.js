export function landWithApplicants(rows) {
  return rows.filter(row => Number.isSafeInteger(Number(row.totalApplicationReceived)) && Number(row.totalApplicationReceived) > 0)
}

export function landApplicantsPath(row) {
  return row.vcId != null && String(row.vcId).trim()
    ? `/department/dtic/id/viewAppliedApplicants/${encodeURIComponent(row.vcId)}`
    : null
}

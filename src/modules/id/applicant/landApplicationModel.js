// Field names and calculations follow IDApplicantBean and the applicant ID controller.
// Amounts in these arrays are rupees (not lakhs).
export const amountTotal = rows => (rows || []).reduce((sum, row) => sum + Math.round(Number(row.empNumber || 0) * 100), 0) / 100

export const isUndeveloped = data => /undeveloped land/i.test(data.vacantLandBean?.industrialAreaName || '')

export function undevelopedApplicationFee(area, maximum) {
  const sqm = Number(area)
  if (!Number.isFinite(sqm) || sqm <= 0 || !Number.isFinite(Number(maximum)) || Number(maximum) <= 0 || sqm > Number(maximum)) {
    throw new Error('Enter a positive plot area within the available area.')
  }
  const hectares = sqm / 10000
  return hectares <= 2 ? 20000 : hectares <= 5 ? 50000 : hectares <= 10 ? 100000 : hectares <= 20 ? 200000 : 500000
}

export function normalizeApplication(data) {
  return {
    ...data,
    presentAddState: data.presentAddState ?? data.stateId ?? '',
    district: data.district ?? data.districtId ?? '',
    tehsil: data.tehsil ?? data.tehsilId ?? '',
    block: data.block ?? data.blockId ?? '',
    permanentAddState: data.permanentAddState ?? data.permanentAddStateId ?? '',
    permanentDistrict: data.permanentDistrict ?? data.permanentAddDistrictId ?? '',
    permanentTehsil: data.permanentTehsil ?? data.permanentTehsilName ?? '',
    permanentBlock: data.permanentBlock ?? data.permanentBlockName ?? '',
    isAlreadyLandAlloted: data.isAlreadyLandAlloted === true || data.isAlreadyLandAlloted === 'true' || data.isLandAllotedStr === 'true',
    itemsManufactured: data.itemsManufactured?.length ? data.itemsManufactured : [{}],
    landDetails: data.landDetails?.length ? data.landDetails : [{}],
  }
}

export function withCalculatedFields(data) {
  const result = { ...data }
  const machinery = data.investmentBeans?.find(row => row.empName === 'Plant and machinery')
  if (machinery && machinery.empNumber !== '' && machinery.empNumber != null) {
    const amount = Number(machinery.empNumber)
    result.proposedVenture = amount < 10000000 ? 'Micro' : amount < 100000000 ? 'Small' : amount < 1250000000 ? 'Medium' : ''
    result.time = amount < 100000000 ? '2' : amount < 1250000000 ? '3' : ''
  }
  for (const [phase, name] of [['Present/First Phase', 'Present'], ['Second/Subsequent Phase', 'Subsequent']]) {
    const rows = (data.landDetails || []).filter(row => row.phase === phase)
    result[`total${name}OpenCoveredArea`] = rows.reduce((sum, row) => sum + Number(row.area || 0), 0)
    result[`total${name}OpenCoveredCost`] = rows.reduce((sum, row) => sum + Number(row.cost || 0), 0)
  }
  result.totalPresentAndSubsequentArea = result.totalPresentOpenCoveredArea + result.totalSubsequentOpenCoveredArea
  result.totalPresentAndSubsequentCost = result.totalPresentOpenCoveredCost + result.totalSubsequentOpenCoveredCost
  return result
}

export function validateApplication(data) {
  for (const name of ['idEmploymentBeans', 'investmentBeans', 'financeBeans']) {
    if (!data[name]?.length) throw new Error('The server did not return the employment, investment or finance categories. Reload the form.')
    for (const row of data[name]) {
      const number = Number(row.empNumber)
      if (row.empNumber === '' || row.empNumber == null || !Number.isFinite(number) || number < 0 || (name === 'idEmploymentBeans' && !Number.isInteger(number))) {
        throw new Error(`Enter a valid non-negative ${name === 'idEmploymentBeans' ? 'whole number' : 'amount'} for ${row.empName}.`)
      }
    }
  }
  if (Math.round(amountTotal(data.investmentBeans) * 100) !== Math.round(amountTotal(data.financeBeans) * 100)) {
    throw new Error('Proposed investment and means of finance totals must be equal.')
  }
  if (data.isAlreadyLandAlloted && !data.detailOfAllotedLand?.trim()) throw new Error('Enter details of the land already allotted.')
  if (isUndeveloped(data)) {
    undevelopedApplicationFee(data.totalPlotArea, data.vacantLandBean.totalPlotAreaun)
    const machinery = data.investmentBeans.find(row => row.empName === 'Plant and machinery')
    if (!machinery || Number(machinery.empNumber) < 250000000) throw new Error('Undeveloped land requires plant and machinery investment of at least 25 crore rupees under the existing application rules.')
    if (Number(data.quotedArea) !== Number(data.totalPlotArea) || !(Number(data.totalAmount) > 0)) throw new Error('Calculate the charges for the selected area before saving.')
  }
  return withCalculatedFields(data)
}

export function requireSaveSuccess(value, requireId = false) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('The server returned an unexpected save response.')
  if (value.errorMessage) throw new Error(value.errorMessage)
  if (!value.successMessage && String(value.id) === '1010') throw new Error('The captcha is incorrect. Refresh it and try again.')
  if (!value.successMessage || (requireId && !/^[1-9]\d*$/.test(String(value.id)))) throw new Error('The server did not confirm that the application was saved.')
  return value
}

export function canApplyToParcel(parcel) {
  return !!parcel.vcId && parcel.hoStatus !== 'Hold' && !parcel.commingSoon && (parcel.active === true || Number(parcel.totalApplicationReceived) > 0)
}

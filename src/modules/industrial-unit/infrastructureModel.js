// Validation order and messages from angular/applicant/fa/controller.js.
export const infrastructureDocuments = [
  [1, 'applicationFileDoc', 'Please upload Application Form!', 'Application form'],
  [2, 'projectReportFileDoc', 'Please upload Project Report!', 'Project Report'],
  [3, 'ownershipDoc', 'Please upload Land owenership documents!', 'Land ownership documents'],
  [4, 'khasaraDoc', 'Please upload Land use document(Copy of Khasara)!', 'Land use or Khasara'],
  [9, 'landMapDoc', 'Please Map of Land', 'Map of Land'],
  [5, 'electricalInstallationFileDoc', null, 'electrical installation'],
  [6, 'approachRoadFileDoc', null, 'Approach road document'],
  [7, 'approachRoadNocDoc', null, 'Approach road- NOC document'],
  [8, 'waterEstimateDoc', null, 'Water - Estimate document'],
  [10, 'electricalInstallationMapDoc', null, 'Map showing the distance from nearest power station document'],
]

export function infrastructureUpload(state) {
  const body = new FormData()
  for (const [number, key, requiredMessage, label] of infrastructureDocuments) {
    const file = state['doc' + number]
    if (!file && requiredMessage) throw new Error(requiredMessage)
    if (file?.size > 5242880) throw new Error(label + ' file size should not exceed 5 MB')
    if (file) body.append(key, file)
  }
  return body
}

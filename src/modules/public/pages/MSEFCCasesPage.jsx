import BackendTablePage from '../components/BackendTablePage'
const columns = [{"field": "msefcCaseId", "label": "Case number"}, {"field": "filingDate", "label": "Filing date"}, {"field": "petitionerUnitName", "label": "Petitioner unit"}, {"field": "respondentName", "label": "Respondent"}, {"field": "hearingDate", "label": "Hearing date"}, {"field": "status", "label": "Status"}, {"field": "totalAmount", "label": "Total amount"}]
export default function MSEFCCasesPage() {
  return <BackendTablePage title="MSEFC Case Status & Cause List" endpoint="/msefcLanding/fetchAllMSEFCCaseList" envelope="aaData" columns={columns} />
}

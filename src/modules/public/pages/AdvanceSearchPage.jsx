import BackendTablePage from '../components/BackendTablePage'
import { documentUrl } from '../publicData'
const columns = [
  { field: 'Subject', label: 'Subject' },
  { field: 'Description', label: 'Description' },
  { field: 'SectionName', label: 'Section' },
  { field: 'SubSectionName', label: 'Subsection' },
  { field: 'DateofIssue', label: 'Issue date' },
  { field: 'uploaddate', label: 'Upload date' },
  { field: 'DocURL', label: 'Document', render: row => {
    const href = documentUrl(row.DocURL)
    return href ? <a href={href} target="_blank" rel="noopener noreferrer">Open document</a> : 'Unavailable'
  } },
]
export default function AdvanceSearchPage() {
  return <BackendTablePage title="Advance Document Search" endpoint="/advanceSearch/fetchAllAdvanceSearchList" columns={columns} dateSearch />
}

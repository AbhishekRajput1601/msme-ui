import { getDownloadDocumentUrl } from '../services/idApplicantService'

// Uploads use LandDocumentsPage and the backend document bundle contract.
export default function DocumentUploadSection({ applicantId, documents = [] }) {
  return <section aria-label="Applicant documents">
    {documents.length === 0 ? <p>No applicant documents have been returned by the server.</p> : <ul>
      {documents.map((doc, index) => <li className="py-2 border-b" key={doc.applicantDocumentId || index}>
        {doc.documentTypeShort ? <a href={getDownloadDocumentUrl(doc.documentTypeShort, applicantId)} target="_blank" rel="noreferrer">{doc.documentType}</a> : <span>{doc.documentType} — Download unavailable</span>}
        {doc.fileName && <span> — {doc.fileName}</span>}
        {typeof doc.verified === 'boolean' && <span> — {doc.verified ? 'Verified' : 'Pending verification'}</span>}
      </li>)}
    </ul>}
  </section>
}

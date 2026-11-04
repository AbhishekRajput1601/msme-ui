import http from '../../../api/httpClient'

export default function ProfileUpload({ documentId, ...props }) {
  return <>
    <input {...props} type="file" />
    {documentId != null && documentId !== '' && <a href={http.getUri({ url: `/applicant/downloadDocumentById/${encodeURIComponent(documentId)}` })} target="_blank" rel="noopener noreferrer">Download uploaded document</a>}
  </>
}

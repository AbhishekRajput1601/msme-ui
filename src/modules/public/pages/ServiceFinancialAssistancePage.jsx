import CmsTopicPage from '../components/CmsTopicPage'
export default function ServiceFinancialAssistancePage() {
  return <CmsTopicPage title="Apply for Financial Assistance" slugs={["service-financial-assistance"]} action={{"to": "/applicant/financial-assistance", "label": "Open financial assistance"}} />
}

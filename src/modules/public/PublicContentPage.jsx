import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { useTranslation } from '../../hooks/useTranslation'
import { hasPublishedContent, parsePublicContent } from './parsePublicContent'
import { backendUrl } from './publicRoutes'
import { WebsiteContent } from './WebsiteContent'
import Spinner from '../../components/loaders/Spinner'
import * as Pages from './pages'

const DEDICATED_PAGE_MAP = {
  // Acts & Rules
  'acts-rules': Pages.ActsRulesPage,
  'acts': Pages.ActsRulesPage,
  'rules': Pages.ActsRulesPage,

  // Facilitation Council
  'facilitation-council': Pages.MSEFCOverviewPage,
  'fc-overview': Pages.MSEFCOverviewPage,
  'msefc-overview': Pages.MSEFCOverviewPage,
  'msefc': Pages.MSEFCOverviewPage,
  'msefc-cases': Pages.MSEFCCasesPage,
  'fc-cases': Pages.MSEFCCasesPage,
  'caseListLanding': Pages.MSEFCCasesPage,
  'msefc-delayed-payment': Pages.MSEFCDelayedPaymentPage,
  'fc-delayed-payment': Pages.MSEFCDelayedPaymentPage,
  'delayed-payment-calculator': Pages.MSEFCDelayedPaymentPage,
  'delayed-payment': Pages.MSEFCDelayedPaymentPage,
  'msefc-rules': Pages.MSEFCRulesPage,
  'fc-rules': Pages.MSEFCRulesPage,

  // Infra & Land
  'vacant-land-developed': Pages.VacantLandDevelopedPage,
  'land-developed': Pages.VacantLandDevelopedPage,
  'vacantLandListLanding': Pages.VacantLandDevelopedPage,
  'vacant-land-undeveloped': Pages.VacantLandUndevelopedPage,
  'land-undeveloped': Pages.VacantLandUndevelopedPage,
  'vacantLandListLandingUL': Pages.VacantLandUndevelopedPage,
  'industrial-areas': Pages.IndustrialAreasPage,
  'land-areas': Pages.IndustrialAreasPage,
  'industrial-areas-directory': Pages.IndustrialAreasPage,
  'land-reports': Pages.LandReportsPage,
  'seekingLandAllotmentReport': Pages.LandReportsPage,
  'collector-rates': Pages.LandReportsPage,
  'infra': Pages.IndustrialAreasPage,
  'land': Pages.VacantLandDevelopedPage,

  // Policies
  'policies': Pages.PoliciesPage,
  'policy': Pages.PoliciesPage,
  'msme-policy': Pages.PoliciesPage,

  // Schemes
  'scheme-mmuky': Pages.SchemeMMUKYPage,
  'mmuky': Pages.SchemeMMUKYPage,
  'scheme-financial-assistance': Pages.SchemeFinancialAssistancePage,
  'financial-assistance': Pages.SchemeFinancialAssistancePage,
  'schemes': Pages.SchemeFinancialAssistancePage,
  'scheme-cluster-development': Pages.SchemeClusterDevelopmentPage,
  'cluster-development': Pages.SchemeClusterDevelopmentPage,
  'clusters': Pages.SchemeClusterDevelopmentPage,
  'scheme-quality-certification': Pages.SchemeQualityCertificationPage,
  'quality-certification': Pages.SchemeQualityCertificationPage,
  'ipr-patents': Pages.SchemeQualityCertificationPage,

  // Online Services
  'service-land-allotment': Pages.ServiceLandAllotmentPage,
  'apply-land': Pages.ServiceLandAllotmentPage,
  'services': Pages.ServiceLandAllotmentPage,
  'service-financial-assistance': Pages.ServiceFinancialAssistancePage,
  'apply-subsidy': Pages.ServiceFinancialAssistancePage,
  'service-mpidc-noc': Pages.ServiceMpidcNocPage,
  'mpidc-noc': Pages.ServiceMpidcNocPage,
  'noc': Pages.ServiceMpidcNocPage,
  'application-status': Pages.ApplicationStatusPage,
  'track-application': Pages.ApplicationStatusPage,
  'status': Pages.ApplicationStatusPage,
  'service-grievance': Pages.ServiceGrievancePage,
  'grievance': Pages.ServiceGrievancePage,
  'helpdesk': Pages.ServiceGrievancePage,

  // Startup
  'startup-policy': Pages.StartupPolicyPage,
  'startup': Pages.StartupPolicyPage,
  'startup-incubation': Pages.StartupIncubationPage,
  'incubation': Pages.StartupIncubationPage,
  'startup-funding': Pages.StartupFundingPage,
  'startup-directory': Pages.StartupDirectoryPage,
  'startups': Pages.StartupDirectoryPage,

  // Circulars & Archive
  'orderCirculars': Pages.CircularsOrdersPage,
  'circulars-orders': Pages.CircularsOrdersPage,
  'circulars': Pages.CircularsOrdersPage,
  'orders': Pages.CircularsOrdersPage,
  'circulars-notifications': Pages.CircularsNotificationsPage,
  'notifications': Pages.CircularsNotificationsPage,
  'tenders': Pages.TendersPage,
  'procurement': Pages.TendersPage,
  'advanceSearch': Pages.AdvanceSearchPage,
  'advanceSearchLanding': Pages.AdvanceSearchPage,
  'advance-search': Pages.AdvanceSearchPage,

  // Common CMS legacy aliases
  'downloads': Pages.CircularsOrdersPage,
}

export default function PublicContentPage() {
  const { page } = useParams()
  const DedicatedComponent = DEDICATED_PAGE_MAP[page]
  return DedicatedComponent ? <DedicatedComponent key={page} /> : <CmsContentPage key={page} />
}

function CmsContentPage() {
  const { page } = useParams()
  const { search } = useLocation()
  const { locale } = useTranslation()
  const [result, setResult] = useState({ loading: true })
  const [attempt, setAttempt] = useState(0)
  const heading = useRef(null)

  useEffect(() => {
    const controller = new AbortController()
    const params = new URLSearchParams(search)
    params.set('language', locale === 'hi' ? 'hi_IN' : 'en_US')
    const url = `${backendUrl(`/website/${encodeURIComponent(page)}`)}?${params}`
    setResult({ loading: true })
    const load = async () => {
      if (page === 'search') {
        const bootstrap = await fetch(backendUrl('/website/auth-bootstrap'), { credentials: 'include', signal: controller.signal })
        if (!bootstrap.ok) throw new Error('Search could not be initialized. Please retry.')
        const data = await bootstrap.json()
        if (!data.csrfPreventionSalt) throw new Error('Search could not be initialized. Please retry.')
        params.set('csrfPreventionSalt', data.csrfPreventionSalt)
      }
      return fetch(`${backendUrl(`/website/${encodeURIComponent(page)}`)}?${params}`, { credentials: 'include', signal: controller.signal })
    }
    load()
      .then(async response => {
        if (!response.ok) throw new Error(`Content could not be loaded (${response.status}). Please try again.`)
        return parsePublicContent(await response.text(), new URL(url, window.location.origin).href)
      })
      .then(data => { if (!controller.signal.aborted) setResult({ ...data, loading: false }) })
      .catch(error => { if (!controller.signal.aborted) setResult({ error: error.message, loading: false }) })
    return () => controller.abort()
  }, [page, search, locale, attempt])

  useEffect(() => {
    if (!result.title) return
    const previous = document.title
    document.title = `${result.title} | MPMSME`
    heading.current?.focus()
    return () => { document.title = previous }
  }, [result.title])

  const hasContent = hasPublishedContent(result.nodes)

  return (
    <article className="container public-content-page py-6" lang={locale} aria-busy={result.loading}>
      <nav aria-label="Breadcrumb" className="mb-4 text-sm text-slate-500">
        <Link to="/" className="text-blue-700 hover:underline">
          {locale === 'hi' ? 'मुख्य पृष्ठ' : 'Home'}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-slate-700 font-medium">
          {result.title || (locale === 'hi' ? 'विभागीय सेवाएं' : 'Departmental Information')}
        </span>
      </nav>

      {result.loading ? (
        <Spinner />
      ) : result.error ? (
        <div role="alert" className="p-6 bg-red-50 border border-red-200 rounded-lg text-red-800 text-center my-8">
          <p className="font-semibold text-lg mb-2">{result.error}</p>
          <button
            type="button"
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 font-medium"
            onClick={() => setAttempt(value => value + 1)}
          >
            {locale === 'hi' ? 'पुनः प्रयास करें' : 'Retry'}
          </button>
        </div>
      ) : hasContent ? (
        <>
          <h1 ref={heading} tabIndex={-1} className="text-2xl sm:text-3xl font-bold text-slate-800 mb-6 border-b pb-3">
            {result.title}
          </h1>
          <WebsiteContent nodes={result.nodes} />
        </>
      ) : (
        <p role="status">Currently no data available.</p>
      )}
    </article>
  )
}

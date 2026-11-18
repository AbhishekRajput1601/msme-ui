import { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { useTranslation } from '../../../hooks/useTranslation'
import PublicPageLayout from './PublicPageLayout'
import { ServiceLink } from './BackendTablePage'
import { WebsiteContent } from '../WebsiteContent'
import { hasPublishedContent, parsePublicContent } from '../parsePublicContent'
import { readPublic } from '../publicData'
import { backendUrl } from '../publicRoutes'

// Aliases observed in the backend CMS menu; never infer an endpoint from a title.
const aliases = {
  'acts-rules': ['acts-&-rules'],
  'scheme-financial-assistance': ['financial-assistance'],
  'startup-policy': ['startup-policy,-guidelines-&-order'],
  'tenders': ['e-tender-and-auction'],
  'startup-incubation': ['incubation-network'],
}
function flatten(items = []) { return items.flatMap(item => [item, ...flatten(item.children)]) }
export default function CmsTopicPage({ title, slugs, source, action }) {
  const website = useOutletContext() || {}
  const { locale } = useTranslation()
  const [attempt, setAttempt] = useState(0)
  const [stored, setResult] = useState({})
  const candidates = slugs.flatMap(slug => [slug, ...(aliases[slug] || [])])
  const match = flatten(website.menu).find(item => {
    const path = (item.sourceHref || '').replace(/^\/backend/, '').split(/[?#]/)[0]
    return candidates.some(slug => path === `/website/${slug}`)
  })
  const path = source || match?.sourceHref?.replace(/^\/backend/, '')
  const requestPath = path ? `${path}${path.includes('?') ? '&' : '?'}language=${locale === 'hi' ? 'hi_IN' : 'en_US'}` : ''
  const requestKey = `${requestPath}:${attempt}`
  const result = stored.key === requestKey ? stored : { loading: true }
  useEffect(() => {
    let active = true
    if (!requestPath) return () => { active = false }
    readPublic(requestPath, 'text').then(html => {
      const parsed = parsePublicContent(html, new URL(backendUrl(requestPath), window.location.origin).href)
      if (active) setResult({ key: requestKey, ...parsed, loading: false })
    }).catch(error => { if (active) setResult({ key: requestKey, error: error.message, loading: false }) })
    return () => { active = false }
  }, [requestPath, requestKey])
  const loading = path ? result.loading : website.loading
  const error = path ? result.error : website.error
  return <PublicPageLayout title={title} actions={action && <ServiceLink to={action.to}>{action.label}</ServiceLink>}>
    <section className="bg-white border rounded-lg p-4 sm:p-6 overflow-x-auto" aria-busy={!!loading}>
      {loading ? <p role="status">Loading published content…</p> : error ? <div role="alert">
        <p>Content could not be loaded. Please try again.</p>
        <button type="button" className="btn btn-primary" onClick={() => path ? setAttempt(value => value + 1) : website.retry?.()}>Retry</button>
      </div> : path && hasPublishedContent(result.nodes) ? <WebsiteContent nodes={result.nodes} /> :
        <p role="status">Currently no data available.</p>}
    </section>
  </PublicPageLayout>
}

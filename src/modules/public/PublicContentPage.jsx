import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { useTranslation } from '../../hooks/useTranslation'
import { contentNodes } from './legacyWebsite'
import { backendUrl } from './publicRoutes'
import { WebsiteContent } from './WebsiteContent'

export function parsePublicContent(html, pageUrl) {
  const doc = new DOMParser().parseFromString(html, 'text/html')
  const content = doc.querySelector('.inner-content')
  if (!content || !doc.querySelector('.header-new-section')) throw new Error('The requested content was not returned by the server.')
  // Replace Bootstrap/jQuery accordions with accessible native disclosure controls.
  for (const panel of content.querySelectorAll('.panel-group > .panel')) {
    const label = panel.querySelector(':scope > .panel-heading')
    const body = panel.querySelector(':scope > .panel-collapse')
    if (!label || !body) continue
    const details = doc.createElement('details')
    const summary = doc.createElement('summary')
    summary.textContent = label.textContent.trim()
    details.append(summary, ...body.childNodes)
    panel.replaceWith(details)
  }
  // The old gallery wraps videos in a Flash player URL. Use native video controls.
  for (const anchor of content.querySelectorAll('a:has(video)')) anchor.replaceWith(...anchor.childNodes)
  return {
    title: content.parentElement.querySelector('.heading')?.textContent.trim() || doc.title,
    nodes: contentNodes(content, pageUrl),
  }
}

export default function PublicContentPage() {
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
    fetch(url, { credentials: 'include', signal: controller.signal })
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
  return <article className="container public-content-page" lang={locale} aria-busy={result.loading}>
    <nav aria-label="Breadcrumb"><Link to="/">{locale === 'hi' ? 'मुख्य पृष्ठ' : 'Home'}</Link></nav>
    {result.loading ? <p role="status">{locale === 'hi' ? 'सामग्री लोड हो रही है…' : 'Loading content…'}</p> : result.error ? <div role="alert"><p>{result.error}</p><button type="button" onClick={() => setAttempt(value => value + 1)}>Retry</button></div> : <>
      <h1 ref={heading} tabIndex={-1}>{result.title}</h1>
      <WebsiteContent nodes={result.nodes} />
    </>}
  </article>
}

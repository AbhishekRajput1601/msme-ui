import { contentNodes } from './legacyWebsite'

export function hasPublishedContent(nodes = []) {
  return nodes.some(node => node.text?.trim() || ['img', 'video'].includes(node.tag) || hasPublishedContent(node.children))
}

export function parsePublicContent(html, pageUrl) {
  const doc = new DOMParser().parseFromString(html, 'text/html')
  const content = doc.querySelector('.inner-content')
  if (!content || !doc.querySelector('.header-new-section')) throw new Error('The requested content was not returned by the server.')
  // A CMS order pointing to the portal homepage is not a document download.
  if (new URL(pageUrl).pathname.endsWith('/website/orderCirculars')) {
    for (const anchor of content.querySelectorAll('a[href]')) {
      try {
        const target = new URL(anchor.getAttribute('href'), pageUrl)
        if (target.hostname === 'mpmsme.gov.in' && target.pathname === '/') {
          anchor.replaceWith(doc.createTextNode('Document unavailable'))
        }
      } catch { anchor.removeAttribute('href') }
    }
  }
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


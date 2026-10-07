import { useEffect, useState } from 'react'
import { backendUrl, publicPagePath } from './publicRoutes'

export const ASSETS = '/legacy/pages/website/msme_new/app_assets'
export const backendLink = path => {
  const [pathname, query] = path.split(/\?(.*)/s)
  const page = publicPagePath(pathname)
  if (page) return page + (query ? `?${query}` : '')
  if (path === '/website/screen-reader') return path
  if (path === '/website/home') return '/'
  if (path === '/website/login') return '/login'
  if (path === '/website/viewforgotpassword') return '/forgot-password'
  if (path === '/website/viewforgotusername') return '/forgot-username'
  if (path === '/website/viewsignup') return '/signup'
  return `/mpmsme${path}`
}
const emptyWebsite = {
  menu: [], footerLinks: [], slides: [], officers: [], features: [], partners: [],
  news: [], circulars: [], events: [], gallery: [], about: [], aboutContent: [],
}

const contentTags = new Set(['p', 'div', 'span', 'strong', 'b', 'em', 'i', 'u', 'br', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'a', 'img', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'blockquote', 'caption', 'details', 'summary', 'video', 'source'])
const contentStyles = ['color', 'backgroundColor', 'fontSize', 'fontWeight', 'fontStyle', 'textAlign', 'textDecoration', 'lineHeight', 'marginTop', 'marginBottom', 'paddingLeft', 'paddingRight']

export function contentNodes(parent, pageUrl) {
  return [...parent.childNodes].flatMap(node => {
    if (node.nodeType === 3) return [{ text: node.textContent }]
    if (node.nodeType !== 1 || ['SCRIPT', 'STYLE', 'IFRAME', 'OBJECT', 'FORM'].includes(node.tagName)) return []
    const tag = node.tagName.toLowerCase()
    if (!contentTags.has(tag)) return contentNodes(node, pageUrl)
    const props = {}
    if (node.id) props.id = `cms-${node.id}`
    if (node.title) props.title = node.title
    if (node.classList.contains('table')) props.className = 'table table-bordered'
    if (tag === 'a') {
      const href = node.getAttribute('href')
      props.href = href?.startsWith('#') ? `#cms-${href.slice(1)}` : safeUrl(href, pageUrl) || undefined
      if (node.target === '_blank') { props.target = '_blank'; props.rel = 'noopener noreferrer' }
    }
    if (tag === 'img') {
      props.src = safeUrl(node.getAttribute('src'), pageUrl, false)
      props.alt = node.getAttribute('alt') || ''
      if (!props.src) return []
    }
    if (tag === 'video' || tag === 'source') {
      props.src = safeUrl(node.getAttribute('src'), pageUrl, false) || undefined
      if (tag === 'video') { props.controls = true; props.preload = 'metadata' }
      if (tag === 'source' && node.type) props.type = node.type
    }
    if (tag === 'td' || tag === 'th') {
      props.colSpan = node.colSpan
      props.rowSpan = node.rowSpan
    }
    const style = Object.fromEntries(contentStyles.filter(key => node.style[key] && !/url\(|expression|var\(/i.test(node.style[key])).map(key => [key, node.style[key]]))
    if (Object.keys(style).length) props.style = style
    return [{ tag, props, children: contentNodes(node, pageUrl) }]
  })
}

function menuNodes(parent, pageUrl) {
  if (!parent) return []
  return [...parent.children].filter(node => node.tagName === 'LI').map(node => {
    const anchor = node.querySelector(':scope > a')
    const children = menuNodes(node.querySelector(':scope > ul'), pageUrl)
    return { label: anchor?.textContent.trim() || '', href: children.length ? '' : safeUrl(anchor?.getAttribute('href'), pageUrl), children }
  }).filter(item => item.label && (item.href || item.children.length))
}

// Read public CMS content from the existing server-rendered page. Legacy scripts
// are never executed and no backend endpoint or authentication contract changes.
export function safeUrl(value, pageUrl, navigation = true) {
  if (!value || /^(javascript:|data:)/i.test(value.trim())) return ''
  try {
    const url = new URL(value, pageUrl)
    if (!/^https?:$/.test(url.protocol)) return ''

    // Intercept any local URLs (whether port 5173 or 8080) and map to frontend
    const isLocal =
      url.origin === window.location.origin ||
      url.hostname === 'localhost' ||
      url.hostname === '127.0.0.1'

    if (isLocal) {
      const cleanPath = url.pathname.replace(/^\/(mpmsme|backend)(?=\/)/, '')
      const frontendPath = navigation && publicPagePath(cleanPath)
      if (frontendPath) return `${frontendPath}${url.search}${url.hash}`
      if (!navigation) return `${backendUrl(cleanPath)}${url.search}${url.hash}`
      if (/^\/website\/screen-reader\/?$/.test(cleanPath)) return `/website/screen-reader${url.search}${url.hash}`
      if (/^\/website\/home\/?$/.test(cleanPath) || cleanPath === '' || cleanPath === '/') return '/'
      if (/^\/website\/login\/?$/.test(cleanPath)) return '/login'
      if (/^\/website\/viewforgotpassword\/?$/.test(cleanPath)) return '/forgot-password'
      if (/^\/website\/viewforgotusername\/?$/.test(cleanPath)) return '/forgot-username'
      if (/^\/website\/viewsignup\/?$/.test(cleanPath)) return '/signup'

      if (url.pathname.startsWith('/mpmsme')) {
        return `${url.pathname}${url.search}${url.hash}`
      }
      return `/mpmsme${url.pathname}${url.search}${url.hash}`
    }
    return url.href
  } catch { return '' }
}

export function parseLegacyWebsite(html, pageUrl) {
  const doc = new DOMParser().parseFromString(html, 'text/html')
  if (!doc.querySelector('.header-new-section')) throw new Error('The server returned an unexpected website response.')
  const text = (node, selector) => node.querySelector(selector)?.textContent.trim() || ''
  const image = node => safeUrl(node?.getAttribute('src'), pageUrl, false)
  const links = selector => [...doc.querySelectorAll(selector)].map(node => ({
    label: node.textContent.trim(), href: safeUrl(node.getAttribute('href'), pageUrl),
  })).filter(link => link.label && link.href)
  const items = selector => [...doc.querySelectorAll(selector)].map(node => ({
    title: text(node, 'label') || text(node, 'a'),
    href: safeUrl(node.querySelector('a')?.getAttribute('href'), pageUrl),
    date: node.querySelector('.fa-calendar')?.parentElement.textContent.trim() || '',
  })).filter(item => item.title && item.href)
  return {
    departmentName: text(doc, '.logo-title h1'), governmentName: text(doc, '.logo-title h5'),
    departmentLogo: image(doc.querySelector('.navbar-brand img')),
    governmentLogo: image(doc.querySelector('.login-menu img')),
    menu: menuNodes(doc.querySelector('.mainmenu .navbar-nav'), pageUrl),
    footerLinks: links('.footer-widget a[href]'),
    slides: [...doc.querySelectorAll('#slider img')].map(img => ({ src: image(img), alt: img.alt || 'MSME Madhya Pradesh', href: safeUrl(img.closest('a')?.getAttribute('href'), pageUrl) })).filter(item => item.src),
    officers: [...doc.querySelectorAll('.about-with-section .img-holder')].map(node => ({ src: image(node.querySelector('img')), name: text(node.parentElement, '.ribbon > span'), position: text(node.parentElement, '.ribbon small') })).filter(item => item.src),
    about: [...doc.querySelectorAll('.about .content_text_body')].map(node => node.textContent.trim()).filter(Boolean),
    aboutContent: [...doc.querySelectorAll('.about .content_text_body')].flatMap(node => contentNodes(node, pageUrl)),
    // Legacy CMS cards can have no destination (javascript:void(0)). Keep their
    // content while safeUrl removes the unusable link.
    features: [...doc.querySelectorAll('.feature-item')].map(node => ({ src: image(node.querySelector('img')), title: text(node, 'h3'), description: text(node, 'p'), href: safeUrl(node.querySelector('a')?.getAttribute('href'), pageUrl) })).filter(item => item.title),
    news: items('.panel1 .news-item'), circulars: items('.panel2 .news-item'), events: items('.panel3 .news-item'),
    gallery: [...doc.querySelectorAll('#image-gallery img')].map(img => ({ src: image(img), alt: img.alt })).filter(item => item.src),
    partners: [...doc.querySelectorAll('#our-partner .item')].map(node => ({ src: image(node.querySelector('img')), title: node.querySelector('img')?.alt || '', href: safeUrl(node.querySelector('a')?.getAttribute('href'), pageUrl) })).filter(item => item.src && item.href),
    updated: text(doc, '.top-footer .col-lg-6 > span:last-child'),
  }
}

export function useLegacyWebsite(locale) {
  const [website, setWebsite] = useState({ ...emptyWebsite, loading: true, error: null })
  const [attempt, setAttempt] = useState(0)
  useEffect(() => {
    const controller = new AbortController()
    setWebsite({ ...emptyWebsite, loading: true, error: null })
    const url = `${backendUrl('/website/home')}?language=${locale === 'hi' ? 'hi_IN' : 'en_US'}`
    fetch(url, { credentials: 'include', signal: controller.signal })
      .then(response => response.ok ? response.text() : Promise.reject(new Error('Website unavailable')))
      .then(html => {
        if (controller.signal.aborted) return
        const data = parseLegacyWebsite(html, new URL(url, window.location.origin).href)
        setWebsite({ ...data, loading: false, error: null })
      })
      .catch(error => {
        if (controller.signal.aborted) return
        setWebsite({ ...emptyWebsite, loading: false, error: error.message })
      })
    return () => controller.abort()
  }, [locale, attempt])
  return { ...website, retry: () => setAttempt(value => value + 1) }
}

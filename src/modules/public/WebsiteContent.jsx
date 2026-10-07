import { createElement } from 'react'
import { Link } from 'react-router-dom'

/** Migrated page links use React navigation, including links from the CMS. */
export function WebsiteLink({ href, ...props }) {
  if (/^\/(?:website\/|login(?:[?#]|$)|signup(?:[?#]|$)|forgot-password(?:[?#]|$)|forgot-username(?:[?#]|$)|[?#]|$)/.test(href || '')) {
    return <Link to={href} {...props} />
  }
  return <a href={href} {...props} />
}

/** Render only the allowlisted CMS nodes produced by parseLegacyWebsite. */
export function WebsiteContent({ nodes }) {
  return nodes.map((node, index) => {
    if ('text' in node) return node.text
    const props = { ...node.props, key: index }
    if (node.tag === 'a') return createElement(WebsiteLink, props, <WebsiteContent nodes={node.children} />)
    if (node.tag === 'img' || node.tag === 'br' || node.tag === 'source') return createElement(node.tag, props)
    return createElement(node.tag, props, <WebsiteContent nodes={node.children} />)
  })
}

export function WebsiteMenuItem({ item, nested = false }) {
  return <li className={nested ? undefined : 'nav-item'}>
    {item.children?.length ? <details className="public-dropdown"
      onPointerEnter={event => {
        if (event.pointerType === 'mouse' && window.matchMedia('(hover: hover)').matches) event.currentTarget.open = true
      }}
      onPointerLeave={event => {
        if (event.pointerType === 'mouse' && !event.currentTarget.contains(document.activeElement)) event.currentTarget.open = false
      }}
      onBlur={event => {
        if (!event.currentTarget.contains(event.relatedTarget)) event.currentTarget.open = false
      }}
      onKeyDown={event => {
        if (event.key === 'Escape') {
          event.stopPropagation()
          event.currentTarget.open = false
          event.currentTarget.querySelector('summary')?.focus()
        }
      }}>
      <summary className="nav-link">{item.label}<span className="public-dropdown__arrow" aria-hidden="true">▾</span></summary>
      <ul>{item.children.map((child, index) => <WebsiteMenuItem item={child} nested key={`${child.label}-${index}`} />)}</ul>
    </details> : <WebsiteLink className="nav-link" href={item.href}>{item.label}</WebsiteLink>}
  </li>
}

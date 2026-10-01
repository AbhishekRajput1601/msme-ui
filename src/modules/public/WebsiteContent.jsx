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
    {item.children?.length ? <details className="public-dropdown">
      <summary className="nav-link">{item.label}</summary>
      <ul>{item.children.map((child, index) => <WebsiteMenuItem item={child} nested key={`${child.label}-${index}`} />)}</ul>
    </details> : <WebsiteLink className="nav-link" href={item.href}>{item.label}</WebsiteLink>}
  </li>
}

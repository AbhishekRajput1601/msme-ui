import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from '../../hooks/useTranslation'
import menu from './dticMenu.json'
import { dticLink } from './dticService'
import './dtic-sidebar.css'

// Mirrors dtichome.html and MetisMenu's one-open-sibling behavior.
function MenuLevel({ items, level = 0, onNavigate }) {
  const { locale } = useTranslation()
  const { pathname } = useLocation()
  const containsPath = item => item.children
    ? item.children.some(containsPath)
    : dticLink(item.legacyHref || '') === pathname
  const [selection, setSelection] = useState(null)
  const openKey = selection?.pathname === pathname
    ? selection.key
    : items.find(item => item.children && containsPath(item))?.key

  return <ul className={`nav${level ? ` nav-${level === 1 ? 'second' : 'third'}-level` : ''}`} id={level ? undefined : 'side-menu'}>
    {items.map(item => {
      const href = item.legacyHref?.startsWith('#')
        ? dticLink(item.legacyHref)
        : (item.href?.startsWith('/department/') ? item.href : item.href || '#')
      const open = openKey === item.key
      const active = pathname === href
      const content = <>
        {item.iconName && <i className={`fa fa-${item.iconName} fa-fw`} aria-hidden="true" />}
        <span>{item.label[locale] || item.label.en}</span>
        {item.children && <span className="fa arrow" aria-hidden="true" />}
      </>
      return <li key={item.key} className={open ? 'active' : undefined}>
        {item.children ? <>
          <button type="button" className="dtic-menu-link" aria-expanded={open}
            aria-controls={`submenu-${item.key}`} onClick={() => setSelection({ pathname, key: open ? null : item.key })}>
            {content}
          </button>
          <div id={`submenu-${item.key}`} hidden={!open}>
            <MenuLevel items={item.children} level={level + 1} onNavigate={onNavigate} />
          </div>
        </> : href.startsWith('/department/') ? <Link to={href}
          className="dtic-menu-link" aria-current={active ? 'page' : undefined}
          onClick={onNavigate}>{content}</Link> : <a href={href} className="dtic-menu-link"
          target={item.target} rel={item.target ? 'noopener noreferrer' : undefined}
          onClick={onNavigate}>{content}</a>}
      </li>
    })}
  </ul>
}

export default function DticSidebar({ onNavigate }) {
  return <nav className="dtic-navigation" aria-label="DTIC navigation">
    <MenuLevel items={menu} onNavigate={onNavigate} />
  </nav>
}

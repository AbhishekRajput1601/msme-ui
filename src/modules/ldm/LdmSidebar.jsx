import {NavLink} from 'react-router-dom'
import './ldm.css'
export default function LdmSidebar({onNavigate}){
  return <nav className="ldm-navigation" aria-label="Lead District Manager navigation"><ul className="nav" id="side-menu">
    {[['dashboard','Dashboard','dashboard'],['verification','Verification','check-square-o'],['batches','Batches','folder']].map(([path,label,icon])=><li key={path}><NavLink className="portal-menu-item" to={'/department/ldm/'+path} onClick={onNavigate}><i className={'fa fa-'+icon+' fa-fw'} aria-hidden="true"/> <span>{label}</span></NavLink></li>)}
  </ul></nav>
}

import {useState} from 'react'
import {Link,useLocation} from 'react-router-dom'
import {financialLink} from './financialService'
import '../dtic/dtic-sidebar.css'
import './financial-sidebar.css'
const assistance=[['Industrial Unit','dticfapendingapplicantsunit'],['Disbursement Calculator','faDisbursementUnit_new'],['Application for Infrastructure Development Permission','infradevelopmetList']]
const reports=[['District Wise Financial Assistance Report','districtWiseReport'],['Scheme Wise Financial Assistance Report','schemeWiseReport'],['Sanctioned Vs Disbursement Report','SanctionedVsDisbursement'],['District Wise MSME Detail Report','districtWiseMsmeDetailsReport']]
export default function FinancialSidebar({onNavigate}){
 const {pathname}=useLocation(),[open,setOpen]=useState({assistance:true,reports:true})
 const link=([label,path],report=false)=><Link className="dtic-menu-link" to={financialLink(path)} onClick={onNavigate} aria-current={pathname===financialLink(path)?'page':undefined}>{report&&<i className="fa fa-bar-chart-o fa-fw" aria-hidden="true"/>}{label}</Link>
 return <nav className="dtic-navigation financial-navigation" aria-label="Financial navigation"><ul className="nav" id="side-menu">
 <li>{link(['Dashboard','dashboard'],true)}</li><li>{link(['PowerBi Dashboard','powerBiDashbord'],true)}</li>
 {[["assistance","Financial Assistance",assistance],["reports","Report",reports]].map(([key,label,items])=><li key={key} className={open[key]?'active':undefined}><button className="dtic-menu-link" aria-expanded={open[key]} aria-controls={'financial-'+key} onClick={()=>setOpen({...open,[key]:!open[key]})}><i className={'fa fa-'+(key==='reports'?'dashboard':'bar-chart-o')+' fa-fw'} aria-hidden="true"/><span>{label}</span><span className="fa arrow"/></button><ul className="nav nav-second-level" id={'financial-'+key} hidden={!open[key]}>{items.map(item=><li key={item[1]}>{link(item)}</li>)}</ul></li>)}
 </ul></nav>
}

import {useEffect,useState} from 'react'
import DashboardPanel from '../../components/ui/DashboardPanel'
import {fetchDashboardCounts} from '../../services/shellService'
import toast from '../../utils/toast'

const metrics=[['totalApp','Total Applications',''],['totalSubmitDTIC','Applications Submitted','2'],['totalDALC','Sanction Order Released','9'],['totalDisbursLetter','Disbursement Letter Released','10']]
// Counter keys are defined by FAServiceImpl.getDashBorad; reuse the portal tile layout.
export default function FinancialDashboard(){
 const [result,setResult]=useState({loading:true}),[attempt,retry]=useState(0)
 useEffect(()=>{let active=true;fetchDashboardCounts().then(data=>{if(active)setResult({data})}).catch(error=>{if(active){setResult({error:error.message});toast.error(error.message||'Failed to load dashboard counts.')}});return()=>{active=false}},[attempt])
 return <div className="legacy-dashboard financial-dashboard"><h1 className="page-header">Dashboard</h1>{result.loading?<p role="status">Loading....</p>:result.error?<div className="alert alert-danger" role="alert">{result.error} <button className="btn btn-default" onClick={()=>{setResult({loading:true});retry(attempt+1)}}>Retry</button></div>:<div className="dashboard-panels">{metrics.map(([key,label,status])=><DashboardPanel key={key} label={label} value={result.data[key]??'—'} href={'/department/fa/detailList'+(status?'?status='+status:'')}/>)}</div>}</div>
}

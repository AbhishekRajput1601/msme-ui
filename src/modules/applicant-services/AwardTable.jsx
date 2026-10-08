import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getUnitData } from '../industrial-unit/industrialUnitService'
import IndustrialView from '../industrial-unit/IndustrialView'
import { applicantServiceLink } from './serviceLinks'

// Ordered exactly as applicantAwardList.html's fnCreatedRow branches.
export function awardAction(row) {
  const view={ label:'View', href:`viewMsmeAwardForm/${row.id}/${row.applicantId}` }
  if (row.alreadyApplied) return Number(row.applicantApplicationStatus) === 3 && !row.bookingClosed ? { label:'View/Edit', href:`editMsmeAward/${row.id}/${row.applicantId}` } : view
  if (row.active) return { label:'Apply', href:`applyMsmeAward/${row.id}` }
  if (row.commingSoon) return { label:'Coming Soon' }
  if (row.bookingClosed) return row.applicantId == null ? { label:'Application Closed' } : view
  return { label:'' }
}
export function awardStatus(status) {
  return status == null ? 'Not applied' : ({ 3:'Incomplete', 2:'Submitted', 5:'Winner' }[status] || '')
}
const columns=['financialYearString','awardDescription','startDate','endDate',null,null]
export default function AwardTable({ node, state }) {
  const [start,setStart]=useState(0), [length,setLength]=useState(10), [search,setSearch]=useState('')
  const [result,setResult]=useState({data:[],loading:true})
  useEffect(() => {
    const abort=new AbortController()
    setResult(previous => ({...previous,loading:true,error:''}))
    const params={ sEcho:1,iDisplayStart:start,iDisplayLength:length,sSearch:search,iColumns:6,iSortingCols:0 }
    columns.forEach((key,i) => { params['mDataProp_'+i]=key || ''; params['bSortable_'+i]=false; params['bSearchable_'+i]=true })
    getUnitData('fetchawards',params,abort.signal).then(data => {
      if (!Array.isArray(data.aaData)) throw new Error('The server returned an invalid award list.')
      if (!abort.signal.aborted) setResult({data:data.aaData,count:Number(data.iTotalDisplayRecords || 0),total:Number(data.iTotalRecords || 0)})
    }).catch(error => { if (!abort.signal.aborted) setResult({data:[],error:error.message}) })
    return () => abort.abort()
  },[start,length,search])
  const count=result.count || 0, pages=Math.ceil(count/length), page=Math.floor(start/length)
  return <div>
    {result.error && <div className="alert alert-danger" role="alert">{result.error}</div>}
    <div className="service-table-controls"><label>Show <select value={length} onChange={e => { setLength(Number(e.target.value)); setStart(0) }}>{[10,25,50,100].map(n => <option key={n}>{n}</option>)}</select> entries</label><label>Search: <input value={search} onChange={e => { setSearch(e.target.value); setStart(0) }} /></label></div>
    {result.loading && <div role="status">Processing...</div>}
    <table id="dynamic-table" className="table table-striped table-bordered table-hover" aria-busy={!!result.loading}>
      <IndustrialView nodes={node.children.filter(child => child.tag === 'thead')} state={state} />
      <tbody>{result.data.map((row,index) => {
        const action=awardAction(row)
        return <tr key={row.id ?? index}>{columns.slice(0,4).map(key => <td key={key}>{row[key]}</td>)}<td>{awardStatus(row.applicantApplicationStatus)}</td><td>{action.href ? <div className="action-buttons"><Link className="blue" to={applicantServiceLink(action.href)}>{action.label}</Link></div> : action.label}</td></tr>
      })}{!result.data.length && <tr><td colSpan="6">{search ? 'No matching records found' : 'No data available in table'}</td></tr>}</tbody>
    </table>
    <div className="service-table-controls"><span>Showing {count ? start+1 : 0} to {Math.min(start+length,count)} of {count} entries{result.total > count && ` (filtered from ${result.total} total entries)`}</span><div className="pagination">
      <button disabled={!start || result.loading} onClick={() => setStart(Math.max(0,start-length))}>Previous</button>
      {Array.from({length:Math.min(5,pages)},(_,i) => Math.max(0,Math.min(page-2,pages-5))+i).map(n => <button key={n} aria-current={page === n ? 'page' : undefined} onClick={() => setStart(n*length)}>{n+1}</button>)}
      <button disabled={start+length >= count || result.loading} onClick={() => setStart(start+length)}>Next</button>
    </div></div>
  </div>
}

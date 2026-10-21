import {useEffect,useState} from 'react'
import IndustrialView from '../industrial-unit/IndustrialView'
import {Cell} from '../dtic/DticTable'
import {escapeRow} from '../id/applicant/reference/LandReferenceTable'
import {financialRequest,financialDocument} from './financialService'
import {reportRows} from './generated/reportRows'
import reports from './generated/reports.json'
import {validateDateRange} from '../../utils/dateUtils'
import Spinner from '../../components/loaders/Spinner'
export function reportParameters(state){
 const f=state.reportForm||{}
 const params={noOfRows:10,startRecord:state.reportStart||0,maxRows:10,searchField:f.searchField||'',fromDate:f.entryDate1||'',toDate:f.entryDate2||'',districtId:state.params.districtId||f.districtId||'',appType:f.appType||'',reportType:f.reportType||'',status:state.params.status||'',schemeName:state.params.scheme||''}
 if(state.reportName?.includes('msme'))params.reportType=f.reportType||'MSME_DETAIL_REPORT'
 return params
}
export function exportReport(state){
 const params=reportParameters(state)
 const range=validateDateRange(params.fromDate,params.toDate)
 if(!range.valid){window.alert(range.error);return}
 window.open(financialDocument((state.reportConfig || reports[state.reportName]).export)+'?'+new URLSearchParams({...params,type:'excel',entryDate1:params.fromDate,entryDate2:params.toDate}),'_blank','noopener')
}
export default function FinancialReportTable({name,node,state}){
 const [result,setResult]=useState({loading:true,rows:[]})
 useEffect(()=>{
  const params=reportParameters(state)
  const range=validateDateRange(params.fromDate,params.toDate)
  if(!range.valid){setResult({loading:false,rows:[],error:range.error});return}
  const abort=new AbortController();setResult({loading:true,rows:[]})
  financialRequest('post',(state.reportConfig || reports[name]).endpoint,new URLSearchParams(params),abort.signal).then(data=>{
   if(!Array.isArray(data)||!Array.isArray(data[0]))throw new Error('The server returned an invalid report.')
   const rows=[]
   const table={insertRow(){const cells=[];rows.push(cells);return{insertCell(index){const cell={innerHTML:'',attrs:{},setAttribute(k,v){this.attrs[k]=v}};cells[index]=cell;return cell}}}}
   reportRows[name](table,escapeRow(data[0]),state.reportStart||0,state.params)
   if(!abort.signal.aborted)setResult({rows,count:Number(data[1])||data[0].length,length:data[0].length})
  }).catch(error=>{if(!abort.signal.aborted)setResult({rows:[],error:error.message})})
  return()=>abort.abort()
 },[name,state,state.listVersion,state.reportStart])
 const headings=node.children.find(n=>n.tag==='thead')
 return <div className="financial-report-table"><div className="table-responsive"><table className="table table-striped table-bordered table-hover">{headings&&<IndustrialView nodes={[{...headings,children:headings.children.filter(n=>n.tag!=='tbody')}]} state={state}/>}<tbody>
 {result.loading?<tr><td colSpan="30" style={{ textAlign: 'center' }}><Spinner /></td></tr>:result.error?<tr><td colSpan="30" role="alert">{result.error}</td></tr>:result.rows.map((row,i)=><tr key={i}>{row.map((cell,j)=><td key={j} colSpan={cell.attrs.colspan} style={{textAlign:cell.attrs.align}}><Cell markup={String(cell.innerHTML??'')} state={state} row={{}}/></td>)}</tr>)}
 </tbody></table></div><div className="dtic-table-controls"><button className="btn btn-default" disabled={!state.reportStart||result.loading} onClick={()=>{state.reportStart=Math.max(0,(state.reportStart||0)-10);state.notify()}}>Previous</button><span>{Math.floor((state.reportStart||0)/10)+1}</span><button className="btn btn-default" disabled={result.loading||result.length<10||(state.reportStart||0)+10>=result.count} onClick={()=>{state.reportStart=(state.reportStart||0)+10;state.notify()}}>Next</button></div></div>
}

import { useEffect, useMemo, useRef, useState } from 'react'
import { getTodayString, isPastDate } from '../../utils/dateUtils'
import toast from '../../utils/toast'

export default function DticAgenda({ state }) {
  const [remarks, setRemarks] = useState({}), [comment, setComment] = useState(null)
  const [letterNo, setLetterNo] = useState(''), [date, setDate] = useState(''), [meetingDate, setMeetingDate] = useState('')
  const [file, setFile] = useState(null)
  const [error, setError] = useState('')
  const today = useMemo(() => getTodayString(), [])
  const ref = useRef(null)
  useEffect(() => { ref.current?.focus() }, [])
  const rows = state.agendaRows || []
  function collect() {
    if (!rows.length) {
      toast.warning('No applications in the agenda.')
      setError('No applications in the agenda.')
      return null
    }
    if (rows.some(row => !remarks[row.applicationNo]?.trim())) {
      toast.warning('GM DTIC Remark is mandatory for every application.')
      setError('GM DTIC Remark is mandatory for every application.')
      return null
    }
    setError('')
    return rows.map(row => ({ applicationNo: row.applicationNo, eligibleAmount: row.totalEligibleAmount ?? 0, gmRemark: remarks[row.applicationNo] }))
  }
  async function forward() {
    const appData = collect()
    if (!appData) return
    if (!letterNo.trim()) {
      toast.warning('Please enter the Covering Letter Number.')
      setError('Please enter the Covering Letter Number.')
      return
    }
    if (date && isPastDate(date)) {
      toast.warning('Covering Letter Date cannot be in the past.')
      setError('Covering Letter Date cannot be in the past.')
      return
    }
    if (meetingDate && isPastDate(meetingDate)) {
      toast.warning('Meeting Date cannot be in the past.')
      setError('Meeting Date cannot be in the past.')
      return
    }
    if (!file || !file.size || !/\.pdf$/i.test(file.name)) {
      toast.warning('Please upload the common Covering Letter (PDF).')
      setError('Please upload the common Covering Letter (PDF).')
      return
    }
    const forwarded = await state.forwardBatch({ appData, letterNo, date, file, meetingDate })
    if (forwarded) toast.success('Batch forwarded successfully.')
  }
  return <div className="dtic-modal-backdrop"><section id="historyModal" className="dtic-modal" role="dialog" aria-modal="true" aria-label="Previous Application Data" tabIndex={-1} ref={ref}
    onKeyDown={e => { if (e.key === 'Escape') { if (comment) setComment(null); else state.closeAgenda() } }}>
    <div style={{ textAlign:'center', padding:'16px 24px', borderBottom:'1px solid #e2e8f0', background:'#f8fafc', borderTopLeftRadius:6, borderTopRightRadius:6 }}>
      <div style={{ fontWeight:700, fontSize:20, color:'#1e3a8a', marginBottom:6 }}>सूक्ष्म, लघु एवं मध्यम उद्यम विभाग, मध्य प्रदेश</div>
      <div style={{ display:'flex', justifyContent:'center', alignItems:'center', gap:8, fontSize:15, color:'#334155', marginBottom:6, flexWrap:'wrap' }}>
        <span style={{ fontWeight:600 }}>जिला उद्योग एवं व्यापार केंद्र:</span>
        <input readOnly value={rows[0]?.districtName || ''} aria-label="District" style={{ width:160, padding:'4px 10px', fontSize:14, fontWeight:600, border:'1px solid #cbd5e1', borderRadius:4, background:'#ffffff', color:'#0f172a', textAlign:'center' }} />
      </div>
      <div style={{ display:'flex', justifyContent:'center', alignItems:'center', gap:8, fontSize:15, color:'#334155', flexWrap:'wrap' }}>
        <span>जिला स्तरीय सहायता समिति बैठक दिनांक</span>
        <input type="date" aria-label="Meeting date" min={today} value={meetingDate} onChange={e => setMeetingDate(e.target.value)} style={{ width:160, padding:'4px 10px', fontSize:14, border:'1px solid #cbd5e1', borderRadius:4, background:'#ffffff', color:'#0f172a' }} />
        <span>में प्रस्तुत प्रकरण</span>
      </div>
    </div>
    <div className="modal-body">
      <div className="dtic-table-scroll"><table className="table table-bordered" style={{ minWidth:1250,fontSize:12 }}>
        <thead><tr>{['S.No','Application ID','Date of Application','Unit Organisation Name','Address','Date of Production','Udyam Registration','Investment in P&M and Building','Type of Assistance Applied','Applied Eligible Amount (Rs.) *','GM DTIC Remark *'].map(label => <th key={label}>{label}</th>)}</tr></thead>
        <tbody>{rows.map((row,index) => <tr key={row.applicationNo}>
          <td>{index+1}</td>{['applicationNo','applicationDate','unitName','address','productionDate','udyamRegNo'].map(key => <td key={key}>{row[key]}</td>)}
          <td>{row.faSchemeCapitalInvestmentBean?.length ? row.faSchemeCapitalInvestmentBean.map((item,i) => <div key={i} className="dtic-amount"><span>{item.investmentName}</span><strong>₹{item.amount || 0}</strong></div>) : '-'}</td>
          <td>{row.assistanceList?.length ? row.assistanceList.map((item,i) => <div className="dtic-amount" key={i}>
            {Number(item.eligibleAmount || 0) === 0 && item.remark?.trim() ? <button className="dtic-action-link" onClick={() => setComment(item)}>{item.assistanceType}</button> : <span>{item.assistanceType}</span>}<strong>₹{item.eligibleAmount ?? 0}</strong>
          </div>) : row.assistanceType}</td>
          <td style={{ textAlign:'right',fontWeight:700 }}>₹{row.totalEligibleAmount ?? 0}</td>
          <td><input className="form-control input-sm" maxLength={2000} aria-label={`GM DTIC remark ${row.applicationNo}`} placeholder="GM DTIC remark" value={remarks[row.applicationNo] || ''} onChange={e => setRemarks({ ...remarks,[row.applicationNo]:e.target.value })} /></td>
        </tr>)}</tbody>
      </table></div>
      <div style={{ marginTop:20, padding:'16px 20px', background:'#f8fafc', borderRadius:6, border:'1px solid #e2e8f0' }}>
        <h4 style={{ margin:'0 0 12px 0', fontSize:16, fontWeight:700, color:'#1e293b' }}>Covering Letter <small style={{ fontWeight:400, color:'#64748b' }}>(one common letter for the entire batch)</small></h4>
        <div style={{ display:'flex', gap:16, flexWrap:'wrap', alignItems:'flex-end' }}>
          <div style={{ flex:'1 1 220px', maxWidth:280 }}>
            <label htmlFor="cvLetterNo" style={{ display:'block', fontSize:13, fontWeight:600, color:'#334155', marginBottom:4 }}>Covering Letter No *</label>
            <input id="cvLetterNo" className="form-control" style={{ height:36, fontSize:13 }} value={letterNo} onChange={e => setLetterNo(e.target.value)} placeholder="Enter letter number" />
          </div>
          <div style={{ flex:'1 1 180px', maxWidth:220 }}>
            <label htmlFor="cvLetterDate" style={{ display:'block', fontSize:13, fontWeight:600, color:'#334155', marginBottom:4 }}>Covering Letter Date</label>
            <input id="cvLetterDate" type="date" min={today} className="form-control" style={{ height:36, fontSize:13 }} value={date} onChange={e => setDate(e.target.value)} />
          </div>
          <div style={{ flex:'1 1 240px', maxWidth:320 }}>
            <label htmlFor="cvLetterFile" style={{ display:'block', fontSize:13, fontWeight:600, color:'#334155', marginBottom:4 }}>Covering Letter File (PDF) *</label>
            <div style={{ display:'flex', alignItems:'center', height:36 }}>
              <input id="cvLetterFile" type="file" accept="application/pdf" style={{ fontSize:13, cursor:'pointer' }} onChange={e => setFile(e.target.files[0])} />
            </div>
          </div>
        </div>
        <p style={{ marginTop:10, marginBottom:0, fontSize:12, color:'#64748b' }}>All selected applications will be forwarded together as one batch and travel together until final approval.</p>
      </div>
    </div>
    <div className="modal-footer" style={{ borderTop:'1px solid #e2e8f0', padding:'12px 20px', display:'flex', justifyContent:'flex-end', gap:10, background:'#f8fafc', borderBottomLeftRadius:6, borderBottomRightRadius:6 }}>
      <button className="btn btn-success" disabled={state.saving} onClick={forward} style={{ padding:'7px 18px', fontWeight:600, fontSize:13, borderRadius:4 }}>Create Batch &amp; Forward</button>
      <button className="btn btn-default" onClick={() => { if (collect()) state.generateExcel('Unit') }} style={{ padding:'7px 18px', fontWeight:600, fontSize:13, borderRadius:4, border:'1px solid #cbd5e1', background:'#fff' }}>Download Meeting Agenda (Excel)</button>
      <button className="btn btn-danger" disabled={state.saving} onClick={state.closeAgenda} style={{ padding:'7px 18px', fontWeight:600, fontSize:13, borderRadius:4 }}>Cancel</button>
    </div>
    {comment && <div className="dtic-modal-backdrop"><section role="dialog" aria-modal="true" aria-label={comment.assistanceType} className="dtic-comment-modal"><div className="modal-header"><h4>{comment.assistanceType}</h4></div><div className="modal-body" style={{ whiteSpace:'pre-wrap' }}>{comment.remark}</div><div className="modal-footer"><button className="btn btn-danger" autoFocus onClick={() => setComment(null)}>Close</button></div></section></div>}
  </section></div>
}

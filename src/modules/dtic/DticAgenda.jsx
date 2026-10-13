import { useEffect, useRef, useState } from 'react'

export default function DticAgenda({ state }) {
  const [remarks, setRemarks] = useState({}), [comment, setComment] = useState(null)
  const [letterNo, setLetterNo] = useState(''), [date, setDate] = useState(''), [file, setFile] = useState(null)
  const [error, setError] = useState('')
  const ref = useRef(null)
  useEffect(() => { ref.current?.focus() }, [])
  const rows = state.agendaRows || []
  function collect() {
    if (!rows.length) { setError('No applications in the agenda.'); return null }
    if (rows.some(row => !remarks[row.applicationNo]?.trim())) { setError('GM DTIC Remark is mandatory for every application.'); return null }
    setError('')
    return rows.map(row => ({ applicationNo: row.applicationNo, eligibleAmount: row.totalEligibleAmount ?? 0, gmRemark: remarks[row.applicationNo] }))
  }
  async function forward() {
    const appData = collect()
    if (!appData) return
    if (!letterNo.trim()) { setError('Please enter the Covering Letter Number.'); return }
    if (!file) { setError('Please upload the common Covering Letter (PDF).'); return }
    await state.forwardBatch({ appData, letterNo, date, file })
  }
  return <div className="dtic-modal-backdrop"><section id="historyModal" className="dtic-modal" role="dialog" aria-modal="true" aria-label="Previous Application Data" tabIndex={-1} ref={ref}
    onKeyDown={e => { if (e.key === 'Escape') { if (comment) setComment(null); else state.closeAgenda() } }}>
    <div style={{ textAlign:'center' }}><div style={{ fontWeight:700,fontSize:20 }}>सूक्ष्म, लघु एवं मध्यम उद्यम विभाग, मध्य प्रदेश</div>
      <div>जिला उद्योग एवं व्यापार केंद्र ...... <input readOnly value={rows[0]?.districtName || ''} aria-label="District" /></div>
      <div>जिला स्तरीय सहायता समिति बैठक दिनांक <input type="date" aria-label="Meeting date" /> में प्रस्तुत प्रकरण</div>
    </div>
    <div className="modal-body">
      {(error || state.error) && <div className="alert alert-danger" role="alert">{error || state.error}</div>}
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
      <hr /><h4>Covering Letter <small>(one common letter for the entire batch)</small></h4>
      <div className="row">
        <div className="col-md-4"><label htmlFor="cvLetterNo">Covering Letter No *</label><input id="cvLetterNo" className="form-control" value={letterNo} onChange={e => setLetterNo(e.target.value)} placeholder="Covering Letter No" /></div>
        <div className="col-md-4"><label htmlFor="cvLetterDate">Covering Letter Date</label><input id="cvLetterDate" type="date" className="form-control" value={date} onChange={e => setDate(e.target.value)} /></div>
        <div className="col-md-4"><label htmlFor="cvLetterFile">Covering Letter File (PDF) *</label><input id="cvLetterFile" type="file" accept="application/pdf" className="form-control" onChange={e => setFile(e.target.files[0])} /></div>
      </div>
      <p style={{ marginTop:8,color:'#777' }}>All selected applications will be forwarded together as one batch and travel together until final approval.</p>
    </div>
    <div className="modal-footer"><button className="btn btn-success" disabled={state.saving} onClick={forward}>Create Batch &amp; Forward</button><button className="btn btn-default" onClick={() => { if (collect()) state.generateExcel('Unit') }}>Download Meeting Agenda (Excel)</button><button className="btn btn-danger" disabled={state.saving} onClick={state.closeAgenda}>Cancel</button></div>
    {comment && <div className="dtic-modal-backdrop"><section role="dialog" aria-modal="true" aria-label={comment.assistanceType} className="dtic-comment-modal"><div className="modal-header"><h4>{comment.assistanceType}</h4></div><div className="modal-body" style={{ whiteSpace:'pre-wrap' }}>{comment.remark}</div><div className="modal-footer"><button className="btn btn-danger" autoFocus onClick={() => setComment(null)}>Close</button></div></section></div>}
  </section></div>
}

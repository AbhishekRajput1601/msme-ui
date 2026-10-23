import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { get } from '../../api/httpClient'
import { jsonData } from '../../api/responseData'
import landTables from '../id/applicant/reference/generated/tables.json'
import { applicantDashboardAction, applicantDashboardData } from './applicantDashboardModel'

const paths = { land: '/applicant/land-allotment', assistance: '/applicant/financial-assistance' }
const text = value => typeof value === 'string' || typeof value === 'number' ? String(value) : '—'

export default function ApplicantOverview({ hindi }) {
  const [results, setResults] = useState({ land: { loading: true }, assistance: { loading: true } })
  const [attempt, setAttempt] = useState(0)
  const [tab, setTab] = useState('land')
  const label = (en, hi) => hindi ? hi : en
  useEffect(() => {
    const abort = new AbortController()
    setResults({ land: { loading: true }, assistance: { loading: true } })
    async function load(kind) {
      const config = landTables.applicationList
      const params = { sEcho: 1, iDisplayStart: 0, iDisplayLength: 5, sSearch: '', iColumns: kind === 'land' ? config.columns.length : 6, iSortingCols: 0 }
      if (kind === 'land') config.columns.forEach((column, i) => {
        params['mDataProp_' + i] = column ?? ''
        params['bSortable_' + i] = config.sortable[i]
        params['bSearchable_' + i] = true
      })
      try {
        const endpoint = kind === 'land' ? config.endpoint : 'fetchfaapplicants/Unit'
        const data = applicantDashboardData(jsonData(await get('/applicant/' + endpoint, params, { signal: abort.signal })))
        if (!abort.signal.aborted) setResults(previous => ({ ...previous, [kind]: data }))
      } catch {
        if (!abort.signal.aborted) setResults(previous => ({ ...previous, [kind]: { error: true } }))
      }
    }
    load('land')
    load('assistance')
    return () => abort.abort()
  }, [attempt])
  const loading = results.land.loading || results.assistance.loading
  const current = results[tab]
  const names = { land: label('Land allotment', 'भूमि आवंटन'), assistance: label('Financial assistance · Industrial units', 'वित्तीय सहायता · औद्योगिक इकाइयाँ') }
  const count = result => result.loading ? label('Loading…', 'लोड हो रहा है…') : result.total == null ? label('Unavailable', 'उपलब्ध नहीं') : result.total.toLocaleString(hindi ? 'hi-IN' : 'en-IN')

  return <>
    <section className="applicant-overview" aria-label={label('Application overview', 'आवेदन अवलोकन')}>
      <div className="applicant-overview__intro"><span className="applicant-dashboard__eyebrow">{label('YOUR APPLICATIONS', 'आपके आवेदन')}</span><h2>{label('Your business. Your progress.', 'आपका उद्योग। आपकी प्रगति।')}</h2><p>{label('Follow your applications and access the services you need, all in one place.', 'अपने आवेदन देखें और आवश्यक सेवाओं का उपयोग एक ही स्थान पर करें।')}</p><Link to="/applicant/land-allotment/new">{label('Apply for land', 'भूमि के लिए आवेदन करें')} <span aria-hidden="true">→</span></Link></div>
      {Object.entries(names).map(([kind, name]) => <Link className={`applicant-overview__metric applicant-overview__metric--${kind}`} key={kind} to={paths[kind]}><span>{name}</span><strong>{count(results[kind])}</strong><small>{label('View applications', 'आवेदन देखें')} <span aria-hidden="true">→</span></small></Link>)}
    </section>
    <section className="applicant-records" aria-labelledby="applicant-records-title">
      <div className="applicant-records__heading"><div><span className="applicant-dashboard__eyebrow">{label('APPLICATION TRACKER', 'आवेदन ट्रैकर')}</span><h2 id="applicant-records-title">{label('Keep track of your applications', 'अपने आवेदनों पर नज़र रखें')}</h2></div><button type="button" disabled={loading} onClick={() => setAttempt(n => n + 1)}>{loading ? label('Refreshing…', 'लोड हो रहा है…') : label('Refresh', 'रीफ़्रेश करें')}</button></div>
      <div className="applicant-records__tabs" aria-label={label('Application type', 'आवेदन प्रकार')}>{Object.entries(names).map(([kind, name]) => <button type="button" key={kind} aria-pressed={tab === kind} onClick={() => setTab(kind)}>{name}</button>)}</div>
      <div aria-busy={!!current.loading}>
        {current.loading ? <p className="applicant-records__message" role="status">{label('Loading your applications…', 'आपके आवेदन लोड हो रहे हैं…')}</p> : current.error ? <p className="applicant-records__message" role="alert">{label('Unable to load these applications. Use Refresh to try again.', 'आवेदन लोड नहीं हो सके। दोबारा प्रयास करने के लिए रीफ़्रेश करें।')}</p> : !current.rows?.length ? <p className="applicant-records__message">{label('No applications were returned for this service.', 'इस सेवा के लिए कोई आवेदन नहीं मिला।')}</p> : <div className="applicant-records__scroll"><table><thead><tr><th scope="col">{label('Application ID', 'आवेदन क्रमांक')}</th><th scope="col">{label('Application date', 'आवेदन तिथि')}</th><th scope="col">{tab === 'land' ? label('Industrial area / plot', 'औद्योगिक क्षेत्र / भूखंड') : label('Unit name', 'इकाई का नाम')}</th><th scope="col">{label('Status', 'स्थिति')}</th><th scope="col">{label('Action', 'कार्य')}</th></tr></thead><tbody>{current.rows.map((row, index) => { const action = applicantDashboardAction(tab, row); return <tr key={`${row.applicationId ?? row.applicantId ?? 'record'}-${index}`}><td>{text(row.applicationId)}</td><td>{text(tab === 'land' ? row.submittedOn : row.applicationDate)}</td><td>{tab === 'land' ? [text(row.vacantLandBean?.industrialAreaName), text(row.vacantLandBean?.plotNumber)].join(' / ') : text(row.unitOrInstName)}</td><td><span className="applicant-records__status">{text(row.status)}</span></td><td>{action ? <Link className="applicant-records__action" to={action.to} aria-label={`${action.resume ? label('Continue application', 'आवेदन जारी रखें') : label('View application', 'आवेदन देखें')} ${text(row.applicationId)}`}>{action.resume ? label('Continue', 'जारी रखें') : label('View', 'देखें')} <span aria-hidden="true">→</span></Link> : '—'}</td></tr> })}</tbody></table></div>}
      </div>
      <div className="applicant-records__footer"><span>{label('Preview of up to 5 records. Open the full list for actions and details.', 'अधिकतम 5 रिकॉर्ड का अवलोकन। कार्यों और विवरण के लिए पूरी सूची खोलें।')}</span><Link to={paths[tab]}>{label('View full list', 'पूरी सूची देखें')} <span aria-hidden="true">→</span></Link></div>
    </section>
  </>
}

import { useEffect, useState } from 'react'
import { get } from '../../../api/httpClient'
import { jsonData } from '../../../api/responseData'

export default function ProfileLocationSelect({ name, value, onChange, disabled, data, ...props }) {
  const permanent = name.startsWith('permanent')
  const stateId = data[permanent ? 'permanentStateId' : 'stateId']
  const districtId = data[permanent ? 'permanentDistrictId' : 'districtId']
  const kind = name.replace(/^permanent/, '').toLowerCase()
  const parent = kind === 'stateid' ? '' : kind === 'districtid' ? stateId : districtId
  const endpoint = { stateid: 'fetchallstates', districtid: 'fetchdistrictmapbystate', tehsilid: 'fetchdistricttehsilmapbydistrictid', blockid: 'fetchdistrictblockmapbydistrictid' }[kind]
  const [options, setOptions] = useState({})
  const [error, setError] = useState('')
  const [retry, setRetry] = useState(0)
  useEffect(() => {
    const abort = new AbortController()
    setOptions({}); setError('')
    if (kind !== 'stateid' && !parent) return () => abort.abort()
    const params = kind === 'stateid' ? {} : kind === 'districtid' ? { stateId: parent } : { districtId: parent }
    get(`/applicant/${endpoint}`, params, { signal: abort.signal })
      .then(jsonData).then(result => { if (!abort.signal.aborted) setOptions(result) })
      .catch(err => { if (!abort.signal.aborted) setError(err.message) })
    return () => abort.abort()
  }, [endpoint, kind, parent, retry])
  return <>
    <select {...props} name={name} value={value ?? ''} onChange={onChange} disabled={disabled || (kind !== 'stateid' && !parent)}>
      <option value="">Select</option>
      {value && !Object.hasOwn(options, value) && <option value={value}>{value}</option>}
      {Object.entries(options).map(([id, label]) => <option key={id} value={id}>{String(label)}</option>)}
    </select>
    {error && <span role="alert">Unable to load locations. <button type="button" className="btn btn-default btn-sm" onClick={() => setRetry(n => n + 1)}>Retry</button></span>}
  </>
}

import { useState } from 'react'
import fields from '../landFormFields.json'
import { amountTotal, isUndeveloped, normalizeApplication, withCalculatedFields } from '../landApplicationModel'
import { quoteUndevelopedLand } from '../services/landApplicationService'

const labels = {
  time: 'Time to implement the project (years)', waterReq: 'Water requirement',
  presentConnectedLoad: 'Present connected load (kW)', presentMaxDemand: 'Present maximum required load (kW)',
  expConnectedLoad: 'Expansion connected load (kW)', expMaxDemand: 'Expansion maximum required load (kW)',
  presentProposedYOI: 'Present proposed year of implementation', subsequentProposedYOI: 'Subsequent proposed year of implementation',
  dimensionsL: 'Length (metres)', dimensionsW: 'Width (metres)', area: 'Area (square metres)', cost: 'Approximate construction cost (lakhs of rupees)',
  isAlreadyLandAlloted: 'Has land or built-up space already been allotted?',
}
const leaf = field => field.name.split('.').at(-1)
const applicationFields = fields.filter(field => field.name.startsWith('selfEmploymentData.'))
const numberFields = new Set(['waterReq', 'presentConnectedLoad', 'presentMaxDemand', 'expConnectedLoad', 'expMaxDemand', 'dimensionsL', 'dimensionsW', 'area', 'cost', 'presentProposedYOI', 'subsequentProposedYOI'])

function Field({ field, value, onChange, readOnly, prefix = '' }) {
  const key = leaf(field)
  const label = labels[key] || field.label
  const id = `land-${prefix}-${key}`
  const locked = readOnly || field.readOnly
  const options = field.options || []
  const props = { id, name: prefix ? `${prefix}.${key}` : key, className: 'form-control', value: value ?? '',
    required: !locked && field.required, maxLength: field.maxLength,
    onChange: event => onChange(event.target.value), disabled: locked }
  return <div className="form-group">
    <label htmlFor={id}>{label}{props.required ? ' *' : ''}</label>
    {locked ? <input {...props} value={options.find(option => option.value === String(value))?.label || (value ?? '')} readOnly /> :
      (field.type === 'select' || field.type === 'radio') ? <select {...props} value={String(value ?? '')}>
        {!options.some(option => option.value === '') && <option value="">Select</option>}
        {options.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select> : field.type === 'textarea' ? <textarea {...props} rows={3} /> : <input {...props} type={numberFields.has(key) ? 'number' : field.type === 'email' ? 'email' : 'text'} min={numberFields.has(key) ? 0 : undefined} step={numberFields.has(key) ? 'any' : undefined} />}
  </div>
}

export default function LandApplicationForm({ initialData, onSave, readOnly = false }) {
  const [data, setData] = useState(() => normalizeApplication(initialData))
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [captchaVersion, setCaptchaVersion] = useState(0)
  const totals = withCalculatedFields(data)
  const calculated = readOnly ? { ...totals, ...data } : totals
  const change = (key, value) => setData(current => ({ ...current, [key]: key === 'isAlreadyLandAlloted' ? value === 'true' : value }))
  const rowChange = (name, index, key, value) => setData(current => ({ ...current, [name]: current[name].map((row, i) => i === index ? { ...row, [key]: value } : row) }))
  const remove = (name, index) => setData(current => ({ ...current, [name]: current[name].filter((_, i) => i !== index) }))
  const add = name => setData(current => ({ ...current, [name]: [...current[name], {}] }))
  const quote = async () => {
    setBusy(true); setError('')
    try {
      const rates = await quoteUndevelopedLand(data.vacantLandBean, data.totalPlotArea)
      setData(current => ({ ...current, ...rates }))
    } catch (err) { setError(err.message) }
    finally { setBusy(false) }
  }
  const submit = async event => {
    event.preventDefault()
    if (busy || readOnly) return
    setBusy(true); setError('')
    try { await onSave(calculated) }
    catch (err) { setError(err.message); change('captchaText', ''); setCaptchaVersion(version => version + 1) }
    finally { setBusy(false) }
  }
  const scalarFields = list => <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
    {list.map(field => <Field key={field.name} field={field} value={calculated[leaf(field)]} onChange={value => change(leaf(field), value)} readOnly={readOnly || busy} />)}
  </div>
  const rows = (name, title, prefix) => <fieldset className="border rounded p-4 mb-5">
    <legend>{title}</legend>
    {data[name].map((row, index) => <div key={index} className="border-b pb-3 mb-3">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4">
        {fields.filter(field => field.name.startsWith(`${prefix}.`)).map(field => <Field key={field.name} field={field} prefix={`${name}-${index}`} value={row[leaf(field)]} onChange={value => rowChange(name, index, leaf(field), value)} readOnly={readOnly || busy} />)}
      </div>
      {!readOnly && data[name].length > 1 && <button type="button" className="btn btn-default" disabled={busy} onClick={() => remove(name, index)}>Remove row {index + 1}</button>}
    </div>)}
    {!readOnly && <button type="button" className="btn btn-default" disabled={busy} onClick={() => add(name)}>Add row</button>}
  </fieldset>
  return <form onSubmit={submit} aria-busy={busy} className="land-application-form">
    {error && <div className="alert alert-danger" role="alert">{error}</div>}
    {isUndeveloped(data) && <fieldset className="border rounded p-4 mb-5"><legend>Undeveloped land area and charges</legend>
      <p>Available area: {data.vacantLandBean.totalPlotAreaun} square metres</p>
      <label htmlFor="requested-area">Requested area (square metres)</label>
      <input id="requested-area" className="form-control" type="number" min="0.01" step="0.01" max={data.vacantLandBean.totalPlotAreaun} required value={data.totalPlotArea ?? ''} disabled={busy || readOnly} onChange={event => setData(current => ({ ...current, totalPlotArea: event.target.value, quotedArea: null }))} />
      {!readOnly && <button className="btn btn-default my-3" type="button" disabled={busy} onClick={quote}>Calculate charges</button>}
      {(readOnly || data.quotedArea != null) && <dl>{[['applicationFee', 'Application fee'], ['premiumCharges', 'Premium'], ['developmentCharges', 'Development charges'], ['maintenanceCharges', 'Maintenance charges'], ['leaseRent', 'Lease rent'], ['securityDeposit', 'Security deposit'], ['advanceRent', 'Advance rent'], ['totalAmount', 'Total amount']].map(([key, label]) => <div key={key}><dt>{label} (rupees)</dt><dd>{data[key]}</dd></div>)}</dl>}
    </fieldset>}
    <details className="mb-5" open={readOnly}>
      <summary className="font-bold cursor-pointer">Applicant and address details</summary>
      <p>These details come from your registered profile.</p>
      {scalarFields(applicationFields.filter(field => field.readOnly && !['proposedVenture', 'time'].includes(leaf(field)) && !leaf(field).startsWith('total')))}
    </details>
    <fieldset className="border rounded p-4 mb-5"><legend>Nominee</legend>{scalarFields(applicationFields.filter(field => leaf(field).startsWith('nominee')))}</fieldset>
    {rows('itemsManufactured', 'Items to be manufactured', 'item')}
    {[
      ['idEmploymentBeans', 'Proposed employment (persons)'], ['investmentBeans', 'Proposed investment (rupees)'], ['financeBeans', 'Means of finance (rupees)'],
    ].map(([name, title]) => <fieldset key={name} className="border rounded p-4 mb-5"><legend>{title}</legend>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">{(data[name] || []).map((row, index) => <div className="form-group" key={index}>
        <label htmlFor={`${name}-${index}`}>{row.empName} *</label>
        <input id={`${name}-${index}`} name={`${name}.${index}.empNumber`} className="form-control" type="number" min="0" step={name === 'idEmploymentBeans' ? '1' : '0.01'} required value={row.empNumber ?? ''} disabled={readOnly || busy} onChange={event => rowChange(name, index, 'empNumber', event.target.value)} />
      </div>)}</div><p><strong>Total: {amountTotal(data[name]).toLocaleString('en-IN')}</strong></p>
    </fieldset>)}
    <fieldset className="border rounded p-4 mb-5"><legend>Project and utilities</legend>
      {scalarFields(applicationFields.filter(field => ['otherConstitution', 'ventureType', 'proposedVenture', 'time', 'waterReq', 'presentConnectedLoad', 'presentMaxDemand', 'expConnectedLoad', 'expMaxDemand', 'isAlreadyLandAlloted', 'detailOfAllotedLand'].includes(leaf(field)) && (leaf(field) !== 'otherConstitution' || data.constitution === 'Other') && (leaf(field) !== 'detailOfAllotedLand' || data.isAlreadyLandAlloted)))}
    </fieldset>
    {rows('landDetails', 'Land and construction requirements', 'landDetail')}
    <p>Total proposed area: {calculated.totalPresentAndSubsequentArea.toLocaleString('en-IN')} square metres</p>
    {!readOnly && !Number(data.applicantId) && <div className="form-group">
      <label htmlFor="land-captcha">Captcha *</label>
      <div className="flex items-center gap-3 mb-2"><img src={`/mpmsme/website/captcha?v=${captchaVersion}`} alt="Captcha verification code" /><button type="button" className="btn btn-default" disabled={busy} onClick={() => { change('captchaText', ''); setCaptchaVersion(version => version + 1) }}>Refresh captcha</button></div>
      <input id="land-captcha" name="captchaText" className="form-control" required autoComplete="off" value={data.captchaText || ''} disabled={busy} onChange={event => change('captchaText', event.target.value)} />
    </div>}
    {!readOnly && <button className="btn btn-primary" type="submit" disabled={busy}>{busy ? 'Saving…' : 'Save and continue to documents'}</button>}
  </form>
}

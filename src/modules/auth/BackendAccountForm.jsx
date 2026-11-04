import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from '../../hooks/useTranslation'
import { backendUrl } from '../public/publicRoutes'
import { toast } from '../../utils/toast'
import Spinner from '../../components/loaders/Spinner'

const actions = new Set(['/website/presignup', '/website/presignupauth', '/website/signup', '/website/resetpassword', '/website/login-through-mobile', '/website/login-through-mobileauth'])
const messages = (doc, selector) => [...new Set([...doc.querySelectorAll(selector)].filter(node => !node.hidden && node.style.display !== 'none').map(node => node.textContent.trim()).filter(Boolean))]
const signupLabels = {
  firstName: 'First name',
  middleName: 'Middle name',
  lastName: 'Last name',
  panNo: 'PAN number',
  emailId: 'Email address',
  mobileNumber: 'Mobile number',
  username: 'Username',
  password: 'Password',
  confirmPassword: 'Confirm password',
  captchaText: 'Security code',
}

export function parseAccountForm(html, url, fallbackAction) {
  const doc = new DOMParser().parseFromString(html, 'text/html')
  const errors = messages(doc, '.alert-danger, .text-danger, .with-errors')
  const success = messages(doc, '.alert-success, .text-success')
  const resultUrl = new URL(url)
  const cleanPath = resultUrl.pathname.replace(/^\/(backend|mpmsme)(?=\/)/, '')
  if (cleanPath === '/website/login' && !errors.length) {
    if (success.length || resultUrl.searchParams.has('signUp') || resultUrl.searchParams.has('resetPwd')) {
      return { complete: true, success: success.length ? success : [resultUrl.searchParams.has('signUp') ? 'Registration completed.' : 'Password reset completed. Check your registered contact details.'] }
    }
  }
  const form = doc.querySelector('form[name="signupform"], #signupForm, #loginform')
  if (!form) throw new Error(errors.join(' ') || 'The server did not return the requested form.')
  const action = new URL(form.getAttribute('action') || fallbackAction, url).pathname.replace(/^\/(backend|mpmsme)(?=\/)/, '')
  if (!actions.has(action)) throw new Error('The server returned an unsupported form action.')
  const fields = [...form.querySelectorAll('input[name], select[name], textarea[name]')].filter(node => !['submit', 'button', 'reset'].includes(node.type)).map((node, index) => ({
    id: `account-field-${index}`, name: node.name, type: node.tagName === 'SELECT' ? 'select' : node.tagName === 'TEXTAREA' ? 'textarea' : node.type,
    label: node.labels?.[0]?.textContent.trim() || node.placeholder || node.name.replace(/([A-Z])/g, ' $1'),
    value: node.type === 'password' || node.name === 'captchaText' ? '' : node.value,
    required: node.required, readOnly: node.readOnly, maxLength: node.maxLength > 0 ? node.maxLength : undefined,
    options: node.tagName === 'SELECT' ? [...node.options].map(option => ({ value: option.value, label: option.textContent, disabled: option.disabled })) : undefined,
  }))
  for (const token of doc.querySelectorAll('input[type="hidden"][name="csrfPreventionSalt"], input[type="hidden"][name="_csrf"]')) {
    if (!fields.some(field => field.name === token.name)) fields.push({ id: token.name, name: token.name, type: 'hidden', value: token.value })
  }
  if (!fields.some(field => field.type !== 'hidden')) throw new Error('The server returned an empty form.')
  return { action, fields, errors, success, captcha: !!form.querySelector('img[src*="captcha"]'), submitLabel: form.querySelector('input[type="submit"]')?.value || form.querySelector('button[type="submit"]')?.textContent.trim() || 'Continue' }
}

export default function BackendAccountForm({ entry, fallbackAction, title, variant = 'default' }) {
  const { locale } = useTranslation()
  const [form, setForm] = useState(null)
  const [values, setValues] = useState({})
  const [busy, setBusy] = useState(true)
  const [error, setError] = useState(null)
  const [attempt, setAttempt] = useState(0)
  const [captchaVersion, setCaptchaVersion] = useState(0)
  const request = useRef(null)
  const notice = useRef(null)
  const update = next => {
    setForm(next)
    setValues(Object.fromEntries((next.fields || []).map(field => [field.name, field.value])))
    setCaptchaVersion(version => version + 1)
    if (next.errors?.length) {
      next.errors.forEach(err => toast.error(err))
    }
    if (next.success?.length) {
      next.success.forEach(msg => toast.success(msg))
    }
  }
  useEffect(() => {
    const controller = new AbortController()
    request.current = controller
    setBusy(true); setError(null); setForm(null)
    fetch(`${backendUrl(entry)}?language=${locale === 'hi' ? 'hi_IN' : 'en_US'}`, { credentials: 'include', signal: controller.signal })
      .then(async response => {
        if (!response.ok) throw new Error(`The form could not be loaded (${response.status}).`)
        return parseAccountForm(await response.text(), response.url, fallbackAction)
      })
      .then(next => { if (!controller.signal.aborted) update(next) })
      .catch(err => {
        if (!controller.signal.aborted) {
          setError(err.message)
          toast.error(err.message)
        }
      })
      .finally(() => { if (!controller.signal.aborted) setBusy(false) })
    return () => { controller.abort(); request.current?.abort() }
  }, [entry, fallbackAction, locale, attempt])

  const submit = async event => {
    event.preventDefault()
    if (busy) return
    const controller = new AbortController()
    request.current = controller
    setBusy(true); setError(null)
    try {
      const fields = { ...values }
      if (event.nativeEvent.submitter?.value === 'send-otp') fields.otp = ''
      const response = await fetch(backendUrl(form.action), {
        method: 'POST', credentials: 'include', signal: controller.signal,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'text/html' },
        body: new URLSearchParams(fields),
      })
      if (!response.ok) throw new Error(`The request failed (${response.status}). Please try again.`)
      const next = parseAccountForm(await response.text(), response.url, form.action)
      if (!controller.signal.aborted) { update(next); notice.current?.focus() }
    } catch (err) {
      if (!controller.signal.aborted) {
        const msg = err.message || 'The request could not be completed.'
        setError(msg)
        toast.error(msg)
      }
    } finally { if (!controller.signal.aborted) setBusy(false) }
  }

  const isSignup = variant === 'signup'
  return <section className={`container account-form-page${isSignup ? ' signup-form-page' : ''}`} aria-busy={busy}>
    <div className="account-form-heading">
      <span className="account-form-icon" aria-hidden="true"><i className="fa fa-user-plus" /></span>
      <div>
        <h1>{title}</h1>
        {isSignup && <p>Register to access MPMSME online services and applications.</p>}
      </div>
    </div>
    <div ref={notice} tabIndex={-1}>
    </div>
    {error && <div className="account-form-error" role="alert">{error}</div>}
    {busy && <Spinner />}
    {!form && !busy && <button type="button" onClick={() => setAttempt(value => value + 1)}>Retry</button>}
    {form?.fields && <form className={isSignup ? 'signup-form' : ''} onSubmit={submit}>
      <fieldset disabled={busy}>
        {form.fields.map(field => {
          const props = { id: field.id, name: field.name, value: values[field.name] ?? '', onChange: event => setValues(previous => ({ ...previous, [field.name]: event.target.value })), required: field.required, readOnly: field.readOnly, maxLength: field.maxLength, className: 'form-control' }
          if (field.type === 'hidden' && field.name !== 'loginType') return <input key={field.id} type="hidden" name={field.name} value={values[field.name] || ''} />
          const label = isSignup ? signupLabels[field.name] || field.label : field.name === 'loginType' ? 'Account type' : field.label
          return <div className={`form-group${isSignup ? ` signup-field signup-field-${field.name}` : ''}`} key={field.id}>
            <label htmlFor={field.id}>{label}{field.required && <span className="required-mark" aria-hidden="true"> *</span>}</label>
            {field.name === 'loginType' ? <select {...props}><option value="APPLICANT">Applicant</option><option value="DEPARTMENT">Department</option></select> : field.type === 'select' ? <select {...props}>{field.options.map(option => <option key={option.value} value={option.value} disabled={option.disabled}>{option.label}</option>)}</select> : field.type === 'textarea' ? <textarea {...props} /> : <input {...props} type={field.type} autoComplete={field.type === 'password' ? 'new-password' : undefined} />}
          </div>
        })}
        {form.captcha && <div className={`form-group signup-captcha${isSignup ? ' signup-field' : ''}`}><div className="captcha-preview"><img src={`${backendUrl('/website/captcha')}?refresh=${captchaVersion}`} alt="Verification code" /><button type="button" onClick={() => { setCaptchaVersion(value => value + 1); setValues(previous => ({ ...previous, captchaText: '' })) }} aria-label="Refresh verification code"><i className="fa fa-refresh" aria-hidden="true" /></button></div></div>}
        <div className="account-form-actions">
          {form.action === '/website/resetpassword' && <button className="btn btn-secondary mr-2" type="submit" value="send-otp">Send OTP</button>}
          <button className="btn btn-primary" type="submit">{isSignup ? 'Create account' : form.submitLabel}</button>
        </div>
      </fieldset>
    </form>}
    <p><Link to="/login">Return to login</Link></p>
  </section>
}

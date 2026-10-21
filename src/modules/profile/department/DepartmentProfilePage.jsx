import { useEffect, useReducer, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from '../../../hooks/useTranslation'
import IndustrialView from '../../industrial-unit/IndustrialView'
import { createDepartmentProfileState, passwordStrength } from './departmentProfileModel'
import views from './generated/views.json'
import translations from './generated/translations.json'
import { expressions } from './generated/expressions'
import Spinner from '../../../components/loaders/Spinner'
import './generated/reference.css'
import './department-profile.css'

export default function DepartmentProfilePage({ password = false, request, dashboard }) {
  const { locale } = useTranslation()
  return <AccountContent key={`${password}-${locale}`} password={password} locale={locale} request={request} dashboard={dashboard} />
}

function AccountContent({ password, locale, request, dashboard }) {
  const navigate = useNavigate(), [, render] = useReducer(n => n + 1, 0), [state, setState] = useState(null)
  useEffect(() => {
    const abort = new AbortController()
    const sidebar = document.getElementById('sideNav'), originalDisplay = sidebar?.style.display || ''
    const model = createDepartmentProfileState({ navigate, locale, request, dashboard, signal: abort.signal, notify: () => { if (!abort.signal.aborted) render() }, onExpiry: expired => { if (sidebar) sidebar.style.display = expired ? 'none' : originalDisplay } })
    Object.assign(model, { expressionBundle: expressions, viewBundle: views, translations })
    model.prepareElement = (attrs, node) => {
      if (node.children?.some(child => child.model === 'sameAsAbovecheck')) {
        attrs.className += ' department-permanent-heading'
      }
      if (password && node.tag === 'div') {
        if (node.children?.some(child => child.tag === 'h3')) attrs.className += ' department-password-guidance'
        else if (attrs.className === 'col-md-6') attrs.className += attrs.align === 'center' ? ' department-password-actions' : ' department-password-fields'
        if (attrs.className === 'col-md-12' && node.children?.some(child => child.attrs?.class?.[0] === 'col-md-6')) attrs.className += ' department-password-layout'
      }
      if (node.tag === 'input' || node.tag === 'select') {
        attrs.id ||= attrs.name
        attrs['aria-label'] = attrs.name
        if (/\bdigits-only\b/.test(attrs.className || '')) attrs.inputMode = 'numeric'
      }
      if (node.tag === 'button' && attrs.type === 'button' && !password) attrs.disabled = !model.loaded || model.saving
      if (node.tag === 'form') attrs['aria-busy'] = model.loading || model.saving
      if (attrs.className === 'password-toggle') {
        const action = expressions[node.click]?.toString().match(/toggle(Current|New|Confirm)Password/)?.[1]
        attrs['aria-label'] = `Show or hide ${action?.toLowerCase()} password`
        attrs['aria-pressed'] = !!model[`show${action}Password`]
        attrs.onMouseDown = event => event.preventDefault()
      }
      if (attrs.name === 'otp') attrs.required = model.otpGenerated
      // Generate OTP is its own action; avoid also firing the password update.
      if (node.click != null && expressions[node.click]?.toString().includes('changePasswordFunction1')) attrs.type = 'button'
    }
    model.renderNode = node => {
      // The page owns one accessible error banner; suppress the template's
      // duplicate of the same request error.
      if (node.if != null && expressions[node.if]?.toString().includes('responseObject.errorMessage')) return null
      if (node.attrs?.id?.[0] !== 'strength') return undefined
      const strength = passwordStrength(model.changePasswordData.password)
      return <ul id="strength" aria-label="Password strength">{Array.from({ length: 5 }, (_, index) => <li className="point" key={index} style={{ background: index < strength.count ? strength.color : '#DDD' }} />)}</ul>
    }
    setState(model)
    return () => { abort.abort(); if (sidebar) sidebar.style.display = originalDisplay }
  }, [locale, navigate, password, request, dashboard])
  if (!state) return null
  const error = state.responseObject.errorMessage || state.error
  const retry = async () => {
    try {
      await state.loadUserDetails()
      await state.loadGender()
      if (state.signupData.designationCode != null) await state.loadDesignation()
    } catch (failure) { state.error = failure.message; render() }
  }
  return <div className={`department-profile-page${password ? ' department-password-page' : ''}`}>
    {state.loading && <Spinner />}
    {error && <div className="department-profile-error" role="alert">
      <div><strong>{locale === 'hi' ? 'त्रुटि' : 'Unable to complete the request'}</strong><p>{error}</p></div>
      {!password && state.disabled && !state.saving && <button type="button" className="btn btn-default" disabled={state.loading} onClick={retry}>{locale === 'hi' ? 'पुनः प्रयास करें' : 'Retry'}</button>}
    </div>}
    <IndustrialView name={password ? 'changepassword' : 'updateprofile'} state={state} />
  </div>
}

import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { fetchLandPage } from '../services/landApplicationService'
import { landReferenceLink, landDownloadLink } from './landReferenceLinks'
import './land-reference.css'

const tags = new Set('div section p span strong b em i u br hr ul ol li h1 h2 h3 h4 h5 h6 a img table thead tbody tfoot tr th td label form input textarea select option button small fieldset legend'.split(' '))
const propsMap = { class:'className',for:'htmlFor',colspan:'colSpan',rowspan:'rowSpan',readonly:'readOnly',maxlength:'maxLength',tabindex:'tabIndex',autocomplete:'autoComplete' }
const bools = new Set(['disabled','required','readOnly','hidden','multiple'])
const allowed = new Set('id class name type value href src title alt width height colspan rowspan for readonly required disabled hidden multiple maxlength rows cols style align target method action placeholder autocomplete min max step checked selected'.split(' '))
const paymentActions = new Set(['submitAnnualPayment','submitAppealPayment','submitLOCPayment','submitOnlinePayment'])

/** Render server-resolved Thymeleaf values with React. No legacy scripts run. */
export default function ResolvedLandPage({ path, identity, amountField, back }) {
  const navigate=useNavigate(), submitted=useRef(false)
  const [result,setResult]=useState({loading:true})
  const [captcha,setCaptcha]=useState(()=>String(Math.floor(Math.random()*1000000)).padStart(6,'0'))
  const [captchaResult,setCaptchaResult]=useState('')
  const [verified,setVerified]=useState(false)
  const [commentsError,setCommentsError]=useState(false)
  useEffect(()=>{
    const abort=new AbortController()
    fetchLandPage(path,abort.signal).then(doc=>{
      doc.querySelectorAll('script,style,head').forEach(el=>el.remove())
      const region=doc.querySelector('#page-wrapper') || doc.body
      if(region.textContent.includes('{{') || !region.querySelector('.panel, table, form')) throw new Error('The server did not return complete page details.')
      if(identity) {
        const form=[...region.querySelectorAll('form')].find(el=>paymentActions.has((el.getAttribute('action') || '').split('/').at(-1)))
        if(!form || form.querySelector(`[name="${identity[0]}"]`)?.value!==String(identity[1]))throw new Error('The payment review does not match the selected record.')
        if(amountField) {
          const amount=form.querySelector(`[name="${amountField}"]`)?.value
          if(!amount || !Number.isFinite(Number(amount)) || Number(amount)<=0)throw new Error('The server did not return a valid payment amount.')
        }
      }
      if(!abort.signal.aborted)setResult({region})
    }).catch(error=>{if(!abort.signal.aborted)setResult({error:error.message})})
    return()=>abort.abort()
  },[path,identity?.[0],identity?.[1],amountField])
  const render=(node,key)=>{
    if(node.nodeType===3)return node.textContent
    if(node.nodeType!==1)return null
    const tag=node.tagName.toLowerCase()==='body'?'div':node.tagName.toLowerCase()
    if(!tags.has(tag))return null
    const props={key}
    for(const attr of node.attributes) {
      if(!allowed.has(attr.name) || ['value','checked','selected','style','href','src','action'].includes(attr.name))continue
      const name=propsMap[attr.name] || attr.name
      props[name]=bools.has(name)?true:attr.value
    }
    if(node.style.length)props.style=Object.fromEntries([...node.style].filter(name=>!/(url|expression)\(/i.test(node.style.getPropertyValue(name))).map(name=>[name.replace(/-([a-z])/g,(_,c)=>c.toUpperCase()),node.style.getPropertyValue(name)]))
    if(props.id==='page-wrapper')props.id='land-resolved-content'
    let children=[...node.childNodes].map(render)
    if(tag==='a') {
      let href=node.getAttribute('href') || ''
      if(node.dataset.documentType && node.dataset.applicantId)href='/mpmsme/applicant/downloadIdDocument/'+encodeURIComponent(node.dataset.documentType)+'/'+encodeURIComponent(node.dataset.applicantId)
      if(href.startsWith('#'))return <Link key={key} {...Object.fromEntries(Object.entries(props).filter(([k])=>k!=='key'))} to={landReferenceLink(href)}>{children}</Link>
      if(href.startsWith('javascript:'))href=landDownloadLink(href) || ''
      if(href && !/^(javascript:|data:)/i.test(href))props.href=/^(https?:|\/)/.test(href)?href:'/mpmsme/applicant/'+href
      props.rel='noopener noreferrer'
      if(/history.back|doTheBack/.test((node.getAttribute('onclick') || '')+(node.getAttribute('data-ng-click') || '')))props.onClick=e=>{e.preventDefault();navigate(-1)}
    }
    if(tag==='img') {
      const src=node.getAttribute('src') || ''
      if(!/^(javascript:|data:)/i.test(src))props.src=src.startsWith('/')?src:'/mpmsme/applicant/'+src
      if(/print/.test(node.getAttribute('onclick') || ''))props.onClick=()=>window.print()
    }
    if(tag==='input') {props.defaultValue=node.value; if(['radio','checkbox'].includes(node.type))props.defaultChecked=node.checked}
    if(tag==='textarea') {props.defaultValue=node.value; children=undefined}
    if(tag==='form') {
      const action=(node.getAttribute('action') || '').split('/').at(-1)
      props.action=paymentActions.has(action)?'/backend/applicant/id/'+action:undefined
      props.onSubmit=e=>{
        if(!props.action || submitted.current){e.preventDefault();return}
        if(action==='submitOnlinePayment') {
          if(result.region.querySelector('#captcha-container') && !verified){e.preventDefault();return}
          if(!e.currentTarget.elements.comments?.value?.trim()){setCommentsError(true);e.preventDefault();return}
        }
        if(!window.confirm(action==='submitOnlinePayment'?'Do you want to submit?':'Do you want to proceed?')){e.preventDefault();return}
        submitted.current=true
      }
    }
    if(props.id==='captcha-container')children=captcha
    if(props.id==='commentsError')props.style={...props.style,display:commentsError?'block':'none'}
    if(props.id==='result'){children=captchaResult;props.style={...props.style,color:verified?'green':'red'}}
    if(props.id==='submitButton')props.disabled=!verified
    if(tag==='button') {
      const action=node.getAttribute('onclick') || ''
      if(action.includes('validateCaptcha'))props.onClick=()=>{
        const match=document.querySelector('#captcha-input')?.value===captcha
        setVerified(match);setCaptchaResult(match?'CAPTCHA is correct!':'CAPTCHA is incorrect. Please Enter again.')
      }
      if(action.includes('displayCaptcha'))props.onClick=()=>{setCaptcha(String(Math.floor(Math.random()*1000000)).padStart(6,'0'));setVerified(false);setCaptchaResult('')}
      if(node.getAttribute('data-ng-click')==='submitForm1()')props.onClick=()=>navigate(back || '/applicant/land-allotment')
    }
    return React.createElement(tag,props,['input','img','br','hr'].includes(tag)?undefined:children)
  }
  return <div className="land-reference-page" data-view="resolved">{result.loading?<p role="status">Loading....</p>:result.error?<p className="alert alert-danger" role="alert">{result.error}</p>:render(result.region,0)}</div>
}

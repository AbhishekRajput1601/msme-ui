import React, { useEffect, useRef } from 'react'
import { expressions } from './generated/expressions'
import views from './generated/views'
import translations from './generated/translations.json'
import { backendPath, faPath, filter, writePath } from './viewHelpers'
import toast from '../../utils/toast'

const names = { enctype: 'encType', class: 'className', for: 'htmlFor', readonly: 'readOnly', maxlength: 'maxLength', minlength: 'minLength', colspan: 'colSpan', rowspan: 'rowSpan', tabindex: 'tabIndex', autocomplete: 'autoComplete', novalidate: 'noValidate', cellpadding: 'cellPadding', cellspacing: 'cellSpacing', 'accept-charset': 'acceptCharset' }
const booleans = new Set(['disabled','required','checked','readOnly','multiple','hidden','noValidate'])
const evaluate = (id, s) => {
  if (id == null) return undefined
  try { return (s.expressionBundle || expressions)[id](s) } catch (error) { if (error instanceof TypeError) return undefined; throw error }
}
const interpolate = (parts, s) => {
  const text = parts?.map(part => typeof part === 'number' ? evaluate(part, s) ?? '' : part).join('') || ''
  return text.replace(/\bEnrolment\b/g, 'Enrollment')
}
const css = value => Object.fromEntries(String(value).split(';').filter(v => v.includes(':')).map(v => { const at = v.indexOf(':'); return [v.slice(0, at).trim().replace(/-([a-z])/g, (_,c) => c.toUpperCase()), v.slice(at + 1).trim().replace(/\s*!important$/, '')] }))

function run(id, s, root) {
  try { const result = (root.expressionBundle || expressions)[id]?.(s); Promise.resolve(result).catch(error => { root.error = error.message; root.notify() }) }
  catch (error) { root.error = error.message }
  root.notify()
}

function validation(form, root, submitted = true) {
  const previous = root[form.name || 'form']
  const state = { ...previous, $submitted: submitted || root[form.name || 'form']?.$submitted || false, $valid: true, $invalid: false, $error: {} }
  for (const el of form.elements) {
    if (el.disabled || !el.willValidate) continue
    const error = { required: el.validity.valueMissing, pattern: el.validity.patternMismatch, min: el.validity.rangeUnderflow, max: el.validity.rangeOverflow, number: el.validity.badInput, email: el.validity.typeMismatch, maxlength: el.validity.tooLong, minlength: el.validity.tooShort }
    state[el.name] = { $error: error, $invalid: !el.validity.valid, $valid: el.validity.valid, $touched: root.trackTouched ? !!previous?.[el.name]?.$touched : true }
    if (!el.validity.valid) state.$valid = false
  }
  state.$invalid = !state.$valid
  state.$setUntouched = () => { for (const field of Object.values(state)) if (field && typeof field === 'object' && '$touched' in field) field.$touched = false }
  state.$setPristine = () => { state.$submitted = false; state.$pristine = true; state.$dirty = false }
  root[form.name || 'form'] = state
  return state
}

export function isBackControl(node) {
  return ['a', 'button'].includes(node.tag) && Boolean(
    node.children?.some(c => c.translation === 'application.page.back' || c.text?.includes('Back')) ||
    node.children?.some(c => c.children?.some(cc => cc.translation === 'application.page.back' || cc.text?.includes('Back')))
  )
}

function ViewNode({ node, scope: s, root, repeated = false }) {
  const formRef = useRef(null)
  const initializedRef = useRef(null)
  const repeatScopes = useRef(new Map())
  const conditionMet = node.if == null || !!evaluate(node.if, s)
  useEffect(() => {
    if (!(node.repeat && !repeated) && conditionMet && node.init != null && (root.initializePerInstance ? initializedRef.current !== root : !root.initialized.has(node))) {
      initializedRef.current = root
      root.initialized.add(node)
      run(node.init, s, root)
    }
  }, [node, root, s, conditionMet, repeated])
  useEffect(() => {
    if (formRef.current) { validation(formRef.current,root,false); root.notify() }
  }, [node,root])
  if (node.text) {
    const text = interpolate(node.text, s)
    if (text.trim() === 'Please click on Print Image for Printing of this Form.') {
      return root.locale === 'hi' ? 'केवल आवेदन पत्र प्रिंट करें या PDF के रूप में सहेजें।' : 'Print or save a PDF of the application form only.'
    }
    return text
  }
  if (root.renderNode) {
    const rendered = root.renderNode(node, s)
    if (rendered !== undefined) return rendered
  }
  if (node.tag === 'table' && node.attrs?.id?.[0] === 'dynamic-table' && root.renderTable) return root.renderTable(node)
  if (node.fragment) return <ViewNodes nodes={(root.viewBundle || views)[node.fragment]} scope={s} root={root} />
  if (node.repeat && !repeated) {
    const items = evaluate(node.repeat.items, s) || []
    return Object.entries(items).map(([key, value], index) => {
      const identity = value && typeof value === 'object' ? value : key
      let child = root.stableRepeatScopes && repeatScopes.current.get(identity)
      if (!child) {
        child = Object.create(s)
        if (root.stableRepeatScopes) { child.$$viewKey = repeatScopes.current.size; repeatScopes.current.set(identity, child) }
      }
      Object.setPrototypeOf(child, s)
      child.$parent = s
      const [first, second] = node.repeat.names
      child[first] = second ? key : value
      if (second) child[second] = value
      Object.assign(child, { $index: index, $first: index === 0, $last: index === Object.keys(items).length - 1, $even: index % 2 === 0, $odd: index % 2 !== 0 })
      for (const alias of node.indexAliases || []) child[alias] = index
      return <ViewNode key={root.stableRepeatScopes ? child.$$viewKey : key} node={node} scope={child} root={root} repeated />
    })
  }
  if (node.if != null && !evaluate(node.if, s)) return null
  const attrs = Object.fromEntries(Object.entries(node.attrs || {}).map(([key,value]) => [names[key] || key, interpolate(value, s)]))
  for (const key of booleans) if (key in attrs) attrs[key] = true
  for (const key of ['disabled','required','checked','value']) if (node[key] != null) attrs[key] = evaluate(node[key], s) ?? (key === 'value' ? '' : false)
  if ('style' in attrs) attrs.style = css(attrs.style)
  if ((node.show != null && !evaluate(node.show, s)) || (node.hide != null && evaluate(node.hide, s))) attrs.style = { ...attrs.style, display: 'none' }
  if (node.class != null) {
    const value = evaluate(node.class, s)
    attrs.className = (attrs.className || '') + ' ' + (typeof value === 'object' ? Object.entries(value || {}).filter(([,v]) => v).map(([k]) => k).join(' ') : value || '')
  }
  if (attrs.type === 'file') {
    const cleaned = (attrs.className || '')
      .split(/\s+/)
      .filter(c => !['btn', 'btn-primary', 'btn-xs', 'btn-sm', 'btn-default', 'btn-success', 'form-control-file', 'w100'].includes(c))
      .join(' ')
      .trim()
    attrs.className = (cleaned ? cleaned + ' ' : '') + 'form-file-input'
  }
  // The surrounding React layout already supplies page-wrapper and its margins.
  if (attrs.id === 'page-wrapper') attrs.id = 'industrial-unit-content'
  const tab = attrs.id?.match(/^step([1-4])$/)
  if (tab) {
    attrs.className = (attrs.className || '').replace(/\bactive\b/g, '') + (root.step === +tab[1] ? ' active' : '')
    attrs.style = { ...attrs.style, display: root.step === +tab[1] ? 'block' : 'none' }
    delete attrs.hidden
  }
  if (attrs.href?.startsWith('#')) attrs.href = (root.resolveLink || faPath)(attrs.href)
  else if (attrs.href && !/^(https?:|\/|\.|javascript:)/.test(attrs.href)) attrs.href = (root.documentPath || backendPath)(attrs.href)
  if (attrs.href?.startsWith('javascript:')) attrs.href = '#'
  if (attrs.src?.startsWith('../')) attrs.src = '/legacy/' + attrs.src.slice(3)
  if (attrs.src?.startsWith('/mpmsme/image/')) attrs.src = '/image/' + attrs.src.slice('/mpmsme/image/'.length)
  if (attrs.src?.startsWith('/mpmsme/img/')) attrs.src = '/img/' + attrs.src.slice('/mpmsme/img/'.length)
  const isBack = isBackControl(node)

  if (isBack) {
    attrs.onClick = e => {
      e.preventDefault()
      if (typeof root.goBack === 'function') {
        root.goBack()
      } else if (typeof window !== 'undefined' && window.history) {
        window.history.back()
      }
    }
  } else if (node.click != null) {
    attrs.onClick = e => {
      if (node.tag === 'a') e.preventDefault()
      if (e.currentTarget.type === 'submit' && e.currentTarget.form) validation(e.currentTarget.form,root)
      run(node.click, s, root)
    }
  } else if (node.tag === 'a' && attrs.href && !attrs.href.startsWith('http') && !attrs.href.startsWith('#')) {
    attrs.onClick = e => {
      e.preventDefault()
      if (typeof root.navigate === 'function') {
        root.navigate(attrs.href)
      } else {
        window.location.href = attrs.href
      }
    }
  }
  if (node.blur != null) attrs.onBlur = () => run(node.blur, s, root)
  if (node.inline_click) attrs.onClick = e => {
    e.preventDefault()
    if (/print/.test(node.inline_click)) (root.print || (() => window.print()))()
    else if (root.inlineAction) root.inlineAction(node.inline_click)
    else if (/history.back/.test(node.inline_click)) (root.goBack || root.goBackToBatch)()
    else { const id = node.inline_click.match(/#([\w]+)/)?.[1]; if (id) document.getElementById(id)?.click() }
  }
  if (attrs['data-toggle'] === 'tab') {
    const target = Number(attrs['aria-controls']?.replace('step',''))
    attrs.className = `nav-link${root.step === target ? ' active' : ''}${target > root.maxStep ? ' disabled stopVald' : ''}`
    attrs.onClick = e => { e.preventDefault(); if (target <= root.maxStep) { root.step = target; root.notify() } }
  }
  if (node.model) {
    const value = evaluate(node.read, s)
    const file = attrs.type === 'file'
    const objectOptions = node.options?.match(/^(\w+) as \1\.(\w+) for \1 in (\w+) track by \1\.(\w+)$/)
    if (/\b(date|dateonlypicker)\b/i.test(attrs.className || '') && !file) attrs.type = 'date'
    if (root.prepareField) root.prepareField(attrs, node)
    if (attrs.type === 'checkbox') attrs.checked = Boolean(value)
    else if (attrs.type === 'radio') attrs.checked = String(value) === String(attrs.value)
    else if (!file) attrs.value = objectOptions ? value?.[objectOptions[4]] ?? '' : attrs.type === 'date' ? filter('date', value, 'yyyy-MM-dd') : value ?? ''
    if (attrs.type === 'date') {
      const prevClick = attrs.onClick
      attrs.onClick = e => {
        try { e.currentTarget.showPicker?.() } catch {}
        prevClick?.(e)
      }
    }
    if (node.pattern) attrs.pattern = node.pattern.replace(/^\//, '').replace(/\/[a-z]*$/, '')
    const isFromDate = ['fromDateId','fromDate','fromDateInput','entryDate1'].includes(attrs.id || node.model)
    const isToDate = ['toDateId','toDate','toDateInput','entryDate2'].includes(attrs.id || node.model)
    attrs.onChange = e => {
      let value = file ? e.target.files?.[0] : attrs.type === 'checkbox' ? e.target.checked : attrs.type === 'number' ? e.target.value === '' ? '' : Number(e.target.value) : e.target.value
      if (objectOptions) value = (s[objectOptions[3]] || []).find(item => String(item[objectOptions[4]]) === e.target.value) || null
      if (attrs.type === 'date') {
        value = filter('date', value, 'dd/MM/yyyy')
        const iso = filter('date', value, 'yyyy-MM-dd')
        if (isFromDate) {
          const currentTo = s.toDateInput || s.toDate || s.entryDate2 || s.reportForm?.entryDate2
          if (currentTo && iso > filter('date', currentTo, 'yyyy-MM-dd')) {
            toast.warning('From Date (Start Date) cannot be greater than To Date (End Date).')
            value = ''
          }
        }
        if (isToDate) {
          const currentFrom = s.fromDateInput || s.fromDate || s.entryDate1 || s.reportForm?.entryDate1
          if (currentFrom && iso < filter('date', currentFrom, 'yyyy-MM-dd')) {
            toast.warning('To Date (End Date) cannot be earlier than From Date (Start Date).')
            value = ''
          }
        }
      }
      if (root.convertFieldValue) value = root.convertFieldValue(value, attrs, node)
      if (node.maxValue != null && evaluate(node.maxValue, s) && Number(value) > Number(evaluate(node.maxValue,s))) {
        toast.warning('The value exceeds ' + evaluate(node.maxValue,s))
        value = ''
      }
      if (/\balpha-only\b/.test(attrs.className || '') && typeof value === 'string') value = value.replace(/[^a-zA-Z .]/g,'')
      if (root.writeField) root.writeField(s, node.model, value)
      else writePath(s, node.model, value)
      if (node.change != null) run(node.change, s, root)
      if (file && node.inline_change) root.previewFile(value, attrs.id)
      root.notify()
    }
    if (/\bnumber-only\b/.test(attrs.className || '')) {
      attrs.inputMode = 'decimal'
      attrs.onKeyDown = event => { if (event.key.length === 1 && !/\d|\./.test(event.key)) event.preventDefault() }
      attrs.onPaste = event => event.preventDefault()
    }
    if (/\bnumber10\b/.test(attrs.className || '')) attrs.maxLength = 10
    if (/\bnumber12\b/.test(attrs.className || '')) attrs.maxLength = 12
    if (['pinCode','unitPinCode'].includes(attrs.name)) attrs.maxLength = 6
    if (['unitElectCompDate','caFirstSellBillDate'].includes(attrs.id)) attrs.max = filter('date',new Date(),'yyyy-MM-dd')
    if (attrs.id === 'unitStartDate' && root.declarationAccepted) {
      if (root.schemeYear === '2025') attrs.min = '2025-02-24'
      else if (root.schemeYear === '2021') attrs.max = '2025-02-23'
      else attrs.max = filter('date',new Date(),'yyyy-MM-dd')
    }
    if (isFromDate) {
      const toVal = s.toDateInput || s.toDate || s.entryDate2 || s.reportForm?.entryDate2
      if (toVal) attrs.max = filter('date', toVal, 'yyyy-MM-dd')
    }
    if (isToDate) {
      const fromVal = s.fromDateInput || s.fromDate || s.entryDate1 || s.reportForm?.entryDate1
      if (fromVal) attrs.min = filter('date', fromVal, 'yyyy-MM-dd')
    }
  }
  if (node.tag === 'form') {
    if (node.children?.some(child => child.attrs?.id?.includes('ms'))) {
      attrs.className = `${attrs.className || ''} report-form`.trim()
    }
    attrs.ref = formRef
    attrs.noValidate = true
    attrs.onChange = e => { validation(e.currentTarget, root, false); root.notify() }
    if (root.trackTouched) attrs.onBlur = e => {
      const state = validation(e.currentTarget, root, false)
      if (state[e.target.name]) state[e.target.name].$touched = true
      root.notify()
    }
    attrs.onSubmit = e => { e.preventDefault(); if (root.saving) return; validation(e.currentTarget, root); run(node.submit, s, root) }
  }
  if (node.tag === 'button' && !attrs.type) attrs.type = node.click != null ? 'button' : 'submit'
  if (node.tag === 'button' && attrs.type === 'submit') attrs.disabled ||= root.saving
  if (node.tag === 'a') {
    if (attrs.disabled) {
      attrs['aria-disabled'] = true
      attrs.tabIndex = -1
      attrs.onClick = e => e.preventDefault()
    }
    const hasDownloadDoc = JSON.stringify(node.children || []).includes('Download uploaded doc') ||
      JSON.stringify(node.children || []).includes('Download')
    if (hasDownloadDoc && (attrs.href || node.attrs?.href)) {
      attrs.className = ((attrs.className || '') + ' download-doc-link').trim()
      attrs.target = '_blank'
      attrs.rel = 'noopener noreferrer'
    }
  }
  // Native file controls retain the exact field names and upload bindings.
  let children = <ViewNodes nodes={node.children} scope={s} root={root} />
  // React does not insert the tbody that the HTML parser supplied in AngularJS.
  // Without it, Bootstrap's table selectors style labels/spans as extra cells.
  if (node.tag === 'table' && node.children?.some(child => child.tag === 'tr')) {
    const groups = []
    const columns = Math.max(1, ...node.children.filter(child => child.tag === 'tr').map(row =>
      (row.children || []).reduce((count, cell) => count + (['td', 'th'].includes(cell.tag) ? Number(cell.attrs?.colspan?.[0] || 1) : 0), 0)))
    for (const original of node.children) {
      let child = original
      // A few legacy section titles were placed directly in tables or rows.
      // Give them a real spanning cell so they survive pagination correctly.
      if (child.tag === 'tr' && child.children?.length && child.children.every(cell => !['td', 'th'].includes(cell.tag))) {
        child = { ...child, children: [{ tag: 'td', attrs: { colspan: [String(columns)] }, children: child.children }] }
      } else if (!['tr', 'thead', 'tbody', 'tfoot', 'caption', 'colgroup'].includes(child.tag)) {
        child = { tag: 'tr', attrs: {}, children: [{ tag: 'td', attrs: { colspan: [String(columns)] }, children: [child] }] }
      }
      if (child.tag === 'tr') {
        if (!groups.at(-1)?.rows) groups.push({ rows: [] })
        groups.at(-1).rows.push(child)
      } else groups.push({ node: child })
    }
    children = groups.map((group, index) => group.rows
      ? <tbody key={index}><ViewNodes nodes={group.rows} scope={s} root={root} /></tbody>
      : <ViewNode key={index} node={group.node} scope={s} root={root} />)
  }
  const hasReportHeading = nodes => nodes?.some(child => child.attrs?.class?.some(value => /\bpanel-heading1\b/.test(value)) || hasReportHeading(child.children))
  if (attrs.id === 'ms' && !hasReportHeading(node.children)) children = <><header className="report-heading"><p>Government of Madhya Pradesh<br />Department of Micro, Small &amp; Medium Enterprises</p><h2>{root.reportTitle || 'Industrial Unit Application'}</h2></header>{children}</>
  const currentLocale = root?.locale || 'en'
  if (node.translation) {
    attrs['data-translation'] = node.translation
    const dictionary = root.translations || translations
    const text = dictionary[currentLocale]?.[node.translation] || dictionary.en?.[node.translation]
    if (text) {
      children = text
    } else if (!node.children || node.children.length === 0) {
      // Fallback: humanize the last token of the translation key if missing
      const fallback = node.translation.split('.').pop().replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).trim()
      children = fallback
    }
  }
  if (node.valueTranslation) {
    const dictionary = root.translations || translations
    const valText = dictionary[currentLocale]?.[node.valueTranslation] || dictionary.en?.[node.valueTranslation]
    if (valText) attrs.value = valText
    else if (!attrs.value) {
      attrs.value = node.valueTranslation.split('.').pop().replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).trim()
    }
  }
  if (node.options) {
    const objectMatch = node.options.match(/^(\w+) as \1\.(\w+) for \1 in (\w+) track by \1\.(\w+)$/)
    if (objectMatch) children = <>{children}{(s[objectMatch[3]] || []).map(item => <option key={item[objectMatch[4]]} value={item[objectMatch[4]]}>{item[objectMatch[2]]}</option>)}</>
    const match = node.options.match(/^(\w+)\.(\w+) as \w+\.(\w+) for \w+ in (\w+)/)
    if (match) {
      const values = s[match[4]] || []
      const options = Array.isArray(values) ? values : Object.entries(values).map(([key,value])=>({key,value}))
      children = <>{children}{options.map(item => <option key={item[match[2]]} value={item[match[2]]}>{item[match[3]]}</option>)}</>
    }
  }
  if (root.prepareElement) root.prepareElement(attrs, node, s)
  if (node.tag === 'img' && attrs.title === 'Print Filled Form') {
    const { onClick, ...icon } = attrs
    return <button type="button" className="btn btn-primary report-print-button" onClick={onClick}><img {...icon} alt="" />Print / Save PDF</button>
  }
  if (node.tag === 'img' && !attrs.src) return null
  if (!root.preserveHeading && node.tag === 'h1' && attrs.className?.includes('page-header') && (!node.children || node.children.length === 0)) return null
  if (node.tag === 'input' && root.renderDate && /\bdate\b/.test(attrs.className || '')) return root.renderDate(attrs)
  if (['input','img','br','hr','wbr','source','area','col'].includes(node.tag)) return React.createElement(node.tag, attrs)
  return React.createElement(node.tag, attrs, children)
}

function ViewNodes({ nodes = [], scope, root }) {
  return nodes.map((node, index) => <ViewNode key={index} node={node} scope={scope} root={root} />)
}
export default function IndustrialView({ name, state, nodes }) { return <ViewNodes nodes={nodes || (state.viewBundle || views)[name]} scope={state} root={state} /> }
export { evaluate, validation }

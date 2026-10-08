import React, { useEffect, useRef } from 'react'
import { expressions } from './generated/expressions'
import views from './generated/views'
import translations from './generated/translations.json'
import { backendPath, faPath, filter, writePath } from './viewHelpers'

const names = { enctype: 'encType', class: 'className', for: 'htmlFor', readonly: 'readOnly', maxlength: 'maxLength', minlength: 'minLength', colspan: 'colSpan', rowspan: 'rowSpan', tabindex: 'tabIndex', autocomplete: 'autoComplete', novalidate: 'noValidate', cellpadding: 'cellPadding', cellspacing: 'cellSpacing', 'accept-charset': 'acceptCharset' }
const booleans = new Set(['disabled','required','checked','readOnly','multiple','hidden','noValidate'])
const evaluate = (id, s) => {
  if (id == null) return undefined
  try { return (s.expressionBundle || expressions)[id](s) } catch (error) { if (error instanceof TypeError) return undefined; throw error }
}
const interpolate = (parts, s) => parts?.map(part => typeof part === 'number' ? evaluate(part, s) ?? '' : part).join('') || ''
const css = value => Object.fromEntries(String(value).split(';').filter(v => v.includes(':')).map(v => { const at = v.indexOf(':'); return [v.slice(0, at).trim().replace(/-([a-z])/g, (_,c) => c.toUpperCase()), v.slice(at + 1).trim().replace(/\s*!important$/, '')] }))

function run(id, s, root) {
  try { const result = (root.expressionBundle || expressions)[id]?.(s); Promise.resolve(result).catch(error => { root.error = error.message; root.notify() }) }
  catch (error) { root.error = error.message }
  root.notify()
}

function validation(form, root, submitted = true) {
  const previous = root[form.name || 'form']
  const state = { $submitted: submitted || root[form.name || 'form']?.$submitted || false, $valid: true, $invalid: false, $error: {} }
  for (const el of form.elements) {
    if (el.disabled || !el.willValidate) continue
    const error = { required: el.validity.valueMissing, pattern: el.validity.patternMismatch, min: el.validity.rangeUnderflow, max: el.validity.rangeOverflow, number: el.validity.badInput, email: el.validity.typeMismatch }
    state[el.name] = { $error: error, $invalid: !el.validity.valid, $valid: el.validity.valid, $touched: root.trackTouched ? !!previous?.[el.name]?.$touched : true }
    if (!el.validity.valid) state.$valid = false
  }
  state.$invalid = !state.$valid
  root[form.name || 'form'] = state
  return state
}

function ViewNode({ node, scope: s, root, repeated = false }) {
  const formRef = useRef(null)
  useEffect(() => {
    if (node.init != null && !root.initialized.has(node)) {
      root.initialized.add(node)
      run(node.init, s, root)
    }
  }, [node, root, s])
  useEffect(() => {
    if (formRef.current) { validation(formRef.current,root,false); root.notify() }
  }, [node,root])
  if (node.text) return interpolate(node.text, s)
  if (node.tag === 'table' && node.attrs?.id?.[0] === 'dynamic-table' && root.renderTable) return root.renderTable(node)
  if (node.fragment) return <ViewNodes nodes={(root.viewBundle || views)[node.fragment]} scope={s} root={root} />
  if (node.repeat && !repeated) {
    const items = evaluate(node.repeat.items, s) || []
    return Object.entries(items).map(([key, value], index) => {
      const child = Object.create(s)
      const [first, second] = node.repeat.names
      child[first] = second ? key : value
      if (second) child[second] = value
      Object.assign(child, { $index: index, $first: index === 0, $last: index === Object.keys(items).length - 1, $even: index % 2 === 0, $odd: index % 2 !== 0 })
      return <ViewNode key={key} node={node} scope={child} root={root} repeated />
    })
  }
  if (node.if != null && !evaluate(node.if, s)) return null
  const attrs = Object.fromEntries(Object.entries(node.attrs || {}).map(([key,value]) => [names[key] || key, interpolate(value, s)]))
  for (const key of booleans) if (key in attrs) attrs[key] = true
  for (const key of ['disabled','required','checked','value']) if (node[key] != null) attrs[key] = evaluate(node[key], s) ?? (key === 'value' ? '' : false)
  if (attrs.style) attrs.style = css(attrs.style)
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
  if (node.click != null) attrs.onClick = e => {
    if (node.tag === 'a') e.preventDefault()
    if (e.currentTarget.type === 'submit' && e.currentTarget.form) validation(e.currentTarget.form,root)
    run(node.click, s, root)
  }
  if (node.blur != null) attrs.onBlur = () => run(node.blur, s, root)
  if (node.inline_click) attrs.onClick = e => {
    e.preventDefault()
    if (/print/.test(node.inline_click)) (root.print || (() => window.print()))()
    else if (root.inlineAction) root.inlineAction(node.inline_click)
    else if (/history.back/.test(node.inline_click)) root.goBackToBatch()
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
    if (/\bdate\b/.test(attrs.className || '') && !file) attrs.type = 'date'
    if (root.prepareField) root.prepareField(attrs, node)
    if (attrs.type === 'checkbox') attrs.checked = Boolean(value)
    else if (attrs.type === 'radio') attrs.checked = String(value) === String(attrs.value)
    else if (!file) attrs.value = objectOptions ? value?.[objectOptions[4]] ?? '' : attrs.type === 'date' ? filter('date', value, 'yyyy-MM-dd') : value ?? ''
    if (node.pattern) attrs.pattern = node.pattern.replace(/^\//, '').replace(/\/[a-z]*$/, '')
    attrs.onChange = e => {
      let value = file ? e.target.files?.[0] : attrs.type === 'checkbox' ? e.target.checked : attrs.type === 'number' ? e.target.value === '' ? '' : Number(e.target.value) : e.target.value
      if (objectOptions) value = (s[objectOptions[3]] || []).find(item => String(item[objectOptions[4]]) === e.target.value) || null
      if (attrs.type === 'date') value = filter('date', value, 'dd/MM/yyyy')
      if (node.maxValue != null && evaluate(node.maxValue, s) && Number(value) > Number(evaluate(node.maxValue,s))) {
        window.alert('The value exceeds ' + evaluate(node.maxValue,s)); value = ''
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
  }
  if (node.tag === 'form') {
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
    }
  }
  // Native file controls retain the exact field names and upload bindings.
  let children = <ViewNodes nodes={node.children} scope={s} root={root} />
  const currentLocale = root?.locale || 'en'
  if (node.translation) {
    attrs['data-translation'] = node.translation
    const text = translations[currentLocale]?.[node.translation] || translations.en?.[node.translation]
    if (text) {
      children = text
    } else if (!node.children || node.children.length === 0) {
      // Fallback: humanize the last token of the translation key if missing
      const fallback = node.translation.split('.').pop().replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).trim()
      children = fallback
    }
  }
  if (node.valueTranslation) {
    const valText = translations[currentLocale]?.[node.valueTranslation] || translations.en?.[node.valueTranslation]
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

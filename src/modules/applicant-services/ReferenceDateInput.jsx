import { useEffect, useRef } from 'react'
import { filter } from '../industrial-unit/viewHelpers'
import './generated/datepicker.css'

let widget
const loadScript=src=>new Promise((resolve,reject)=>{
  const script=document.createElement('script')
  script.src=src; script.onload=resolve; script.onerror=()=>reject(new Error('Unable to load the date picker.'))
  document.head.appendChild(script)
})
function loadWidget() {
  widget ||= (async()=>{
    await loadScript('/legacy/vendor/applicant-services/jquery.2.1.1.min.js')
    await loadScript('/legacy/vendor/applicant-services/jquery.datetimepicker.full.js')
    return window.jQuery
  })()
  return widget
}

export default function ReferenceDateInput({ attrs, onError, options = {} }) {
  const input=useRef(null), latest=useRef(attrs)
  latest.current=attrs
  useEffect(()=>{
    let disposed=false, picker
    loadWidget().then(jquery=>{
      if (disposed) return
      picker=jquery(input.current)
      const computedOptions = { lang:'ch',timepicker:false,format:'d/m/Y', ...options }
      if (attrs.disablePast || options.disablePast) {
        computedOptions.minDate = 0
      }
      if (attrs.min) {
        computedOptions.minDate = attrs.min
      }
      if (attrs.disableFuture || options.disableFuture) {
        computedOptions.maxDate = 0
      }
      if (attrs.max) {
        computedOptions.maxDate = attrs.max
      }
      picker.datetimepicker({
        ...computedOptions,
        onSelectDate() {
          latest.current.onChange?.({ target: input.current })
        }
      })
    }).catch(error=>{ if (!disposed) onError?.(error) })
    return ()=>{ disposed=true; picker?.datetimepicker('destroy') }
  },[attrs.min, attrs.max, attrs.disablePast, attrs.disableFuture])
  return <input {...attrs} ref={input} type="text" value={filter('date',attrs.value,'dd/MM/yyyy')} onKeyPress={event=>event.preventDefault()} />
}

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

export default function ReferenceDateInput({ attrs, onError }) {
  const input=useRef(null), latest=useRef(attrs)
  latest.current=attrs
  useEffect(()=>{
    let disposed=false, picker
    loadWidget().then(jquery=>{
      if (disposed) return
      picker=jquery(input.current)
      picker.datetimepicker({ lang:'ch',timepicker:false,format:'d/m/Y',onSelectDate() {
        latest.current.onChange({target:input.current})
      } })
    }).catch(error=>{ if (!disposed) onError(error) })
    return ()=>{ disposed=true; picker?.datetimepicker('destroy') }
  },[])
  return <input {...attrs} ref={input} type="text" value={filter('date',attrs.value,'dd/MM/yyyy')} onKeyPress={event=>event.preventDefault()} />
}

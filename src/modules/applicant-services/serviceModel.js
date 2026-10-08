import { createRequests, getUnitData, saveUnitData } from '../industrial-unit/industrialUnitService'
import { backendPath, filter, writePath } from '../industrial-unit/viewHelpers'
import { installAwardActions } from './generated/actions'
import { applicantServiceLink } from './serviceLinks'

// Keyboard rules from angular/common.js, scoped to these reference forms.
export function referenceKeyDown(event) {
  if (event.ctrlKey || event.metaKey || event.altKey || event.key.length !== 1) return
  const el=event.target, classes=el.classList
  if (!classes || !('value' in el)) return
  const text=el.value, caret=el.selectionStart
  if (classes.contains('digits-only') && !/^\d$/.test(event.key)) event.preventDefault()
  if (classes.contains('number-OnlyTwoDecimal') || classes.contains('number-OnlyThreeDecimal')) {
    const decimals=classes.contains('number-OnlyThreeDecimal') ? 3 : 2
    if (!/^[\d.]$/.test(event.key) || event.key === '.' && text.includes('.') || text.includes('.') && text.slice(text.indexOf('.')).length > decimals && caret >= text.length-decimals) event.preventDefault()
  }
  if (classes.contains('form-control') && caret === 0 && /[ ,\[\\{|\]}:;'"?!#~./^_`< =+@>$%&*()\-]/.test(event.key)) event.preventDefault()
  if (classes.contains('no-space') && event.key === ' ') event.preventDefault()
  if (classes.contains('alpha-numeric-only') && !/^[a-z\d]$/i.test(event.key)) event.preventDefault()
}

export function validateBank(bean) {
  if (!bean.selectedBank) return 'Please enter proposed bank name.'
  if (!bean.accountHolderName) return 'Please enter Account Holder Name.'
  if (!/^[a-zA-Z ]+$/.test(bean.accountHolderName) || bean.accountHolderName.length > 50) return 'Only alphabets are allowed.'
  if (!/^\d{8,16}$/.test(bean.accountNumber || '')) return 'Account number must be 8 to 16 digits only.'
  if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(bean.ifscCode || '')) return 'Enter valid IFSC Code (Example: SBIN0001234).'
  if (!bean.chequefile) return 'Please upload Cancelled Cheque.'
  if (bean.chequefile.type !== 'application/pdf') return 'Please upload a PDF file.'
  if (bean.chequefile.size > 500 * 1024) return 'Size of file should not exceed 500KB'
  return ''
}

export function createServiceState({ params, navigate, notify, signal, locale }) {
  const state = {
    initialized:new Set(), locale, notify, preserveHeading:true, trackTouched:true, error:'', busy:false,
    BankDetailsBean:{}, bankList:[], editBankData:{}, showEditForm:false,
    awardFormData:{}, awardData:{}, responseObject:{}, responseObject1:{}, applicantDocumentsList:[],
    resolveLink:applicantServiceLink, documentPath:backendPath,
    goBackToBatch:() => navigate(-1), fetchAwards() {},
    prepareField(attrs) { if (/\bdate\b/.test(attrs.className || '')) attrs.type='text' },
    inlineAction(code) {
      if (code.includes('mpidcInitiateForm')) window.location.assign('/mpmsme/sws/initiate')
      else if (code.includes('history.back')) navigate(-1)
    },
    writeField(scope, path, value) {
      const dynamic = path.match(/^(\w+)\['(\w+_)' \+ \$index\]$/)
      if (dynamic) scope[dynamic[1]][dynamic[2]+scope.$index] = value
      else writePath(scope, path, value)
    },
  }
  const request = createRequests(state, notify, signal)
  installAwardActions(state, {
    request, params,
    loading:{ start() { state.busy=true; notify() }, finish() { state.busy=false; notify() } },
    navigation:{ confirm:message => window.confirm(message), location:{ set href(hash) { navigate(applicantServiceLink(hash)) } }, open:path => window.open(backendPath(path),'_blank','noopener') },
    later:(fn,delay) => setTimeout(() => { if (!signal.aborted) { fn(); notify() } },delay),
    format:name => (value,pattern) => filter(name,value,pattern),
  })
  async function perform(action) {
    state.error=''; state.busy=true; notify()
    try { await action() }
    catch (error) { if (!signal.aborted) state.error=error.message }
    finally { state.busy=false; state.saving=false; if (!signal.aborted) notify() }
  }
  state.loadBanks = () => perform(async () => {
    const data = await getUnitData('fetchBanksMap',undefined,signal)
    state.bankList = Array.isArray(data) ? data : Object.entries(data || {}).map(([key,value]) => ({key,value}))
  })
  state.fetchBankList = () => perform(async () => {
    const data = await getUnitData('fetchBankDetails',undefined,signal)
    const records = typeof data.value === 'string' ? JSON.parse(data.value) : data.value ?? (Array.isArray(data) ? data : [])
    if (!Array.isArray(records)) throw new Error('The server returned an invalid bank list.')
    state.bankList=records
  })
  state.addBank = () => {
    if (state.saving) return
    const error = validateBank(state.BankDetailsBean)
    if (error) { state.error=error; notify(); return }
    state.saving=true
    return perform(async () => {
      const bean=state.BankDetailsBean, data=new FormData()
      data.append('bankId',bean.selectedBank.key); data.append('bankName',bean.selectedBank.value)
      for (const key of ['accountHolderName','accountNumber','ifscCode','chequefile']) data.append(key,bean[key])
      const response=await saveUnitData('saveBankDetails',data,signal)
      // This legacy service returns rejected duplicates in successMessage too.
      if (!/Data Saved Successfylly|Data Saved Successfully/i.test(response.successMessage || '')) throw new Error(response.successMessage || 'The server did not confirm that the bank details were saved.')
      window.alert(response.successMessage)
      navigate('/applicant/bank-details')
    })
  }
  state.editBank = bank => { state.editBankData={...bank}; state.showEditForm=true; notify() }
  state.cancelEdit = () => { state.showEditForm=false; notify() }
  state.updateBank = () => perform(async () => {
    const response=await saveUnitData('updateBank',state.editBankData,signal)
    if (!/Data Updated Successfully/i.test(response.successMessage || '')) throw new Error(response.successMessage || 'The server did not confirm the update.')
    state.showEditForm=false
    await state.fetchBankList()
  })
  return state
}

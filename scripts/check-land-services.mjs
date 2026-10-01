import assert from 'node:assert/strict'
import { createServer } from 'vite'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' })
try {
  const service = await server.ssrLoadModule('/src/modules/id/applicant/services/landApplicationService.js')
  const { default: http } = await server.ssrLoadModule('/src/api/httpClient.js')
  const downloads = await server.ssrLoadModule('/src/modules/id/applicant/services/idApplicantService.js')
  const queries = await server.ssrLoadModule('/src/modules/id/applicant/services/landQueryService.js')
  const annual = await server.ssrLoadModule('/src/modules/id/applicant/services/landAnnualPaymentService.js')
  const notices = await server.ssrLoadModule('/src/modules/id/applicant/services/landNoticeService.js')
  const signing = await server.ssrLoadModule('/src/modules/id/applicant/services/landSigningService.js')
  const { default: SigningDocument } = await server.ssrLoadModule('/src/modules/id/applicant/components/LandSigningDocument.jsx')
  const requests = []
  let response = { id: '17', successMessage: 'Saved' }
  http.defaults.adapter = async config => {
    requests.push(config)
    return { data: typeof response === 'function' ? response(config) : response, status: 200, statusText: 'OK', headers: { 'content-type': 'application/json' }, config }
  }
  const data = {
    vacantLandId: 42, vacantLandIDEncrypt: 'opaque-token', isAlreadyLandAlloted: false,
    idEmploymentBeans: [{ empName: 'Skilled Workers', empNumber: '1' }],
    investmentBeans: [{ empName: 'Plant and machinery', empNumber: '100' }],
    financeBeans: [{ empName: 'Own Fund', empNumber: '100' }],
  }
  assert.equal((await service.saveLandApplication(data)).applicantId, '17')
  assert.equal(requests.at(-1).url, '/applicant/id/addIdApplicantDetail')
  assert.equal(JSON.parse(requests.at(-1).data).vacantLandId, 42)
  await service.saveLandApplication({ ...data, applicantId: 17 })
  assert.equal(requests.at(-1).url, '/applicant/id/updateIdApplicantDetail')
  await service.saveLandApplication({ ...data, applicantId: 17, statusId: 5 }, true)
  assert.equal(requests.at(-1).url, '/applicant/id/editIdApplicantDetail')
  await assert.rejects(() => service.saveLandApplication({ ...data, applicantId: 17, statusId: 1 }, true), /awaiting a query/)
  response = { errorMessage: 'Save rejected' }
  await assert.rejects(() => service.saveLandApplication(data), /Save rejected/)
  const pdf = () => new File(['fixture'], 'fixture.pdf', { type: 'application/pdf' })
  const files = { doc2: pdf(), doc3: pdf(), doc9: pdf(), profileImage: new File(['fixture'], 'photo.jpg', { type: 'image/jpeg' }) }
  response = { successMessage: 'Documents saved', value: 'opaque-token' }
  await assert.rejects(() => service.saveLandDocuments({ applicantId: 17, files, declaration: false }), /declaration/)
  await assert.rejects(() => service.saveLandDocuments({ applicantId: 17, files: { doc2: pdf() }, declaration: true }), /project schedule/)
  await service.saveLandDocuments({ applicantId: 17, files, declaration: true })
  const upload = requests.at(-1)
  assert.equal(upload.url, '/applicant/addIDApplicantDocuments')
  assert.deepEqual([...upload.data.keys()], ['applicantId', 'checkDeclaration', 'doc2', 'doc3', 'doc9', 'profileImage'])
  assert.equal(upload.data.get('applicantId'), '17')
  assert.equal(upload.data.get('checkDeclaration'), 'true')
  await service.saveLandDocuments({ applicantId: 17, files: { doc3: pdf() }, declaration: true, update: true })
  assert.equal(requests.at(-1).url, '/applicant/updateIDApplicantDocuments')
  await service.saveLandDocuments({ applicantId: 17, files: { doc3: pdf() }, correction: true })
  assert.equal(requests.at(-1).url, '/applicant/editIDApplicantDocuments')
  assert.equal(requests.at(-1).data.has('checkDeclaration'), false)
  response = { errorMessage: 'Upload rejected' }
  await assert.rejects(() => service.saveLandDocuments({ applicantId: 17, files, declaration: true }), /Upload rejected/)
  assert.equal(downloads.getDownloadDocumentUrl('ID_DOC_2', 17), '/mpmsme/applicant/id/downloaddocument/ID_DOC_2/17')
  assert.equal(downloads.getDownloadEsignedDocumentUrl(8), '/mpmsme/applicant/downloadEsignDocument/8')
  response = { successMessage: 'Saved' }
  await assert.rejects(() => service.saveLandDocuments({ applicantId: 17, files, declaration: true, undeveloped: true }), /financial closure/)
  await service.saveLandDocuments({ applicantId: 17, files: { ...files, doc1: pdf(), doc10: pdf(), doc11: pdf(), doc12: pdf() }, declaration: true, undeveloped: true })
  assert.equal(requests.at(-1).url, '/applicant/addIDApplicantDocuments1')
  assert.ok(requests.at(-1).data.has('doc12'))
  const parcel = { totalPlotAreaun: 50000, collectorRateId: 7, districtId: 2, plotShed: 'Plot', newArea: 'Old' }
  response = { premiumCharges: 20, developmentCharges: 10, maintenanceCharges: 3, leaseRent: 4, securityDeposit: 5, advanceRent: 6, totalAmount: 48 }
  const quote = await service.quoteUndevelopedLand(parcel, 20001)
  assert.equal(quote.applicationFee, 50000)
  assert.equal(quote.quotedArea, 20001)
  assert.equal(requests.at(-1).params.category, 'OpenForAll')
  assert.equal(requests.at(-1).url, '/applicant/fetchRatesByCollectorRateIdAndAreaLeaseRent')
  await assert.rejects(() => service.quoteUndevelopedLand(parcel, 50001), /available area/)
  response = { totalAmount: 0 }
  await assert.rejects(() => service.quoteUndevelopedLand(parcel, 100), /incomplete/)
  response = { successMessage: 'Reply saved' }
  await queries.submitLandQuery(17, { id: 9, comments: 'Explain the layout' }, 'Layout clarified')
  assert.equal(requests.at(-1).url, '/applicant/id/submitQueryReply')
  assert.deepEqual(JSON.parse(requests.at(-1).data), { id: 9, comments: 'Layout clarified', queryAsked: 'Explain the layout', applicationId: 17 })
  await assert.rejects(() => queries.submitLandQuery(17, {}, ' '), /1 to 400/)
  await queries.uploadLandQueryDocument(17, pdf())
  assert.equal(requests.at(-1).url, '/applicant/uploadQueryDoc')
  assert.deepEqual([...requests.at(-1).data.keys()], ['applicantId', 'doc1'])
  response = { errorMessage: 'Document rejected' }
  await assert.rejects(() => queries.uploadLandQueryDocument(17, pdf()), /Document rejected/)
  const annualData = { fyFrom: '2026', fyTo: '2028', leaseRent: '0.1', maintenanceFee: '0.2', shedRent: '0', transferCharge: '0' }
  assert.equal(annual.annualPaymentPayload(17, annualData).totalCharges, '0.60')
  assert.throws(() => annual.annualPaymentPayload(17, { ...annualData, fyTo: '2026' }), /ending year/)
  assert.throws(() => annual.annualPaymentPayload(17, { ...annualData, leaseRent: '-1' }), /non-negative/)
  assert.throws(() => annual.annualPaymentPayload(17, { ...annualData, leaseRent: '0.001' }), /decimal/)
  response = 81
  assert.equal(await annual.saveAnnualPayment(17, annualData), '81')
  assert.equal(requests.at(-1).url, '/applicant/applicantAnnualPayment')
  assert.equal(JSON.parse(requests.at(-1).data).totalCharges, '0.60')
  response = null
  await assert.rejects(() => annual.saveAnnualPayment(17, annualData), /did not confirm/)
  response = { errorMessage: 'Annual payment rejected' }
  await assert.rejects(() => annual.saveAnnualPayment(17, annualData), /Annual payment rejected/)
  assert.equal(notices.noticeActions({ statusId: 16, idNoticeBean: { noticeId: 4, statusId: 16, noticeDaysLeft: 0 } }).length, 0)
  assert.match(notices.noticeActions({ statusId: 16, idNoticeBean: { noticeId: 4, statusId: 16, noticeDaysLeft: 2 } })[0].href, /compliance\/4$/)
  response = { successMessage: 'Compliance saved' }
  await notices.saveNoticeWorkflow('compliance', 4, { userCompliance: 'Complied', document: pdf(), documentDesc: 'Evidence' }, {})
  assert.equal(requests.at(-1).url, '/applicant/enterCompliance')
  assert.deepEqual([...requests.at(-1).data.keys()], ['noticeId', 'userCompliance', 'complianceDocument', 'complianceDocumentDesc'])
  await notices.saveNoticeWorkflow('conditional-ic', 6, { userCompliance: 'Complied', document: pdf() }, {})
  assert.equal(requests.at(-1).url, '/applicant/enterConditionalComplianceIC')
  assert.ok(requests.at(-1).data.has('appealHearingId'))
  assert.ok(requests.at(-1).data.has('userComplianceDocument'))
  response = 93
  await notices.saveNoticeWorkflow('appeal-zo', 4, { appealGround: 'Review requested', appealDate: '2026-10-01' }, { appealFees: 1000 })
  assert.equal(requests.at(-1).url, '/applicant/addAppeal')
  assert.equal(requests.at(-1).data.get('appealDate'), '01/10/2026')
  assert.equal(requests.at(-1).data.get('appealType'), 'ZO_APPEAL')
  assert.equal(requests.at(-1).data.get('appealFees'), '1000')
  assert.equal((await notices.saveNoticeWorkflow('appeal-ic', 4, { appealGround: 'Review requested', appealDate: '2026-10-01' }, {})).id, '93')
  assert.equal(requests.at(-1).data.get('appealType'), 'IC_APPEAL')
  assert.equal(requests.at(-1).data.has('appealFees'), false)
  response = { errorMessage: 'Appeal rejected' }
  await assert.rejects(() => notices.saveNoticeWorkflow('appeal-ic', 4, { appealGround: 'Review requested', appealDate: '2026-10-01' }, {}), /Appeal rejected/)
  console.log('Land API paths, payloads, multipart fields, rejected saves and downloads passed.')
  const signable = { ...data, applicantId: 17, applicationId: 'TEST-17', statusId: 2, ctPaymentBean: { status: 'Success' }, applicantFirstName: '<script>unsafe</script>', itemsManufactured: [{ itemName: 'TEST manufactured item' }], industrialProfileBean: { firmConstitution: 'Proprietorship' } }
  const html = renderToStaticMarkup(createElement(SigningDocument, { applicationData: signable }))
  assert.match(html, /TEST-17/)
  assert.match(html, /TEST manufactured item/)
  assert.match(html, /&lt;script&gt;unsafe&lt;\/script&gt;/)
  assert.doesNotMatch(html, /\{\{|data-ng-|<script/)
  response = { successMessage: 'Ready', aspUrl: 'https://sign.example.test/start', eHastaksharHiddenInputTAG: '<signed-request />' }
  const gateway = await signing.requestApplicationEsign(signable, html, { aadhaarLast4Digits: '1234' })
  assert.equal(gateway.action, 'https://sign.example.test/start')
  assert.equal(requests.at(-1).url, '/applicant/eSignature')
  assert.equal(JSON.parse(requests.at(-1).data).unsignedBase64, html)
  await assert.rejects(() => signing.requestApplicationEsign(signable, html, { aadhaarLast4Digits: '123' }), /four Aadhaar/)
  await assert.rejects(() => signing.requestApplicationEsign({ ...signable, signedApplicationFormUploadDocId: 1 }, html, { aadhaarLast4Digits: '1234' }), /already been signed/)
  response = { successMessage: 'Ready', aspUrl: 'javascript:alert(1)', eHastaksharHiddenInputTAG: 'bad' }
  await assert.rejects(() => signing.requestApplicationEsign(signable, html, { aadhaarLast4Digits: '1234' }), /gateway response/)
  response = config => config.url.endsWith('/generateLOIPDF') ? { successMessage: 'PDF ready', transactionId: 'txn-17', eHastaksharHiddenInputTAG: 'PDF-fixture', serverDateTime: '2026-10-01', signatureName: 'Test signer' } : { vcId: 'opaque-token' }
  let signerCalls = 0
  await signing.signApplicationWithDsc(signable, html, {}, async (url, options) => {
    signerCalls++
    assert.equal(url, 'http://localhost:8060/jsonsigner/Sign')
    assert.equal(options.credentials, 'omit')
    assert.equal(JSON.parse(options.body).Data, 'PDF-fixture')
    return { ok: true, json: async () => ({ SignedData: 'SIGNED-fixture' }) }
  })
  assert.equal(signerCalls, 1)
  assert.equal(requests.at(-1).url, '/applicant/signPDFAPPLICATIONFORM')
  assert.equal(JSON.parse(requests.at(-1).data).transactionId, 'txn-17')
  const before = requests.filter(request => request.url.endsWith('/signPDFAPPLICATIONFORM')).length
  await assert.rejects(() => signing.signApplicationWithDsc(signable, html, {}, async () => ({ ok: true, json: async () => ({}) })), /no signed PDF/)
  assert.equal(requests.filter(request => request.url.endsWith('/signPDFAPPLICATIONFORM')).length, before)
  console.log('Signing document rendering, eSign validation and DSC transaction checks passed.')
} finally {
  await server.close()
}

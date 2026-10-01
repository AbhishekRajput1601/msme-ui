import assert from 'node:assert/strict'
import { amountTotal, canApplyToParcel, normalizeApplication, requireSaveSuccess, undevelopedApplicationFee, validateApplication, withCalculatedFields } from '../src/modules/id/applicant/landApplicationModel.js'
import { resolveLegacyHashRoute } from '../src/routes/roleRoutes.js'

const draft = {
  isAlreadyLandAlloted: false,
  idEmploymentBeans: [{ empName: 'Skilled Workers', empNumber: '1' }],
  investmentBeans: [{ empName: 'Plant and machinery', empNumber: '0.30' }],
  financeBeans: [{ empName: 'Own Fund', empNumber: '0.1' }, { empName: 'Loan', empNumber: '0.2' }],
}
assert.equal(amountTotal(draft.financeBeans), 0.3)
assert.equal(validateApplication(draft).proposedVenture, 'Micro')
assert.throws(() => validateApplication({ ...draft, financeBeans: [{ empName: 'Loan', empNumber: '0.31' }] }), /totals must be equal/)
assert.throws(() => validateApplication({ ...draft, idEmploymentBeans: [{ empName: 'Skilled Workers', empNumber: '1.5' }] }), /whole number/)
assert.throws(() => validateApplication({ ...draft, financeBeans: [] }), /categories/)
assert.throws(() => validateApplication({ ...draft, isAlreadyLandAlloted: true }), /already allotted/)
assert.equal(normalizeApplication({ isLandAllotedStr: 'false' }).isAlreadyLandAlloted, false)
assert.equal(normalizeApplication({ isAlreadyLandAlloted: 'true' }).isAlreadyLandAlloted, true)
assert.equal(withCalculatedFields({ landDetails: [{ phase: 'Present/First Phase', area: '10', cost: '3' }, { phase: 'Second/Subsequent Phase', area: '20', cost: '4' }] }).totalPresentAndSubsequentArea, 30)
assert.throws(() => requireSaveSuccess({}), /did not confirm/)
assert.throws(() => requireSaveSuccess({ id: '1010' }), /captcha/)
assert.throws(() => requireSaveSuccess({ errorMessage: 'Rejected', successMessage: 'Saved' }), /Rejected/)
assert.throws(() => requireSaveSuccess({ successMessage: 'Saved' }, true), /did not confirm/)
assert.equal(requireSaveSuccess({ id: '17', successMessage: 'Saved' }, true).id, '17')
assert.equal(canApplyToParcel({ vcId: 'opaque', active: true }), true)
assert.equal(canApplyToParcel({ vcId: 'opaque', active: true, hoStatus: 'Hold' }), false)
assert.equal(canApplyToParcel({ vcId: 'opaque', active: true, commingSoon: true }), false)
assert.equal(canApplyToParcel({ active: true }), false)
assert.equal(resolveLegacyHashRoute('/applicant/home', '#/id/viewApplyForLandForm/0/a%2Fb'), '/applicant/land-allotment/apply/a%2Fb')
assert.equal(resolveLegacyHashRoute('/applicant/home', '#id/viewDocumentsUpload/17/a%2Fb'), '/applicant/land-allotment/documents/17/a%2Fb')
assert.equal(resolveLegacyHashRoute('/applicant/home', '#id/viewIdHistory/17'), '/applicant/land-allotment/history/17')
assert.equal(resolveLegacyHashRoute('/idSection/home', '#id/viewIdHistory/17'), '/department/id/id/viewIdHistory/17')
console.log('Land model, rejected-response and legacy-route checks passed.')
for (const [area, fee] of [[20000, 20000], [20001, 50000], [50000, 50000], [50001, 100000], [100001, 200000], [200001, 500000]]) assert.equal(undevelopedApplicationFee(area, 500000), fee)
for (const area of [0, -1, 'bad', 500001]) assert.throws(() => undevelopedApplicationFee(area, 500000), /available area/)
const undeveloped = { ...draft, vacantLandBean: { industrialAreaName: 'Undeveloped Land', totalPlotAreaun: 20000 }, totalPlotArea: 1000, quotedArea: 1000, totalAmount: 20 }
assert.throws(() => validateApplication(undeveloped), /25 crore/)
const eligible = { ...undeveloped, investmentBeans: [{ empName: 'Plant and machinery', empNumber: 250000000 }], financeBeans: [{ empName: 'Own Fund', empNumber: 250000000 }] }
assert.equal(validateApplication(eligible).totalPlotArea, 1000)
assert.throws(() => validateApplication({ ...eligible, totalPlotArea: 1001 }), /Calculate the charges/)
assert.equal(resolveLegacyHashRoute('/applicant/home', '#id/queryReplyByApplicant/17/a%2Fb'), '/applicant/land-allotment/query/17/a%2Fb')
assert.equal(resolveLegacyHashRoute('/applicant/home', '#id/idInstructionUL/0/a%2Fb'), '/applicant/land-allotment/instructions-undeveloped/a%2Fb')

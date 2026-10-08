import assert from 'node:assert/strict'
import { infrastructureDocuments, infrastructureUpload } from '../src/modules/industrial-unit/infrastructureModel.js'
import { resolveLegacyHashRoute } from '../src/routes/roleRoutes.js'

const state = {}
for (const [n, , message] of infrastructureDocuments.filter(row => row[2])) {
  assert.throws(() => infrastructureUpload(state), { message })
  state['doc' + n] = new File(['%PDF-1.4'], 'document.pdf', { type: 'application/pdf' })
}
assert.equal([...infrastructureUpload(state).keys()].length, 5)
for (const [n, key, , label] of infrastructureDocuments) {
  state['doc' + n] = new File([new Uint8Array(5242881)], 'too-large.pdf')
  assert.throws(() => infrastructureUpload(state), { message: label + ' file size should not exceed 5 MB' })
  state['doc' + n] = new File([new Uint8Array(5242880)], 'boundary.pdf')
  assert.equal(infrastructureUpload(state).get(key).size, 5242880)
  state['doc' + n] = new File(['%PDF-1.4'], 'document.pdf')
}
assert.deepEqual([...infrastructureUpload(state).keys()], infrastructureDocuments.map(row => row[1]))
for (const hash of ['#infradevelopmetList', '#/infradevelopmetList']) {
  assert.equal(resolveLegacyHashRoute('/fa/home', hash), '/department/fa/infradevelopmetList')
}
assert.equal(resolveLegacyHashRoute('/mpmsme/fa/home', '#/viewfaInfrastructure/71'), '/department/fa/viewfaInfrastructure/71')
assert.equal(resolveLegacyHashRoute('/applicant/home', '#fa/infradevelopmetform'), '/applicant/financial-assistance/infradevelopmetform')
console.log('Infrastructure document validation, payload keys, size boundaries and legacy routes passed.')

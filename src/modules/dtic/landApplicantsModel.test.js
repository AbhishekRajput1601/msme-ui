import { test } from 'node:test'
import assert from 'node:assert/strict'
import { landWithApplicants, landApplicantsPath } from './landApplicantsModel.js'

test('shows only land with a positive integer applicant count', () => {
  const rows = [0, '0', null, undefined, '', -1, 'invalid', 1.5, 1, '12'].map(totalApplicationReceived => ({ totalApplicationReceived }))
  assert.deepEqual(landWithApplicants(rows), rows.slice(-2))
})

test('uses the existing applicant route and encodes the land token', () => {
  assert.equal(landApplicantsPath({ vacantLandId: 1, vcId: 'a/b+c=' }), '/department/dtic/id/viewAppliedApplicants/a%2Fb%2Bc%3D')
  assert.equal(landApplicantsPath({ vacantLandId: 1 }), null)
})

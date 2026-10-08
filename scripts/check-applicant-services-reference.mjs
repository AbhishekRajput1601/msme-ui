import assert from 'node:assert/strict'
import fs from 'node:fs'
import { resolveLegacyHashRoute } from '../src/routes/roleRoutes.js'

const read=file=>JSON.parse(fs.readFileSync(file,'utf8'))
const inventory=read('artifacts/applicant-services/reference-inventory.json')
const coverage=read('artifacts/applicant-services/action-coverage.json')
const translations=read('src/modules/industrial-unit/generated/translations.json')
assert.deepEqual(coverage.missing,[])
const translationKeys=new Set()
for (const [name,reference] of Object.entries(inventory)) {
  const nodes=read(`src/modules/applicant-services/generated/${name}.json`)
  let fields=0
  const walk=node=>{
    if (!node || typeof node !== 'object') return
    if (['input','select','textarea'].includes(node.tag)) fields++
    if (node.translation) translationKeys.add(node.translation)
    Object.values(node).forEach(walk)
  }
  walk(nodes)
  assert.equal(fields,reference.fields.length,`${name}: every source field must survive compilation`)
}
const missing=[...translationKeys].filter(key=>!translations.en[key])
assert.deepEqual(missing,[], 'Every reference translation must be available')
for (const [hash,route] of Object.entries({ 'bank/addBankDetails':'bank-details/new','bank/banksList':'bank-details',mpidcServices:'online-nocs',msmeAwardList:'msme-award','applyMsmeAward/7':'msme-award/applyMsmeAward/7','editMsmeAward/7/17':'msme-award/editMsmeAward/7/17','viewMsmeAwardForm/7/17':'msme-award/viewMsmeAwardForm/7/17','uploadMsmeAwardDocs/7/17':'msme-award/uploadMsmeAwardDocs/7/17' })) {
  for (const prefix of ['#','#/']) assert.equal(resolveLegacyHashRoute('/applicant/home',prefix+hash),'/applicant/'+route)
}
console.log(`Verified ${Object.keys(inventory).length} templates, all field declarations, ${translationKeys.size} translations, action coverage and legacy routes.`)

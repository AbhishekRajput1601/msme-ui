import assert from 'node:assert/strict'
import fs from 'node:fs'
import {createServer} from 'vite'
const server=await createServer({server:{middlewareMode:true},appType:'custom'})
try{
 const {createFinancialState}=await server.ssrLoadModule('/src/modules/financial/financialModel.js')
 const {expressions}=await server.ssrLoadModule('/src/modules/financial/generated/expressions.js')
 const {dticCells}=await server.ssrLoadModule('/src/modules/dtic/DticTable.jsx')
 const {rowRules}=await server.ssrLoadModule('/src/modules/financial/generated/rows.js')
 const {reportRows}=await server.ssrLoadModule('/src/modules/financial/generated/reportRows.js')
 const views=JSON.parse(fs.readFileSync('src/modules/financial/generated/views.json','utf8'))
 const tables=JSON.parse(fs.readFileSync('src/modules/financial/generated/tables.json','utf8'))
 const inventory=JSON.parse(fs.readFileSync('artifacts/financial/fa-fields.json','utf8'))
 const alerts=[],navigation=[]
 globalThis.window={alert:m=>alerts.push(m),open:u=>navigation.push(u),confirm:()=>true}
 globalThis.alert=window.alert
 globalThis.document={querySelectorAll:()=>[]}
 const state=createFinancialState({params:{applicationId:'TEST-1',establishmentType:'Unit'},navigate:u=>navigation.push(u),notify(){},signal:new AbortController().signal,locale:'en'})
 let fieldCount=0,actionCount=0
 for(const [name,record] of Object.entries(inventory)){
  let fields=0
  function walk(nodes,parent){for(const node of nodes||[]){
   if(node.tag==='tr')assert(['thead','tbody','tfoot'].includes(parent),name+' valid table row parent: '+parent)
   if(['td','th'].includes(node.tag))assert.equal(parent,'tr',name+' valid table cell parent')
   if(['input','select','textarea'].includes(node.tag))fields++
   for(const key of ['init','submit','click','change','blur'])if(node[key]!=null){for(const m of String(expressions[node[key]]).matchAll(/s\.(\w+)\(/g)){assert.equal(typeof state[m[1]],'function',`${name}: ${m[1]}`);actionCount++}}
   walk(node.children,node.tag)
  }}walk(views[name]);assert.equal(fields,record.fields.length,name+' field inventory');fieldCount+=fields
 }
 state.generateExcel('Unit');assert.equal(state.showError,true);assert.equal(navigation.length,0,'Empty agenda selection must not open a download')
 state.selectApplication('TEST-1',true);state.selectApplication('TEST-2',true)
 state.generateExcel('Unit');assert.equal(navigation.at(-1),'/mpmsme/fa/generateExcelNewMeetingAgenda/Unit/TEST-1,TEST-2')
 const {default:config}=await import('../vite.config.js')
 const bypass=config.server.proxy['/mpmsme'].bypass
 assert.equal(bypass({method:'GET',headers:{accept:'text/html,application/xhtml+xml'},url:navigation.at(-1)}),null,'Agenda download must reach Spring rather than the React 404 page')
 assert.equal(bypass({method:'GET',headers:{accept:'text/html'},url:'/mpmsme/fa/home'}),'/index.html','Legacy page navigation still reaches React')
 state.process();assert(alerts.at(-1).includes('select'))
 state.disbursementList=[{applicationId:'TEST-1',check:true,sanctionedAmount:1000,disbursedAmount:0}];state.process();assert(navigation.at(-1).startsWith('/department/fa/faDisbursementUnit_new2/'))
 state.disbursList=[{sanctionedAmount:1000,disbursedAmount:900},{sanctionedAmount:3000,disbursedAmount:0}];state.totalDisbursedAmount=1000;state.distribute();assert.equal(Number(state.disbursList[0].disbursementAmount),100);assert.equal(Number(state.disbursList[1].disbursementAmount),750)
 for(const status of [2,3,5,6,7,8,9,10,12,13,15,17,19])for(const commiteeRequired of [true,false]){
  const cells=dticCells('fa/fapendingapplicantsunit',{applicationId:'TEST-1',currentStatusId:status,commiteeRequired},0,rowRules,tables)
  assert(cells[0].includes('checkbox'))
  if(status===9)assert(cells[5].includes('faDisbursementUnit/TEST-1'))
  if(status===10)assert(cells[5].includes('viewfaDisbursementUnit/TEST-1'))
 }
 for(const [name,build] of Object.entries(reportRows)){
  const rows=[];const table={insertRow(){const cells=[];rows.push(cells);return{insertCell(i){return cells[i]={innerHTML:'',setAttribute(){}}}}}}
  build(table,[{applicationId:3,districtId:1,districtName:'Bhopal',status2:1,status5:0,status9:1,status10:1}],0,{districtId:1,status:2})
  assert(rows.length>=1,name)
 }
 console.log(JSON.stringify({templates:Object.keys(inventory).length,fields:fieldCount,actionBindings:actionCount,statusBranches:28,reportBuilders:Object.keys(reportRows).length}))
}finally{await server.close()}

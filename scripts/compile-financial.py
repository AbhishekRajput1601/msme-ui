"""Compile Financial officer routes, templates, fields, row actions and controller."""
import json,re
from pathlib import Path
from bs4 import BeautifulSoup,Comment
base=Path('scripts/compile-dtic.py').read_text(encoding='utf-8')
ns={}
exec(base[:base.index('java = uncomment')].replace("src/modules/dtic/generated","src/modules/financial/generated").replace('artifacts/dtic-migration','artifacts/financial'),ns)
ROOT,OUT,audit,uncomment,balanced=[ns[k] for k in ['ROOT','OUT','audit','uncomment','balanced']]
java=uncomment((ROOT.parents[3]/'mpindustry-fa/src/main/java/com/mapit/mpindustry/fa/controller/FAController.java').read_text(encoding='utf-8'))
endpoints={}
for m in re.finditer(r'@RequestMapping\(value\s*=\s*"([^"]+)"',java):
 end=java.find('@RequestMapping',m.end()); block=java[m.end():end if end!=-1 else len(java)]
 paths=re.findall(r'(?:new ModelAndView\(|setViewName\()\s*"([^"]+)"',block)
 if paths: endpoints[m[1].strip('/')]=paths
routes=[]
routing=uncomment((ROOT/'angular/fa/FARouting.js').read_text(encoding='utf-8'))
for m in re.finditer(r"\.when\('([^']+)',\s*\{",routing):
 block=routing[m.end():balanced(routing,m.end()-1)]
 if not re.search(r"controller\s*:\s*'FAController'",block): continue
 ep=re.search(r"templateUrl\s*:\s*(?:function\([^)]*\)\s*\{\s*return\s*)?'([^']+)'",block)[1].strip('/')
 candidates=[(k,v) for k,v in endpoints.items() if k.split('/{')[0]==ep]
 paths=next((v for k,v in candidates if k.count('{')==m[1].count(':')),candidates[0][1] if candidates else None)
 aliases={'report':['fa/report'],'viewfaapplicantdetailunitnew':['applicant/fa/viewFADetailUnitNew2'],'viewdownloadfaacceptanceform':['fa/viewfaacceptanceamountdetailunit'],'fa/newapplicantformapparel':['dtic/faApparelInstituteList'],'fa/viewfaDisbursementUnit':['fa/viewfaDisbursementUnit']}
 paths=paths or aliases.get(ep)
 if not paths: raise ValueError((m[1],ep))
 paths=[p.strip('/') for p in paths if 'customError' not in p]
 if ep=='viewfaapplicantdetailunitnew': paths=['fa/viewFADetailUnitNew2']
 route={'path':m[1].lstrip('/'),'views':paths,'endpoint':ep,'controller':'FAController'}
 if not any(r['path']==route['path'] for r in routes): routes.append(route)
missing=[{'route':r['path'],'template':p} for r in routes for p in r['views'] if not (ROOT/'pages'/f'{p}.html').exists()]
(audit/'missing-source.json').write_text(json.dumps(missing,indent=2))
fallbacks={'fa/detailList':'fa/report','fa/viewfaacceptanceamountdetailunit':'dtic/viewfaacceptanceamountdetailunit','fa/faDisbursementUnit_new':'fa/faDisbursementUnit_new1','dtic/faApparelInstituteList':'dtic/fapendingapplicantsapparel','fa/faCommitteeStatusUnit':'dtic/faCommitteeStatusUnit','fa/viewfaCommitteeStatusUnit':'dtic/viewfaCommitteeStatusUnit'}
for r in routes: r['views']=[fallbacks.get(p,p) for p in r['views']]
(audit/'shared-template-substitutions.json').write_text(json.dumps(fallbacks,indent=2))
routes=[r for r in routes if r['path']!='dashboard']
ns.update(routes=routes)
segment=base[base.index('# Reuse the existing reviewed'):base.index('source = uncomment((ROOT / \'angular/dtic/controller.js\')')]
segment=segment.replace("'dtic-page-content'","'financial-page-content'").replace("@scope (.dtic-page)","@scope (.financial-page)")
segment=segment.replace("(audit / 'all-routes.json').write_text(json.dumps(all_routes,indent=2),encoding='utf-8')",'')
segment=segment.replace("    for c in soup.find_all(string=lambda s: isinstance(s, Comment)): c.extract()", "    for element in soup.find_all(['input','img','br','hr','wbr','source','area','col']):\n        for child in reversed(list(element.contents)): element.insert_after(child.extract())\n    for c in soup.find_all(string=lambda s: isinstance(s, Comment)): c.extract()")
# Repair legacy table nesting before generating React nodes.
segment=segment.replace("    for table in soup.find_all('table'):", """    for row in reversed(soup.find_all('tr')):
        while row.parent.name == 'tr': row.parent.insert_after(row.extract())
    for wrapper in list(soup.select('tr > div')):
        if wrapper.find(['td','th'], recursive=False):
            for cell in wrapper.find_all(['td','th'], recursive=False):
                cell['class'] = cell.get('class',[]) + wrapper.get('class',[])
            wrapper.unwrap()
    for body in list(soup.select('thead > tbody')):
        body.parent.insert_after(body.extract())
    for table in soup.find_all('table'):""")
exec(segment,ns)
source=uncomment((ROOT/'angular/fa/FAController.js').read_text(encoding='utf-8'))
functions={}; spans=[]
for m in re.finditer(r'\$scope\.(\w+)\s*=\s*function\s*\([^)]*\)\s*\{',source):
 end=balanced(source,m.end()-1); functions[m[1]]=source[m.start():end]+';'; spans.append((m.start(),end))
# Shared functions referenced by Financial's reused applicant/DTIC templates.
needed={'ShowHideDisbursementDetails','calcTotal','calcTotalCompExpUnderID','calcTotalProductAnnualAmt','downloadAcceptanceLetter','downloadFaDocumentsByApplicant','getApplicationId','uploadAcceptanceLetter','loadCommitteeStatus','addCommitteeStatus','loadFAMSMEDetailUnitForSanction'}
for shared in ['angular/applicant/fa/controller.js','angular/dtic/controller.js']:
 shared_source=uncomment((ROOT/shared).read_text(encoding='utf-8'))
 for m in re.finditer(r'\$scope\.(\w+)\s*=\s*function\s*\([^)]*\)\s*\{',shared_source):
  if m[1] in needed and m[1] not in functions:
   functions[m[1]]=shared_source[m.start():balanced(shared_source,m.end()-1)]+';'
left=source
for start,end in reversed(spans): left=left[:start]+left[end:]
initializers='\n'.join(m[0] for m in re.finditer(r'\$scope\.\w+\s*=\s*(?:\{[^;]*?\}|\[[^;]*?\]|[^;\n]+);',left))
(audit/'initializers.txt').write_text(initializers,encoding='utf-8')
helpers=[]
for m in re.finditer(r'function (\w+)\([^)]*\)\s*\{',source):
 if m[1]=='formatDate': helpers.append(source[m.start():balanced(source,m.end()-1)])
body=initializers+'\n'+'\n'.join(helpers)+'\n'+'\n'.join(code for name,code in functions.items() if name not in {'loadPendingApplicantList','loadInfrastructureList','loadDateTimePicker'})
for a,b in [('$rootScope','state'),('$scope','state'),('$window','navigation'),('$http','request'),('$loading','loading'),('$routeParams','params'),('$filter','format'),('$timeout','later'),('angular.forEach','each'),('angular.identity','identity'),('angular.toJson','JSON.stringify'),('angular.fromJson','JSON.parse'),('angular.copy','structuredClone')]: body=body.replace(a,b)
body=re.sub(r'(?<!\w)\$\(', 'dom(',body)
body=body.replace('window.location.href =', 'navigation.location.href =')
body=re.sub(r'var contextPath = [^;]+;', "var contextPath = '/mpmsme';", body)
body=body.replace('orderDate1= state.entryDate1','var orderDate1= state.entryDate1').replace('orderDate2 = state.entryDate2','var orderDate2 = state.entryDate2').replace('dticId = i;', 'var dticId = i;')
header='''// Generated from angular/fa/FAController.js; explicit React IO adapters.
export function installFinancialActions(state, {request,navigation,loading,params,format,later,dom}) {
const each=(items,fn)=>Object.entries(items||{}).forEach(([k,v])=>fn(v,Array.isArray(items)?Number(k):k));
const identity=value=>value;
'''
(OUT/'actions.js').write_text(header+body+'\n}',encoding='utf-8')
rows={}; tables={}; scripts={}
for name in ns['inventory']:
 soup=BeautifulSoup((ROOT/'pages'/f'{name}.html').read_text(encoding='utf-8'),'html.parser')
 script=uncomment('\n'.join(s.get_text() for s in soup.find_all('script'))); scripts[name]=script
 m=re.search(r'["\']fnCreatedRow["\']\s*:\s*function\s*\([^)]*\)\s*\{',script)
 endpoint=re.search(r'["\']sAjaxSource["\']\s*:\s*["\']([^"\']+)',script)
 columns=re.search(r'["\']aoColumns["\']\s*:\s*\[([\s\S]*?)\]',script)
 if endpoint and columns:
  tables[name]={'endpoint':endpoint[1],'columns':[json.loads(c) for c in re.findall(r'"mData"\s*:\s*(null|"[^"]+")',columns[1])]}
  if m: rows[name]=script[m.end():balanced(script,m.end()-1)-1].replace('$(', 'cell(')
(OUT/'rows.js').write_text('export const rowRules = {\n'+',\n'.join(json.dumps(k)+': (cell,nRow,aData,iDataIndex)=>{'+v+'}' for k,v in rows.items())+'\n}',encoding='utf-8')
(OUT/'tables.json').write_text(json.dumps(tables,indent=2),encoding='utf-8')
(audit/'scripts.json').write_text(json.dumps(scripts,indent=2),encoding='utf-8')
(audit/'actions.json').write_text(json.dumps(list(functions),indent=2),encoding='utf-8')
print('Routes:',len(routes),'Templates:',len(ns['inventory']),'Actions:',len(functions),'Tables:',len(tables))
# Compile report table builders (including totals) as static functions over inert cells.
report_names={'fa/financialReportDitrictWise':'districtReportJs','fa/financialReportSchemeWise':'schemeReportJs','fa/sanctionedVsDisbursementReport':'sanctionedReport','fa/msmeDetailsReportDistrictWise':'msmeDetailDistrictWiseReportJs','fa/msmeDetailReportList':'msmeDetailListReportJs','fa/report':'reportJs','fa/reportScheme':'reportScheme'}
configs={}; builders=[]
for name,filename in report_names.items():
 s=uncomment((ROOT/f'angular/fa/{filename}.js').read_text(encoding='utf-8'))
 endpoint=re.search(r"url\s*:\s*baseUrl\s*\+\s*['\"]/([^'\"]+)",s)[1]
 export=re.search(r'baseUrl\s*\+\s*"/([^"?]+)\?type=excel',s)[1]
 configs[name]={'endpoint':endpoint,'export':export}
 if name=='fa/report': configs['detailList']={'endpoint':'dashboardReportData','export':export}
 funcs=[]
 for function in ['prepareApplicationList','createRowForApplicationList']:
  m=re.search(r'function '+function+r'\([^)]*\)\s*\{',s)
  if m: funcs.append(s[m.start():balanced(s,m.end()-1)])
 body='\n'.join(funcs).replace("$('#applicationListData').html('');",'').replace("document.getElementById('applicationListData')",'table')
 body=body.replace('for (i in dataList)', 'for (const i in dataList)')
 builders.append(json.dumps(name)+': (table,dataList,startRecord,params)=>{\nconst {districtId,status,scheme}=params;\nconst recordNotFound="Record not found !! Try again";\n'+body+'\nprepareApplicationList(dataList);\n}')
(OUT/'reportRows.js').write_text('export const reportRows={\n'+',\n'.join(builders)+'\n}',encoding='utf-8')
(OUT/'reports.json').write_text(json.dumps(configs,indent=2),encoding='utf-8')
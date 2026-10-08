"""Compile land templates and DataTables row rules into static React metadata/JS."""
import json,re
from pathlib import Path
from bs4 import BeautifulSoup,Comment
ROOT=Path('E:/eclipse/MSME%20-%20LAND%20ALLOTMENT%20AND%20FINANCIAL%20ASSISTANCE/mpindustry-web/src/main/webapp')
OUT=Path('src/modules/id/applicant/reference/generated');OUT.mkdir(parents=True,exist_ok=True)
# Share the reviewed expression compiler, without running its output stage.
compiler=Path('scripts/compile-industrial-unit.py').read_text(encoding='utf-8').split("NAMES += ['viewfaInfrastructure']")[0]
ns={};exec(compiler.replace("OUT = Path('src/modules/industrial-unit/generated')", "OUT = Path('src/modules/id/applicant/reference/generated')"),ns)
names=['vacantLandList','vacantLandListUN','applicationList','annualPayments','noticeAppealList','applicantAnnualPayment','viewAnnualPaymentHistory','viewAnnualPaymentDetails','enterCompliance','viewCompliance','newAppeal','newAppealForIC','viewAppeal','viewAppealForIC','viewAppealHearing','enterConditionalComplianceZO','enterConditionalComplianceIC','viewZOConditionalDecision','viewICConditionalDecision','uploadLOCLetter','viewLOCDetails','uploadPossessionLetter','idInstruction','idInstructionUL']
lex=re.compile(r'''"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`|/\*[\s\S]*?\*/|//[^\n]*|[\s\S]''')
def clean(s):return ''.join(t for t in lex.findall(s) if not t.startswith(('//','/*')))
def block(s,start):
 depth=0
 for m in lex.finditer(s,start):
  if m[0]=='{':depth+=1
  elif m[0]=='}':
   depth-=1
   if not depth:return s[start:m.end()]
 raise ValueError('Unbalanced')
rows=[];configs={};inventory={};page_styles=[]
for name in names:
 source=(ROOT/'pages/applicant/id'/f'{name}.html').read_text(encoding='utf-8')
 soup=BeautifulSoup(source,'html.parser')
 for c in soup.find_all(string=lambda x:isinstance(x,Comment)):c.extract()
 # The browser repairs these malformed letter tables in the legacy HTML.
 for group in soup.select('thead,tbody,tfoot'):
  cells=group.find_all(['td','th'],recursive=False)
  if cells:
   row=soup.new_tag('tr');cells[0].insert_before(row)
   for cell in cells:row.append(cell.extract())
 for cell in soup.select('p > td, p > th'):cell.name='span'
 for table in soup.find_all('table'):
  trs=table.find_all('tr',recursive=False)
  if trs:
   body=soup.new_tag('tbody');trs[0].insert_before(body)
   for tr in trs:body.append(tr.extract())
 # file-model is absent on original notice inputs; its file directive supplies this binding.
 for el in soup.select('input[type=file]'):
  if not el.get('file-model') and not el.get('data-ng-model'):
   el['file-model']=el.get('ng-file-select') or el.get('name') or el.get('id')
 inventory[name]={'source':f'pages/applicant/id/{name}.html','fields':[dict(e.attrs) for e in soup.select('input,select,textarea')],'events':sorted(set(v for e in soup.find_all() for k,v in e.attrs.items() if re.match('(data-)?ng-(init|click|change|submit)',k)))}
 style_start=len(ns['styles'])
 data=[n for el in soup.children if (n:=ns['node'](el)) is not None]
 page_styles.append('@scope (.land-reference-page[data-view="'+name+'"]) {\n'+'\n'.join(ns['styles'][style_start:])+'\n}')
 (OUT/f'{name}.json').write_text(json.dumps(data,ensure_ascii=False,separators=(',',':')),encoding='utf-8')
 if name in names[:5]:
  js=clean('\n'.join(s.get_text() for s in soup.find_all('script')))
  match=re.search(r'"fnCreatedRow"\s*:\s*function\s*\([^)]*\)\s*({)',js)
  body=block(js,match.start(1)).replace('$(', 'cell(')
  rows.append(f'{name}(cell,nRow,aData,iDataIndex) {body}')
  colpart=js.split('"aoColumns"')[1]
  columns=[None if m=='null' else m.strip('"') for m in re.findall(r'"mData"\s*:\s*(null|"[^"]+")',colpart)]
  sortable=[v=='true' for v in re.findall(r'"bSortable"\s*:\s*(true|false)',colpart)]
  configs[name]={'endpoint':re.search(r'"sAjaxSource"\s*:\s*"([^"]+)"',js)[1],'columns':columns,'sortable':sortable,'placeholder':'District/ Tehsil' if name.startswith('vacant') else 'Application ID'}
(OUT/'rows.js').write_text('// Static port of the original fnCreatedRow branches; no jQuery or eval.\nexport const rowRules = {\n'+',\n'.join(rows)+'\n}\n',encoding='utf-8')
(OUT/'tables.json').write_text(json.dumps(configs,indent=2),encoding='utf-8')
lines=["import { filter } from '../../../../industrial-unit/viewHelpers'",'export const expressions = [']
for source,statement in ns['expressions']:
 code=ns['js'](source)
 lines.append('s => {'+code+'},' if statement else 's => ('+code+'),')
(OUT/'expressions.js').write_text('\n'.join(lines)+'\n]\n',encoding='utf-8')
(OUT/'views.js').write_text('\n'.join('import '+n+" from './"+n+".json'" for n in names)+'\nexport default {'+','.join(names)+'}\n',encoding='utf-8')
(OUT/'reference.css').write_text('\n'.join(page_styles),encoding='utf-8')
audit=Path('artifacts/land-allotment');audit.mkdir(exist_ok=True)
(audit/'reference-inventory.json').write_text(json.dumps(inventory,ensure_ascii=False,indent=2),encoding='utf-8')
print('Compiled',len(names),'templates and',len(ns['expressions']),'bindings; tables:',{k:len(v['columns']) for k,v in configs.items()})

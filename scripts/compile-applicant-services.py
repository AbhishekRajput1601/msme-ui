"""Port the applicant NOC, bank and MSME templates and reachable award actions.

Run from the UI root. The legacy checkout is read only; output is static React
view metadata and ordinary JavaScript, never a browser Angular runtime.
"""
import json
import re
from pathlib import Path
from bs4 import BeautifulSoup, Comment

ROOT = Path('E:/eclipse/MSME%20-%20LAND%20ALLOTMENT%20AND%20FINANCIAL%20ASSISTANCE/mpindustry-web/src/main/webapp')
OUT = Path('src/modules/applicant-services/generated')
OUT.mkdir(parents=True, exist_ok=True)
(OUT/'datepicker.css').write_text((ROOT/'css/jquery.datetimepicker.css').read_text(encoding='utf-8'), encoding='utf-8')
compiler = Path('scripts/compile-industrial-unit.py').read_text(encoding='utf-8').split("NAMES += ['viewfaInfrastructure']")[0]
ns = {}
exec(compiler.replace("OUT = Path('src/modules/industrial-unit/generated')", "OUT = Path('src/modules/applicant-services/generated')"), ns)
pages = {'addBankDetails':'bank', 'banksList':'bank', 'mpidcServices':'applicant', 'applicantAwardList':'msme', 'applyMsmeAwardForm':'msme', 'editMsmeAwardForm':'msme', 'viewMsmeAwardForm':'msme', 'msmeAwardDocUploadForm':'msme'}
inventory = {}
styles = []
for name, folder in pages.items():
    path = ROOT/'pages'/folder/(name+'.html')
    soup = BeautifulSoup(path.read_text(encoding='utf-8'), 'html.parser')
    for c in soup.find_all(string=lambda x:isinstance(x, Comment)): c.extract()
    inventory[name] = {'source':str(path.relative_to(ROOT)), 'fields':[dict(e.attrs) for e in soup.select('input,select,textarea')], 'events':sorted(set(v for e in soup.find_all() for k,v in e.attrs.items() if re.match(r'(data-)?ng-(init|click|change|blur|submit)', k)))}
    if name == 'addBankDetails':
        soup.select_one('form')['ng-submit'] = 'addBank()'
        del soup.select_one('button[type=submit]')['ng-click']
        # The reference points this validation at an absent bankForm and $index.
        soup.select_one('select')['name'] = 'bankName'
        for el in soup.select('[data-ng-show]'):
            if 'bankForm.bankName_' in el['data-ng-show']:
                el['data-ng-show'] = '(signupForm.$submitted || signupForm.bankName.$touched) && signupForm.bankName.$error.required'
    # Styles in head are skipped by the shared compiler; retain them explicitly.
    css = '\n'.join(e.get_text() for e in soup.find_all('style'))
    css = re.sub(r'@\s+keyframes', '@keyframes', css)
    styles.append('@scope (.applicant-services-page[data-view="'+name+'"]) {\n'+css+'\n}')
    for table in soup.find_all('table'):
        rows = table.find_all('tr', recursive=False)
        if rows:
            body = soup.new_tag('tbody'); rows[0].insert_before(body)
            for row in rows: body.append(row.extract())
    # The native browser normalizes tag case and malformed option closing tags.
    for el in soup.select('input[type=file]'):
        model = el.get('file-model')
        if model and '{{' in model:
            el['file-model'] = re.sub(r'\.(\w+)_\{\{\$index\}\}', r"['\1_' + $index]", model)
    data = [n for el in soup.children if (n := ns['node'](el)) is not None]
    (OUT/(name+'.json')).write_text(json.dumps(data, ensure_ascii=False, separators=(',',':')), encoding='utf-8')
(OUT/'views.js').write_text('\n'.join('import '+n+" from './"+n+".json'" for n in pages)+'\nexport default {'+','.join(pages)+'}\n', encoding='utf-8')
lines = ["import { filter } from '../../industrial-unit/viewHelpers'", 'export const expressions = [']
for source, statement in ns['expressions']:
    code = ns['js'](source)
    lines.append('s => {'+code+'},' if statement else 's => ('+code+'),')
(OUT/'expressions.js').write_text('\n'.join(lines)+'\n]\n', encoding='utf-8')
(OUT/'reference.css').write_text('\n'.join(styles), encoding='utf-8')

lex = re.compile(r'''"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`|/\*[\s\S]*?\*/|//[^\n]*|[\s\S]''')
source = (ROOT/'angular/applicant/msme/controller.js').read_text(encoding='utf-8')
source = ''.join(t for t in lex.findall(source) if not t.startswith(('//','/*')))
def block(start):
    depth = 0
    for m in lex.finditer(source, start):
        if m[0] == '{': depth += 1
        elif m[0] == '}':
            depth -= 1
            if not depth: return m.end()
    raise ValueError('Unbalanced action')
functions = {}
for m in re.finditer(r'\$scope\.(\w+)\s*=\s*function\s*\([^)]*\)\s*\{', source):
    functions[m[1]] = source[m.start():block(m.end()-1)]+';'
names = set(re.findall(r's\.(\w+)\(', '\n'.join(lines)))
manual = {'fetchAwards','loadBanks','addBank','fetchBankList','updateBank','cancelEdit'}
selected = {}
queue = list(names)
while queue:
    name = queue.pop()
    if name in manual or name in selected or name not in functions: continue
    selected[name] = functions[name]
    queue += re.findall(r'\$scope\.(\w+)\(', functions[name])
body = '\n\n'.join(selected[name] for name in sorted(selected))
for a,b in [('$rootScope','state'),('$scope','state'),('$http','request'),('$loading','loading'),('$window','navigation'),('$routeParams','params'),('$timeout','later'),('$filter','format'),('angular.forEach','each'),('angular.identity','identity')]: body = body.replace(a,b)
(OUT/'actions.js').write_text('// Ported from angular/applicant/msme/controller.js. Regenerate with compile-applicant-services.py.\nexport function installAwardActions(state, { request, loading, navigation, params, later, format }) {\nconst each = (items, fn) => Object.entries(items || {}).forEach(([k,v]) => fn(v,k));\nconst identity = value => value;\n'+body+'\n}\n', encoding='utf-8')
audit = Path('artifacts/applicant-services'); audit.mkdir(parents=True, exist_ok=True)
(audit/'reference-inventory.json').write_text(json.dumps(inventory, ensure_ascii=False, indent=2), encoding='utf-8')
(audit/'action-coverage.json').write_text(json.dumps({'ported':sorted(selected), 'manual':sorted(manual), 'missing':sorted(names - selected.keys() - manual)}, indent=2), encoding='utf-8')
print('Compiled', len(pages), 'pages,', sum(len(p['fields']) for p in inventory.values()), 'field declarations and', len(selected), 'award actions. Missing:', names-selected.keys()-manual)

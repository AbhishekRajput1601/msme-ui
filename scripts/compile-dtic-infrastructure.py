"""Compile the DTIC infrastructure reference without overwriting other migrations."""
import json
import re
from pathlib import Path
from bs4 import BeautifulSoup, Comment

ROOT = Path('E:/eclipse/MSME%20-%20LAND%20ALLOTMENT%20AND%20FINANCIAL%20ASSISTANCE/mpindustry-web/src/main/webapp')
OUT = Path('src/modules/dtic/infrastructure/generated')
AUDIT = Path('artifacts/dtic-infrastructure')
OUT.mkdir(parents=True, exist_ok=True)
AUDIT.mkdir(parents=True, exist_ok=True)
lex = re.compile(r'''"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`|/\*[\s\S]*?\*/|//[^\n]*|[\s\S]''')
def uncomment(s):
    return ''.join(t for t in lex.findall(s) if not t.startswith(('//', '/*')))
def balanced(s, start):
    depth = 0
    for t in lex.finditer(s, start):
        if t[0] == '{': depth += 1
        elif t[0] == '}':
            depth -= 1
            if not depth: return t.end()
    raise ValueError('Unbalanced source')

endpoints = {}
for java_path in ROOT.parents[3].glob('*/src/main/java/**/*Controller.java'):
    if java_path.name not in ('IDDTICController.java', 'DTICController.java'): continue
    source = uncomment(java_path.read_text(encoding='utf-8'))
    for m in re.finditer(r'@RequestMapping\(\s*(?:value\s*=\s*)?"([^"]+)"', source):
        end = source.find('@RequestMapping', m.end())
        block = source[m.end():end if end != -1 else len(source)]
        views = list(dict.fromkeys(re.findall(r'(?:new ModelAndView\(|setViewName\()\s*"([^"]+)"', block)))
        if views:
            endpoints['/' + m[1].split('/{')[0].strip('/')] = [v for v in views if 'customError' not in v]
            (AUDIT / ('endpoint-' + m[1].strip('/').replace('/', '_').replace('{','').replace('}','') + '.txt')).write_text(block, encoding='utf-8')
routes = []
routing = uncomment((ROOT / 'angular/dtic/routing.js').read_text(encoding='utf-8'))
for m in re.finditer(r"\.when\('([^']+)',\s*\{", routing):
    block = routing[m.end():balanced(routing, m.end()-1)]
    if not re.search(r"controller\s*:\s*'DTICIDController'", block): continue
    if m[1].startswith(('/supplierInfo', '/eSingAOLetter')) and m[1] == '/supplierInfo': continue
    if m[1].split('/')[1] in ('dashboard', 'legacyData', 'enrolmentList', 'viewEnrolment', 'viewenrolmentform', 'completeDataOfLandApplicant', 'esignPaymentPendencyReport', 'id') and m[1].startswith(('/legacyData', '/enrolment', '/viewEnrolment', '/viewenrolment', '/completeData', '/esignPayment', '/id/editViewLegacyData')): continue
    endpoint = re.search(r"templateUrl:\s*(?:function\([^)]*\)\s*\{\s*return\s*)?'([^']+)'", block)
    endpoint = '/' + endpoint[1].strip('/')
    if endpoint not in endpoints: raise ValueError(('Missing endpoint', m[1], endpoint))
    routes.append(dict(path=m[1].lstrip('/'), endpoint=endpoint, views=endpoints[endpoint], controller='DTICIDController'))

ns = {}
exec(compile(Path('scripts/compile-industrial-unit.py').read_text(encoding='utf-8').split('NAMES +=')[0], 'binding-compiler', 'exec'), ns)
views = {}; inventory = {}; tables = {}; rows = {}; scripts = {}; page_styles = {}
pending = list(dict.fromkeys(v for r in routes for v in r['views']))
while pending:
    name = pending.pop(0)
    if name in views: continue
    path = ROOT / 'pages' / (name + '.html')
    soup = BeautifulSoup(path.read_text(encoding='utf-8'), 'html.parser')
    # One signing template nests <head> tags around the page itself.
    # Unwrap them so the shared compiler does not discard that form.
    for head in soup.find_all('head'): head.unwrap()
    # HTML void elements cannot contain children. Repair legacy stray closing
    # tags before compiling so React does not silently drop following fields.
    for element in soup.find_all(['input','img','br','hr','wbr','source','area','col']):
        for child in reversed(list(element.contents)): element.insert_after(child.extract())
    for c in soup.find_all(string=lambda s: isinstance(s, Comment)): c.extract()
    page_styles[name] = [style.get_text() for style in soup.find_all('style')]
    for style in soup.find_all('style'):
        ns['styles'].append(style.get_text()); style.extract()
    for wrapper in soup.select('#page-wrapper'): wrapper['id'] = 'dtic-page-content'
    for el in soup.select('[th\\:replace]'): pending.append(el['th:replace'].split('::')[0].strip())
    for el in soup.find_all():
        # These directives were provided by Angular and the old date/number widgets.
        if el.get('data-ng-keyup'): el['data-ng-change'] = el.get('data-ng-change', '') + ';' + el['data-ng-keyup']
        if el.get('ng-maxlength'): el['maxlength'] = el['ng-maxlength']
    for table in soup.find_all('table'):
        direct = table.find_all('tr', recursive=False)
        if direct:
            tbody = soup.new_tag('tbody'); direct[0].insert_before(tbody)
            for tr in direct: tbody.append(tr.extract())
    script = uncomment('\n'.join(s.get_text() for s in soup.find_all('script')))
    scripts[name] = script
    inventory[name] = dict(source=str(path.relative_to(ROOT)), fields=[dict(e.attrs) for e in soup.select('input,select,textarea')],
        events=sorted(set(str(v) for e in soup.find_all() for k,v in e.attrs.items() if re.match(r'(data-)?ng-(click|change|submit|init)', k))),
        links=[dict(e.attrs) for e in soup.select('a')], directives=sorted(set(k for e in soup.find_all() for k in e.attrs if 'ng-' in k)),
        inlineEvents=[dict(e.attrs) for e in soup.select('[onclick],[onchange],[onblur]')])
    views[name] = [n for child in soup.children if (n := ns['node'](child)) is not None]
    views[name.split('/')[-1]] = views[name]
    endpoint = re.search(r'["\']sAjaxSource["\']\s*:\s*["\']([^"\']+)["\']', script)
    columns = re.search(r'["\']aoColumns["\']\s*:\s*\[([\s\S]*?)\]', script)
    row = re.search(r'["\']fnCreatedRow["\']\s*:\s*function\s*\([^)]*\)\s*\{', script)
    if endpoint and columns:
        cols = re.findall(r'["\']mData["\']\s*:\s*(null|["\'][^"\']+["\'])', columns[1])
        tables[name] = dict(endpoint=endpoint[1], columns=[None if c=='null' else c[1:-1] for c in cols], pagingType='full_numbers')
        if row:
            rows[name] = script[row.end():balanced(script,row.end()-1)-1].replace('$(', 'cell(')
            # Applicants without a notice still have an Issue Notice action.
            rows[name] = rows[name].replace('aData.idNoticeBean.zoAppealBean', 'aData.idNoticeBean?.zoAppealBean').replace('aData.idNoticeBean.icAppealBean', 'aData.idNoticeBean?.icAppealBean')

source = uncomment((ROOT / 'angular/dtic/controller.js').read_text(encoding='utf-8'))
start = source.index("'DTICIDController'")
end = source.find('.controller(', start)
source = source[start:end]
body_start = source.index('{') + 1
source = source[body_start:source.rfind('}')]
functions = {}; spans = []
for m in re.finditer(r'\$scope\.(\w+)\s*=\s*(?:async\s+)?function\s*\([^)]*\)\s*\{', source):
    end = balanced(source,m.end()-1)
    functions[m[1]] = source[m.start():end]+';'
    spans.append((m.start(),end))
left = source
for start,end in reversed(spans): left = left[:start]+left[end:]
(AUDIT/'controller-initializers.txt').write_text(left,encoding='utf-8')
initializers = []
# Only retain assignments at controller scope, never assignments inside idle callbacks.
depth=0; positions=set()
for token in lex.finditer(left):
    if depth==0: positions.add(token.start())
    if token[0]=='{': depth+=1
    elif token[0]=='}': depth-=1
for m in re.finditer(r'(?:\$scope\.\w+|(?:var|let|const)\s+\w+)\s*=\s*[^;]+;',left):
    if m.start() in positions: initializers.append(m[0])
helpers = []
for m in re.finditer(r'function\s+(\w+)\s*\([^)]*\)\s*\{',left):
    if m[1] != 'closeModals': helpers.append(left[m.start():balanced(left,m.end()-1)])
body = '\n'.join(initializers+helpers+list(functions.values()))
# Leaflet rendering is owned by the React map component, not controller globals.
for m in reversed(list(re.finditer(r'if\s*\(polygonCoords.length > 0\)\s*\{', body))):
    end = balanced(body,m.end()-1)
    body = body[:m.start()] + 'state.setMapPolygon(polygonCoords);' + body[end:]
body = re.sub(r'angular\s*\.\s*forEach','each',body)
for a,b in [('$rootScope','state'),('$scope','state'),('$http','request'),('$loading','loading'),('$routeParams','params'),('$window','navigation'),('$filter','format'),('$timeout','later'),('angular.identity','identity'),('angular.toJson','JSON.stringify'),('angular.fromJson','JSON.parse'),('angular.copy','structuredClone')]: body=body.replace(a,b)
body = re.sub(r'(?<!\w)\$\(', 'dom(',body)
body = body.replace('angular.element(', 'dom(').replace('angular.equals(', 'Object.is(')
body = body.replace('$.param(', 'encodeForm(')
body = body.replace('selectedArea.value &&', 'selectedArea?.value &&').replace('alert(111);', '')
body = re.sub(r'for\s*\(\s*([ijk])\s*=',r'for (var \1 =',body)
header = '''// Generated from the legacy DTICIDController; React supplies IO adapters.
export function installInfrastructureActions(state, { request, loading, params, navigation, format, later, dom }) {
const each = (items, fn) => Object.entries(items || {}).forEach(([k,v]) => fn(v, Array.isArray(items) ? Number(k) : k));
const identity = value => value;
const encodeForm = value => new URLSearchParams(value).toString();
const refresh = () => { state.listVersion++; loading.finish(); state.notify(); };
const fetchApplicationList = refresh, fetchLandAllotmentList = refresh, reDraw = refresh, fetchLandAllotmentListForGroupLOI = refresh;
'''
(OUT/'actions.js').write_text(header+body+'\n}\n',encoding='utf-8')
(OUT/'routes.json').write_text(json.dumps(routes,indent=2),encoding='utf-8')
(OUT/'views.json').write_text(json.dumps(views,ensure_ascii=False,separators=(',',':')),encoding='utf-8')
(OUT/'tables.json').write_text(json.dumps(tables,indent=2),encoding='utf-8')
(OUT/'rows.js').write_text('export const rowRules = {\n'+',\n'.join(json.dumps(k)+': (cell,nRow,aData,iDataIndex) => {\n'+v+'\n}' for k,v in rows.items())+'\n}\n',encoding='utf-8')
lines=["import { filter } from '../../../industrial-unit/viewHelpers'",'export const expressions = [']
for source,statement in ns['expressions']:
    source = re.sub(r'\{\{(.*?)\}\}',r'\1',source).replace('--', '- -')
    source = re.sub(r'\(([^()|]+)\|\s*number\s*:\s*(\d+)\)',r'Number(\1).toFixed(\2)', source)
    code=ns['js'](source)
    lines.append('s => {'+code+'},' if statement else 's => ('+code+'),')
(OUT/'expressions.js').write_text('\n'.join(lines+ [']']),encoding='utf-8')
css = '\n'.join('@scope (.dtic-infrastructure[data-dtic-view="'+name+'"]) {\n'+'\n'.join(styles)+'\n}' for name,styles in page_styles.items() if styles)
css = css.replace('../fonts/', '/mpmsme/fonts/').replace('../img/', '/mpmsme/img/')
(OUT/'reference.css').write_text(css,encoding='utf-8')
(AUDIT/'inventory.json').write_text(json.dumps(inventory,ensure_ascii=False,indent=2),encoding='utf-8')
(AUDIT/'template-scripts.json').write_text(json.dumps(scripts,ensure_ascii=False,indent=2),encoding='utf-8')
(AUDIT/'actions.json').write_text(json.dumps({'functions':list(functions),'initializers':initializers},indent=2),encoding='utf-8')
print(f'{len(routes)} routes, {len(inventory)} templates, {sum(len(v["fields"]) for v in inventory.values())} fields, {len(functions)} actions, {len(tables)} server tables')

"""Compile DTIC FA source templates and business actions to static React metadata.

No Angular runtime, template requests, eval, or script injection is used in React.
Source files are read only. Keep route and field inventories for parity review.
"""
import json
import re
from pathlib import Path
from bs4 import BeautifulSoup, Comment

ROOT = Path('E:/eclipse/MSME%20-%20LAND%20ALLOTMENT%20AND%20FINANCIAL%20ASSISTANCE/mpindustry-web/src/main/webapp')
OUT = Path('src/modules/dtic/generated')
OUT.mkdir(parents=True, exist_ok=True)
audit = Path('artifacts/dtic-migration')
audit.mkdir(parents=True, exist_ok=True)
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

java = uncomment((ROOT.parents[3] / 'mpindustry-fa/src/main/java/com/mapit/mpindustry/fa/controller/FADTICController.java').read_text(encoding='utf-8'))
endpoints = {}
for m in re.finditer(r'@RequestMapping\(value\s*=\s*"([^"]+)"', java):
    end = java.find('@RequestMapping', m.end())
    block = java[m.end():end if end != -1 else len(java)]
    templates = re.findall(r'(?:new ModelAndView\(|setViewName\()\s*"([^"]+)"', block)
    if templates: endpoints[m[1].split('/{')[0].rstrip('/')] = templates

routing = uncomment((ROOT / 'angular/dtic/routing.js').read_text(encoding='utf-8'))
routes = []
all_routes = []
for m in re.finditer(r"\.when\('([^']+)',\s*\{", routing):
    block = routing[m.end():balanced(routing, m.end()-1)]
    controller = re.search(r"controller:\s*'([^']+)'", block)
    controller = controller[1] if controller else None
    endpoint = re.search(r"templateUrl:\s*(?:function\([^)]*\)\s*\{\s*return\s*)?'([^']+)'", block)
    all_routes.append({'route': m[1], 'controller': controller, 'templateExpression': block.strip()})
    if controller != 'DTICFAController': continue
    endpoint = '/' + endpoint[1].rstrip('/')
    paths = endpoints.get(endpoint)
    if not paths:
        if endpoint == '/fa/fetchfaschemes': paths = ['applicant/fa/viewFASchemesUnit']
        else: raise ValueError((m[1], endpoint))
    routes.append({'path': m[1].lstrip('/'), 'views': paths, 'endpoint': endpoint, 'controller': controller})

EXTRA_CONTROLLERS = {'DTICBudgetPlanningController', 'DTICCoordinationController', 'AuditDTICController', 'DTICSelfEmploymentController', 'CommonController'}
extra_endpoints = {
    '/letterList': ['employee/letterList'],
    '/viewLetter': ['cmcs/viewLetter'],
    '/updateProcess': ['cmcs/updateProcess'],
    '/loadHistory': ['cmcs/cmcsHistory'],
}
for java_path in ROOT.parents[3].glob('*/src/main/java/**/*Controller.java'):
    if not any(word in java_path.name for word in ['DTICBudget', 'DTICCoordination', 'AuditDTIC', 'SelfEmploymentDTIC']): continue
    text = uncomment(java_path.read_text(encoding='utf-8'))
    for m in re.finditer(r'@RequestMapping\(value\s*=\s*"([^"]+)"', text):
        end = text.find('@RequestMapping',m.end())
        block = text[m.end():end if end != -1 else len(text)]
        paths = re.findall(r'(?:new ModelAndView\(|setViewName\()\s*"([^"]+)"',block)
        if paths: extra_endpoints[m[1].split('/{')[0].rstrip('/')] = paths
for item in all_routes:
    if item['controller'] not in EXTRA_CONTROLLERS: continue
    endpoint = re.search(r"templateUrl:\s*(?:function\([^)]*\)\s*\{\s*return\s*)?'([^']+)'", item['templateExpression'])
    if not endpoint: continue
    endpoint = '/' + endpoint[1].rstrip('/')
    if endpoint not in extra_endpoints: continue
    routes.append({'path':item['route'].lstrip('/'), 'views':extra_endpoints[endpoint], 'endpoint':endpoint, 'controller':item['controller']})

# Reuse the existing reviewed static binding compiler, without running its output phase.
compiler = Path('scripts/compile-industrial-unit.py').read_text(encoding='utf-8').split("NAMES +=")[0]
ns = {}
exec(compile(compiler, 'compile-industrial-unit.py', 'exec'), ns)
ns['expressions'].clear(); ns['styles'].clear(); ns['keys'].clear()
sources = list(dict.fromkeys(v for r in routes for v in r['views']))
views = {}; inventory = {}
while sources:
    name = sources.pop(0)
    if name in views: continue
    path = ROOT / 'pages' / (name + '.html')
    soup = BeautifulSoup(path.read_text(encoding='utf-8'), 'html.parser')
    for c in soup.find_all(string=lambda s: isinstance(s, Comment)): c.extract()
    for style in soup.find_all('style'):
        ns['styles'].append(style.get_text())
        style.extract()
    for table in soup.find_all('table'):
        rows = table.find_all('tr', recursive=False)
        if rows:
            body = soup.new_tag('tbody'); rows[0].insert_before(body)
            for row in rows: body.append(row.extract())
    # Avoid nesting the portal layout container inside the page content.
    for wrapper in soup.select('#page-wrapper'): wrapper['id'] = 'dtic-page-content'
    for el in soup.select('[th\\:replace]'):
        target = el['th:replace'].split('::')[0].strip()
        sources.append(target)
    inventory[name] = {
        'fields': [dict(e.attrs) for e in soup.select('input, select, textarea')],
        'events': sorted(set(str(v) for e in soup.find_all() for k,v in e.attrs.items() if re.match(r'(data-)?ng-(click|change|submit|init)', k))),
        'inlineScripts': len(soup.find_all('script')),
    }
    views[name] = [n for child in soup.children if (n := ns['node'](child)) is not None]
    # The shared renderer resolves fragment names by basename.
    views[name.split('/')[-1]] = views[name]

(OUT / 'views.json').write_text(json.dumps(views,ensure_ascii=False,separators=(',',':')),encoding='utf-8')
lines = ["import { filter } from '../../industrial-unit/viewHelpers'", 'export const expressions = [']
for source, statement in ns['expressions']:
    code = ns['js'](source)
    lines.append('s => {' + code + '},' if statement else 's => (' + code + '),')
lines.append(']')
(OUT / 'expressions.js').write_text('\n'.join(lines),encoding='utf-8')
(OUT / 'reference.css').write_text('@scope (.dtic-page) {\n' + '\n'.join(dict.fromkeys(ns['styles'])) + '\n}',encoding='utf-8')
(OUT / 'routes.json').write_text(json.dumps(routes,indent=2),encoding='utf-8')
(audit / 'all-routes.json').write_text(json.dumps(all_routes,indent=2),encoding='utf-8')
(audit / 'fa-fields.json').write_text(json.dumps(inventory,ensure_ascii=False,indent=2),encoding='utf-8')

def repair(s):
    s = re.sub(r'\\u([a-fA-F0-9]{4})', lambda m: chr(int(m[1],16)),s)
    for _ in range(4):
        try: fixed = b''.join(bytes([ord(c)]) if ord(c)<256 else c.encode('cp1252') for c in s).decode('utf-8')
        except (UnicodeError,ValueError): break
        if fixed == s: break
        s = fixed
    return s
translations = {}
for locale in ['en_US','hi_IN']:
    values = {}
    for kind in ['views','application']:
        for line in (ROOT.parent / f'resources/{kind}_{locale}.properties').read_text(encoding='utf-8-sig').splitlines():
            if '=' not in line or line.lstrip().startswith('#'): continue
            k,v = line.split('=',1); values[k.strip()] = repair(v.strip())
    translations[locale[:2]] = values
(OUT / 'translations.json').write_text(json.dumps(translations,ensure_ascii=False,separators=(',',':')),encoding='utf-8')

source = uncomment((ROOT / 'angular/dtic/controller.js').read_text(encoding='utf-8'))
source = source[source.index('$scope.faMsmeDetailData = {}'):source.index("'DTICSelfEmploymentController'")]
functions = {}; spans = []
for m in re.finditer(r'\$scope\.(\w+)\s*=\s*function\s*\([^)]*\)\s*\{', source):
    end = balanced(source,m.end()-1)
    functions[m[1]] = source[m.start():end] + ';'
    spans.append((m.start(),end))
left = source
for start,end in reversed(spans): left = left[:start] + left[end:]
(audit / 'fa-initializers.txt').write_text(left,encoding='utf-8')
manual = {'loadPendingApplicantList','addtoList','removeFromList','forwardBatch','doTheBack'}
body = '\n'.join(code for name,code in functions.items() if name not in manual)
for a,b in [('$scope','$STATE'),('$rootScope','$STATE'),('$window','navigation'),('$http','request'),('$loading','loading'),('$routeParams','params'),('$filter','format'),('$timeout','later'),('angular.forEach','each'),('angular.identity','identity'),('angular.toJson','JSON.stringify'),('angular.fromJson','JSON.parse')]: body = body.replace(a,b)
body = body.replace('$STATE','state').replace('openHistoryPopup(', 'state.openHistoryPopup(')
body = body.replace("+ documentId + '/' + applicationId", "+ state.documentId + '/' + applicationId")
body = re.sub(r'(?<!\w)\$\(', 'dom(', body)
header = '''// Source: angular/dtic/controller.js. Generated static JS, with explicit React IO dependencies.
export function installFaActions(state, { request, loading, navigation, params, format, later, dom }) {
const each = (items, fn) => Object.entries(items || {}).forEach(([k,v]) => fn(v,Array.isArray(items) ? Number(k) : k));
const identity = value => value;
'''
initializers = '\n'.join(m[0] for m in re.finditer(r'\$scope\.\w+\s*=\s*(?:\{[^;]*?\}|\[[^;]*?\]|[^;\n]+);', left))
initializers = initializers.replace('$scope','state')
(OUT / 'faActions.js').write_text(header+initializers+'\n'+body+'\nstate.initTodayDate();\n}\n',encoding='utf-8')
called = set(re.findall(r's\.(\w+)\(', (OUT/'expressions.js').read_text(encoding='utf-8')))
(audit/'fa-actions.json').write_text(json.dumps({'ported':sorted(functions.keys()-manual),'manual':sorted(manual),'missing':sorted(called-functions.keys())},indent=2),encoding='utf-8')

# Preserve every status-dependent table action as static row rules; markup is
# parsed inertly and converted to React elements by DticTable.
rows = {}; tables = {}
for name in inventory:
    table_soup = BeautifulSoup((ROOT/'pages'/f'{name}.html').read_text(encoding='utf-8'), 'html.parser')
    source = uncomment('\n'.join(s.get_text() for s in table_soup.find_all('script')))
    m = re.search(r'"fnCreatedRow"\s*:\s*function\s*\([^)]*\)\s*\{',source)
    endpoint = re.search(r'"sAjaxSource"\s*:\s*"([^"]+)"',source)
    if not m or not endpoint: continue
    end = balanced(source,m.end()-1)
    rows[name] = source[m.end():end-1].replace('$(', 'cell(')
    columns = re.search(r'"aoColumns"\s*:\s*\[([\s\S]*?)\]',source)[1]
    tables[name] = {'endpoint':endpoint[1], 'columns':re.findall(r'"mData"\s*:\s*(null|"[^"]+")',columns)}
    tables[name]['columns'] = [json.loads(c) for c in tables[name]['columns']]
(OUT/'tables.json').write_text(json.dumps(tables,indent=2),encoding='utf-8')
if 'employee/letterList' not in rows:
    rows['employee/letterList'] = """
var status=aData.statusId;
if(status==1){
    cell('td:eq(7)', nRow).html('<a class="blue" href="#viewLetter/'+aData.letterId+'"><span th:text="#{application.page.view}" >View</span></a> | <a class="blue" href="#updateProcess/'+aData.letterId+'"><span th:text="#{application.legal.updateCaseDetails}">Update</span></a>');
} else {
    cell('td:eq(7)', nRow).html('<a class="blue" href="#viewLetter/'+aData.letterId+'"><span th:text="#{application.page.view}" >View</span></a>');
}
"""
(OUT/'rows.js').write_text('export const rowRules = {\n'+',\n'.join(json.dumps(k)+': (cell,nRow,aData,iDataIndex) => {\n'+v+'\n}' for k,v in rows.items())+'\n}\n',encoding='utf-8')
print(f'Compiled {len(routes)} DTIC routes and {len(inventory)} templates; inventory contains {len(all_routes)} total DTIC routes.')

controller_source = uncomment((ROOT / 'angular/dtic/controller.js').read_text(encoding='utf-8'))
common_controller_source = uncomment((ROOT / 'angular/common/CommonController.js').read_text(encoding='utf-8'))
extra_installers = []
for controller in sorted(EXTRA_CONTROLLERS):
    src = common_controller_source if controller == 'CommonController' else controller_source
    start = src.index("'"+controller+"'")
    end = src.find('.controller(',start)
    source = src[start:end if end!=-1 else len(src)]
    functions = {}; spans = []
    for m in re.finditer(r'\$scope\.(\w+)\s*=\s*function\s*\([^)]*\)\s*\{',source):
        end = balanced(source,m.end()-1)
        functions[m[1]] = source[m.start():end]+';'
        spans.append((m.start(),end))
    left=source
    for start,end in reversed(spans): left=left[:start]+left[end:]
    (audit/(controller+'-initializers.txt')).write_text(left,encoding='utf-8')
    helpers=[]; helper_spans=[]
    for m in re.finditer(r'function\s+(\w+)\s*\([^)]*\)\s*\{',left):
        end=balanced(left,m.end()-1)
        if m[1]!='closeModals': helpers.append(left[m.start():end])
        helper_spans.append((m.start(),end))
    for start,end in reversed(helper_spans):left=left[:start]+left[end:]
    # Date inputs are owned by React's native date controls.
    functions.pop('loadDate',None)
    body='\n'.join(helpers+list(functions.values()))
    initializers='\n'.join(m[0] for m in re.finditer(r'\$scope\.\w+\s*=\s*(?:\{[^;]*?\}|\[[^;]*?\]|[^;\n]+);',left))
    body=initializers+'\n'+body
    body=re.sub(r'angular\s*\.\s*forEach','each',body)
    body=re.sub(r'for\s*\(\s*([ijk])\s*=',r'for (var \1 =',body)
    body=re.sub(r'for\s*\(\s*([ijk])\s+in\b',r'for (var \1 in',body)
    for a,b in [('$scope','state'),('$rootScope','state'),('$window','navigation'),('$http','request'),('$loading','loading'),('$routeParams','params'),('$filter','format'),('$timeout','later'),('angular.forEach','each'),('angular.identity','identity'),('angular.toJson','JSON.stringify'),('angular.fromJson','JSON.parse')]:body=body.replace(a,b)
    body=re.sub(r'(?<!\w)\$\(','dom(',body)
    refresh_functions=['fetchDTICBudgetByFY','fetchDTICDemandByFY','fetchInspectionOffices','fetchInternalAuditList','fetchExternalAuditListForDTIC','fetchFactualDetailListForDTIC','fetchProformaClauseListForDTIC','fetchApplicants','fetchYuvaUdhamiApplicants','fetchResubmittedApplicants','fetchResubmittedYuvaudhamiApplicants','fetchInProcessApplicants','fetchInProcessYuvaudhamiApplicants','fetchTotalApplications','fetchApplicationsByStatus','fetchLetters']
    declarations='\n'.join('const '+name+' = () => { state.listVersion++; loading.finish(); };' for name in refresh_functions if re.search(r'\b'+name+r'\(',body))
    declarations+='\nlet lastObjectId="", lastSchemeId="", lastSchemeTypeId="";\n'
    if controller == 'CommonController':
        body += """
state.loadLetterPage = function() {
\tloading.start('sample-1');
\tvar responsePromise = request.get('fetchusergroupsmap');
\tresponsePromise.success(function(data, status, headers, config) {
\t\tstate.assignedToSectionList = data;
\t\tloading.finish('sample-1');
\t});
};
state.loadLetterList = function() {
\tloading.start('sample-1');
\tfetchLetters();
};
state.loadLetterById = function() {
\tstate.disabled = true;
\tstate.letterId = params.letterId;
\tloading.start('sample-1');
\tvar responsePromise = request.get('fetchLetterDetail/' + params.letterId);
\tresponsePromise.success(function(data, status, headers, config) {
\t\tstate.letterData = data;
\t});
\tvar responsePromise2 = request.get('getStatusList');
\tresponsePromise2.success(function(data, status, headers, config) {
\t\tstate.statusList = data;
\t});
\tvar responsePromise3 = request.get('fetchusergroupsmap');
\tresponsePromise3.success(function(data, status, headers, config) {
\t\tstate.assignedToSectionList = data;
\t\tloading.finish('sample-1');
\t});
};
state.updateProcessSubmit = function(isValid) {
\tif (!isValid) {
\t\treturn false;
\t}
\tstate.letterId = params.letterId;
\tstate.requestProcessBean = state.requestProcessBean || {};
\tstate.requestProcessBean.letterId = params.letterId;
\tloading.start('sample-1');
\tvar responsePromise = request.post('updateProcessSubmit', state.requestProcessBean);
\tresponsePromise.success(function(data, status, headers, config) {
\t\tstate.responseObject = data;
\t\tif (state.responseObject && state.responseObject.successMessage != null) {
\t\t\tnavigation.location.href = '#letterList';
\t\t}
\t\tloading.finish('sample-1');
\t});
};
state.loadHistoryByLetterId = function() {
\tloading.start('sample-1');
\tvar responsePromise = request.get('fetchHistoryByLetterId/' + params.letterId);
\tresponsePromise.success(function(data, status, headers, config) {
\t\tstate.hearingList = data;
\t\tloading.finish('sample-1');
\t});
};
state.downloadDocument = function(documentId) {
\tnavigation.open('downloadDocument/' + documentId);
};
state.populateAssignToUsersInUpdate = function() {
\tloading.start('sample-1');
\tvar responsePromise = request.get('fetchusersbygroupcode/' + (state.requestProcessBean && state.requestProcessBean.assigneeSection));
\tresponsePromise.success(function(data, status, headers, config) {
\t\tstate.assigneeList = data;
\t\tloading.finish('sample-1');
\t});
};
"""
    (OUT/(controller+'.js')).write_text(header.replace('installFaActions','installActions')+declarations+body+'\nstate.loadDate = () => {};\n}\n',encoding='utf-8')
    extra_installers.append(controller)
(OUT/'extraActions.js').write_text('\n'.join(f"import {{ installActions as {c} }} from './{c}'" for c in extra_installers)+'\nexport default {'+','.join(extra_installers)+'}\n',encoding='utf-8')


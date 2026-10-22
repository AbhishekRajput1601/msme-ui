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

EXTRA_CONTROLLERS = {'DTICBudgetPlanningController', 'DTICCoordinationController', 'AuditDTICController', 'DTICSelfEmploymentController', 'CommonController', 'DTICController', 'DTICMSMEController'}
extra_endpoints = {
    '/letterList': ['employee/letterList'],
    '/viewLetter': ['cmcs/viewLetter'],
    '/updateProcess': ['cmcs/updateProcess'],
    '/loadHistory': ['cmcs/cmcsHistory'],
    '/enrolmentList': ['dtic/enrolmentList'],
    '/viewenrolmentform': ['dtic/enrolment/viewenrolmentform'],
    '/supplierNameList': ['dtic/supplierNameList'],
    '/supplierInfo': ['dtic/supplierInfo'],
    '/viewEditSupplierName': ['dtic/viewEditSupplierNameForm'],
    '/supplyNameList': ['dtic/supplyNameList'],
    '/addSupplyNameForm': ['dtic/addSupplyNameForm'],
    '/viewEditSupplyName': ['dtic/viewEditSupplyNameForm'],
}
for java_path in ROOT.parents[3].glob('*/src/main/java/**/*Controller.java'):
    if not any(word in java_path.name for word in ['DTICBudget', 'DTICCoordination', 'AuditDTIC', 'SelfEmploymentDTIC', 'IDDTIC', 'DTICController', 'MSMEDTIC']): continue
    text = uncomment(java_path.read_text(encoding='utf-8'))
    for m in re.finditer(r'@RequestMapping\(value\s*=\s*"([^"]+)"', text):
        end = text.find('@RequestMapping',m.end())
        block = text[m.end():end if end != -1 else len(text)]
        paths = re.findall(r'(?:new ModelAndView\(|setViewName\()\s*"([^"]+)"',block)
        if paths: extra_endpoints[m[1].split('/{')[0].rstrip('/')] = paths
for item in all_routes:
    ctrl = item['controller']
    if item['route'] in ('/enrolmentList', '/viewenrolmentform/:userId', '/supplierInfo', '/supplierNameList', '/supplyNameList', '/addSupplyNameForm', '/viewEditSupplierName/:id', '/viewEditSupplyName/:id'):
        ctrl = 'DTICController'
    if ctrl not in EXTRA_CONTROLLERS: continue
    # Report templates have their own source compiler and date/table adapter.
    if item['route'].endswith('reportform') and ctrl == 'DTICMSMEController': continue
    endpoint = re.search(r"templateUrl:\s*(?:function\([^)]*\)\s*\{\s*return\s*)?'([^']+)'", item['templateExpression'])
    if not endpoint: continue
    endpoint = '/' + endpoint[1].rstrip('/')
    if endpoint not in extra_endpoints: continue
    routes.append({'path':item['route'].lstrip('/'), 'views':extra_endpoints[endpoint], 'endpoint':endpoint, 'controller':ctrl})

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
    for el in soup.find_all('input'):
        if el.get('file-model'):
            el['data-ng-model'] = el['file-model']
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
    # Angular parses adjacent minus operators as subtraction of a negative,
    # whereas JavaScript parses them as a decrement.
    if not statement and 'msmeDetailData.' in source: source = source.replace('--', '- -')
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
if 'dtic/supplierNameList' in tables:
    tables['dtic/supplierNameList'] = {'endpoint': 'fetchSupplierNameList', 'columns': ['index', 'supplierName', 'supplierTypeName', 'supplySource', 'districtName', 'emailId', 'mobileNo', 'external', 'status', None], 'pagingType': 'full_numbers'}
if 'dtic/supplyNameList' in tables:
    tables['dtic/supplyNameList'] = {'endpoint': 'fetchSupplyNameList', 'columns': ['index', 'supplyName', 'supplyTypeName', 'supplyCategory', 'districtName', 'emailId', 'mobileNo', 'status', None], 'pagingType': 'full_numbers'}
if 'dtic/enrolmentList' in tables:
    tables['dtic/enrolmentList'] = {'endpoint': 'fetchAllEnrolment', 'columns': [None, 'userId', 'firstName', 'emailId', 'mobileNumber', None], 'pagingType': 'full_numbers'}
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
rows['dtic/supplierNameList'] = """
cell('td:eq(0)', nRow).html(iDataIndex + 1);
cell('td:eq(1)', nRow).html(aData.supplierName != null ? aData.supplierName : "");
cell('td:eq(2)', nRow).html(aData.supplierTypeName != null ? aData.supplierTypeName : "");
cell('td:eq(3)', nRow).html(aData.supplySource != null ? aData.supplySource : "-");
cell('td:eq(4)', nRow).html(aData.districtName != null ? aData.districtName : "");
cell('td:eq(5)', nRow).html(aData.emailId != null ? aData.emailId : "");
cell('td:eq(6)', nRow).html(aData.mobileNo != null ? aData.mobileNo : "");
cell('td:eq(7)', nRow).html(aData.external == 'Y' ? 'Yes' : 'No');
cell('td:eq(8)', nRow).html(aData.status != null ? aData.status : "");
cell('td:eq(9)', nRow).html('<a class="blue" href="#viewEditSupplierName/' + aData.id + '"><span>View / Edit</span></a>');
"""
rows['dtic/supplyNameList'] = """
cell('td:eq(0)', nRow).html(iDataIndex + 1);
cell('td:eq(1)', nRow).html(aData.supplyName != null ? aData.supplyName : "");
cell('td:eq(2)', nRow).html(aData.supplyTypeName != null ? aData.supplyTypeName : "");
cell('td:eq(3)', nRow).html(aData.supplyCategory != null ? aData.supplyCategory : "-");
cell('td:eq(4)', nRow).html(aData.districtName != null ? aData.districtName : "");
cell('td:eq(5)', nRow).html(aData.emailId != null ? aData.emailId : "-");
cell('td:eq(6)', nRow).html(aData.mobileNo != null ? aData.mobileNo : "-");
cell('td:eq(7)', nRow).html(aData.status != null ? aData.status : "");
cell('td:eq(8)', nRow).html('<a class="blue" href="#viewEditSupplyName/' + aData.id + '"><span>View / Edit</span></a>');
"""
rows['dtic/enrolmentList'] = """
cell('td:eq(0)', nRow).html(iDataIndex + 1);
cell('td:eq(1)', nRow).html(aData.userId != null ? aData.userId : "");
cell('td:eq(2)', nRow).html(aData.firstName != null ? aData.firstName : "");
cell('td:eq(3)', nRow).html(aData.emailId != null ? aData.emailId : "");
cell('td:eq(4)', nRow).html(aData.mobileNumber != null ? aData.mobileNumber : "");
cell('td:eq(5)', nRow).html('<a class="blue" href="#viewenrolmentform/' + aData.userId + '"><span th:text="#{application.page.viewEdit}">View Edit</span></a>');
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
    refresh_functions=['fetchDTICBudgetByFY','fetchDTICDemandByFY','fetchInspectionOffices','fetchInternalAuditList','fetchExternalAuditListForDTIC','fetchFactualDetailListForDTIC','fetchProformaClauseListForDTIC','fetchApplicants','fetchYuvaUdhamiApplicants','fetchResubmittedApplicants','fetchResubmittedYuvaudhamiApplicants','fetchInProcessApplicants','fetchInProcessYuvaudhamiApplicants','fetchTotalApplications','fetchApplicationsByStatus','fetchLetters','fetchSupplyNameList','fetchSupplierNameList','fetchEnrolment']
    refresh_functions += ['fetchAllApplicationsList', 'fetchApplicationsListByStatus', 'fetchMSMEApplications', 'fetchMicroLevelApplicants', 'fetchSmallLevelApplicants', 'fetchMediumLevelApplicants']
    declarations='\n'.join('const '+name+' = () => { state.listVersion++; loading.finish(); };' for name in refresh_functions if re.search(r'\b'+name+r'\(',body))
    if controller == 'DTICMSMEController': declarations += '\nconst $sce = { trustAsHtml: value => value?.message || value };\n'
    declarations+='\nlet lastObjectId="", lastSchemeId="", lastSchemeTypeId="";\n'
    body = body.replace(', 19, 00, 00, 0)', ', 19, 0, 0, 0)')
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
    if controller == 'DTICController':
        body += """
state.loadDticDistrictsForSupplier = function() {
\tloading.start('sample-1');
\tvar response = request.get('fetchDticDistricts');
\tresponse.success(function(data) {
\t\tstate.districts = data;
\t\tstate.supplierInfoData = state.supplierInfoData || {};
\t\tstate.supplierInfoData.external = state.supplierInfoData.external || 'N';
\t\tif (data && data.length) {
\t\t\tstate.supplierInfoData.districtId = data[0].key + "";
\t\t}
\t\tif (state.supplierInfoData.status == null) {
\t\t\tstate.supplierInfoData.status = 'INACTIVE';
\t\t}
\t\tloading.finish('sample-1');
\t});
};
state.fetchSupplierTypes = function() {
\tloading.start('sample-1');
\tvar response = request.get('fetchSupplierTypes');
\tresponse.success(function(data) {
\t\tstate.supplierTypes = data;
\t\tloading.finish('sample-1');
\t});
};
state.addSupplier = function(form, isValid) {
\tif (!isValid) return false;
\tif (navigation.confirm("Are you sure you want to save the data?")) {
\t\tloading.start('sample-1');
\t\tvar fd = new FormData();
\t\tvar d = state.supplierInfoData || {};
\t\tfd.append('supplierName', d.supplierName || '');
\t\tfd.append('supplierTypeId', d.supplierTypeId || '');
\t\tfd.append('authorisedPersonName', d.authorisedPersonName || '');
\t\tfd.append('mobileNo', d.mobileNo || '');
\t\tfd.append('emailId', d.emailId || '');
\t\tfd.append('address', d.address || '');
\t\tfd.append('pin', d.pin || '');
\t\tfd.append('districtId', d.districtId || '');
\t\tfd.append('status', d.status || 'INACTIVE');
\t\tfd.append('supplySource', d.supplySource || '');
\t\tfd.append('external', d.external || 'N');
\t\tvar responsePromise = request.post('addSupplier', fd);
\t\tresponsePromise.success(function(data) {
\t\t\tstate.responseObject = data;
\t\t\tif (state.responseObject && state.responseObject.successMessage != null) {
\t\t\t\tlater(function() { state.responseObject.successMessage = null; }, 10000);
\t\t\t\tnavigation.location.href = '#supplierNameList';
\t\t\t}
\t\t\tloading.finish('sample-1');
\t\t});
\t\tresponsePromise.error(function() {
\t\t\tstate.responseObject = { errorMessage: "Some error occured while saving the data" };
\t\t\tloading.finish('sample-1');
\t\t});
\t}
};
state.loadSupplierDetails = function() {
\tloading.start('sample-1');
\tvar response = request.get('fetchSupplierDetailsById/' + params.id);
\tresponse.success(function(data) {
\t\tif (data) {
\t\t\tstate.supplierInfoData = data;
\t\t\tif (data.supplierTypeId != null) state.supplierInfoData.supplierTypeId = data.supplierTypeId + "";
\t\t\tif (data.districtId != null) state.supplierInfoData.districtId = data.districtId + "";
\t\t\tif (data.external != null) state.supplierInfoData.external = data.external + "";
\t\t}
\t\tloading.finish('sample-1');
\t});
};
state.fetchSupplierTypes1 = function() {
\tstate.fetchSupplierTypes();
};
state.editSupplier = function(form, isValid) {
\tif (!isValid) return false;
\tif (navigation.confirm("Are you sure you want to save the data?")) {
\t\tloading.start('sample-1');
\t\tvar fd = new FormData();
\t\tvar d = state.supplierInfoData || {};
\t\tif (params.id || d.id) fd.append('id', params.id || d.id);
\t\tfd.append('supplierName', d.supplierName || '');
\t\tfd.append('supplierTypeId', d.supplierTypeId || '');
\t\tfd.append('authorisedPersonName', d.authorisedPersonName || '');
\t\tfd.append('mobileNo', d.mobileNo || '');
\t\tfd.append('emailId', d.emailId || '');
\t\tfd.append('address', d.address || '');
\t\tfd.append('pin', d.pin || '');
\t\tfd.append('districtId', d.districtId || '');
\t\tfd.append('status', d.status || 'INACTIVE');
\t\tfd.append('supplySource', d.supplySource || '');
\t\tfd.append('external', d.external || 'N');
\t\tvar responsePromise = request.post('addSupplier', fd);
\t\tresponsePromise.success(function(data) {
\t\t\tstate.responseObject = data;
\t\t\tif (state.responseObject && state.responseObject.successMessage != null) {
\t\t\t\tlater(function() { state.responseObject.successMessage = null; }, 10000);
\t\t\t\tnavigation.location.href = '#supplierNameList';
\t\t\t}
\t\t\tloading.finish('sample-1');
\t\t});
\t\tresponsePromise.error(function() {
\t\t\tstate.responseObject = { errorMessage: "Some error occured while saving the data" };
\t\t\tloading.finish('sample-1');
\t\t});
\t}
};
state.loadSupplierNameList = function() {
\tloading.start('sample-1');
\tfetchSupplierNameList();
};
state.loadEnrolment = function() {
\tloading.start('sample-1');
\tfetchEnrolment();
};
state.loadEnrollment = function() {
\tloading.start('sample-1');
\tfetchEnrolment();
};
state.loadEnrollmentDetail = function() {
\tstate.loadEnlrolmentDetail();
};
state.loadEnlrolmentDetail = function() {
\tstate.disabled = true;
\tloading.start('sample-1');
\tvar responsePromise = request.get('fetchEnrolmentDetails', { params: { 'userId': params.userId } });
\tresponsePromise.success(function(data) {
\t\tstate.opData = data || {};
\t\tif (data) {
\t\t\tif (data.gender) state.opData.gender = data.gender + "";
\t\t\tif (data.status) state.opData.status = data.status + "";
\t\t\tif (data.employeeType) state.opData.employeeType = data.employeeType + "";
\t\t\tif (data.maritalStatus) state.opData.maritalStatus = data.maritalStatus + "";
\t\t\tif (data.physicallyDisabled != null) state.opData.physicallyDisabled = data.physicallyDisabled + "";
\t\t\tif (data.category) state.opData.category = data.category + "";
\t\t\tif (data.bloodGroup) state.opData.bloodGroup = data.bloodGroup + "";
\t\t\tif (data.state) state.opData.state = data.state + "";
\t\t\tif (data.district) state.opData.district = data.district + "";
\t\t\tif (data.tehsil) state.opData.tehsil = data.tehsil + "";
\t\t\tif (data.permanentState) state.opData.permanentState = data.permanentState + "";
\t\t\tif (data.permanentDistrict) state.opData.permanentDistrict = data.permanentDistrict + "";
\t\t\tif (data.permanentTehsil) state.opData.permanentTehsil = data.permanentTehsil + "";
\t\t\tif (data.dateOfBirth) state.opData.dateOfBirth = data.dateOfBirth + "";
\t\t\tif (data.dateOfJoining) state.opData.dateOfJoining = data.dateOfJoining + "";
\t\t\tif (data.dateOfRetirement) state.opData.dateOfRetirement = data.dateOfRetirement + "";
\t\t\tif (data.designation) state.opData.designation = data.designation + "";
\t\t\tif (data.posterOfficeType) state.opData.officeType = data.posterOfficeType + "";
\t\t\tif (data.officeName) state.opData.officeName = data.officeName + "";
\t\t}
\t\tvar responseCategories = request.get('fetchcategoriesmap');
\t\tresponseCategories.success(function(cat) { state.categories = cat; });
\t\tvar responseDesignation = request.get('fetchdesignationmap');
\t\tresponseDesignation.success(function(des) { state.designationList = des; });
\t\tvar responseGender = request.get('fetchgendermap');
\t\tresponseGender.success(function(gen) { state.genderList = gen; });
\t\tvar responseOfficeTypes = request.get('fetchallofficestypelist');
\t\tresponseOfficeTypes.success(function(oft) {
\t\t\tstate.officeTypeList = oft;
\t\t\tif (state.opData && state.opData.officeType) {
\t\t\t\tvar responseOffice = request.get('fetchOfficeByTypeId/' + state.opData.officeType);
\t\t\t\tresponseOffice.success(function(off) { state.officesList = off; });
\t\t\t}
\t\t});
\t\tif (state.opData && state.opData.state) {
\t\t\tstate.fetchPresentAddDistrictByState(state.opData.state);
\t\t}
\t\tif (state.opData && state.opData.district) {
\t\t\tstate.fetchTehsilByDistrict(state.opData.district);
\t\t}
\t\tif (state.opData && state.opData.permanentState) {
\t\t\tstate.fetchPermanentAddDistrictByState(state.opData.permanentState);
\t\t}
\t\tif (state.opData && state.opData.permanentDistrict) {
\t\t\tstate.fetchPermanentTehsilByDistrict(state.opData.permanentDistrict);
\t\t}
\t\tloading.finish('sample-1');
\t});
};
state.fetchAllOfficeTypes = function() {
\tvar response = request.get('fetchallofficestypelist');
\tresponse.success(function(data) {
\t\tstate.officeTypeList = data;
\t});
};
state.fetchAllOfficesByOfficeType = function() {
\tif (!state.opData || !state.opData.officeType) return;
\tloading.start('sample-1');
\tstate.opData.officeName = null;
\tvar response = request.get('fetchOfficeByTypeId/' + state.opData.officeType);
\tresponse.success(function(data) {
\t\tstate.officesList = data;
\t\tloading.finish('sample-1');
\t});
};
state.fetchAllStates = function() {
\tvar response = request.get('fetchallstates');
\tresponse.success(function(data) {
\t\tstate.respondentStates = data;
\t\tstate.states = data;
\t});
};
state.fetchPresentAddDistrictByState = function(stateId) {
\tif (!stateId) return;
\tvar response = request.get('fetchdistrictmapbystate', { params: { stateId: stateId } });
\tresponse.success(function(data) {
\t\tstate.districts = data;
\t});
};
state.fetchTehsilByDistrict = function(districtId) {
\tif (!districtId) return;
\tvar response = request.get('fetchtehsilmapbydistrict', { params: { districtId: districtId } });
\tresponse.success(function(data) {
\t\tstate.tehsils = data;
\t});
};
state.fetchPermanentAddDistrictByState = function(stateId) {
\tif (!stateId) return;
\tvar response = request.get('fetchdistrictmapbystate', { params: { stateId: stateId } });
\tresponse.success(function(data) {
\t\tstate.permanentDistricts = data;
\t});
};
state.fetchPermanentTehsilByDistrict = function(districtId) {
\tif (!districtId) return;
\tvar response = request.get('fetchtehsilmapbydistrict', { params: { districtId: districtId } });
\tresponse.success(function(data) {
\t\tstate.permanentTehsils = data;
\t});
};
state.setSameAddress = function() {
\tif (state.sameAsAbovecheck) {
\t\tstate.opData.permanentAddress1 = state.opData.address1;
\t\tstate.opData.permanentAddress2 = state.opData.address2;
\t\tstate.opData.permanentAddress3 = state.opData.address3;
\t\tstate.opData.permanentState = state.opData.state;
\t\tstate.fetchPermanentAddDistrictByState(state.opData.permanentState);
\t\tstate.opData.permanentDistrict = state.opData.district;
\t\tstate.fetchPermanentTehsilByDistrict(state.opData.permanentDistrict);
\t\tstate.opData.permanentTehsil = state.opData.tehsil;
\t\tstate.opData.permanentPinCode = state.opData.pinCode;
\t} else {
\t\tstate.opData.permanentAddress1 = '';
\t\tstate.opData.permanentAddress2 = '';
\t\tstate.opData.permanentAddress3 = '';
\t\tstate.opData.permanentState = '';
\t\tstate.opData.permanentDistrict = '';
\t\tstate.opData.permanentTehsil = '';
\t\tstate.opData.permanentPinCode = '';
\t}
};
state.saveEnrolmentForm = function(isValid, profileImage) {
\tif (!isValid) return false;
\tloading.start('sample-1');
\tvar fd = new FormData();
\tvar d = state.opData || {};
\tif (params.userId) fd.append('userId', params.userId);
\tif (d.userEnrolmentId) fd.append('userEnrolmentId', d.userEnrolmentId);
\tif (profileImage) fd.append('profileImage', profileImage);
\tif (d.fullName) fd.append('fullName', d.fullName);
\tif (d.address) fd.append('address', d.address);
\tif (d.dateOfBirth) fd.append('dateOfBirth', d.dateOfBirth);
\tif (d.employeeId) fd.append('employeeId', d.employeeId);
\tif (d.employeeType) fd.append('employeeType', d.employeeType);
\tif (d.officeType) fd.append('posterOfficeType', d.officeType);
\tif (d.officeName) fd.append('officeName', d.officeName);
\tif (d.dateOfJoining) fd.append('dateOfJoining', d.dateOfJoining);
\tif (d.designation) fd.append('designation', d.designation);
\tif (d.fatherOrHusbandName) fd.append('fatherOrHusbandName', d.fatherOrHusbandName);
\tif (d.maritalStatus) fd.append('maritalStatus', d.maritalStatus);
\tif (d.physicallyDisabled != null) fd.append('physicallyDisabled', d.physicallyDisabled);
\tif (d.officeEmailId) fd.append('officeEmailId', d.officeEmailId);
\tif (d.category) fd.append('category', d.category);
\tif (d.gender) fd.append('gender', d.gender);
\tif (d.bloodGroup) fd.append('bloodGroup', d.bloodGroup);
\tif (d.mobileNumber) fd.append('mobileNumber', d.mobileNumber);
\tif (d.address1) fd.append('address1', d.address1);
\tif (d.address2) fd.append('address2', d.address2);
\tif (d.address3) fd.append('address3', d.address3);
\tif (d.state) fd.append('state', d.state);
\tif (d.district) fd.append('district', d.district);
\tif (d.tehsil) fd.append('tehsil', d.tehsil);
\tif (d.pinCode) fd.append('pinCode', d.pinCode);
\tif (d.permanentAddress1) fd.append('permanentAddress1', d.permanentAddress1);
\tif (d.permanentAddress2) fd.append('permanentAddress2', d.permanentAddress2);
\tif (d.permanentAddress3) fd.append('permanentAddress3', d.permanentAddress3);
\tif (d.permanentState) fd.append('permanentState', d.permanentState);
\tif (d.permanentDistrict) fd.append('permanentDistrict', d.permanentDistrict);
\tif (d.permanentTehsil) fd.append('permanentTehsil', d.permanentTehsil);
\tif (d.permanentPinCode) fd.append('permanentPinCode', d.permanentPinCode);
\tif (d.dateOfRetirement) fd.append('dateOfRetirement', d.dateOfRetirement);

\tvar responsePromise = request.post('saveEnrolment', fd);
\tresponsePromise.success(function(data) {
\t\tstate.responseObject = data;
\t\tif (state.responseObject && state.responseObject.successMessage != null) {
\t\t\tlater(function() { state.responseObject.successMessage = null; }, 5000);
\t\t\tnavigation.location.href = '#enrolmentList';
\t\t}
\t\tloading.finish('sample-1');
\t});
\tresponsePromise.error(function() {
\t\tstate.responseObject = { errorMessage: "Some error occured while saving enrolment data" };
\t\tloading.finish('sample-1');
\t});
};
state.loadGender = function() {
\tvar response = request.get('fetchgendermap');
\tresponse.success(function(data) {
\t\tstate.genderList = data;
\t});
};
state.loadDesignation = function() {
\tvar response = request.get('fetchdesignationmap');
\tresponse.success(function(data) {
\t\tstate.designationList = data;
\t});
};
state.loadDesignationforadd = function() {
\tvar response = request.get('fetchdesignationmap');
\tresponse.success(function(data) {
\t\tstate.designationList = data;
\t});
};
"""
    declarations = '\n'.join('const '+name+' = () => { state.listVersion++; loading.finish(); };' for name in refresh_functions if re.search(r'\b'+name+r'\(', body))
    if controller == 'DTICMSMEController': declarations += '\nconst $sce = { trustAsHtml: value => value?.message || value };\n'
    declarations += '\nlet lastObjectId="", lastSchemeId="", lastSchemeTypeId="";\n'
    (OUT/(controller+'.js')).write_text(header.replace('installFaActions','installActions')+declarations+body+'\nstate.loadDate = () => {};\n}\n',encoding='utf-8')
    extra_installers.append(controller)
(OUT/'extraActions.js').write_text('\n'.join(f"import {{ installActions as {c} }} from './{c}'" for c in extra_installers)+'\nexport default {'+','.join(extra_installers)+'}\n',encoding='utf-8')


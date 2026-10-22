"""Compile every LDM route and shared Industrial Unit fragment from the reference."""
import re, json, hashlib
from pathlib import Path

base = Path('scripts/compile-dtic.py').read_text(encoding='utf-8')
ns = {}
exec(base[:base.index('java = uncomment')].replace('src/modules/dtic/generated', 'src/modules/ldm/generated').replace('artifacts/dtic-migration', 'artifacts/ldm'), ns)
ROOT, OUT, audit, uncomment, balanced = [ns[k] for k in ['ROOT','OUT','audit','uncomment','balanced']]
routes = [
    {'path': 'dashboard', 'views': ['ldm/dashboard']},
    {'path': 'verification', 'views': ['ldm/verification']},
    {'path': 'batches', 'views': ['ldm/batches']},
    {'path': 'detail/:applicationNo', 'views': ['ldm/detail']},
    {'path': 'fa/viewfaapplicantdetailunitnew/:applicationId', 'views': ['applicant/fa/viewFADetailUnitNew2']},
    {'path': 'fa/viewfaapplicantHistory/:applicationId/:establishmentType', 'views': ['applicant/fa/faHistory']},
]
ns.update(routes=routes, all_routes=routes)
segment = base[base.index('# Reuse the existing reviewed'):base.index("source = uncomment((ROOT / 'angular/dtic/controller.js')")]
segment = segment.replace('dtic-page-content', 'ldm-page-content').replace('@scope (.dtic-page)', '@scope (.ldm-page)')
segment = segment.replace("    for table in soup.find_all('table'):", """    # Legacy headings placed directly inside rows/tables need real cells in React.
    for table in soup.find_all('table'):
        columns = max([sum(int(c.get('colspan', 1)) for c in r.find_all(['td','th'], recursive=False)) for r in table.find_all('tr')] or [1]) or 1
        for row in table.find_all('tr'):
            invalid = [c for c in row.find_all(recursive=False) if c.name not in ('td','th','script')]
            if invalid:
                cell = soup.new_tag('td', colspan=str(columns))
                invalid[0].insert_before(cell)
                for child in invalid: cell.append(child.extract())
        for child in list(table.find_all(recursive=False)):
            if child.name not in ('tr','tbody','thead','tfoot','caption','colgroup','script'):
                body = soup.new_tag('tbody'); row = soup.new_tag('tr'); cell = soup.new_tag('td', colspan=str(columns))
                child.insert_before(body); body.append(row); row.append(cell); cell.append(child.extract())
    for table in soup.find_all('table'):""")
exec(segment, ns)

# Keep the original controller functions as statically bundled JavaScript.
source = (ROOT/'angular/ldm/LdmController.js').read_text(encoding='utf-8')
# The generic brace scanner does not tokenize regex literals in this download helper.
# Its blob handling is implemented in the native HTTP adapter instead.
source = source[:source.index('$scope.downloadCoveringLetter =')] + source[source.index('$scope.openBatch ='):]
source = uncomment(source)
source = source[source.index('$scope.applications ='):]
functions = {}
pos = 0
while match := re.search(r'\$scope\.(\w+)\s*=\s*function\s*\([^)]*\)\s*\{', source[pos:]):
    start = pos + match.start()
    end = balanced(source, pos + match.end()-1)
    functions[match[1]] = source[start:end] + ';'
    pos = end
manual = {'openRemarks', 'viewHistory', 'downloadCoveringLetter'}
body = '\n'.join(v for k,v in functions.items() if k not in manual)
shared = uncomment((ROOT/'angular/common/FaViewController.js').read_text(encoding='utf-8'))
shared = shared[shared.index('$scope.faData ='):shared.rfind('});')]
applicant = uncomment((ROOT/'angular/applicant/fa/controller.js').read_text(encoding='utf-8'))
for name in ['calcTotal','calcTotalCompExpUnderID','calcTotalProductAnnualAmt']:
    match = re.search(r'\$scope\.'+name+r'\s*=\s*function\s*\([^)]*\)\s*\{',applicant)
    shared += '\n'+applicant[match.start():balanced(applicant,match.end()-1)]+';'
for old,new in [('$rootScope','state'),('$scope','state'),('$window','navigation'),('$http','request'),('$loading','loading'),('$routeParams','params'),('$timeout','later'),('angular.forEach','each')]:
    body = body.replace(old,new)
    shared = shared.replace(old,new)
header = 'const each = (items, fn) => Object.entries(items || {}).forEach(([k,v]) => fn(v,k));\n'
args = 'state, {request, navigation, loading, params, later}'
(OUT/'actions.js').write_text('// Generated from LdmController.js and FaViewController.js.\n'+header+'export function installLdmActions('+args+') {\n'+body+'\n}\nexport function installViewActions('+args+') {\n'+shared+'\n}\n',encoding='utf-8')
sources = [ROOT/'angular/ldm/LdmRouting.js', ROOT/'angular/ldm/LdmController.js',ROOT/'angular/common/FaViewController.js', ROOT/'pages/ldm/ldmhome.html', ROOT/'css/bootstrap.min.css', ROOT/'css/sb-admin-2.css']
sources += [ROOT/'pages'/f'{name}.html' for name in ns['inventory']]
(audit/'sources.json').write_text(json.dumps([{'path':str(p.relative_to(ROOT)), 'sha256':hashlib.sha256(p.read_bytes()).hexdigest()} for p in sources],indent=2),encoding='utf-8')
called = set(re.findall(r's\.(\w+)\(', (OUT/'expressions.js').read_text(encoding='utf-8')))
available = set(re.findall(r'state\.(\w+)\s*=\s*function', body+'\n'+shared)) | manual
missing = sorted(called-available)
(audit/'actions.json').write_text(json.dumps({'sourceFunctions':sorted(functions), 'manual':sorted(manual), 'missing':missing},indent=2),encoding='utf-8')
print(json.dumps({'routes':len(routes), 'templates':len(ns['inventory']), 'missingActions':missing}))

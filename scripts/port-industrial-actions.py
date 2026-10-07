"""One-time source port of Industrial Unit business rules to plain JS actions.

No Angular registration, dependency injection, scope or digest is emitted.
React owns rendering; IO and navigation are explicit dependencies.
"""
import json
import re
from pathlib import Path

root = Path('E:/eclipse/MSME%20-%20LAND%20ALLOTMENT%20AND%20FINANCIAL%20ASSISTANCE/mpindustry-web/src/main/webapp')
source = (root / 'angular/applicant/fa/controller.js').read_text(encoding='utf-8')
lex = re.compile(r'''"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`|/\*[\s\S]*?\*/|//[^\n]*|[\s\S]''')
source = ''.join(t for t in lex.findall(source) if not t.startswith(('//', '/*')))
def balanced(start):
    depth = 0
    for t in lex.finditer(source, start):
        if t[0] == '{': depth += 1
        elif t[0] == '}':
            depth -= 1
            if not depth: return t.end()
    raise ValueError('Unbalanced function')

functions = {}
for m in re.finditer(r'\$scope\.(\w+)\s*=\s*function\s*\([^)]*\)\s*\{', source[:source.index("mpindustry.controller('MPIncubationController'")]):
    end = balanced(m.end()-1)
    functions[m[1]] = source[m.start():end] + ';'
inventory = json.loads(Path('artifacts/industrial-unit/reference-inventory.json').read_text(encoding='utf-8'))
expr = Path('src/modules/industrial-unit/generated/expressions.js').read_text(encoding='utf-8')
names = set(re.findall(r's\.(\w+)\(', expr)) | {'loadQueryReplyPage', 'submitQueryReply'}
manual = {'addFaIndustrialProfileDetails','addFaIndustrialUnitDetails','addFaIndustrialSchemeDetails','addFaTenCRIndustrialSchemeDetails','goToPreviousTab','openForm','checkProductionDate','setUnitDetails','downloadFaDocuments','downloadFaDocumentsByApplicant','downloadFADocument','reload','saveInfrastructure','resetForm','uploadFADocuments','loadFAApplicantDetailList','isNewUnitDisabled','fetchZEDCertificationDetails','setSaveAndNext','setFinalSubmit'}
selected = {}
queue = list(names)
while queue:
    name = queue.pop()
    if name in selected or name in manual or name not in functions: continue
    selected[name] = functions[name]
    queue += re.findall(r'\$scope\.(\w+)\(', functions[name])

validation = []
for name, target in [('addFaIndustrialUnitDetails','validateUnit'), ('addFaIndustrialSchemeDetails','validateScheme'), ('addFaTenCRIndustrialSchemeDetails','validateTenCrore')]:
    code = functions[name]
    cutoff = re.search(r'if\s*\(confirm\(', code)
    if not cutoff: raise ValueError('Missing confirmation boundary: ' + name)
    validation.append(code[:cutoff.start()].replace('$scope.'+name, '$scope.'+target, 1) + '\nreturn true;\n};')
m = re.search(r'function validateAllFiles\(\)\s*\{', source)
validation.append(source[m.start():balanced(m.end()-1)])
body = '\n\n'.join([*(selected[key] for key in sorted(selected)), *validation])
body = re.sub(r'function\(data,\s*status,\s*headers,\s*config\)', 'function(data)', body)
body = body.replace('$scope.$apply', 'commit')
for a,b in [('$scope','state'),('$rootScope','state'),('$http','request'),('$loading','loading'),('$window','navigation'),('$routeParams','params'),('$filter','format'),('$timeout','later'),('angular.forEach','each'),('angular.identity','identity')]: body = body.replace(a,b)
# DOM reads are isolated at the browser boundary, not a second rendering engine.
body = re.sub(r'(?<!\w)\$\(', 'dom(', body)
header = '''// Ported Industrial Unit calculations and data loading. React owns the state and DOM.
// Source: angular/applicant/fa/controller.js; regenerate with scripts/port-industrial-actions.py.
export function installReferenceActions(state, { request, loading, navigation, params, format, later, commit, dom }) {
const each = (items, callback) => Object.entries(items || {}).forEach(([key, value]) => callback(value, Array.isArray(items) ? Number(key) : key));
'''
Path('src/modules/industrial-unit/generated/referenceActions.js').write_text(header + body + '\n}\n', encoding='utf-8')
missing = sorted(names - functions.keys() - manual)
Path('artifacts/industrial-unit/action-coverage.json').write_text(json.dumps({'ported': sorted(selected), 'manual': sorted(manual), 'missingFromFAController': missing}, indent=2), encoding='utf-8')
print(f'Ported {len(selected)} action functions. Additional actions: {missing}')

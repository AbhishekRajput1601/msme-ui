"""Audit the Industrial Unit template inventory against its AngularJS source."""
import hashlib
import json
import re
from pathlib import Path
from bs4 import BeautifulSoup, Comment

root = Path('E:/eclipse/MSME%20-%20LAND%20ALLOTMENT%20AND%20FINANCIAL%20ASSISTANCE/mpindustry-web/src/main/webapp')
inventory = json.loads(Path('artifacts/industrial-unit/reference-inventory.json').read_text(encoding='utf-8'))
report = {'templates': [], 'missingFields': [], 'missingActions': [], 'sources': []}
runtime = '\n'.join(path.read_text(encoding='utf-8') for path in Path('src/modules/industrial-unit').rglob('*.js'))
for name, record in inventory.items():
    source = root / record['source'].replace('\\', '/')
    soup = BeautifulSoup(source.read_text(encoding='utf-8'), 'html.parser')
    for comment in soup.find_all(string=lambda value: isinstance(value, Comment)):
        comment.extract()
    fields = [dict(el.attrs) for el in soup.select('input,select,textarea')]
    if fields != record['fields']:
        report['missingFields'].append(name)
    compiled = json.loads((Path('src/modules/industrial-unit/generated') / (name + '.json')).read_text(encoding='utf-8'))
    def walk(nodes):
        for node in nodes:
            yield node
            yield from walk(node.get('children', []))
    nodes = list(walk(compiled))
    source_models = [el.get('data-ng-model') or el.get('ng-model') or el.get('file-model') for el in soup.select('input,select,textarea')]
    target_models = [node.get('model') for node in nodes if node.get('tag') in ['input', 'select', 'textarea']]
    if source_models != target_models:
        report['missingFields'].append(name + ': compiled bindings')
    events = [value for el in soup.find_all() for key, value in el.attrs.items() if re.match(r'(data-)?ng-(click|change|submit|init|blur)', key)]
    actions = sorted(set(action for event in events for action in re.findall(r'\b(\w+)\(', event)))
    missing = [action for action in actions if action not in ['Number', 'parseInt', 'parseFloat'] and not re.search(r'\b' + action + r'\s*[:=(]', runtime)]
    report['missingActions'].extend(name + ': ' + action for action in missing)
    report['templates'].append({'name': name, 'source': str(source.relative_to(root)), 'fields': len(fields), 'options': len(soup.select('option')), 'tables': len(soup.select('table')), 'modals': len(soup.select('.modal')), 'actions': actions, 'conditions': len(soup.select('[data-ng-if], [ng-if], [data-ng-show], [ng-show]'))})
sources = [root / 'angular/applicant/fa/controller.js', root / 'angular/applicant/routing.js', root / 'angular/common/CommonController.js', root / 'angular/dtic/routing.js', root / 'css/bootstrap.min.css', root / 'css/sb-admin-2.css']
sources += list((root / 'angular/dtic').rglob('*MSME*.js'))
for source in sources:
    content = source.read_text(encoding='utf-8')
    report['sources'].append({'path': str(source.relative_to(root)), 'sha256': hashlib.sha256(source.read_bytes()).hexdigest(), 'controllerFunctions': len(re.findall(r'\$scope\.\w+\s*=\s*function', content)), 'httpEndpoints': sorted(set(re.findall(r'\$http\s*\.\s*(?:get|post)\s*\(\s*[\'"]([^\'"]+)', content)))})
report['limitations'] = ['Static inventory and binding coverage do not prove visual parity or live backend behavior.']
out = Path('artifacts/dtic-profile/industrial-reference-audit.json')
out.parent.mkdir(parents=True, exist_ok=True)
out.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding='utf-8')
print(json.dumps({'templates': len(report['templates']), 'fields': sum(item['fields'] for item in report['templates']), 'missingFields': report['missingFields'], 'missingActions': report['missingActions']}, indent=2))

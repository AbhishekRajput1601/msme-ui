"""Compile the five DTIC MSME reports directly from the read-only legacy source."""
import json
import re
from pathlib import Path
from bs4 import BeautifulSoup, Comment

ROOT = Path('E:/eclipse/MSME%20-%20LAND%20ALLOTMENT%20AND%20FINANCIAL%20ASSISTANCE/mpindustry-web/src/main/webapp')
OUT = Path('src/modules/dtic/reports/generated')
OUT.mkdir(parents=True, exist_ok=True)
ns = {}
exec(compile(Path('scripts/compile-industrial-unit.py').read_text(encoding='utf-8').split('NAMES +=')[0], 'compile-industrial-unit.py', 'exec'), ns)
ns['expressions'].clear(); ns['styles'].clear(); ns['keys'].clear()
views, tables, inventory, routes = {}, {}, {}, []
for kind in ['serviceenterprise', 'manufacturingenterprise', 'microlevel', 'smalllevel', 'mediumlevel']:
    name = kind + 'reportform'
    source = ROOT / 'pages/dtic' / (name + '.html')
    soup = BeautifulSoup(source.read_text(encoding='utf-8'), 'html.parser')
    for comment in soup.find_all(string=lambda s: isinstance(s, Comment)): comment.extract()
    inventory[name] = {
        'source': str(source),
        'fields': [dict(e.attrs) for e in soup.select('input,select,textarea')],
        'events': [v for e in soup.find_all() for k,v in e.attrs.items() if re.match(r'(data-)?ng-(click|submit|init|change)', k)],
        'scripts': [s.get_text() for s in soup.find_all('script')],
    }
    for style in soup.find_all('style'):
        ns['styles'].append(style.get_text()); style.extract()
    for el in soup.select('#page-wrapper'): el['id'] = 'dtic-page-content'
    for el in soup.select('[data-ng-bind-html]'):
        el['data-ng-bind'] = el['data-ng-bind-html']
        del el['data-ng-bind-html']
    for table in soup.find_all('table'):
        rows = table.find_all('tr', recursive=False)
        if rows:
            body = soup.new_tag('tbody'); rows[0].insert_before(body)
            for row in rows: body.append(row.extract())
    views[name] = [n for child in soup.children if (n := ns['node'](child)) is not None]
    if kind.endswith('level'):
        script = '\n'.join(inventory[name]['scripts'])
        columns = []
        for m in re.finditer(r'"mData"\s*:\s*(null|"[^"]+")', script):
            if m[1] != 'null': columns.append(json.loads(m[1]))
            else: columns.append(re.search(r'row\.(\w+)', script[m.end():])[1])
        tables[name] = {'endpoint': re.search(r'"sAjaxSource"\s*:\s*"([^"]+)"', script)[1].rstrip('/'), 'columns': columns}
    routes.append({'path':name, 'views':[name], 'controller':'DTICMSMEReports'})
for name, value in [('views',views), ('tables',tables), ('routes',routes)]:
    (OUT / (name+'.json')).write_text(json.dumps(value,ensure_ascii=False,indent=2),encoding='utf-8')
lines = ["import { filter } from '../../../industrial-unit/viewHelpers'", 'export const expressions = [']
for source, statement in ns['expressions']:
    code = ns['js'](source)
    lines.append('s => {'+code+'},' if statement else 's => ('+code+'),')
(OUT/'expressions.js').write_text('\n'.join(lines+ [']']),encoding='utf-8')
(OUT/'reference.css').write_text('@scope (.dtic-msme-reports) {\n'+'\n'.join(dict.fromkeys(ns['styles']))+'\n}',encoding='utf-8')
audit = Path('artifacts/dtic-msme-reports'); audit.mkdir(parents=True,exist_ok=True)
(audit/'inventory.json').write_text(json.dumps(inventory,ensure_ascii=False,indent=2),encoding='utf-8')
print(f'Compiled {len(routes)} reports, {sum(len(i["fields"]) for i in inventory.values())} fields and {len(tables)} server tables.')

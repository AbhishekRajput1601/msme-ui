"""Compile all four OX forms directly from the read-only Angular reference."""
import json
import re
from pathlib import Path
from bs4 import BeautifulSoup, Comment

ROOT = Path('E:/eclipse/MSME%20-%20LAND%20ALLOTMENT%20AND%20FINANCIAL%20ASSISTANCE/mpindustry-web/src/main/webapp')
OUT = Path('src/modules/dtic/ox/generated')
AUDIT = Path('artifacts/dtic-ox')
OUT.mkdir(parents=True, exist_ok=True)
AUDIT.mkdir(parents=True, exist_ok=True)
ns = {}
exec(compile(Path('scripts/compile-industrial-unit.py').read_text(encoding='utf-8').split('NAMES +=')[0], 'binding-compiler', 'exec'), ns)
views, inventory, styles, routes = {}, {}, [], []
for number in range(1, 5):
    name = f'dtic/ox{number}Form'
    source = ROOT / 'pages' / (name + '.html')
    soup = BeautifulSoup(source.read_text(encoding='utf-8'), 'html.parser')
    for comment in soup.find_all(string=lambda s: isinstance(s, Comment)): comment.extract()
    for element in soup.find_all(['input','img','br','hr','wbr','source','area','col']):
        for child in reversed(list(element.contents)): element.insert_after(child.extract())
    inventory[name] = dict(source=str(source.relative_to(ROOT)), fields=[dict(e.attrs) for e in soup.select('input,select,textarea')],
        events=sorted(set(str(v) for e in soup.find_all() for k,v in e.attrs.items() if re.match(r'(data-)?ng-(click|change|submit|init|blur)', k))),
        options=[dict(e.attrs) | {'text': e.get_text()} for e in soup.select('option')],
        scripts=[e.get_text() for e in soup.select('script')])
    for style in soup.select('style'):
        styles.append('.legacy-portal #page-wrapper .dtic-ox[data-view="'+name+'"] {\n'+style.get_text()+'\n}')
        style.extract()
    for e in soup.select('#page-wrapper'): e['id'] = 'ox-page-content'
    views[name] = [n for child in soup.children if (n := ns['node'](child)) is not None]
    def prepare(nodes):
        for node in nodes:
            if node.get('repeat') and 'init' in node:
                node['indexAliases'] = re.findall(r'(\w+)\s*=\s*\$index', ns['expressions'][node['init']][0])
            prepare(node.get('children', []))
    prepare(views[name])
    routes.append(dict(path=f'ox{number}Form', views=[name], endpoint=f'/ox{number}Form', controller='OXController'))
(OUT/'views.json').write_text(json.dumps(views, ensure_ascii=False, separators=(',', ':')), encoding='utf-8')
(OUT/'routes.json').write_text(json.dumps(routes, indent=2), encoding='utf-8')
(OUT/'reference.css').write_text('\n'.join(styles), encoding='utf-8')
lines = ["import { filter } from '../../../industrial-unit/viewHelpers'", 'export const expressions = [']
for source, statement in ns['expressions']:
    code = ns['js'](source)
    lines.append('s => {'+code+'},' if statement else 's => ('+code+'),')
(OUT/'expressions.js').write_text('\n'.join(lines+[']']), encoding='utf-8')
(AUDIT/'inventory.json').write_text(json.dumps(inventory, ensure_ascii=False, indent=2), encoding='utf-8')
print(f'{len(views)} OX templates, {sum(len(v["fields"]) for v in inventory.values())} field declarations')

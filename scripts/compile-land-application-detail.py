"""Port the original read-only land application form to static React metadata."""
import base64
import json
from pathlib import Path
from bs4 import BeautifulSoup, Comment

ROOT = Path('E:/eclipse/MSME%20-%20LAND%20ALLOTMENT%20AND%20FINANCIAL%20ASSISTANCE/mpindustry-web/src/main/webapp')
OUT = Path('src/modules/id/applicant/reference/generated/application-detail')
OUT.mkdir(parents=True, exist_ok=True)
compiler = Path('scripts/compile-industrial-unit.py').read_text(encoding='utf-8').split("NAMES += ['viewfaInfrastructure']")[0]
namespace = {}
exec(compiler.replace("OUT = Path('src/modules/industrial-unit/generated')", f"OUT = Path('{OUT.as_posix()}')"), namespace)
soup = BeautifulSoup((ROOT / 'pages/applicant/id/viewApplicationDetail.html').read_text(encoding='utf-8'), 'html.parser')
for comment in soup.find_all(string=lambda text: isinstance(text, Comment)):
    comment.extract()
form = soup.select_one('div#applicationForm')
for index, image in enumerate(form.select('img[src^="data:image/png;base64,"]')):
    asset = Path(f'public/legacy/image/land-application-emblem-{index}.png')
    asset.write_bytes(base64.b64decode(image['src'].split(',', 1)[1]))
    image['src'] = '/' + asset.relative_to('public').as_posix()
    image['alt'] = 'Government emblem'
for container in form.select('ng-container'):
    container.name = 'span'
for table in form.find_all('table'):
    rows = table.find_all('tr', recursive=False)
    if rows:
        body = soup.new_tag('tbody')
        rows[0].insert_before(body)
        for row in rows:
            body.append(row.extract())
data = [namespace['node'](form)]
(OUT / 'view.json').write_text(json.dumps(data, ensure_ascii=False, separators=(',', ':')), encoding='utf-8')
lines = ["import { filter } from '../../../../../industrial-unit/viewHelpers'", 'export const expressions = [']
for source, statement in namespace['expressions']:
    code = namespace['js'](source)
    lines.append('s => {' + code + '},' if statement else 's => (' + code + '),')
(OUT / 'expressions.js').write_text('\n'.join(lines) + '\n]\n', encoding='utf-8')
print(f'Compiled original application view: {len(namespace["expressions"])} bindings, {len(form.select("table"))} tables.')

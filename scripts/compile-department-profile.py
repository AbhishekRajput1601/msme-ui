"""Preserve the department account templates using the existing static view compiler."""
import json
import re
from pathlib import Path
from bs4 import BeautifulSoup, Comment

compiler = Path('scripts/compile-industrial-unit.py').read_text(encoding='utf-8')
context = {}
exec(compiler.split("NAMES += ['viewfaInfrastructure']")[0], context)
root = context['ROOT']
out = Path('src/modules/profile/department/generated')
out.mkdir(parents=True, exist_ok=True)
views, inventory = {}, {}
for name in ['updateprofile', 'changepassword']:
    path = root / 'pages/section' / (name + '.html')
    soup = BeautifulSoup(path.read_text(encoding='utf-8'), 'html.parser')
    for comment in soup.find_all(string=lambda s: isinstance(s, Comment)):
        comment.extract()
    inventory[name] = {
        'source': str(path.relative_to(root)),
        'fields': [dict(e.attrs) for e in soup.select('input, select, textarea')],
        'events': sorted(set(v for e in soup.find_all() for k,v in e.attrs.items() if re.match(r'(data-)?ng-(click|change|submit|init|blur)', k))),
    }
    # Angular minlength must also reach the browser constraint validator.
    for field in soup.select('[data-ng-minlength]'):
        field['minlength'] = field['data-ng-minlength']
    views[name] = [n for child in soup.children if (n := context['node'](child)) is not None]
(out / 'views.json').write_text(json.dumps(views, ensure_ascii=False), encoding='utf-8')
lines = ['// Generated from the legacy department account templates.', 'export const expressions = [']
for source, statement in context['expressions']:
    code = context['js'](source)
    lines.append('  s => (' + code.rstrip(';') + '),')
(out / 'expressions.js').write_text('\n'.join(lines + [']\n']), encoding='utf-8')
(out / 'reference.css').write_text('@scope (.department-profile-page) {\n' + '\n'.join(context['styles']).replace('.point:last {', '.point:last-child {') + '\n}\n', encoding='utf-8')
translations = {}
for locale in ['en_US', 'hi_IN']:
    values = {}
    for line in next(root.parent.rglob('views_' + locale + '.properties')).read_text(encoding='utf-8').splitlines():
        if '=' not in line or line.lstrip().startswith('#'): continue
        key, value = line.split('=', 1)
        if key.strip() in context['keys']:
            values[key.strip()] = re.sub(r'\\u([0-9a-fA-F]{4})', lambda m: chr(int(m[1], 16)), value.strip())
    translations[locale[:2]] = values
(out / 'translations.json').write_text(json.dumps(translations, ensure_ascii=False, indent=2), encoding='utf-8')
(out / 'inventory.json').write_text(json.dumps(inventory, ensure_ascii=False, indent=2), encoding='utf-8')
print(json.dumps({name: {'fields': len(item['fields']), 'events': item['events']} for name, item in inventory.items()}, indent=2))

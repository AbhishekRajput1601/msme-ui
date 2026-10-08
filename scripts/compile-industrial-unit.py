"""Compile the Industrial Unit reference markup into React view metadata.

The browser loads no AngularJS, legacy controller, HTML template, or expression
interpreter. Expressions become ordinary, statically bundled JS functions.
"""
import json
import re
import sys
from pathlib import Path
from bs4 import BeautifulSoup, Comment, NavigableString, Doctype

ROOT = Path(sys.argv[1]) if len(sys.argv) > 1 else Path('E:/eclipse/MSME%20-%20LAND%20ALLOTMENT%20AND%20FINANCIAL%20ASSISTANCE/mpindustry-web/src/main/webapp')
OUT = Path('src/modules/industrial-unit/generated')
OUT.mkdir(parents=True, exist_ok=True)
NAMES = ['faNewMsmeFundAssistance', 'editFaNewMsmeFundAssistance', 'faIndustrialProfileDetails', 'faIndustrialUnitDetails', 'faIndustrialSchemeDetails', 'faTenCr_scheme', 'viewFADetailUnitNew2', 'viewFASchemesFormUnit', 'viewFASchemesUnit', 'viewFADocUploadUnitForm', 'viewFADocumentsUploadUnit', 'faHistory', 'viewfaDisbursementUnit', 'viewfaacceptanceamountdetailunit', 'infraDevelopmetForm', 'addUnitDetails']
expressions = []
inventory = {}
styles = []
keys = set()
token = re.compile(r'''("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\b\d+(?:\.\d+)?\b|[$A-Za-z_][$\w]*|\s+|.)''', re.S)
reserved = set('true false null undefined NaN Infinity Math Number String Date Object Array parseInt parseFloat isNaN typeof instanceof new return'.split())

def js(source):
    if not source.strip(): return 'undefined'
    # Repair two unterminated conditions in faTenCr_scheme (bankDoc1/2).
    if source.endswith("=='Made-ups and readymade garment"):
        source += "s'"
    source = re.sub(r'\.([\w]+)_\{\{(.*?)\}\}', lambda m: '[' + json.dumps(m[1] + '_') + '+(' + m[2] + ')]', source)
    # Pipe filters occur in read-only labels; logical OR must remain JS OR.
    pipes = re.split(r'(?<!\|)\|(?!\|)', source)
    source = pipes[0]
    tokens = token.findall(source)
    out = []
    for i, t in enumerate(tokens):
        prev = next((p for p in reversed(tokens[:i]) if p.strip()), '')
        following = next((p for p in tokens[i+1:] if p.strip()), '')
        if re.fullmatch(r'[$A-Za-z_][$\w]*', t) and t not in reserved and prev != '.' and not (following == ':' and prev in ('{', ',')):
            t = 's.' + t
        out.append(t)
    result = ''.join(out)
    for pipe in pipes[1:]:
        parts = pipe.strip().split(':', 1)
        result = 'filter(' + json.dumps(parts[0].strip()) + ',(' + result + ')' + (',' + js(parts[1]) if len(parts) > 1 else '') + ')'
    return result

def expr(value, statement=False):
    value = value.strip()
    if not statement: value = value.rstrip(';')
    item = (value, statement)
    if item not in expressions:
        expressions.append(item)
    return expressions.index(item)

def text(value):
    return [expr(p[2:-2]) if p.startswith('{{') else p for p in re.split(r'(\{\{.*?\}\})', value, flags=re.S) if p]

def node(el):
    if isinstance(el, (Comment, Doctype)):
        return None
    if isinstance(el, NavigableString):
        value = re.sub(r'\s+', ' ', str(el))
        return {'text': text(value)} if value.strip() else None
    if el.name in ('script', 'head', 'meta', 'link', 'title'):
        return None
    if el.name == 'style':
        styles.append(el.get_text())
        return None
    attrs = {k: ' '.join(v) if isinstance(v, list) else v for k,v in el.attrs.items()}
    a = {re.sub(r'^data-', '', k): v for k,v in attrs.items()}
    result = {'tag': el.name, 'attrs': {}}
    if a.get('th:replace'):
        result['fragment'] = a['th:replace'].split('::')[0].strip().split('/')[-1]
        return result
    for name in ('if', 'show', 'hide', 'disabled', 'required', 'value', 'class', 'checked'):
        if 'ng-' + name in a:
            result[name] = expr(a['ng-' + name])
    for name in ('click', 'change', 'blur', 'submit', 'init'):
        if 'ng-' + name in a:
            result[name] = expr(a['ng-' + name], True)
    for attr in ('onclick', 'onchange', 'onblur'):
        if a.get(attr): result['inline_' + attr[2:]] = a[attr]
    if a.get('ng-repeat'):
        match = re.match(r'\s*(?:\(([^)]+)\)|([\w$]+))\s+in\s+(.+?)(?:\s+track by .*)?$', a['ng-repeat'])
        if not match: raise ValueError(a['ng-repeat'])
        result['repeat'] = {'names': (match[1] or match[2]).replace(' ', '').split(','), 'items': expr(match[3])}
    if a.get('ng-model') or a.get('file-model'):
        result['model'] = a.get('ng-model') or a.get('file-model')
        result['read'] = expr(result['model'])
    if a.get('ng-options'):
        result['options'] = a['ng-options']
    if a.get('ng-pattern'):
        result['pattern'] = a['ng-pattern']
    if a.get('ng-attr-max-value'):
        result['maxValue'] = expr(a['ng-attr-max-value'].strip()[2:-2])
    for k,v in attrs.items():
        if k.startswith(('data-ng-', 'ng-', 'th:', 'xmlns')) or k in ('file-model', 'selected') or k.startswith('on'):
            continue
        result['attrs'][k] = text(v)
    for name in ('href', 'src'):
        if a.get('ng-' + name): result['attrs'][name] = text(a['ng-' + name])
        if a.get('th:' + name, '').startswith('@{'):
            result['attrs'][name] = text('/mpmsme' + a['th:' + name][2:-1])
    if a.get('th:text', '').startswith('#{'):
        result['translation'] = a['th:text'][2:-1]
        keys.add(result['translation'])
    if a.get('th:value', '').startswith('#{'):
        result['valueTranslation'] = a['th:value'][2:-1]
        keys.add(result['valueTranslation'])
    if a.get('ng-bind'):
        result['children'] = [{'text': [expr(a['ng-bind'])]}]
    else:
        result['children'] = [n for child in el.children if (n := node(child)) is not None]
    if el.name in ('html', 'body'):
        result['tag'] = 'section'
    return result

NAMES += ['viewfaInfrastructure']
for name in NAMES:
    path = ROOT / 'pages/applicant/fa' / (name + '.html')
    if name == 'viewfaInfrastructure':
        path = ROOT / 'pages/fa' / (name + '.html')
    soup = BeautifulSoup(path.read_text(encoding='utf-8'), 'html.parser')
    if name == 'viewfaInfrastructure':
        # Match the tbody inserted by the browser when it parses the old HTML.
        for table in soup.find_all('table'):
            rows = table.find_all('tr', recursive=False)
            if rows:
                body = soup.new_tag('tbody')
                rows[0].insert_before(body)
                for row in rows:
                    body.append(row.extract())
    for c in soup.find_all(string=lambda s: isinstance(s, Comment)): c.extract()
    inventory[name] = {
        'source': str(path.relative_to(ROOT)),
        'fields': [dict(e.attrs) for e in soup.select('input, select, textarea')],
        'events': sorted(set(v for e in soup.find_all() for k,v in e.attrs.items() if re.match(r'(data-)?ng-(click|change|submit|init)', k))),
        'fragments': [e.get('th:replace') for e in soup.select('[th\\:replace]')],
    }
    data = [n for child in soup.children if (n := node(child)) is not None]
    (OUT / (name + '.json')).write_text(json.dumps(data, ensure_ascii=False, separators=(',', ':')), encoding='utf-8')

lines = ['// Generated at build time from reviewed reference expressions. No runtime eval.', "import { filter } from '../viewHelpers'", 'export const expressions = [']
for source, statement in expressions:
    code = js(source)
    if statement and re.fullmatch(r'\w+\([^;]*\);?', source.strip(), flags=re.S):
        lines.append('  (s) => (' + code.rstrip(';') + '),')
    else:
        lines.append('  (s) => {' + code + '},' if statement else '  (s) => (' + code + '),')
lines.append(']\n')
(OUT / 'expressions.js').write_text('\n'.join(lines), encoding='utf-8')
(OUT / 'reference.css').write_text('@scope (.industrial-unit-page) {\n' + '\n'.join(dict.fromkeys(styles)) + '\n}\n', encoding='utf-8')
(OUT / 'views.js').write_text('\n'.join('import '+n+" from './"+n+".json'" for n in NAMES) + '\nexport default {' + ','.join(NAMES) + '}\n', encoding='utf-8')
translation_path = OUT / 'translations.json'
# The application also supplies reviewed translations for other Industrial Unit
# screens. Recompiling these templates must not discard those entries.
translations = json.loads(translation_path.read_text(encoding='utf-8')) if translation_path.exists() else {}
for locale in ['en_US', 'hi_IN']:
    candidates = list(ROOT.parent.rglob('views_' + locale + '.properties'))
    values = {}
    if candidates:
        for line in candidates[0].read_text(encoding='utf-8').splitlines():
            if '=' not in line or line.lstrip().startswith('#'): continue
            k,v = line.split('=', 1)
            if k.strip() in keys:
                values[k.strip()] = re.sub(r'\\u([0-9a-fA-F]{4})', lambda m: chr(int(m[1], 16)), v.strip())
    existing = translations.setdefault(locale[:2], {})
    for key, value in values.items():
        existing.setdefault(key, value)
translation_path.write_text(json.dumps(translations, ensure_ascii=False, indent=2), encoding='utf-8')
audit = Path('artifacts/industrial-unit')
audit.mkdir(parents=True, exist_ok=True)
(audit / 'reference-inventory.json').write_text(json.dumps(inventory, ensure_ascii=False, indent=2), encoding='utf-8')
print(f'Compiled {len(NAMES)} templates, {sum(len(v["fields"]) for v in inventory.values())} field occurrences and {len(expressions)} bindings.')

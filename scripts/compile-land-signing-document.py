"""Compile the checked-in legacy document into static JSX; no Angular runtime/eval.

Only the known expression subset is accepted. Unsupported expressions stop generation
instead of silently dropping content from a document intended for signing.
"""
import json
import re
import sys
from pathlib import Path
from bs4 import BeautifulSoup, Comment, NavigableString

root = Path(sys.argv[1])
source = root / 'pages/applicant/id/eSignApplicationDetail.html'
soup = BeautifulSoup(source.read_text(encoding='utf-8'), 'html.parser')
for comment in soup.find_all(string=lambda node: isinstance(node, Comment)):
    comment.extract()
document = soup.select_one('.esignHtml')
assert document is not None
# The old document contains direct table rows and a table nested directly inside
# another table. Preserve their content/order while emitting valid React markup.
for table in reversed(document.find_all('table')):
    for nested in list(table.find_all('table', recursive=False)):
        row, cell = soup.new_tag('tr'), soup.new_tag('td', colspan='4')
        nested.replace_with(row)
        row.append(cell)
        cell.append(nested)
    body = None
    for child in list(table.children):
        if getattr(child, 'name', None) == 'tr':
            if body is None:
                body = soup.new_tag('tbody')
                child.insert_before(body)
            body.append(child.extract())
        elif getattr(child, 'name', None):
            body = None
bindings = set()
roots = {'applicationData', 'applicantDocumentsList', 'industrialProfileDocumentsList', 'item', 'idEmpBean', 'landDetail', 'partner', 'profileDocument', 'applicantDocument', '$index'}
token = re.compile(r'''\s+|"[^"\\]*"|'[^'\\]*'|[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*)*|\d+(?:\.\d+)?|===|!==|==|!=|&&|\|\||[!?():+*/<>-]''')

def expression(value):
    value = value.strip()
    bindings.add(value)
    if re.fullmatch(r'calTotalEmployment\(applicationData\.(idEmploymentBeans|investmentBeans|financeBeans),\s*(true|false)\)', value):
        return 'amountTotal(applicationData?.' + re.search(r'applicationData\.(\w+)', value)[1] + ')'
    if re.search(r'\|\s*IND\s*$', value):
        return 'formatAmount(' + expression(re.sub(r'\|\s*IND\s*$', '', value)) + ')'
    parts = token.findall(value)
    if ''.join(parts) != value:
        raise ValueError('Unsupported signing expression: ' + value)
    result = []
    for part in parts:
        if re.match(r'[A-Za-z_$]', part) and part not in {'null', 'true', 'false'}:
            if part.split('.')[0] not in roots:
                raise ValueError('Unknown signing identifier: ' + part)
            part = part.replace('.', '?.').replace('$index', 'rowIndex')
        result.append(part)
    return ''.join(result)

def text_jsx(value):
    result = []
    for index, part in enumerate(re.split(r'\{\{(.*?)\}\}', value, flags=re.S)):
        if index % 2:
            result.append('{(' + expression(part) + ') ?? ""}')
        elif part.strip():
            result.append('{' + json.dumps(re.sub(r'\s+', ' ', part), ensure_ascii=False) + '}')
    return ''.join(result)

def render(node):
    if isinstance(node, NavigableString):
        return text_jsx(str(node))
    tag = node.name
    if tag in {'script', 'style', 'input', 'select', 'textarea', 'button', 'form'}:
        raise ValueError('Unexpected interactive node in signing document: ' + tag)
    if tag in {'ng-container', 'a'}:
        tag = 'span'
    if not re.fullmatch(r'[a-z][a-z0-9]*', tag):
        raise ValueError('Unexpected tag: ' + tag)
    attrs = []
    for key, value in node.attrs.items():
        if key in {'class', 'colspan', 'rowspan', 'width', 'height', 'align', 'valign', 'border', 'cellpadding', 'cellspacing'}:
            name = {'class': 'className', 'colspan': 'colSpan', 'rowspan': 'rowSpan', 'valign': 'vAlign', 'cellpadding': 'cellPadding', 'cellspacing': 'cellSpacing'}.get(key, key)
            attrs.append(name + '={' + json.dumps(' '.join(value) if isinstance(value, list) else value) + '}')
        elif key == 'style':
            style = {}
            for entry in value.split(';'):
                if ':' not in entry:
                    continue
                name, val = entry.split(':', 1)
                name = re.sub(r'-([a-z])', lambda match: match[1].upper(), name.strip())
                if re.search(r'url\(|expression', val, re.I):
                    raise ValueError('Unexpected style URL')
                style[name] = val.strip()
            attrs.append('style={' + json.dumps(style) + '}')
        elif key.startswith(('ng-', 'data-ng-')) and key not in {'ng-if', 'data-ng-if', 'ng-repeat', 'data-ng-repeat', 'ng-click', 'data-ng-click', 'ng-bind', 'data-ng-bind', 'ng-href', 'data-ng-href'}:
            raise ValueError('Unsupported directive: ' + key)
    repeat = node.get('data-ng-repeat') or node.get('ng-repeat')
    if repeat:
        variable, collection = re.split(r'\s+in\s+', repeat.strip())
        if variable not in roots:
            raise ValueError('Unknown repeat variable')
        attrs.append('key={rowIndex}')
    binding = node.get('data-ng-bind') or node.get('ng-bind')
    children = '{' + expression(binding) + '}' if binding else ''.join(render(child) for child in node.children)
    opening = '<' + tag + (' ' + ' '.join(attrs) if attrs else '')
    element = opening + ' />' if tag in {'br', 'hr', 'img'} else opening + '>' + children + '</' + tag + '>'
    condition = node.get('data-ng-if') or node.get('ng-if')
    if condition:
        element = '{(' + expression(condition) + ') ? (' + element + ') : null}'
    if repeat:
        element = '{(' + expression(collection) + ' ?? []).map((' + variable + ', rowIndex) => (' + element + '))}'
    return element

body = render(document)
target = Path('src/modules/id/applicant/components/LandSigningDocument.jsx')
target.write_text('// Generated by scripts/compile-land-signing-document.py from eSignApplicationDetail.html.\n'
                  "import { amountTotal } from '../landApplicationModel'\n"
                  "const formatAmount = value => value == null || value === '' ? '' : Number(value).toLocaleString('en-IN', { maximumFractionDigits: 2 })\n"
                  'export default function LandSigningDocument({ applicationData, applicantDocumentsList = [], industrialProfileDocumentsList = [] }) {\n'
                  '  return (' + body.replace('</tr>', '</tr>\n').replace('</table>', '</table>\n') + ')\n}\n', encoding='utf-8')
Path('artifacts/land-allotment/signing-bindings.json').write_text(json.dumps(sorted(bindings), indent=2, ensure_ascii=False), encoding='utf-8')
print(f'Compiled {len(bindings)} signing bindings to {target}.')

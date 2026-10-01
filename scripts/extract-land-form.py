"""Extract declarative field metadata; never ship or execute Angular expressions."""
import json
import re
import sys
from pathlib import Path
from bs4 import BeautifulSoup, Comment

root = Path(sys.argv[1])
source = root / 'pages/applicant/id/vacantLandApplyForm.html'
soup = BeautifulSoup(source.read_text(encoding='utf-8'), 'html.parser')
for comment in soup.find_all(string=lambda text: isinstance(text, Comment)):
    comment.extract()
fields = {}
for node in soup.select('input, select, textarea'):
    model = node.get('data-ng-model', node.get('ng-model', ''))
    if not model or model.startswith('calTotal'):
        continue
    group = node.find_parent(class_='form-group')
    label = group.find('label') if group else None
    fallback = re.sub(r'([a-z])([A-Z])', r'\1 \2', model.split('.')[-1]).capitalize()
    title = ' '.join(label.stripped_strings).strip(' *:') if label else fallback
    options = [{'value': o.get('value', ''), 'label': ' '.join(o.stripped_strings)}
               for o in node.find_all('option') if '{{' not in str(o)]
    field = {'name': model, 'label': title or fallback, 'type': node.get('type', node.name),
             'required': node.has_attr('required'),
             'readOnly': node.has_attr('readonly') or node.has_attr('disabled') or
                         node.get('ng-disabled', node.get('data-ng-disabled')) == 'true'}
    if node.get('maxlength', '').isdigit():
        field['maxLength'] = int(node['maxlength'])
    if options:
        field['options'] = options
    if node.get('value') and node.get('type') == 'radio':
        field['options'] = [{'value': node['value'], 'label': 'Yes' if node['value'] == 'true' else 'No'}]
        if model in fields:
            fields[model]['options'] += field['options']
            continue
    fields[model] = field
output = Path('src/modules/id/applicant/landFormFields.json')
output.write_text(json.dumps(list(fields.values()), ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print(f'Extracted {len(fields)} fields to {output}')

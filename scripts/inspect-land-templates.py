import json
import re
import sys
from pathlib import Path
from bs4 import BeautifulSoup, Comment

root = Path(sys.argv[1])
for name in sys.argv[2:]:
    soup = BeautifulSoup((root / f'pages/applicant/id/{name}.html').read_text(encoding='utf-8'), 'html.parser')
    for comment in soup.find_all(string=lambda text: isinstance(text, Comment)):
        comment.extract()
    region = soup.select_one('.esignHtml') or soup
    print(json.dumps({'template': name,
        'expressions': sorted(set(re.findall(r'\{\{(.*?)\}\}', str(region), re.S))),
        'directives': sorted(set(f'{key}={value}' for el in region.find_all() for key, value in el.attrs.items()
                                 if key in ['data-ng-if', 'ng-if', 'data-ng-show', 'ng-show', 'data-ng-repeat', 'ng-repeat', 'data-ng-init', 'data-ng-submit'])),
        'fields': [dict(el.attrs) for el in region.select('input, select, textarea')]
    }, ensure_ascii=False))

"""Check the actual served artifact, including every local link and asset."""
import hashlib
import sys
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urljoin, urlparse
from urllib.request import urlopen

base = sys.argv[1]
root = Path(__file__).resolve().parent.parent

class Page(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids = []
        self.urls = []
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if 'id' in attrs:
            self.ids.append(attrs['id'])
        for key in ('src', 'href'):
            if key in attrs:
                self.urls.append(attrs[key])

with urlopen(base) as response:
    assert response.status == 200
    assert response.headers['X-Content-Type-Options'] == 'nosniff'
    assert response.headers['Referrer-Policy'] == 'no-referrer'
    html = response.read().decode()
page = Page()
page.feed(html)
assert 'From the lab to the test kitchen' not in html, 'Superseded company-focused headline'
assert 'tea-island' not in html and 'Step inside' not in html, 'Superseded hero or entrance gate'
assert 'I design circuits and build software.' in html, 'Missing direct personal headline'
assert 'Stanford University · Electrical Engineering' in html, 'Missing Stanford introduction'
for phrase in ('A little curiosity goes a long way', 'made tangible', 'Ideas into things that work', 'ds.</span>'):
    assert phrase not in html, f'Superseded copy: {phrase}'
assert '<span class="monogram">dst</span>' in html, 'Missing dst monogram'
assert len(page.ids) == len(set(page.ids)), 'Duplicate HTML IDs'
for anchor in ('about', 'work', 'experience', 'contact', 'verdnt', 'research', 'developer'):
    assert anchor in page.ids, f'Missing section: {anchor}'
for url in set(page.urls):
    if url.startswith('#'):
        assert url[1:] in page.ids, f'Broken anchor: {url}'
    elif not urlparse(url).scheme:
        with urlopen(urljoin(base, url)) as response:
            assert response.status == 200, url
            assert response.read(), f'Empty asset: {url}'
for url in ('https://github.com/dsanchezt22', 'https://www.linkedin.com/in/diego-sanchez-tirado', 'https://github.com/manaflow-ai/cmux', 'https://github.com/earendil-works/pi'):
    assert url in page.urls, f'Missing public link: {url}'
assert not any('modern-software-dev-assignments' in url or 'staging.fsteaai.com' in url for url in page.urls)
with urlopen(urljoin(base, 'Diego-Sanchez-Tirado-Resume.pdf')) as response:
    pdf = response.read()
    assert response.headers.get_content_type() == 'application/pdf'
    assert pdf.startswith(b'%PDF-')
assert hashlib.sha256(pdf).digest() == hashlib.sha256((root / 'Diego-Sanchez-Tirado-Resume.pdf').read_bytes()).digest(), 'Resume differs from source'
for asset in [*(root / 'dist').glob('*.js'), root / 'dist' / 'styles.css']:
    with urlopen(urljoin(base, asset.name)) as response:
        assert response.read() == asset.read_bytes(), f'Served build differs: {asset.name}'
print(f'PASS: {len(page.ids)} IDs, all local anchors/assets, public profile/tool links, headers, exact resume bytes.')

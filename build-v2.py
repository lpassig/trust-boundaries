"""Build the current story game, its offline copies, and the previous URL redirect."""
from pathlib import Path

root = Path(__file__).resolve().parent
src = root / 'v2'
html = (src / 'index.html').read_text()
html = html.replace('<link rel="stylesheet" href="style.css">', '<style>\n' + (src / 'style.css').read_text() + '\n</style>')
for name, path in [
    ('../assets/art.js', root / 'assets/art.js'),
    ('../assets/protocols.js', root / 'assets/protocols.js'),
    *[(name, src / name) for name in ['story.js', 'rules.js', 'interactions.js', 'trace.js', 'products.js', 'architecture.js', 'ui.js']],
]:
    code = path.read_text().replace('</script', '<\\/script')
    html = html.replace(f'<script src="{name}"></script>', '<script>\n' + code + '\n</script>')

for output in [root / 'play.html', root / 'play-v2.html', root / 'docs/index.html']:
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(html)

redirect = root / 'docs/v2/index.html'
redirect.parent.mkdir(parents=True, exist_ok=True)
redirect.write_text('''<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Trust Boundaries</title><link rel="canonical" href="https://lpassig.github.io/trust-boundaries/">
<script>location.replace('../'+location.search+location.hash);</script>
<noscript><meta http-equiv="refresh" content="0;url=../"></noscript></head>
<body><p><a href="../">Play Trust Boundaries</a></p></body></html>
''')
print('Built the main game, offline copies, and previous-URL redirect.')

"""Build or check the story game, its offline copies, and the previous URL redirect."""
from argparse import ArgumentParser
from pathlib import Path

root = Path(__file__).resolve().parent
src = root / 'v2'
parser = ArgumentParser(description=__doc__)
parser.add_argument('--check', action='store_true', help='Report missing or stale files without writing them.')
args = parser.parse_args()

html = (src / 'index.html').read_text(encoding='utf-8')
html = html.replace('<link rel="stylesheet" href="style.css">', '<style>\n' + (src / 'style.css').read_text(encoding='utf-8') + '\n</style>')
for name, path in [
    ('../assets/art.js', root / 'assets/art.js'),
    ('../assets/protocols.js', root / 'assets/protocols.js'),
    *[(name, src / name) for name in ['story.js', 'rules.js', 'interactions.js', 'trace.js', 'products.js', 'architecture.js', 'decision-lab.js', 'shadow.js', 'ui.js']],
]:
    code = path.read_text(encoding='utf-8').replace('</script', '<\\/script')
    html = html.replace(f'<script src="{name}"></script>', '<script>\n' + code + '\n</script>')

redirect = '''<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Trust Boundaries</title><link rel="canonical" href="https://lpassig.github.io/trust-boundaries/">
<script>location.replace('../'+location.search+location.hash);</script>
<noscript><meta http-equiv="refresh" content="0;url=../"></noscript></head>
<body><p><a href="../">Play Trust Boundaries</a></p></body></html>
'''
outputs = {
    'play.html': html,
    'play-v2.html': html,
    'docs/index.html': html,
    'docs/v2/index.html': redirect,
}

if args.check:
    stale = []
    for name, content in outputs.items():
        path = root / name
        if not path.is_file() or path.read_bytes() != content.encode('utf-8'):
            stale.append(name)
    if stale:
        raise SystemExit(f"Missing or stale build files: {', '.join(stale)}. Run python3 build-v2.py.")
    print('All generated game files match the source.')
else:
    for name, content in outputs.items():
        path = root / name
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_bytes(content.encode('utf-8'))
    print('Built the main game, offline copies, and previous-URL redirect.')

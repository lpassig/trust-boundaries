"""Create the self-contained, offline HTML edition from the editable web files."""
from pathlib import Path

root = Path(__file__).resolve().parent
dist = root / "dist"
html = (dist / "index.html").read_text()
html = html.replace('<link rel="stylesheet" href="style.css">', '<style>\n' + (dist / "style.css").read_text() + '\n</style>')
for name in ("content.js", "protocols.js", "engine.js", "art.js", "game.js"):
    source = (dist / name).read_text().replace('</script', '<\\/script')
    html = html.replace(f'<script src="{name}"></script>', '<script>\n' + source + '\n</script>')
(root / "play.html").write_text(html)
print("Created play.html — opens directly in a browser, no installation needed.")

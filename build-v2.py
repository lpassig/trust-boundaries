"""Build the V2 story as an offline file and a separate GitHub Pages episode."""
from pathlib import Path
root=Path(__file__).resolve().parent
src=root/'v2'
html=(src/'index.html').read_text()
html=html.replace('<link rel="stylesheet" href="style.css">','<style>\n'+(src/'style.css').read_text()+'\n</style>')
for name,path in [('../dist/art.js',root/'dist/art.js'),('../dist/protocols.js',root/'dist/protocols.js'),('story.js',src/'story.js'),('rules.js',src/'rules.js'),('interactions.js',src/'interactions.js'),('trace.js',src/'trace.js'),('products.js',src/'products.js'),('ui.js',src/'ui.js')]:
    code=path.read_text().replace('</script','<\\/script')
    html=html.replace(f'<script src="{name}"></script>','<script>\n'+code+'\n</script>')
(root/'play-v2.html').write_text(html.replace('__CLASSIC_LINK__','play.html'))
output=root/'docs/v2';output.mkdir(parents=True,exist_ok=True)
(output/'index.html').write_text(html.replace('__CLASSIC_LINK__','../'))
print('Built play-v2.html and docs/v2/index.html. Classic edition preserved.')

classic=root/'docs/index.html'
if classic.exists():
    page=classic.read_text()
    if 'id="v2-invitation"' not in page:
        banner='<a id="v2-invitation" href="v2/" style="display:block;padding:12px 18px;margin-bottom:20px;border:1px solid #a88bd666;border-radius:12px;background:#28243b;color:#e3d0ff;text-decoration:none;font-size:15px">V2 is here · Play The Last Upload and Nova’s new story adventures</a>'
        page=page.replace('<main>','<main>'+banner,1)
        classic.write_text(page)

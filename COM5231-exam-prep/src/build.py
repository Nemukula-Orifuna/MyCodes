"""Build a styled PDF from one or more Markdown study-note files.

Usage: python3 -I build.py OUT.pdf "Title" "Subtitle" in1.md [in2.md ...]
"""
import html, re, subprocess, sys, os, json

out_pdf, title, subtitle, *inputs = sys.argv[1:]
here = os.path.dirname(os.path.abspath(__file__))

BADGES = [
    (r"🟦\s*\*\*SUPPLEMENTARY\*\*", '<span class="badge supp">SUPPLEMENTARY</span>'),
    (r"🟦\s*SUPPLEMENTARY", '<span class="badge supp">SUPPLEMENTARY</span>'),
    (r"🟦", '<span class="badge supp">SUPPLEMENTARY</span>'),
    (r"⚠️\s*\*\*NOTES ERROR[^*]*\*\*", '<span class="badge err">NOTES ERROR</span>'),
    (r"⚠️\s*\*\*EXAM TIP\*\*", '<span class="badge tip">EXAM TIP</span>'),
    (r"⚠️", '<span class="badge warn">NOTE</span>'),
    (r"🎯\s*\*\*EXAM TIP\*\*", '<span class="badge tip">EXAM TIP</span>'),
    (r"🎯\s*\*\*EXAM\*\*", '<span class="badge exam">EXAM</span>'),
    (r"🎯", '<span class="badge exam">EXAM</span>'),
    (r"⭐", '<span class="star">★</span>'),
    (r"✅", "✔"),
]

parts = []
for i, path in enumerate(inputs):
    md = open(path, encoding="utf-8").read()
    for pat, rep in BADGES:
        md = re.sub(pat, rep, md)
    # drop the markdown horizontal-rule clusters; sections get page breaks instead
    md = re.sub(r"\n---\n(---\n)?", "\n\n", md)
    h = subprocess.run(["pandoc", "-f", "gfm", "-t", "html", "--wrap=none"],
                       input=md, capture_output=True, text=True, check=True).stdout
    parts.append(f'<section class="doc">{h}</section>')
body = "\n".join(parts)

DIAGRAM_CHARS = set("─│┌┐└┘├┤┬┴┼═║▓▒░█▄▂∿∽◄►▼▲•")

def convert_pre(m):
    raw = html.unescape(m.group(1))
    lines = raw.rstrip("\n").split("\n")
    is_diagram = any(c in DIAGRAM_CHARS for c in raw) or len(lines) > 1 and any(
        re.search(r"\S {3,}\S", ln) for ln in lines)
    if is_diagram:
        return f'<div class="figure"><pre>{html.escape(raw.rstrip())}</pre></div>'
    inner = "<br>".join(html.escape(ln.strip()) for ln in lines if ln.strip())
    return f'<div class="formula">{inner}</div>'

body = re.sub(r"<pre[^>]*><code[^>]*>(.*?)</code></pre>", convert_pre, body, flags=re.S)
# inline code (rare) -> plain emphasis, so nothing looks like programming code
body = re.sub(r"<code>(.*?)</code>", r'<span class="mono">\1</span>', body, flags=re.S)
# each top-level "# TOPIC" heading starts a new page; give h1s stable ids for the contents page
toc = []
def tag_h1(m):
    n = len(toc)
    title_html = m.group(2)
    toc.append(re.sub(r"<[^>]+>", "", title_html))
    return f'<h1 id="sec-{n}" class="pb">{title_html}</h1>'
body = re.sub(r"<h1([^>]*)>(.*?)</h1>", tag_h1, body, flags=re.S)
toc_html = ""
if len(inputs) > 1 or os.environ.get("TOC"):
    items = []
    for n, t in enumerate(toc):
        cls = "toc-part" if re.match(r"(Part|Overview|How|\d+\.)", t) else "toc-topic"
        items.append(f'<li class="{cls}"><a href="#sec-{n}">{html.escape(t)}</a></li>')
    toc_html = '<div class="toc"><h1 class="toch">Contents</h1><ul>' + "".join(items) + "</ul></div>"

css = open(os.path.join(here, "style.css"), encoding="utf-8").read()
doc = f"""<!doctype html><html><head><meta charset="utf-8"><title>{html.escape(title)}</title>
<style>{css}</style></head><body>
<div class="cover">
  <div class="course">COM5231 · Introduction to Wireless and Ad Hoc Networking</div>
  <h1 class="ctitle">{html.escape(title)}</h1>
  <div class="csub">{html.escape(subtitle)}</div>
  <div class="ckey">
    <div><span class="badge supp">SUPPLEMENTARY</span> content not found in the uploaded lecture notes</div>
    <div><span class="badge err">NOTES ERROR</span> a mistake in the lecture notes, with the verified correction</div>
    <div><span class="badge exam">EXAM</span> how the topic is or could be examined</div>
    <div><span class="star">★</span> high-priority, frequently examined content</div>
  </div>
  <div class="cfoot">Exam preparation pack, built from the uploaded lecture materials and past papers</div>
</div>
{toc_html}
{body}
</body></html>"""
tmp_html = out_pdf[:-4] + ".tmp.html"
open(tmp_html, "w", encoding="utf-8").write(doc)
subprocess.run(["node", os.path.join(here, "topdf.js"), tmp_html, out_pdf, title], check=True)
os.remove(tmp_html)
print("wrote", out_pdf)

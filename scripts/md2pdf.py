#!/usr/bin/env python3
"""Markdown -> styled HTML -> PDF, matching the house print style
(teal/navy/gold, dark table header rows, system font, 900px measure)."""
import pathlib
import subprocess
import sys

import markdown

CSS = """
@page { size: Letter; margin: 0.75in 0.7in; @bottom-center {
  content: "Nano Games — Page " counter(page) " of " counter(pages);
  font-size: 8pt; color: #7a7a7a; } }
body { font-family: -apple-system, "Helvetica Neue", Calibri, sans-serif;
  max-width: 900px; margin: 0 auto; color: #1c1c1c; font-size: 10.5pt; line-height: 1.55; }
h1 { color: #1B4D5C; font-size: 22pt; margin: 0 0 4pt; border-bottom: 3px solid #C9A84C; padding-bottom: 6pt; }
h2 { color: #1B4D5C; font-size: 14pt; margin: 20pt 0 6pt; border-bottom: 1px solid #d8d8d8; padding-bottom: 3pt; }
h3 { color: #1B2A4A; font-size: 11.5pt; margin: 14pt 0 4pt; }
a { color: #1B4D5C; text-decoration: none; }
code { background: #f2f4f6; padding: 1pt 3pt; border-radius: 2pt;
  font-family: "SF Mono", Menlo, monospace; font-size: 9pt; }
pre { background: #12181f; color: #e6edf3; padding: 9pt 11pt; border-radius: 4pt;
  font-size: 8.5pt; line-height: 1.4; overflow-wrap: break-word; white-space: pre-wrap; }
pre code { background: none; color: inherit; padding: 0; }
table { border-collapse: collapse; width: 100%; margin: 10pt 0; font-size: 9.5pt; }
th { background: #1B2A4A; color: #fff; text-align: left; padding: 6pt 8pt; font-weight: 600; }
td { border-bottom: 1px solid #e2e2e2; padding: 5pt 8pt; vertical-align: top; }
tr:nth-child(even) td { background: #fafbfc; }
blockquote { border-left: 3px solid #C9A84C; margin: 10pt 0; padding: 2pt 0 2pt 12pt; color: #444; }
strong { color: #1B2A4A; }
ul, ol { padding-left: 18pt; }
li { margin: 2pt 0; }
"""


def main():
    if len(sys.argv) != 3:
        print("usage: md2pdf.py <in.md> <out.pdf>", file=sys.stderr)
        return 2
    src, out = pathlib.Path(sys.argv[1]), pathlib.Path(sys.argv[2])
    html_body = markdown.markdown(
        src.read_text(encoding="utf-8"),
        extensions=["tables", "fenced_code", "sane_lists", "toc"],
    )
    html = (
        '<!DOCTYPE html><html><head><meta charset="utf-8">'
        "<style>" + CSS + "</style></head><body>" + html_body + "</body></html>"
    )
    tmp = out.with_suffix(".gen.html")
    tmp.write_text(html, encoding="utf-8")
    subprocess.run(["weasyprint", str(tmp), str(out)], check=True)
    tmp.unlink()
    print("wrote", out)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

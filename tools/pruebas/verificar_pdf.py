"""Compara páginas y orientación de cada PDF de salida/ con lo esperado en casos.json (campos 'paginas' y 'orientacion': v/h).
Requiere: pip install pypdf"""
import json, os
from pypdf import PdfReader
aqui = os.path.dirname(os.path.abspath(__file__))
fallas = 0
for c in json.load(open(os.path.join(aqui, 'casos.json'), encoding='utf-8')):
    r = PdfReader(os.path.join(aqui, 'salida', c['id'] + '.pdf'))
    w, h = [float(x) / 72 * 25.4 for x in r.pages[0].mediabox[2:]]
    ori = 'h' if w > h else 'v'
    bien = len(r.pages) == c['paginas'] and ori == c['orientacion']
    fallas += 0 if bien else 1
    print(f"{c['id']:26s} páginas {len(r.pages):3d} (esperadas {c['paginas']})  {w:.0f}x{h:.0f} mm  {'OK' if bien else 'FALLA'}")
raise SystemExit(1 if fallas else 0)

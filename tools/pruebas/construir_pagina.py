"""Arma salida/app.html: la interfaz completa (Index + Styles + JavaScript) con google.script.run simulado,
para poder abrirla en un navegador sin Apps Script. No modifica nada de gas/."""
import os, re
aqui = os.path.dirname(os.path.abspath(__file__))
gas = os.path.join(aqui, '..', '..', 'gas')
leer = lambda n: open(os.path.join(gas, n), encoding='utf-8').read()
stub = """<script>window.google={script:{run:{withSuccessHandler:function(f){this._s=f;return this},withFailureHandler:function(f){this._f=f;return this},
cargarClientes:function(){var s=this._s;setTimeout(function(){s({ok:true,clientes:[{cuenta:'1',razonSocial:'X',fantasia:'',direccion:'',telefono:'',departamento:'',condicion:''}]})},0)},
agregarCliente:function(c){var s=this._s;setTimeout(function(){s({ok:true,cliente:c})},0)}}}};</script>"""
html = leer('Index.html')
html = html.replace("<?!= include('Styles'); ?>", leer('Styles.html'))
html = html.replace("<?!= include('JavaScript'); ?>", stub + leer('JavaScript.html'))
assert '<?!=' not in html, 'quedó un include sin resolver'
os.makedirs(os.path.join(aqui, 'salida'), exist_ok=True)
open(os.path.join(aqui, 'salida', 'app.html'), 'w', encoding='utf-8').write(html)
print('salida/app.html generado')

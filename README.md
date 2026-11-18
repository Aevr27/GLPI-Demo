# GLPI-Demo — demo visual (prototipo estático)

Prototipo **estático** en español que imita el lenguaje visual de un service desk tipo GLPI 11
para enseñarlo en una reunión. **No es GLPI** ni una instalación real: no hay backend,
base de datos, autenticación ni integración con ningún sistema. Todos los datos son ficticios
(`data/mock-data.js`).

## Contenido

| Ruta | Pantalla |
|---|---|
| `#/` | Panel de control (totales, por prioridad, por mes, actividad reciente) |
| `#/tickets` | Lista de tickets con búsqueda y filtros (estado, prioridad, tipo, técnico) |
| `#/tickets/nuevo` | Formulario de creación (añade el ticket a la sesión actual) |
| `#/tickets/<id>` | Detalle: cronología, seguimientos, propiedades, actores, SLA |
| `#/categorias` | Árbol jerárquico expandible + ficha de categoría |
| `#/usuarios`, `#/grupos`, `#/tecnicos` | Administración |
| `#/configuracion` | Pantalla de configuración general |
| `#/activos/ordenadores`, `monitores`, `impresoras` | Inventario + ficha de activo |

Los tickets creados se guardan en `sessionStorage` (se pierden al cerrar la pestaña).

## Ejecutar (IIS Express existente, sin instalar nada)

```
start-demo.cmd      # sirve esta carpeta en http://localhost:8090
stop-demo.cmd       # detiene solo el IIS Express del puerto 8090
```

`start-demo.cmd` usa `iisexpress /path:... /port:8090`, que genera una configuración temporal;
no modifica el `applicationhost.config` del Dashboard. Si el puerto 8090 está ocupado, el script
se detiene y lo indica.

Alternativa sin servidor: abrir `index.html` directamente en Chrome (funciona con `file://`).

## Estructura

```
index.html
assets/css/app.css
assets/js/app.js
assets/images/logo.svg
data/mock-data.js
start-demo.cmd / stop-demo.cmd
```

Sin dependencias externas ni CDNs: funciona sin conexión a Internet.

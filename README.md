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

## Abrir la demo

Doble clic en `index.html` (o arrastrarlo a Chrome). No necesita servidor, instalación
ni conexión a Internet: todo el código y los datos se cargan desde archivos locales.

## Opcional: servir con IIS Express

```
dev-local.cmd [puerto]   # sirve esta carpeta en http://localhost:8090 (por defecto)
stop-demo.cmd [puerto]   # detiene solo el IIS Express de ese puerto
```

`dev-local.cmd` (adaptado del Dashboard) usa `iisexpress /path:... /port:8090`, que genera una configuración temporal;
no modifica el `applicationhost.config` del Dashboard. Si el puerto 8090 está ocupado, el script
se detiene y lo indica.

## Estructura

```
index.html
assets/css/app.css
assets/js/app.js
assets/images/logo.svg
data/mock-data.js
Web.config                 # cabeceras de seguridad, sin cache, bloquea .git/.cmd/.md
dev-local.cmd / stop-demo.cmd
```

Sin dependencias externas ni CDNs: funciona sin conexión a Internet.

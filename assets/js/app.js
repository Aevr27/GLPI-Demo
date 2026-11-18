/* Demo visual inspirada en GLPI 11. Sin backend: todo son datos ficticios en memoria. */
(function () {
  "use strict";
  var D = window.DEMO_DATA;
  var view = document.getElementById("view");

  /* ---------- Persistencia de sesión (opcional) ---------- */
  var STORE_KEY = "glpi-demo-nuevos-tickets";
  try {
    var saved = JSON.parse(sessionStorage.getItem(STORE_KEY) || "[]");
    saved.forEach(function (t) { if (!D.tickets.some(function (x) { return x.id === t.id; })) D.tickets.unshift(t); });
  } catch (e) { /* sin almacenamiento: no pasa nada */ }
  function persistNew(t) {
    try {
      var arr = JSON.parse(sessionStorage.getItem(STORE_KEY) || "[]");
      arr.unshift(t);
      sessionStorage.setItem(STORE_KEY, JSON.stringify(arr));
    } catch (e) { /* ignorar */ }
  }

  /* ---------- Utilidades ---------- */
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function initials(name) {
    if (!name) return "?";
    return name.split(" ").filter(Boolean).slice(0, 2).map(function (p) { return p[0]; }).join("").toUpperCase();
  }
  function status(id) { var s = D.estados[id]; return '<span class="status ' + s.clase + '"><i></i>' + esc(s.nombre) + "</span>"; }
  function prio(id) { var p = D.prioridades[id]; return '<span class="badge ' + p.clase + '">' + esc(p.nombre) + "</span>"; }
  function cat(id) { return D.categorias.find(function (c) { return c.id === id; }); }
  function catPath(id) {
    var parts = [], c = cat(id);
    while (c) { parts.unshift(c.nombre); c = c.padre ? cat(c.padre) : null; }
    return parts.join(" > ");
  }
  function actor(name) {
    if (!name) return '<span class="tag">Sin asignar</span>';
    return '<span class="actor"><span class="avatar">' + initials(name) + "</span>" + esc(name) + "</span>";
  }
  function now() {
    var d = new Date(), p = function (n) { return String(n).padStart(2, "0"); };
    return d.getFullYear() + "-" + p(d.getMonth() + 1) + "-" + p(d.getDate()) + " " + p(d.getHours()) + ":" + p(d.getMinutes());
  }
  function toast(msg) {
    var t = document.getElementById("toast");
    t.textContent = msg; t.classList.add("show");
    clearTimeout(toast._t); toast._t = setTimeout(function () { t.classList.remove("show"); }, 2600);
  }
  function fullName(u) { return u.nombre + " " + u.apellido; }
  function stateTag(s) {
    var cls = /uso|producción|stock/i.test(s) ? "ok" : /reparación/i.test(s) ? "warn" : /averiada/i.test(s) ? "bad" : "";
    return '<span class="tag ' + cls + '">' + esc(s) + "</span>";
  }

  /* ---------- Iconos (SVG en línea, trazo simple) ---------- */
  var I = {
    home: '<path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
    assets: '<rect x="3" y="4" width="18" height="12" rx="1"/><path d="M8 20h8M12 16v4"/>',
    help: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .8-1 1.5V14M12 17h.01"/>',
    admin: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4a3.5 3.5 0 0 1 0 7M18 20a6 6 0 0 0-2.5-5"/>',
    config: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1"/>',
    ticket: '<path d="M4 7a2 2 0 0 0 0 4v5h16v-5a2 2 0 0 1 0-4V4H4z"/><path d="M10 4v12" stroke-dasharray="2 2"/>',
    open: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    pause: '<circle cx="12" cy="12" r="9"/><path d="M10 9v6M14 9v6"/>',
    check: '<circle cx="12" cy="12" r="9"/><path d="M8 12l3 3 5-6"/>',
    folder: '<path d="M3 6a1 1 0 0 1 1-1h5l2 2h9a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z"/>'
  };
  function icon(name) {
    return '<span class="ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + I[name] + "</svg></span>";
  }

  /* ---------- Menú lateral ---------- */
  var MENU = [
    { key: "inicio", label: "Inicio", icon: "home", href: "#/" },
    { key: "activos", label: "Activos", icon: "assets", items: [
      ["Ordenadores", "#/activos/ordenadores"], ["Monitores", "#/activos/monitores"], ["Impresoras", "#/activos/impresoras"] ] },
    { key: "asistencia", label: "Asistencia", icon: "help", items: [
      ["Tickets", "#/tickets"], ["Crear ticket", "#/tickets/nuevo"], ["Categorías", "#/categorias"] ] },
    { key: "administracion", label: "Administración", icon: "admin", items: [
      ["Usuarios", "#/usuarios"], ["Grupos", "#/grupos"], ["Técnicos", "#/tecnicos"] ] },
    { key: "configuracion", label: "Configuración", icon: "config", items: [
      ["General", "#/configuracion"], ["Desplegables · Categorías", "#/categorias"] ] }
  ];
  var openSections = { asistencia: true };

  function renderNav(activeKey, hash) {
    var html = MENU.map(function (s) {
      if (!s.items) {
        return '<div class="nav-section' + (activeKey === s.key ? " active" : "") + '"><button data-href="' + s.href + '">' + icon(s.icon) + esc(s.label) + "</button></div>";
      }
      var isOpen = openSections[s.key] || activeKey === s.key;
      var sub = s.items.map(function (it) {
        var on = hash === it[1] || (hash.indexOf(it[1] + "/") === 0 && it[1] !== "#/tickets") ||
          (it[1] === "#/tickets" && /^#\/tickets\/\d+/.test(hash));
        return '<a href="' + it[1] + '"' + (on ? ' class="active"' : "") + ">" + esc(it[0]) + "</a>";
      }).join("");
      return '<div class="nav-section' + (isOpen ? " open" : "") + (activeKey === s.key ? " active" : "") + '" data-key="' + s.key + '"><button>' + icon(s.icon) + esc(s.label) + '<span class="chev">▶</span></button><div class="nav-sub">' + sub + "</div></div>";
    }).join("");
    document.getElementById("nav").innerHTML = html;
  }
  document.getElementById("nav").addEventListener("click", function (e) {
    var btn = e.target.closest("button");
    if (!btn) return;
    if (btn.dataset.href) { location.hash = btn.dataset.href; return; }
    var sec = btn.parentElement, key = sec.dataset.key;
    sec.classList.toggle("open");
    openSections[key] = sec.classList.contains("open");
  });
  document.getElementById("menuToggle").addEventListener("click", function () {
    document.getElementById("sidebar").classList.toggle("open");
  });

  function crumbs(list) {
    document.getElementById("breadcrumb").innerHTML = '<a href="#/">Inicio</a>' + list.map(function (c, i) {
      var last = i === list.length - 1;
      return " <span>/</span> " + (last ? "<b>" + esc(c[0]) + "</b>" : c[1] ? '<a href="' + c[1] + '">' + esc(c[0]) + "</a>" : esc(c[0]));
    }).join("");
  }

  /* ---------- Tabla genérica con filtros ---------- */
  function listPage(opts) {
    // opts: title, icon, newHref, columns [{label, render, text}], rows, rowHref, filters [{label, key, values}]
    var filtersHtml = (opts.filters || []).map(function (f, i) {
      return '<select data-f="' + i + '" aria-label="' + esc(f.label) + '"><option value="">' + esc(f.label) + ": todos</option>" +
        f.values.map(function (v) { return '<option value="' + esc(v[0]) + '">' + esc(v[1]) + "</option>"; }).join("") + "</select>";
    }).join("");
    view.innerHTML =
      '<div class="page-head"><h1>' + icon(opts.icon) + esc(opts.title) + '</h1><div class="actions">' +
      (opts.newHref ? '<a class="btn btn-accent" href="' + opts.newHref + '">+ Añadir</a>' : "") +
      '<button class="btn" type="button" id="exportBtn">Exportar</button></div></div>' +
      '<div class="card"><div class="searchbar"><input type="search" id="q" placeholder="Buscar en ' + esc(opts.title.toLowerCase()) + '…">' + filtersHtml +
      '<button class="btn" type="button" id="resetF">Restablecer</button><span class="count" id="count"></span></div>' +
      '<div class="table-wrap"><table class="list"><thead><tr><th><input type="checkbox" aria-label="Seleccionar todo"></th>' +
      opts.columns.map(function (c) { return "<th>" + esc(c.label) + "</th>"; }).join("") +
      '</tr></thead><tbody id="tb"></tbody></table></div>' +
      '<div class="pager"><span id="pinfo"></span><span class="pg"><span>«</span><span class="on">1</span><span>»</span></span></div></div>';

    var q = document.getElementById("q");
    var sels = view.querySelectorAll("select[data-f]");
    function draw() {
      var term = q.value.trim().toLowerCase();
      var rows = opts.rows.filter(function (r) {
        for (var i = 0; i < sels.length; i++) {
          var v = sels[i].value, f = opts.filters[i];
          if (v && !(f.match ? f.match(r, v) : String(f.get(r)) === v)) return false;
        }
        if (!term) return true;
        return opts.columns.some(function (c) { return String(c.text ? c.text(r) : "").toLowerCase().indexOf(term) !== -1; });
      });
      var tb = document.getElementById("tb");
      tb.innerHTML = rows.length ? rows.map(function (r) {
        return '<tr data-href="' + opts.rowHref(r) + '"><td><input type="checkbox" aria-label="Seleccionar"></td>' +
          opts.columns.map(function (c) { return "<td" + (c.num ? ' class="num"' : "") + ">" + c.render(r) + "</td>"; }).join("") + "</tr>";
      }).join("") : '<tr><td colspan="' + (opts.columns.length + 1) + '" class="empty">Ningún elemento encontrado</td></tr>';
      document.getElementById("count").textContent = rows.length + " de " + opts.rows.length + " elementos";
      document.getElementById("pinfo").textContent = "Mostrando " + (rows.length ? 1 : 0) + " a " + rows.length + " de " + rows.length + " filas";
    }
    q.addEventListener("input", draw);
    sels.forEach(function (s) { s.addEventListener("change", draw); });
    document.getElementById("resetF").addEventListener("click", function () { q.value = ""; sels.forEach(function (s) { s.value = ""; }); draw(); });
    document.getElementById("exportBtn").addEventListener("click", function () { toast("Exportación no disponible en la demo visual"); });
    document.getElementById("tb").addEventListener("click", function (e) {
      if (e.target.matches("input")) return;
      var tr = e.target.closest("tr[data-href]");
      if (tr) location.hash = tr.dataset.href;
    });
    if (opts.initialFilter) { sels[opts.initialFilter[0]].value = opts.initialFilter[1]; }
    draw();
  }

  /* ---------- Páginas ---------- */
  function pageDashboard() {
    crumbs([["Panel de control"]]);
    var t = D.tickets;
    var abiertos = t.filter(function (x) { return x.estado <= 3; }).length;
    var pendientes = t.filter(function (x) { return x.estado === 4; }).length;
    var resueltos = t.filter(function (x) { return x.estado >= 5; }).length;
    var porPrio = [6, 5, 4, 3, 2, 1].map(function (p) { return { p: p, n: t.filter(function (x) { return x.prioridad === p; }).length }; });
    var maxP = Math.max.apply(null, porPrio.map(function (x) { return x.n; })) || 1;
    var maxM = Math.max.apply(null, D.ticketsPorMes.map(function (x) { return x.total; }));
    var recientes = t.slice().sort(function (a, b) { return a.actualizacion < b.actualizacion ? 1 : -1; }).slice(0, 6);

    function stat(num, label, ic, tint, href) {
      return '<div class="card"><a class="stat" href="' + href + '"><div class="stat-ico ' + tint + '">' + icon(ic) + '</div><div><div class="stat-num">' + num + '</div><div class="stat-label">' + label + "</div></div></a></div>";
    }
    view.innerHTML =
      '<div class="page-head"><h1>' + icon("home") + 'Panel de control</h1><div class="actions"><a class="btn btn-accent" href="#/tickets/nuevo">+ Crear ticket</a></div></div>' +
      '<div class="grid grid-4" style="margin-bottom:16px">' +
      stat(t.length, "Total de tickets", "ticket", "tint-blue", "#/tickets") +
      stat(abiertos, "Tickets abiertos", "open", "tint-green", "#/tickets?estado=abiertos") +
      stat(pendientes, "Tickets en espera", "pause", "tint-orange", "#/tickets?estado=4") +
      stat(resueltos, "Resueltos / cerrados", "check", "tint-gray", "#/tickets?estado=resueltos") +
      "</div>" +
      '<div class="grid grid-2" style="margin-bottom:16px">' +
      '<div class="card"><div class="card-head">Tickets por prioridad<small>Todos los estados</small></div><div class="card-body"><div class="bars">' +
      porPrio.map(function (x) {
        return '<div class="bar-row" title="' + D.prioridades[x.p].nombre + ": " + x.n + ' tickets"><span>' + D.prioridades[x.p].nombre + '</span><div class="bar-track"><div class="bar-fill" style="width:' + (x.n / maxP * 100) + '%"></div></div><span class="val">' + x.n + "</span></div>";
      }).join("") + "</div></div></div>" +
      '<div class="card"><div class="card-head">Tickets creados por mes<small>Últimos 6 meses · histórico simulado</small></div><div class="card-body"><div class="cols">' +
      D.ticketsPorMes.map(function (m) {
        return '<div class="col" title="' + m.mes + ": " + m.total + ' tickets"><span class="val">' + m.total + '</span><div class="col-fill" style="height:' + (m.total / maxM * 80) + '%"></div></div>';
      }).join("") + '</div><div class="col-labels">' + D.ticketsPorMes.map(function (m) { return "<span>" + m.mes + "</span>"; }).join("") + "</div></div></div>" +
      "</div>" +
      '<div class="grid grid-3-1">' +
      '<div class="card"><div class="card-head">Actividad reciente</div><div class="card-body" style="padding-top:4px;padding-bottom:4px"><ul class="activity">' +
      recientes.map(function (x) {
        return '<li><span class="avatar" style="width:28px;height:28px;font-size:11px">' + initials(x.asignado || x.solicitante) + '</span><div><a href="#/tickets/' + x.id + '">#' + x.id + " " + esc(x.titulo) + '</a><div style="color:var(--ink-3);font-size:12px;margin-top:2px">' + status(x.estado) + " · " + esc(x.asignado || "Sin asignar") + '</div></div><span class="when">' + esc(x.actualizacion) + "</span></li>";
      }).join("") + "</ul></div></div>" +
      '<div class="card"><div class="card-head">Por estado</div><div class="card-body"><div class="bars">' +
      [1, 2, 3, 4, 5, 6].map(function (s) {
        var n = t.filter(function (x) { return x.estado === s; }).length;
        return '<div class="prop" style="padding:4px 0;grid-template-columns:1fr auto">' + status(s) + '<b>' + n + "</b></div>";
      }).join("") + "</div></div></div>" +
      "</div>" +
      '<p class="demo-note">Demo visual con datos ficticios · no es una instalación de GLPI</p>';
  }

  function pageTickets(params) {
    crumbs([["Asistencia"], ["Tickets"]]);
    var estadoVals = Object.keys(D.estados).map(function (k) { return [k, D.estados[k].nombre]; });
    estadoVals.unshift(["resueltos", "Resueltos o cerrados"]);
    estadoVals.unshift(["abiertos", "Abiertos (nuevo / en curso)"]);
    listPage({
      title: "Tickets", icon: "ticket", newHref: "#/tickets/nuevo",
      rows: D.tickets,
      rowHref: function (r) { return "#/tickets/" + r.id; },
      columns: [
        { label: "ID", num: true, render: function (r) { return r.id; }, text: function (r) { return r.id; } },
        { label: "Título", render: function (r) { return '<a href="#/tickets/' + r.id + '">' + esc(r.titulo) + "</a>"; }, text: function (r) { return r.titulo; } },
        { label: "Estado", render: function (r) { return status(r.estado); }, text: function (r) { return D.estados[r.estado].nombre; } },
        { label: "Última actualización", render: function (r) { return esc(r.actualizacion); }, text: function (r) { return r.actualizacion; } },
        { label: "Fecha de apertura", render: function (r) { return esc(r.apertura); }, text: function (r) { return r.apertura; } },
        { label: "Prioridad", render: function (r) { return prio(r.prioridad); }, text: function (r) { return D.prioridades[r.prioridad].nombre; } },
        { label: "Solicitante", render: function (r) { return esc(r.solicitante); }, text: function (r) { return r.solicitante; } },
        { label: "Asignado a", render: function (r) { return r.asignado ? esc(r.asignado) : '<span class="tag">Sin asignar</span>'; }, text: function (r) { return r.asignado; } },
        { label: "Categoría", render: function (r) { return esc(catPath(r.categoria)); }, text: function (r) { return catPath(r.categoria); } }
      ],
      filters: [
        { label: "Estado", values: estadoVals, get: function (r) { return r.estado; },
          match: function (r, v) {
            if (v === "abiertos") return r.estado <= 3;
            if (v === "resueltos") return r.estado >= 5;
            return String(r.estado) === v;
          } },
        { label: "Prioridad", values: Object.keys(D.prioridades).map(function (k) { return [k, D.prioridades[k].nombre]; }), get: function (r) { return r.prioridad; } },
        { label: "Tipo", values: [["Incidencia", "Incidencia"], ["Solicitud", "Solicitud"]], get: function (r) { return r.tipo; } },
        { label: "Técnico", values: D.usuarios.filter(function (u) { return u.tecnico; }).map(function (u) { return [fullName(u), fullName(u)]; }), get: function (r) { return r.asignado; } }
      ],
      initialFilter: params.estado ? [0, params.estado] : null
    });
  }
  function pageTicket(id) {
    var t = D.tickets.find(function (x) { return x.id === id; });
    if (!t) return notFound();
    crumbs([["Asistencia"], ["Tickets", "#/tickets"], ["Ticket #" + t.id]]);
    var tabs = ["Ticket", "Estadísticas", "Aprobaciones", "Base de conocimiento", "Elementos", "Costes", "Proyectos", "Problemas", "Cambios", "Historial", "Todo"];
    var items = [{ autor: t.solicitante, fecha: t.apertura, texto: t.descripcion, tipo: "desc" }].concat(t.seguimiento);
    var kind = { desc: "Descripción", seguimiento: "Seguimiento", tarea: "Tarea", solucion: "Solución" };
    view.innerHTML =
      '<div class="page-head"><h1>' + icon("ticket") + esc(t.titulo) + ' <span style="color:var(--ink-3);font-weight:400">(#' + t.id + ")</span></h1>" +
      '<div class="actions"><a class="btn" href="#/tickets">← Volver a la lista</a></div></div>' +
      '<div class="item-layout"><div class="card"><ul class="tabs-v" id="tabs">' +
      tabs.map(function (x, i) { return '<li class="' + (i === 0 ? "on" : "") + '">' + x + (i === 9 ? '<span class="n">' + (items.length + 3) + "</span>" : "") + "</li>"; }).join("") +
      "</ul></div>" +
      '<div class="ticket-layout"><div class="card"><div class="timeline" id="timeline">' +
      items.map(function (s) {
        return '<div class="tl-item ' + s.tipo + '"><span class="avatar">' + initials(s.autor) + '</span><div class="tl-bubble"><header><b>' + esc(s.autor) + "</b><span>" + esc(s.fecha) + '</span><span class="tl-kind">' + kind[s.tipo] + "</span></header>" + esc(s.texto) + "</div></div>";
      }).join("") +
      '</div><div class="answer-box"><div class="row"><button class="btn btn-primary" type="button" data-k="seguimiento">Responder</button><button class="btn" type="button" data-k="tarea">Crear una tarea</button><button class="btn" type="button" data-k="solucion">Añadir una solución</button></div>' +
      '<textarea id="followText" class="field" style="padding:8px 10px;border:1px solid var(--border);border-radius:6px;min-height:70px" placeholder="Escriba un seguimiento…"></textarea></div></div>' +
      '<div class="card props">' +
      '<div class="sect">Ticket</div>' +
      prop("Fecha de apertura", esc(t.apertura)) +
      prop("Tipo", esc(t.tipo)) +
      prop("Categoría", '<a href="#/categorias/' + t.categoria + '">' + esc(catPath(t.categoria)) + "</a>") +
      prop("Estado", '<select id="stSel" style="padding:4px 6px;border:1px solid var(--border);border-radius:4px">' + Object.keys(D.estados).map(function (k) { return '<option value="' + k + '"' + (+k === t.estado ? " selected" : "") + ">" + D.estados[k].nombre + "</option>"; }).join("") + "</select>") +
      prop("Urgencia", esc(D.prioridades[t.urgencia].nombre)) +
      prop("Impacto", esc(D.prioridades[t.impacto].nombre)) +
      prop("Prioridad", prio(t.prioridad)) +
      prop("Ubicación", esc(t.ubicacion)) +
      prop("Tiempo de resolución", esc(t.vencimiento)) +
      '<div class="sect">Actores</div>' +
      prop("Solicitante", actor(t.solicitante)) +
      prop("Observador", '<span class="tag">—</span>') +
      prop("Asignado a", actor(t.asignado)) +
      prop("Grupo técnico", esc(t.grupo)) +
      '<div class="sect">Acuerdos de nivel de servicio</div>' +
      prop("SLA", esc(t.prioridad >= 4 ? "SLA Prioridad alta (4 h)" : "SLA Estándar (24 h)")) +
      '<div class="form-foot"><button class="btn btn-primary" type="button" id="saveTicket">Guardar</button></div>' +
      "</div></div></div>";

    view.querySelector("#tabs").addEventListener("click", function (e) {
      var li = e.target.closest("li"); if (!li) return;
      view.querySelectorAll("#tabs li").forEach(function (x) { x.classList.remove("on"); });
      li.classList.add("on");
      if (li.textContent.indexOf("Ticket") !== 0) toast("Pestaña «" + li.firstChild.textContent + "» no incluida en la demo");
    });
    view.querySelectorAll(".answer-box [data-k]").forEach(function (b) {
      b.addEventListener("click", function () {
        var txt = document.getElementById("followText").value.trim();
        if (!txt) { toast("Escriba un texto primero"); return; }
        t.seguimiento.push({ autor: D.usuarioActual.nombre, fecha: now(), texto: txt, tipo: b.dataset.k });
        if (b.dataset.k === "solucion") t.estado = 5;
        t.actualizacion = now();
        pageTicket(id); toast("Elemento añadido al ticket");
      });
    });
    document.getElementById("saveTicket").addEventListener("click", function () {
      t.estado = +document.getElementById("stSel").value; t.actualizacion = now();
      toast("Ticket #" + t.id + " actualizado");
      pageTicket(id);
    });
  }
  function prop(k, v) { return '<div class="prop"><span>' + esc(k) + "</span><span>" + v + "</span></div>"; }

  function pageNewTicket() {
    crumbs([["Asistencia"], ["Tickets", "#/tickets"], ["Crear ticket"]]);
    var opts = function (arr) { return arr.map(function (x) { return '<option value="' + esc(x[0]) + '">' + esc(x[1]) + "</option>"; }).join(""); };
    var users = D.usuarios.filter(function (u) { return u.activo; }).map(function (u) { return [fullName(u), fullName(u)]; });
    var techs = D.usuarios.filter(function (u) { return u.tecnico; }).map(function (u) { return [fullName(u), fullName(u)]; });
    var cats = D.categorias.map(function (c) { return [c.id, catPath(c.id)]; }).sort(function (a, b) { return a[1].localeCompare(b[1], "es"); });
    var lvl = Object.keys(D.prioridades).filter(function (k) { return k < 6; }).map(function (k) { return [k, D.prioridades[k].nombre]; });
    view.innerHTML =
      '<div class="page-head"><h1>' + icon("ticket") + 'Nuevo ticket</h1></div>' +
      '<form class="card" id="newForm" autocomplete="off"><div class="form">' +
      '<div class="field"><label>Tipo</label><select name="tipo">' + opts([["Incidencia", "Incidencia"], ["Solicitud", "Solicitud"]]) + "</select></div>" +
      '<div class="field"><label>Categoría</label><select name="categoria">' + opts(cats) + "</select></div>" +
      '<div class="field full"><label>Título <span class="req">*</span></label><input name="titulo" required maxlength="140" placeholder="Resumen breve del problema o solicitud"></div>' +
      '<div class="field full"><label>Descripción <span class="req">*</span></label><textarea name="descripcion" required placeholder="Describa el problema con el mayor detalle posible"></textarea></div>' +
      '<div class="field"><label>Urgencia</label><select name="urgencia">' + opts(lvl) + "</select></div>" +
      '<div class="field"><label>Impacto</label><select name="impacto">' + opts(lvl) + "</select></div>" +
      '<div class="field"><label>Solicitante</label><select name="solicitante">' + opts(users) + "</select></div>" +
      '<div class="field"><label>Asignado a</label><select name="asignado"><option value="">— Sin asignar —</option>' + opts(techs) + "</select></div>" +
      '<div class="field"><label>Ubicación</label><select name="ubicacion">' + opts([["Oficina Central > Planta 1", "Oficina Central > Planta 1"], ["Oficina Central > Planta 2", "Oficina Central > Planta 2"], ["Delegación Norte", "Delegación Norte"], ["Almacén", "Almacén"], ["Teletrabajo", "Teletrabajo"]]) + "</select></div>" +
      '<div class="field"><label>Prioridad (calculada)</label><input name="prioridad" readonly></div>' +
      '</div><div class="form-foot"><a class="btn" href="#/tickets">Cancelar</a><button class="btn btn-accent" type="submit">+ Añadir</button></div></form>';
    var f = document.getElementById("newForm");
    f.urgencia.value = "3"; f.impacto.value = "3";
    function calc() { var p = Math.round((+f.urgencia.value + +f.impacto.value) / 2); f.prioridad.value = D.prioridades[p].nombre; return p; }
    f.urgencia.addEventListener("change", calc); f.impacto.addEventListener("change", calc); calc();
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!f.titulo.value.trim() || !f.descripcion.value.trim()) { toast("Complete los campos obligatorios"); return; }
      var c = cat(+f.categoria.value);
      var id = Math.max.apply(null, D.tickets.map(function (x) { return x.id; })) + 1;
      var t = {
        id: id, titulo: f.titulo.value.trim(), tipo: f.tipo.value, estado: f.asignado.value ? 2 : 1, prioridad: calc(),
        urgencia: +f.urgencia.value, impacto: +f.impacto.value, categoria: c.id, solicitante: f.solicitante.value,
        asignado: f.asignado.value, grupo: c.grupo, apertura: now(), actualizacion: now(), vencimiento: "—",
        ubicacion: f.ubicacion.value, descripcion: f.descripcion.value.trim(), seguimiento: []
      };
      D.tickets.unshift(t); persistNew(t);
      toast("Ticket #" + id + " creado correctamente");
      location.hash = "#/tickets/" + id;
    });
  }

  function pageCategorias(selId) {
    crumbs([["Configuración"], ["Desplegables"], ["Categorías ITIL"]]);
    var sel = cat(selId) || D.categorias[0];
    function count(id) { return D.tickets.filter(function (t) { return t.categoria === id; }).length; }
    function branch(parent) {
      var kids = D.categorias.filter(function (c) { return c.padre === parent; });
      if (!kids.length) return "";
      return (parent === null ? '<ul class="tree" id="tree">' : "<ul>") + kids.map(function (c) {
        var hasKids = D.categorias.some(function (x) { return x.padre === c.id; });
        return '<li data-id="' + c.id + '"><div class="node' + (c.id === sel.id ? " sel" : "") + '"><span class="tw">' + (hasKids ? "▼" : "") + "</span>" + icon("folder") + esc(c.nombre) + '<span class="cnt">' + count(c.id) + "</span></div>" + branch(c.id) + "</li>";
      }).join("") + "</ul>";
    }
    var hijos = D.categorias.filter(function (c) { return c.padre === sel.id; });
    var tks = D.tickets.filter(function (t) { return t.categoria === sel.id; });
    view.innerHTML =
      '<div class="page-head"><h1>' + icon("folder") + 'Categorías ITIL</h1><div class="actions"><button class="btn" type="button" id="expAll">Expandir todo</button><button class="btn" type="button" id="colAll">Contraer todo</button><button class="btn btn-accent" type="button" id="addCat">+ Añadir</button></div></div>' +
      '<div class="grid grid-3-1" style="grid-template-columns:minmax(0,1fr) minmax(0,1.6fr)">' +
      '<div class="card"><div class="card-head">Árbol de categorías<small>' + D.categorias.length + " elementos</small></div>" + branch(null) + "</div>" +
      '<div class="card"><div class="card-head">' + icon("folder") + esc(sel.nombre) + "</div><div class=\"card-body\"><dl class=\"kv\">" +
      "<dt>Nombre completo</dt><dd>" + esc(catPath(sel.id)) + "</dd>" +
      "<dt>Como hijo de</dt><dd>" + (sel.padre ? '<a href="#/categorias/' + sel.padre + '">' + esc(cat(sel.padre).nombre) + "</a>" : "—") + "</dd>" +
      "<dt>Comentarios</dt><dd>" + esc(sel.descripcion) + "</dd>" +
      "<dt>Técnico responsable</dt><dd>" + actor(sel.tecnico) + "</dd>" +
      "<dt>Grupo responsable</dt><dd>" + esc(sel.grupo) + "</dd>" +
      "<dt>Visible en incidencias</dt><dd>" + (sel.incidencias ? '<span class="tag ok">Sí</span>' : '<span class="tag">No</span>') + "</dd>" +
      "<dt>Visible en solicitudes</dt><dd>" + (sel.solicitudes ? '<span class="tag ok">Sí</span>' : '<span class="tag">No</span>') + "</dd>" +
      "<dt>Visible en interfaz simplificada</dt><dd><span class=\"tag ok\">Sí</span></dd>" +
      "<dt>Subcategorías</dt><dd>" + (hijos.length ? hijos.map(function (h) { return '<a href="#/categorias/' + h.id + '">' + esc(h.nombre) + "</a>"; }).join(", ") : "Ninguna") + "</dd>" +
      "</dl></div>" +
      '<div class="card-head" style="border-top:1px solid var(--border)">Tickets en esta categoría<small>' + tks.length + "</small></div>" +
      (tks.length ? '<table class="list"><tbody>' + tks.map(function (t) { return '<tr data-href="#/tickets/' + t.id + '"><td class="num">' + t.id + '</td><td><a href="#/tickets/' + t.id + '">' + esc(t.titulo) + "</a></td><td>" + status(t.estado) + "</td></tr>"; }).join("") + "</tbody></table>" : '<div class="empty">Sin tickets</div>') +
      "</div></div>";

    var tree = document.getElementById("tree");
    tree.addEventListener("click", function (e) {
      var node = e.target.closest(".node"); if (!node) return;
      var li = node.parentElement;
      if (e.target.closest(".tw") && li.querySelector("ul")) {
        li.classList.toggle("collapsed");
        node.querySelector(".tw").textContent = li.classList.contains("collapsed") ? "▶" : "▼";
        return;
      }
      location.hash = "#/categorias/" + li.dataset.id;
    });
    document.getElementById("expAll").addEventListener("click", function () { tree.querySelectorAll("li").forEach(function (li) { if (li.querySelector("ul")) { li.classList.remove("collapsed"); li.querySelector(".tw").textContent = "▼"; } }); });
    document.getElementById("colAll").addEventListener("click", function () { tree.querySelectorAll("li").forEach(function (li) { if (li.querySelector("ul")) { li.classList.add("collapsed"); li.querySelector(".tw").textContent = "▶"; } }); });
    document.getElementById("addCat").addEventListener("click", function () { toast("Alta de categorías no incluida en la demo visual"); });
    view.querySelectorAll("tr[data-href]").forEach(function (tr) { tr.addEventListener("click", function () { location.hash = tr.dataset.href; }); });
  }

  function pageUsuarios(tecnicos) {
    crumbs([["Administración"], [tecnicos ? "Técnicos" : "Usuarios"]]);
    var perfiles = ["Super-Admin", "Supervisor", "Técnico", "Self-Service", "Observer"];
    listPage({
      title: tecnicos ? "Técnicos" : "Usuarios", icon: "admin", newHref: tecnicos ? null : "#/usuarios",
      rows: D.usuarios.filter(function (u) { return !tecnicos || u.tecnico; }),
      rowHref: function (r) { return "#/usuarios/" + r.id; },
      columns: [
        { label: "Usuario", render: function (r) { return '<a href="#/usuarios/' + r.id + '">' + esc(r.login) + "</a>"; }, text: function (r) { return r.login; } },
        { label: "Apellidos", render: function (r) { return esc(r.apellido); }, text: function (r) { return r.apellido; } },
        { label: "Nombre", render: function (r) { return esc(r.nombre); }, text: function (r) { return r.nombre; } },
        { label: "Correo electrónico", render: function (r) { return esc(r.email); }, text: function (r) { return r.email; } },
        { label: "Teléfono", render: function (r) { return esc(r.telefono); }, text: function (r) { return r.telefono; } },
        { label: "Perfil", render: function (r) { return esc(r.perfil); }, text: function (r) { return r.perfil; } },
        { label: "Grupo", render: function (r) { return esc(r.grupo); }, text: function (r) { return r.grupo; } },
        { label: tecnicos ? "Tickets asignados" : "Activo", render: function (r) {
            if (tecnicos) return String(D.tickets.filter(function (t) { return t.asignado === fullName(r) && t.estado < 5; }).length);
            return r.activo ? '<span class="tag ok">Sí</span>' : '<span class="tag">No</span>'; }, text: function () { return ""; } },
        { label: "Última conexión", render: function (r) { return esc(r.ultimoAcceso); }, text: function (r) { return r.ultimoAcceso; } }
      ],
      filters: [
        { label: "Perfil", values: perfiles.map(function (p) { return [p, p]; }), get: function (r) { return r.perfil; } },
        { label: "Grupo", values: D.grupos.map(function (g) { return [g.nombre, g.nombre]; }), get: function (r) { return r.grupo; } }
      ]
    });
  }

  function pageUsuario(id) {
    var u = D.usuarios.find(function (x) { return x.id === id; });
    if (!u) return notFound();
    crumbs([["Administración"], ["Usuarios", "#/usuarios"], [u.login]]);
    var asignados = D.tickets.filter(function (t) { return t.asignado === fullName(u); });
    var solicitados = D.tickets.filter(function (t) { return t.solicitante === fullName(u); });
    var tabs = ["Usuario", "Perfiles", "Grupos", "Preferencias", "Elementos usados", "Tickets", "Historial"];
    function tkRows(arr) { return arr.length ? '<table class="list"><tbody>' + arr.map(function (t) { return '<tr data-href="#/tickets/' + t.id + '"><td class="num">' + t.id + '</td><td><a href="#/tickets/' + t.id + '">' + esc(t.titulo) + "</a></td><td>" + status(t.estado) + "</td><td>" + prio(t.prioridad) + "</td></tr>"; }).join("") + "</tbody></table>" : '<div class="empty">Ninguno</div>'; }
    view.innerHTML =
      '<div class="page-head"><h1><span class="avatar">' + initials(fullName(u)) + "</span>" + esc(fullName(u)) + ' <span style="color:var(--ink-3);font-weight:400">(' + esc(u.login) + ')</span></h1><div class="actions"><a class="btn" href="#/usuarios">← Volver a la lista</a></div></div>' +
      '<div class="item-layout"><div class="card"><ul class="tabs-v">' + tabs.map(function (x, i) { return '<li class="' + (i === 0 ? "on" : "") + '">' + x + "</li>"; }).join("") + "</ul></div>" +
      '<div class="card"><div class="form">' +
      field("Usuario", u.login) + field("Correo electrónico", u.email) + field("Apellidos", u.apellido) + field("Nombre", u.nombre) +
      field("Teléfono", u.telefono) + field("Perfil", u.perfil) + field("Grupo", u.grupo) + field("Última conexión", u.ultimoAcceso) +
      '<div class="field"><label>Activo</label><label class="toggle"><input type="checkbox" ' + (u.activo ? "checked" : "") + "> " + (u.activo ? "Sí" : "No") + "</label></div>" +
      '<div class="field"><label>Autenticación</label><input value="Base de datos interna (demo)" readonly></div>' +
      '</div><div class="card-head" style="border-top:1px solid var(--border)">Tickets asignados<small>' + asignados.length + "</small></div>" + tkRows(asignados) +
      '<div class="card-head" style="border-top:1px solid var(--border)">Tickets solicitados<small>' + solicitados.length + "</small></div>" + tkRows(solicitados) +
      '<div class="form-foot"><button class="btn btn-primary" type="button" id="saveU">Guardar</button></div></div></div>';
    bindDetailCommon();
    document.getElementById("saveU").addEventListener("click", function () { toast("Cambios guardados (solo en la demo)"); });
  }
  function field(label, value) { return '<div class="field"><label>' + esc(label) + '</label><input value="' + esc(value) + '"></div>'; }
  function bindDetailCommon() {
    view.querySelectorAll(".tabs-v").forEach(function (ul) {
      ul.addEventListener("click", function (e) {
        var li = e.target.closest("li"); if (!li) return;
        ul.querySelectorAll("li").forEach(function (x) { x.classList.remove("on"); }); li.classList.add("on");
        if (li !== ul.firstElementChild) toast("Pestaña «" + li.textContent + "» no incluida en la demo");
      });
    });
    view.querySelectorAll("tr[data-href]").forEach(function (tr) { tr.addEventListener("click", function () { location.hash = tr.dataset.href; }); });
  }

  function pageGrupos() {
    crumbs([["Administración"], ["Grupos"]]);
    listPage({
      title: "Grupos", icon: "admin", newHref: "#/grupos",
      rows: D.grupos,
      rowHref: function (r) { return "#/grupos/" + r.id; },
      columns: [
        { label: "Nombre", render: function (r) { return '<a href="#/grupos/' + r.id + '">' + esc(r.nombre) + "</a>"; }, text: function (r) { return r.nombre; } },
        { label: "Comentarios", render: function (r) { return esc(r.descripcion); }, text: function (r) { return r.descripcion; } },
        { label: "Miembros", num: true, render: function (r) { return r.miembros; }, text: function (r) { return r.miembros; } },
        { label: "Puede ser asignado", render: function (r) { return r.tecnico ? '<span class="tag ok">Sí</span>' : '<span class="tag">No</span>'; }, text: function () { return ""; } },
        { label: "Puede ser solicitante", render: function () { return '<span class="tag ok">Sí</span>'; }, text: function () { return ""; } }
      ],
      filters: [{ label: "Asignable", values: [["true", "Sí"], ["false", "No"]], get: function (r) { return r.tecnico; } }]
    });
  }
  function pageGrupo(id) {
    var g = D.grupos.find(function (x) { return x.id === id; });
    if (!g) return notFound();
    crumbs([["Administración"], ["Grupos", "#/grupos"], [g.nombre]]);
    var miembros = D.usuarios.filter(function (u) { return u.grupo === g.nombre; });
    var tks = D.tickets.filter(function (t) { return t.grupo === g.nombre; });
    view.innerHTML =
      '<div class="page-head"><h1>' + icon("admin") + esc(g.nombre) + '</h1><div class="actions"><a class="btn" href="#/grupos">← Volver a la lista</a></div></div>' +
      '<div class="item-layout"><div class="card"><ul class="tabs-v">' + ["Grupo", "Usuarios", "Tickets", "Notificaciones", "Historial"].map(function (x, i) { return '<li class="' + (i === 0 ? "on" : "") + '">' + x + "</li>"; }).join("") + "</ul></div>" +
      '<div class="card"><div class="form">' + field("Nombre", g.nombre) + field("Comentarios", g.descripcion) +
      '<div class="field"><label>Puede ser asignado a un ticket</label><label class="toggle"><input type="checkbox" ' + (g.tecnico ? "checked" : "") + "> " + (g.tecnico ? "Sí" : "No") + "</label></div>" +
      '<div class="field"><label>Puede ser solicitante</label><label class="toggle"><input type="checkbox" checked> Sí</label></div></div>' +
      '<div class="card-head" style="border-top:1px solid var(--border)">Miembros<small>' + miembros.length + "</small></div>" +
      (miembros.length ? '<table class="list"><tbody>' + miembros.map(function (u) { return '<tr data-href="#/usuarios/' + u.id + '"><td>' + actor(fullName(u)) + "</td><td>" + esc(u.perfil) + "</td><td>" + esc(u.email) + "</td></tr>"; }).join("") + "</tbody></table>" : '<div class="empty">Sin miembros en los datos de ejemplo</div>') +
      '<div class="card-head" style="border-top:1px solid var(--border)">Tickets del grupo<small>' + tks.length + "</small></div>" +
      (tks.length ? '<table class="list"><tbody>' + tks.map(function (t) { return '<tr data-href="#/tickets/' + t.id + '"><td class="num">' + t.id + '</td><td><a href="#/tickets/' + t.id + '">' + esc(t.titulo) + "</a></td><td>" + status(t.estado) + "</td></tr>"; }).join("") + "</tbody></table>" : '<div class="empty">Ninguno</div>') +
      "</div></div>";
    bindDetailCommon();
  }

  var ASSET_DEF = {
    ordenadores: { titulo: "Ordenadores", cols: [["Nombre", "nombre"], ["Tipo", "tipo"], ["Fabricante", "fabricante"], ["Modelo", "modelo"], ["Número de serie", "serie"], ["Usuario", "usuario"], ["Ubicación", "ubicacion"], ["Estado", "estado"], ["Sistema operativo", "so"]],
      filtros: [["Estado", "estado"], ["Tipo", "tipo"], ["Fabricante", "fabricante"]],
      campos: [["Nombre", "nombre"], ["Tipo", "tipo"], ["Fabricante", "fabricante"], ["Modelo", "modelo"], ["Número de serie", "serie"], ["Usuario", "usuario"], ["Ubicación", "ubicacion"], ["Estado", "estado"], ["Sistema operativo", "so"], ["Memoria", "ram"], ["Procesador", "cpu"], ["Última actualización de inventario", "actualizacion"]],
      tabs: ["Ordenador", "Análisis de impacto", "Sistemas operativos", "Componentes", "Volúmenes", "Software", "Conexiones", "Puertos de red", "Gestión", "Contratos", "Tickets", "Historial"] },
    monitores: { titulo: "Monitores", cols: [["Nombre", "nombre"], ["Fabricante", "fabricante"], ["Modelo", "modelo"], ["Número de serie", "serie"], ["Tamaño", "tamano"], ["Usuario", "usuario"], ["Ubicación", "ubicacion"], ["Estado", "estado"]],
      filtros: [["Estado", "estado"], ["Fabricante", "fabricante"]],
      campos: [["Nombre", "nombre"], ["Fabricante", "fabricante"], ["Modelo", "modelo"], ["Número de serie", "serie"], ["Tamaño", "tamano"], ["Usuario", "usuario"], ["Ubicación", "ubicacion"], ["Estado", "estado"], ["Conectado a", "conectadoA"]],
      tabs: ["Monitor", "Conexiones", "Gestión", "Contratos", "Tickets", "Historial"] },
    impresoras: { titulo: "Impresoras", cols: [["Nombre", "nombre"], ["Fabricante", "fabricante"], ["Modelo", "modelo"], ["Tipo", "tipo"], ["Dirección IP", "ip"], ["Ubicación", "ubicacion"], ["Estado", "estado"]],
      filtros: [["Estado", "estado"], ["Fabricante", "fabricante"], ["Ubicación", "ubicacion"]],
      campos: [["Nombre", "nombre"], ["Fabricante", "fabricante"], ["Modelo", "modelo"], ["Número de serie", "serie"], ["Tipo", "tipo"], ["Dirección IP", "ip"], ["Ubicación", "ubicacion"], ["Estado", "estado"], ["Contador de páginas", "contador"]],
      tabs: ["Impresora", "Cartuchos", "Puertos de red", "Gestión", "Contratos", "Tickets", "Historial"] }
  };
  function uniq(arr) { return arr.filter(function (v, i) { return v && arr.indexOf(v) === i; }).sort(); }

  function pageActivos(tipo) {
    var def = ASSET_DEF[tipo]; if (!def) return notFound();
    crumbs([["Activos"], [def.titulo]]);
    var rows = D.activos[tipo];
    listPage({
      title: def.titulo, icon: "assets", newHref: "#/activos/" + tipo,
      rows: rows,
      rowHref: function (r) { return "#/activos/" + tipo + "/" + r.id; },
      columns: def.cols.map(function (c, i) {
        return { label: c[0], text: function (r) { return r[c[1]]; }, render: function (r) {
          if (i === 0) return '<a href="#/activos/' + tipo + "/" + r.id + '">' + esc(r[c[1]]) + "</a>";
          if (c[1] === "estado") return stateTag(r.estado);
          return esc(r[c[1]] || "—"); } };
      }),
      filters: def.filtros.map(function (f) {
        return { label: f[0], values: uniq(rows.map(function (r) { return r[f[1]]; })).map(function (v) { return [v, v]; }), get: function (r) { return r[f[1]]; } };
      })
    });
  }
  function pageActivo(tipo, id) {
    var def = ASSET_DEF[tipo]; if (!def) return notFound();
    var a = D.activos[tipo].find(function (x) { return x.id === id; });
    if (!a) return notFound();
    crumbs([["Activos"], [def.titulo, "#/activos/" + tipo], [a.nombre]]);
    var tks = D.tickets.filter(function (t) { return a.usuario && t.solicitante === a.usuario; }).slice(0, 4);
    view.innerHTML =
      '<div class="page-head"><h1>' + icon("assets") + esc(a.nombre) + " " + stateTag(a.estado) + '</h1><div class="actions"><a class="btn" href="#/activos/' + tipo + '">← Volver a la lista</a></div></div>' +
      '<div class="item-layout"><div class="card"><ul class="tabs-v">' + def.tabs.map(function (x, i) { return '<li class="' + (i === 0 ? "on" : "") + '">' + x + "</li>"; }).join("") + "</ul></div>" +
      '<div class="card"><div class="form">' + def.campos.map(function (c) { return field(c[0], a[c[1]] || "—"); }).join("") +
      '<div class="field full"><label>Comentarios</label><textarea>Activo de ejemplo para la demostración.</textarea></div></div>' +
      '<div class="card-head" style="border-top:1px solid var(--border)">Tickets relacionados (por usuario)<small>' + tks.length + "</small></div>" +
      (tks.length ? '<table class="list"><tbody>' + tks.map(function (t) { return '<tr data-href="#/tickets/' + t.id + '"><td class="num">' + t.id + '</td><td><a href="#/tickets/' + t.id + '">' + esc(t.titulo) + "</a></td><td>" + status(t.estado) + "</td></tr>"; }).join("") + "</tbody></table>" : '<div class="empty">Ninguno</div>') +
      '<div class="form-foot"><button class="btn btn-primary" type="button" id="saveA">Guardar</button></div></div></div>';
    bindDetailCommon();
    document.getElementById("saveA").addEventListener("click", function () { toast("Cambios guardados (solo en la demo)"); });
  }

  function pageConfig() {
    crumbs([["Configuración"], ["General"]]);
    var tabs = ["Configuración general", "Valores por defecto", "Activos", "Asistencia", "Sistema", "Seguridad", "Rendimiento", "API", "Historial"];
    view.innerHTML =
      '<div class="page-head"><h1>' + icon("config") + 'Configuración general</h1></div>' +
      '<div class="item-layout"><div class="card"><ul class="tabs-v">' + tabs.map(function (x, i) { return '<li class="' + (i === 0 ? "on" : "") + '">' + x + "</li>"; }).join("") + "</ul></div>" +
      '<div class="card"><div class="card-head">Parámetros generales</div><div class="form">' +
      field("URL de la aplicación", "http://localhost:8090") +
      '<div class="field"><label>Idioma por defecto</label><select><option selected>Español (España)</option><option>English (GB)</option><option>Français</option><option>Português (Brasil)</option></select></div>' +
      '<div class="field"><label>Zona horaria</label><select><option selected>Europe/Madrid</option><option>America/Mexico_City</option><option>America/Bogota</option></select></div>' +
      '<div class="field"><label>Formato de fecha</label><select><option selected>DD-MM-AAAA</option><option>AAAA-MM-DD</option><option>MM-DD-AAAA</option></select></div>' +
      field("Texto en la página de inicio de sesión", "Bienvenido a la Mesa de Servicio (demo)") +
      '<div class="field"><label>Elementos por página</label><select><option>15</option><option selected>20</option><option>50</option></select></div>' +
      '<div class="field"><label>Notificaciones por correo</label><label class="toggle"><input type="checkbox" checked> Activadas</label></div>' +
      '<div class="field"><label>Inventario nativo</label><label class="toggle"><input type="checkbox" checked> Activado</label></div>' +
      '</div><div class="card-head" style="border-top:1px solid var(--border)">Asistencia</div><div class="form">' +
      '<div class="field"><label>Prioridad por defecto</label><select><option>Baja</option><option selected>Media</option><option>Alta</option></select></div>' +
      '<div class="field"><label>Matriz urgencia / impacto</label><input value="5 × 5 (por defecto)" readonly></div>' +
      '<div class="field"><label>Permitir tickets anónimos</label><label class="toggle"><input type="checkbox"> No</label></div>' +
      '<div class="field"><label>Cierre automático de tickets resueltos</label><select><option>Inmediatamente</option><option selected>Tras 7 días</option><option>Nunca</option></select></div>' +
      '</div><div class="form-foot"><button class="btn btn-primary" type="button" id="saveC">Guardar</button></div></div></div>';
    bindDetailCommon();
    document.getElementById("saveC").addEventListener("click", function () { toast("Configuración guardada (solo en la demo)"); });
  }

  function pagePrefs() {
    crumbs([["Mis preferencias"]]);
    var u = D.usuarioActual;
    view.innerHTML = '<div class="page-head"><h1><span class="avatar">' + initials(u.nombre) + "</span>Mis preferencias</h1></div>" +
      '<div class="card"><div class="form">' + field("Usuario", u.login) + field("Nombre", u.nombre) + field("Perfil por defecto", u.perfil) +
      '<div class="field"><label>Idioma</label><select><option selected>Español (España)</option><option>English (GB)</option></select></div>' +
      '<div class="field"><label>Paleta de colores</label><select><option selected>Por defecto</option><option>Oscura</option></select></div>' +
      '</div><div class="form-foot"><button class="btn btn-primary" type="button" onclick="return false">Guardar</button></div></div>';
  }

  function notFound() {
    crumbs([["Página no encontrada"]]);
    view.innerHTML = '<div class="card"><div class="empty">El elemento solicitado no existe en los datos de ejemplo. <a href="#/">Volver al inicio</a></div></div>';
  }

  /* ---------- Router ---------- */
  function route() {
    var hash = location.hash || "#/";
    var parts = hash.split("?"), path = parts[0], params = {};
    (parts[1] || "").split("&").forEach(function (kv) { if (kv) { var p = kv.split("="); params[p[0]] = decodeURIComponent(p[1] || ""); } });
    var seg = path.replace(/^#\/?/, "").split("/").filter(Boolean);
    var key = "inicio";
    if (!seg.length) pageDashboard();
    else if (seg[0] === "tickets") {
      key = "asistencia";
      if (seg[1] === "nuevo") pageNewTicket();
      else if (seg[1]) pageTicket(+seg[1]);
      else pageTickets(params);
    }
    else if (seg[0] === "categorias") { key = "asistencia"; pageCategorias(+seg[1]); }
    else if (seg[0] === "usuarios") { key = "administracion"; seg[1] ? pageUsuario(+seg[1]) : pageUsuarios(false); }
    else if (seg[0] === "tecnicos") { key = "administracion"; pageUsuarios(true); }
    else if (seg[0] === "grupos") { key = "administracion"; seg[1] ? pageGrupo(+seg[1]) : pageGrupos(); }
    else if (seg[0] === "activos") { key = "activos"; seg[2] ? pageActivo(seg[1], +seg[2]) : pageActivos(seg[1]); }
    else if (seg[0] === "configuracion") { key = "configuracion"; pageConfig(); }
    else if (seg[0] === "preferencias") { pagePrefs(); }
    else notFound();
    renderNav(key, path);
    document.getElementById("sidebar").classList.remove("open");
    window.scrollTo(0, 0);
  }

  /* ---------- Cabecera ---------- */
  document.getElementById("entity").textContent = D.entidad;
  document.getElementById("avatar").textContent = initials(D.usuarioActual.nombre);
  document.getElementById("userName").textContent = D.usuarioActual.nombre;
  document.getElementById("userProfile").textContent = D.usuarioActual.perfil;
  document.getElementById("globalSearch").addEventListener("keydown", function (e) {
    if (e.key !== "Enter") return;
    var v = this.value.trim();
    location.hash = "#/tickets";
    setTimeout(function () { var q = document.getElementById("q"); if (q) { q.value = v; q.dispatchEvent(new Event("input")); } }, 0);
  });

  window.addEventListener("hashchange", route);
  route();
})();

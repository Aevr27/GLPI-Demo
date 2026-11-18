/* Datos ficticios para la demostración visual. Ningún dato real. */
window.DEMO_DATA = {
  entidad: "Entidad raíz > Demo Corp",
  usuarioActual: { nombre: "Laura Méndez", login: "lmendez", perfil: "Super-Admin" },

  estados: {
    1: { nombre: "Nuevo", clase: "st-new" },
    2: { nombre: "En curso (asignado)", clase: "st-assigned" },
    3: { nombre: "En curso (planificado)", clase: "st-planned" },
    4: { nombre: "En espera", clase: "st-waiting" },
    5: { nombre: "Resuelto", clase: "st-solved" },
    6: { nombre: "Cerrado", clase: "st-closed" }
  },
  prioridades: {
    1: { nombre: "Muy baja", clase: "pr-1" },
    2: { nombre: "Baja", clase: "pr-2" },
    3: { nombre: "Media", clase: "pr-3" },
    4: { nombre: "Alta", clase: "pr-4" },
    5: { nombre: "Muy alta", clase: "pr-5" },
    6: { nombre: "Mayor", clase: "pr-6" }
  },

  grupos: [
    { id: 1, nombre: "Soporte N1", descripcion: "Primer nivel de atención", miembros: 4, tecnico: true },
    { id: 2, nombre: "Soporte N2 - Sistemas", descripcion: "Servidores, red y almacenamiento", miembros: 3, tecnico: true },
    { id: 3, nombre: "Aplicaciones", descripcion: "ERP, CRM y aplicaciones internas", miembros: 2, tecnico: true },
    { id: 4, nombre: "Administración", descripcion: "Departamento administrativo", miembros: 6, tecnico: false },
    { id: 5, nombre: "Ventas", descripcion: "Equipo comercial", miembros: 8, tecnico: false }
  ],

  usuarios: [
    { id: 1, login: "lmendez", nombre: "Laura", apellido: "Méndez", email: "lmendez@demo.local", telefono: "100", perfil: "Super-Admin", grupo: "Soporte N2 - Sistemas", activo: true, tecnico: true, ultimoAcceso: "2026-11-18 08:42" },
    { id: 2, login: "jortega", nombre: "Javier", apellido: "Ortega", email: "jortega@demo.local", telefono: "101", perfil: "Técnico", grupo: "Soporte N1", activo: true, tecnico: true, ultimoAcceso: "2026-11-18 08:15" },
    { id: 3, login: "pnavarro", nombre: "Paula", apellido: "Navarro", email: "pnavarro@demo.local", telefono: "102", perfil: "Técnico", grupo: "Soporte N1", activo: true, tecnico: true, ultimoAcceso: "2026-11-18 07:58" },
    { id: 4, login: "drivas", nombre: "Diego", apellido: "Rivas", email: "drivas@demo.local", telefono: "103", perfil: "Técnico", grupo: "Soporte N2 - Sistemas", activo: true, tecnico: true, ultimoAcceso: "2026-11-17 18:20" },
    { id: 5, login: "cflores", nombre: "Carmen", apellido: "Flores", email: "cflores@demo.local", telefono: "104", perfil: "Supervisor", grupo: "Aplicaciones", activo: true, tecnico: true, ultimoAcceso: "2026-11-18 09:01" },
    { id: 6, login: "mserrano", nombre: "Marcos", apellido: "Serrano", email: "mserrano@demo.local", telefono: "205", perfil: "Self-Service", grupo: "Administración", activo: true, tecnico: false, ultimoAcceso: "2026-11-18 08:30" },
    { id: 7, login: "aruiz", nombre: "Ana", apellido: "Ruiz", email: "aruiz@demo.local", telefono: "206", perfil: "Self-Service", grupo: "Ventas", activo: true, tecnico: false, ultimoAcceso: "2026-11-17 16:44" },
    { id: 8, login: "tgil", nombre: "Tomás", apellido: "Gil", email: "tgil@demo.local", telefono: "207", perfil: "Self-Service", grupo: "Ventas", activo: true, tecnico: false, ultimoAcceso: "2026-11-16 12:10" },
    { id: 9, login: "evega", nombre: "Elena", apellido: "Vega", email: "evega@demo.local", telefono: "208", perfil: "Observer", grupo: "Administración", activo: true, tecnico: false, ultimoAcceso: "2026-11-15 10:05" },
    { id: 10, login: "rcastro", nombre: "Raúl", apellido: "Castro", email: "rcastro@demo.local", telefono: "209", perfil: "Self-Service", grupo: "Administración", activo: false, tecnico: false, ultimoAcceso: "2026-09-30 17:00" }
  ],

  categorias: [
    { id: 1, padre: null, nombre: "Hardware", descripcion: "Incidencias y solicitudes sobre equipos físicos", grupo: "Soporte N1", tecnico: "Javier Ortega", incidencias: true, solicitudes: true },
    { id: 2, padre: 1, nombre: "Ordenadores", descripcion: "Portátiles y equipos de sobremesa", grupo: "Soporte N1", tecnico: "Javier Ortega", incidencias: true, solicitudes: true },
    { id: 3, padre: 1, nombre: "Impresoras", descripcion: "Impresión, escaneo y consumibles", grupo: "Soporte N1", tecnico: "Paula Navarro", incidencias: true, solicitudes: true },
    { id: 4, padre: 1, nombre: "Periféricos", descripcion: "Monitores, teclados, ratones y docks", grupo: "Soporte N1", tecnico: "Paula Navarro", incidencias: true, solicitudes: true },
    { id: 5, padre: null, nombre: "Software", descripcion: "Aplicaciones de escritorio y corporativas", grupo: "Aplicaciones", tecnico: "Carmen Flores", incidencias: true, solicitudes: true },
    { id: 6, padre: 5, nombre: "Ofimática", descripcion: "Correo, documentos y hojas de cálculo", grupo: "Soporte N1", tecnico: "Javier Ortega", incidencias: true, solicitudes: true },
    { id: 7, padre: 5, nombre: "ERP", descripcion: "Sistema de gestión empresarial", grupo: "Aplicaciones", tecnico: "Carmen Flores", incidencias: true, solicitudes: false },
    { id: 8, padre: 7, nombre: "Facturación", descripcion: "Módulo de facturación del ERP", grupo: "Aplicaciones", tecnico: "Carmen Flores", incidencias: true, solicitudes: false },
    { id: 9, padre: 7, nombre: "Inventario", descripcion: "Módulo de almacén del ERP", grupo: "Aplicaciones", tecnico: "Carmen Flores", incidencias: true, solicitudes: false },
    { id: 10, padre: null, nombre: "Red y comunicaciones", descripcion: "Conectividad, Wi-Fi, VPN y telefonía", grupo: "Soporte N2 - Sistemas", tecnico: "Diego Rivas", incidencias: true, solicitudes: true },
    { id: 11, padre: 10, nombre: "VPN", descripcion: "Acceso remoto", grupo: "Soporte N2 - Sistemas", tecnico: "Diego Rivas", incidencias: true, solicitudes: true },
    { id: 12, padre: 10, nombre: "Wi-Fi", descripcion: "Red inalámbrica de oficinas", grupo: "Soporte N2 - Sistemas", tecnico: "Diego Rivas", incidencias: true, solicitudes: false },
    { id: 13, padre: null, nombre: "Cuentas y accesos", descripcion: "Altas, bajas y permisos", grupo: "Soporte N1", tecnico: "Paula Navarro", incidencias: false, solicitudes: true },
    { id: 14, padre: 13, nombre: "Alta de usuario", descripcion: "Nuevas incorporaciones", grupo: "Soporte N1", tecnico: "Paula Navarro", incidencias: false, solicitudes: true },
    { id: 15, padre: 13, nombre: "Restablecer contraseña", descripcion: "Desbloqueo y cambio de contraseña", grupo: "Soporte N1", tecnico: "Javier Ortega", incidencias: true, solicitudes: true }
  ],

  tickets: [
    { id: 1042, titulo: "El portátil no arranca tras actualización", tipo: "Incidencia", estado: 2, prioridad: 4, urgencia: 4, impacto: 3, categoria: 2, solicitante: "Marcos Serrano", asignado: "Javier Ortega", grupo: "Soporte N1", apertura: "2026-11-18 08:05", actualizacion: "2026-11-18 08:40", vencimiento: "2026-11-18 16:00", ubicacion: "Oficina Central > Planta 2", descripcion: "Después de la actualización nocturna, el portátil se queda en la pantalla de reparación automática.",
      seguimiento: [ { autor: "Javier Ortega", fecha: "2026-11-18 08:40", texto: "Reviso el equipo en remoto. Programo visita si no se recupera.", tipo: "seguimiento" } ] },
    { id: 1041, titulo: "Solicitud de alta para nueva incorporación en Ventas", tipo: "Solicitud", estado: 1, prioridad: 3, urgencia: 3, impacto: 3, categoria: 14, solicitante: "Ana Ruiz", asignado: "", grupo: "Soporte N1", apertura: "2026-11-18 07:52", actualizacion: "2026-11-18 07:52", vencimiento: "2026-11-20 18:00", ubicacion: "Oficina Central > Planta 1", descripcion: "Necesitamos cuenta de correo, acceso al CRM y portátil para una persona que se incorpora el lunes.", seguimiento: [] },
    { id: 1040, titulo: "La VPN se desconecta cada 10 minutos", tipo: "Incidencia", estado: 2, prioridad: 5, urgencia: 5, impacto: 4, categoria: 11, solicitante: "Tomás Gil", asignado: "Diego Rivas", grupo: "Soporte N2 - Sistemas", apertura: "2026-11-17 17:30", actualizacion: "2026-11-18 08:10", vencimiento: "2026-11-18 12:00", ubicacion: "Teletrabajo", descripcion: "Al trabajar desde casa la conexión VPN se corta de forma periódica y se pierden las sesiones abiertas.",
      seguimiento: [ { autor: "Diego Rivas", fecha: "2026-11-17 18:02", texto: "Solicito registro del cliente VPN.", tipo: "seguimiento" }, { autor: "Tomás Gil", fecha: "2026-11-18 07:45", texto: "Adjunto el registro solicitado.", tipo: "seguimiento" }, { autor: "Diego Rivas", fecha: "2026-11-18 08:10", texto: "Revisar tiempo de inactividad en el perfil del concentrador.", tipo: "tarea" } ] },
    { id: 1039, titulo: "Error al emitir factura rectificativa", tipo: "Incidencia", estado: 4, prioridad: 4, urgencia: 4, impacto: 4, categoria: 8, solicitante: "Elena Vega", asignado: "Carmen Flores", grupo: "Aplicaciones", apertura: "2026-11-17 11:20", actualizacion: "2026-11-17 15:00", vencimiento: "2026-11-19 11:20", ubicacion: "Oficina Central > Planta 1", descripcion: "El módulo de facturación devuelve un error de validación al generar una rectificativa.",
      seguimiento: [ { autor: "Carmen Flores", fecha: "2026-11-17 15:00", texto: "En espera de respuesta del proveedor del ERP.", tipo: "seguimiento" } ] },
    { id: 1038, titulo: "Impresora de planta 1 imprime con rayas", tipo: "Incidencia", estado: 3, prioridad: 2, urgencia: 2, impacto: 2, categoria: 3, solicitante: "Marcos Serrano", asignado: "Paula Navarro", grupo: "Soporte N1", apertura: "2026-11-17 10:05", actualizacion: "2026-11-17 12:30", vencimiento: "2026-11-21 10:05", ubicacion: "Oficina Central > Planta 1", descripcion: "Las copias salen con rayas verticales grises.",
      seguimiento: [ { autor: "Paula Navarro", fecha: "2026-11-17 12:30", texto: "Visita planificada para mañana a las 10:00 con tóner de repuesto.", tipo: "tarea" } ] },
    { id: 1037, titulo: "Restablecer contraseña de correo", tipo: "Solicitud", estado: 5, prioridad: 3, urgencia: 3, impacto: 2, categoria: 15, solicitante: "Ana Ruiz", asignado: "Javier Ortega", grupo: "Soporte N1", apertura: "2026-11-16 09:12", actualizacion: "2026-11-16 09:30", vencimiento: "2026-11-16 13:12", ubicacion: "Oficina Central > Planta 1", descripcion: "No puedo acceder al correo tras varios intentos fallidos.",
      seguimiento: [ { autor: "Javier Ortega", fecha: "2026-11-16 09:30", texto: "Contraseña restablecida y cuenta desbloqueada.", tipo: "solucion" } ] },
    { id: 1036, titulo: "Wi-Fi lenta en sala de reuniones", tipo: "Incidencia", estado: 2, prioridad: 3, urgencia: 3, impacto: 3, categoria: 12, solicitante: "Elena Vega", asignado: "Diego Rivas", grupo: "Soporte N2 - Sistemas", apertura: "2026-11-15 16:40", actualizacion: "2026-11-17 09:00", vencimiento: "2026-11-19 16:40", ubicacion: "Oficina Central > Sala Atlántico", descripcion: "Durante las videollamadas la conexión inalámbrica es inestable.", seguimiento: [] },
    { id: 1035, titulo: "Instalar complemento de firma en Ofimática", tipo: "Solicitud", estado: 6, prioridad: 2, urgencia: 2, impacto: 1, categoria: 6, solicitante: "Raúl Castro", asignado: "Javier Ortega", grupo: "Soporte N1", apertura: "2026-11-12 12:00", actualizacion: "2026-11-13 10:15", vencimiento: "2026-11-15 12:00", ubicacion: "Oficina Central > Planta 2", descripcion: "Necesito el complemento de firma digital en el procesador de textos.",
      seguimiento: [ { autor: "Javier Ortega", fecha: "2026-11-13 10:15", texto: "Complemento instalado y verificado con el usuario.", tipo: "solucion" } ] },
    { id: 1034, titulo: "Monitor parpadea de forma intermitente", tipo: "Incidencia", estado: 5, prioridad: 2, urgencia: 2, impacto: 1, categoria: 4, solicitante: "Tomás Gil", asignado: "Paula Navarro", grupo: "Soporte N1", apertura: "2026-11-11 14:22", actualizacion: "2026-11-12 09:00", vencimiento: "2026-11-14 14:22", ubicacion: "Delegación Norte", descripcion: "El monitor secundario se apaga y enciende cada pocos minutos.",
      seguimiento: [ { autor: "Paula Navarro", fecha: "2026-11-12 09:00", texto: "Sustituido el cable DisplayPort.", tipo: "solucion" } ] },
    { id: 1033, titulo: "Discrepancia de stock en módulo de inventario", tipo: "Incidencia", estado: 2, prioridad: 4, urgencia: 3, impacto: 5, categoria: 9, solicitante: "Elena Vega", asignado: "Carmen Flores", grupo: "Aplicaciones", apertura: "2026-11-10 10:00", actualizacion: "2026-11-17 13:20", vencimiento: "2026-11-18 10:00", ubicacion: "Almacén", descripcion: "El stock mostrado no coincide con el recuento físico de la semana.", seguimiento: [] },
    { id: 1032, titulo: "Solicitud de segundo monitor", tipo: "Solicitud", estado: 4, prioridad: 1, urgencia: 1, impacto: 1, categoria: 4, solicitante: "Marcos Serrano", asignado: "Paula Navarro", grupo: "Soporte N1", apertura: "2026-11-08 09:45", actualizacion: "2026-11-10 11:00", vencimiento: "2026-11-22 09:45", ubicacion: "Oficina Central > Planta 2", descripcion: "Solicito un segundo monitor para el puesto de trabajo.", seguimiento: [] },
    { id: 1031, titulo: "Caída del servidor de archivos", tipo: "Incidencia", estado: 6, prioridad: 6, urgencia: 5, impacto: 5, categoria: 10, solicitante: "Laura Méndez", asignado: "Diego Rivas", grupo: "Soporte N2 - Sistemas", apertura: "2026-11-05 07:30", actualizacion: "2026-11-05 09:10", vencimiento: "2026-11-05 08:30", ubicacion: "CPD", descripcion: "Las unidades de red compartidas no responden.",
      seguimiento: [ { autor: "Diego Rivas", fecha: "2026-11-05 09:10", texto: "Reiniciado el servicio de almacenamiento. Análisis de causa raíz pendiente en problema asociado.", tipo: "solucion" } ] }
  ],

  activos: {
    ordenadores: [
      { id: 1, nombre: "PC-ADM-001", tipo: "Portátil", fabricante: "Lenovo", modelo: "ThinkPad T14", serie: "DEMO-LT-0001", usuario: "Marcos Serrano", ubicacion: "Oficina Central > Planta 2", estado: "En uso", so: "Windows 11 Pro", ram: "16 GB", cpu: "Intel Core i5", actualizacion: "2026-11-18 08:00" },
      { id: 2, nombre: "PC-VEN-004", tipo: "Portátil", fabricante: "Dell", modelo: "Latitude 5440", serie: "DEMO-LT-0004", usuario: "Ana Ruiz", ubicacion: "Oficina Central > Planta 1", estado: "En uso", so: "Windows 11 Pro", ram: "16 GB", cpu: "Intel Core i7", actualizacion: "2026-11-17 19:12" },
      { id: 3, nombre: "PC-VEN-007", tipo: "Portátil", fabricante: "HP", modelo: "EliteBook 840", serie: "DEMO-LT-0007", usuario: "Tomás Gil", ubicacion: "Teletrabajo", estado: "En uso", so: "Windows 11 Pro", ram: "32 GB", cpu: "Intel Core i7", actualizacion: "2026-11-17 22:05" },
      { id: 4, nombre: "PC-SOP-002", tipo: "Sobremesa", fabricante: "Lenovo", modelo: "ThinkCentre M70q", serie: "DEMO-DT-0002", usuario: "Javier Ortega", ubicacion: "Oficina Central > Planta 2", estado: "En uso", so: "Windows 11 Pro", ram: "16 GB", cpu: "Intel Core i5", actualizacion: "2026-11-18 07:30" },
      { id: 5, nombre: "SRV-FILE-01", tipo: "Servidor", fabricante: "Dell", modelo: "PowerEdge R650", serie: "DEMO-SV-0001", usuario: "Diego Rivas", ubicacion: "CPD", estado: "En producción", so: "Windows Server 2022", ram: "128 GB", cpu: "Intel Xeon Silver", actualizacion: "2026-11-18 06:00" },
      { id: 6, nombre: "PC-ALM-001", tipo: "Sobremesa", fabricante: "HP", modelo: "ProDesk 400", serie: "DEMO-DT-0011", usuario: "", ubicacion: "Almacén", estado: "En reparación", so: "Windows 10 Pro", ram: "8 GB", cpu: "Intel Core i3", actualizacion: "2026-11-10 12:00" }
    ],
    monitores: [
      { id: 1, nombre: "MON-ADM-001", fabricante: "Dell", modelo: "P2422H", serie: "DEMO-MN-0001", tamano: "24\"", usuario: "Marcos Serrano", ubicacion: "Oficina Central > Planta 2", estado: "En uso", conectadoA: "PC-ADM-001" },
      { id: 2, nombre: "MON-VEN-004", fabricante: "LG", modelo: "27BN65Q", serie: "DEMO-MN-0004", tamano: "27\"", usuario: "Ana Ruiz", ubicacion: "Oficina Central > Planta 1", estado: "En uso", conectadoA: "PC-VEN-004" },
      { id: 3, nombre: "MON-VEN-007", fabricante: "Samsung", modelo: "S24R350", serie: "DEMO-MN-0007", tamano: "24\"", usuario: "Tomás Gil", ubicacion: "Delegación Norte", estado: "En uso", conectadoA: "PC-VEN-007" },
      { id: 4, nombre: "MON-STK-010", fabricante: "Dell", modelo: "P2422H", serie: "DEMO-MN-0010", tamano: "24\"", usuario: "", ubicacion: "Almacén", estado: "En stock", conectadoA: "" }
    ],
    impresoras: [
      { id: 1, nombre: "IMP-P1-01", fabricante: "Brother", modelo: "MFC-L8900", serie: "DEMO-PR-0001", tipo: "Multifunción láser color", ip: "10.0.1.50", ubicacion: "Oficina Central > Planta 1", estado: "Averiada", contador: "48.210 páginas" },
      { id: 2, nombre: "IMP-P2-01", fabricante: "HP", modelo: "LaserJet M428", serie: "DEMO-PR-0002", tipo: "Multifunción láser B/N", ip: "10.0.2.50", ubicacion: "Oficina Central > Planta 2", estado: "En uso", contador: "21.904 páginas" },
      { id: 3, nombre: "IMP-NOR-01", fabricante: "Kyocera", modelo: "ECOSYS M5526", serie: "DEMO-PR-0003", tipo: "Multifunción láser color", ip: "10.1.0.50", ubicacion: "Delegación Norte", estado: "En uso", contador: "9.377 páginas" }
    ]
  },

  ticketsPorMes: [
    { mes: "Jun", total: 38 }, { mes: "Jul", total: 31 }, { mes: "Ago", total: 22 },
    { mes: "Sep", total: 41 }, { mes: "Oct", total: 47 }, { mes: "Nov", total: 29 }
  ]
};

# Guía Completa de la Intranet CAS

> Documento unificado: **funcionamiento general + estructura de carpetas + manual de usuario + manual de programador**.

## 1) Resumen ejecutivo

La intranet CAS es una aplicación web interna construida con **Node.js + Express**, con persistencia híbrida:

- **MongoDB** para módulos dinámicos (Noticias, CITA).
- **HTML como fuente de contenido** para módulos heredados (SGI, RESPEL, RUA, PCB, Boletines, Agenda).
- **Sistema de archivos `/data`** para documentos, imágenes y adjuntos.

El servidor sirve frontend estático, expone APIs REST para administración y publica el contenido para consulta interna.

---

## 2) Arquitectura funcional

### 2.1 Componentes principales

1. **Frontend público**
   - Página principal y secciones de menú (`index.html`, `header_menu/*`, `herramientas/*`).
2. **Panel de administración**
   - UI administrativa (`administracion/index.html`, `administracion/admin-logic.js`).
3. **Backend Express**
   - Servidor principal (`server.js`), rutas (`src/routes`), controladores (`src/controllers`), modelos (`src/models`).
4. **Persistencia de datos**
   - MongoDB: noticias y CITA.
   - HTML + archivos: agenda y módulos documentales.

### 2.2 Flujo general de una solicitud

1. Usuario (o admin) hace una petición desde la interfaz web.
2. Express enruta a `/api/...` según el módulo.
3. El controlador valida y transforma la entrada.
4. Se guarda en MongoDB o se modifica HTML/archivos locales.
5. Se responde JSON para refrescar la vista.

---

## 3) Estructura de carpetas recomendada (real del proyecto)

```text
intranet/
├── documentacion/
│   ├── README.md
│   ├── tecnico.md
│   ├── administracion.md
│   └── GUIA_COMPLETA_INTRANET_CAS.md   <- este documento
└── practicas/
    ├── server.js
    ├── package.json
    ├── index.html
    ├── styles.css
    ├── script.js
    ├── administracion/
    │   ├── index.html
    │   ├── admin-logic.js
    │   └── admin-styles.css
    ├── header_menu/
    │   ├── cas/
    │   ├── sgi/
    │   ├── git/
    │   └── talento-humano/
    ├── herramientas/
    ├── data/
    │   ├── imagenes/
    │   ├── Talento humano/
    │   └── ... (subcarpetas por módulo)
    └── src/
        ├── routes/
        ├── controllers/
        └── models/
```

---

## 4) Configuración e instalación

## 4.1 Requisitos

- Node.js 18+
- MongoDB 7+ (local o remoto)
- NPM

### 4.2 Instalación

```bash
cd practicas
npm install
```

### 4.3 Variables y conexión

El backend usa:

- `MONGO_URI` (opcional)
- Valor por defecto: `mongodb://127.0.0.1:27017/intranet_cas`

### 4.4 Ejecución

```bash
cd practicas
node server.js
```

URLs principales:

- Portal: `http://localhost:3000`
- Administración: `http://localhost:3000/administracion`
- Alias administración: `http://localhost:3000/administrador`

---

## 5) Manual de usuario (usuarios finales)

## 5.1 Ingreso al portal

1. Abrir navegador institucional.
2. Ir a la URL interna del servidor.
3. Navegar por menús superiores (CAS, SGI, GIT, Herramientas).

## 5.2 Consulta de noticias

- Las noticias se muestran en la sección correspondiente del portal.
- Cada noticia puede incluir imagen y descripción.

## 5.3 Consulta de agenda

- La agenda institucional muestra actividades y horarios.
- Las actividades nuevas aparecen automáticamente cuando son creadas por administración.

## 5.4 Descarga de documentos

- En SGI/GIT/Herramientas se visualizan tarjetas o listados.
- Al hacer clic, se abre/descarga el archivo (normalmente PDF).

---

## 6) Manual de administración (operación funcional)

## 6.1 Acceso

- Ruta: `/administracion`
- Desde allí se operan módulos CRUD.

## 6.2 Operaciones típicas

- Crear/editar/eliminar registros.
- Cargar archivos mediante formularios (`multipart/form-data`).
- Publicar noticias, eventos o documentos por sección.

## 6.3 Recomendaciones operativas

- Nombrar archivos sin caracteres extraños.
- Verificar enlaces antes de publicar.
- Mantener consistencia de categorías para SGI/RESPEL/RUA.

---

## 7) Manual de programador (desarrollo y mantenimiento)

## 7.1 Backend (`server.js`)

- Inicializa Express y CORS.
- Conecta a MongoDB con Mongoose.
- Publica estáticos:
  - raíz `./`
  - `/data`
- Registra rutas API:
  - `/api/news`
  - `/api/agenda`
  - `/api/sgi`
  - `/api/respel`
  - `/api/rua`
  - `/api/boletines`
  - `/api/pcb`
  - `/api/manuales-sgi`
  - `/api/cita`
- Incluye logging básico de errores en `error_log.txt`.

## 7.2 Patrón por módulo

Cada módulo sigue este esquema:

- **Route**: declara endpoints y middlewares de carga.
- **Controller**: orquesta la lógica de negocio y respuestas HTTP.
- **Model**: define persistencia (Mongo o manipulación de HTML/FS).

## 7.3 Carga de archivos

Se usa **Multer** en rutas que suben contenido:

- Noticias (`/api/news/upload`, campo `image`).
- CITA (`/api/cita`, campo `file`).
- SGI, RESPEL, RUA, PCB, Boletines, Manuales (`file`).

## 7.4 Persistencia híbrida

### MongoDB

- Colección `News` (modelo `MongoNews.js`).
- CITA con esquema dedicado (`citaModel.js`).

### HTML + File System

- Agenda y módulos documentales insertan/eliminan bloques HTML.
- Los archivos se guardan en rutas de `data/...` definidas por cada módulo.

## 7.5 Endpoints clave (referencia rápida)

- `GET /api/news`
- `POST /api/news`
- `POST /api/news/upload`
- `DELETE /api/news/:id`

- `GET /api/agenda`
- `POST /api/agenda`
- `DELETE /api/agenda/:id`

- `GET /api/sgi/:section`
- `POST /api/sgi/:section`
- `PUT /api/sgi/:section/:id`
- `DELETE /api/sgi/:section/:id`
- `POST /api/sgi/upload`

(El mismo patrón CRUD aplica a `respel`, `rua`, `boletines`, `pcb`, `manuales-sgi`, con variaciones de rutas internas).

## 7.6 Convenciones de mantenimiento

1. Si agregas módulo nuevo:
   - crear `model`, `controller`, `route`.
   - registrar `app.use('/api/nuevo', nuevoRoute)` en `server.js`.
2. Si el módulo usa archivos:
   - definir carpeta en `data/`.
   - validar creación de directorios con `fs.mkdirSync(..., { recursive: true })`.
3. Documentar cada cambio en `documentacion/`.

## 7.7 Backups y recuperación

- Base de datos: `mongodump` periódico.
- Archivos: respaldo completo de `practicas/data/`.
- Recomendado: snapshots diarios + retención semanal/mensual.

---

## 8) Troubleshooting rápido

### Error de conexión MongoDB

- Verificar servicio MongoDB activo.
- Validar `MONGO_URI`.

### Archivos no suben

- Revisar permisos de escritura en `data/`.
- Confirmar nombre del campo multipart (`file` o `image`).

### No aparecen documentos en pantalla

- Validar que el HTML base contiene marcadores esperados para inserción.
- Revisar rutas relativas de `href` generadas por el modelo.

---

## 9) Plan de evolución sugerido

1. Unificar todos los módulos en MongoDB (evitar parsing HTML).
2. Agregar autenticación/roles al panel.
3. Incorporar pruebas automáticas (API + UI smoke).
4. Añadir observabilidad (logs estructurados y métricas).

---

## 10) Anexo: checklist de despliegue

- [ ] `npm install` ejecutado en `practicas/`.
- [ ] MongoDB operativo y accesible.
- [ ] `node server.js` sin errores.
- [ ] Carga de una noticia de prueba OK.
- [ ] Descarga de un documento SGI/RESPEL OK.
- [ ] Backups configurados.


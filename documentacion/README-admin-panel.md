# 📋 README — Panel de Administración Intranet CAS

> **Servidor:** `http://localhost:3000`  
> **Panel Admin:** `http://localhost:3000/administracion`  
> **Iniciado con:** `node practicas/server.js` desde la raíz del proyecto

---

## ¿Cómo funciona el sistema de administración?

El panel es una **página única (SPA)** donde todos los módulos están cargados en `administracion/index.html` y se muestran u ocultan mediante JavaScript (`admin-logic.js`). Cuando guardas o eliminas un documento desde el admin, el servidor **modifica directamente el archivo HTML público** de la sección correspondiente — ese archivo `.html` actúa simultáneamente como base de datos y como vista pública.

```
Formulario Admin
    ↓ fetch() con JSON o FormData
Express (server.js :3000)
    ↓ Route → Controller → Model
Archivo HTML público
    (se lee, se modifica, se reescribe)
```

> Los únicos módulos que usan MongoDB son **Noticias** y **Agenda**.

---

## 🗂️ Módulos del Panel

---

### 1. 📰 Noticias (NotiCAS)

**Descripción:** Gestión de noticias institucionales de la CAS.  
**Almacenamiento:** MongoDB → colección `news`  
**API:** `/api/news`  
**Archivo público:** `header_menu/cas/noticas-cas.html`

| Acción | Método | Endpoint |
|--------|--------|----------|
| Listar | GET | `/api/news` |
| Crear | POST | `/api/news` (multipart con imagen) |
| Actualizar | PUT | `/api/news/:id` |
| Eliminar | DELETE | `/api/news/:id` |

**Campos del formulario:**
- Título
- Descripción / Contenido
- Imagen (opcional, se guarda en `data/imagenes/noticias/`)
- Fecha

**Archivos clave:**
```
src/models/MongoNews.js       ← Mongoose schema
src/models/newsModel.js       ← Lógica de lectura/escritura HTML
src/controllers/newsController.js
src/routes/newsRoutes.js
```

---

### 2. 📅 Agenda CAS

**Descripción:** Eventos y publicaciones en la agenda institucional.  
**Almacenamiento:** MongoDB → colección `agenda`  
**API:** `/api/agenda`

| Acción | Método | Endpoint |
|--------|--------|----------|
| Listar | GET | `/api/agenda` |
| Crear | POST | `/api/agenda` |
| Actualizar | PUT | `/api/agenda/:id` |
| Eliminar | DELETE | `/api/agenda/:id` |

**Archivos clave:**
```
src/models/agendaModel.js
src/routes/agendaRoutes.js
```

---

### 3. 🌿 SGI — Procesos Estratégicos

**Descripción:** Documentos de Planeación Estratégica y Mejora Continua.  
**Almacenamiento:** HTML-as-DB (modifica el HTML público)  
**API:** `/api/sgi/:section`  

**Secciones disponibles:**

| `section` | Archivo HTML público | Carpeta de archivos |
|-----------|---------------------|---------------------|
| `planeacion` | `header_menu/sgi/planeacion-estrategica.html` | `data/menu header/sgi/Procesos Estratégicos/Planeación Estratégica/` |
| `mejora` | `header_menu/sgi/mejora-continua.html` | `data/menu header/sgi/Procesos Estratégicos/mejora continua/` |

| Acción | Método | Endpoint |
|--------|--------|----------|
| Listar | GET | `/api/sgi/:section` |
| Subir archivo | POST | `/api/sgi/upload` (multipart: `section`, `category`, `file`) |
| Crear entrada | POST | `/api/sgi/:section` |
| Actualizar | PUT | `/api/sgi/:section/:id` |
| Eliminar | DELETE | `/api/sgi/:section/:id` |

> **⚠️ Importante upload:** En el `FormData` los campos `section` y `category` deben ir **antes** que `file` para que Multer los reciba correctamente.

**Archivos clave:**
```
src/models/sgiModel.js
src/controllers/sgiController.js
src/routes/sgiRoutes.js
```

---

### 4. 🌿 SGI — Procesos Misionales (×3)

**Descripción:** Tres subsecciones misionales con documentos organizados por categorías.  
**Almacenamiento:** HTML-as-DB  
**API:** `/api/sgi/:section` (misma ruta que los estratégicos)  
**Lógica JS:** Función genérica `initMisionalSection(cfg)` en `admin-logic.js`

**Secciones:**

#### 4a. Administración de Recursos Naturales Renovables

| Campo | Valor |
|-------|-------|
| `section` API | `admin-recursos` |
| HTML público | `header_menu/sgi/admin-recursos.html` |
| Carpeta base | `data/menu header/sgi/procesos misionales/Administración de la Oferta.../` |
| Categorías | Caracterización · Formato Único Nacional · Procedimientos · Formatos · Instructivos · Anexos y Folletos |

#### 4b. Planeación y Ordenamiento Ambiental

| Campo | Valor |
|-------|-------|
| `section` API | `planeacion-ambiental` |
| HTML público | `header_menu/sgi/planeacion-ambiental.html` |
| Carpeta base | `data/menu header/sgi/procesos misionales/Planeación y Ordenamiento Ambiental/` |
| Categorías | Caracterización · Procedimientos · Formatos · Guías y Gestión de Riesgos · Anexos |

#### 4c. Vigilancia, Seguimiento y Control Ambiental

| Campo | Valor |
|-------|-------|
| `section` API | `vigilancia-control` |
| HTML público | `header_menu/sgi/vigilancia-control.html` |
| Carpeta base | `data/menu header/sgi/procesos misionales/Vigilancia, Seguimiento y Control Ambiental/` |
| Categorías | Caracterización · Formato Único Nacional · Formatos · Procedimientos · Gestión de Riesgos y Anexos |

**Funcionalidades del panel para cada misional:**
- Filtro por categoría (menú desplegable dinámico)
- Contador de documentos por categoría
- Crear / Editar / Eliminar documentos
- Al eliminar: borra el elemento del HTML **y** el archivo físico del servidor

---

### 5. ☢️ RESPEL

**Descripción:** Gestión de Residuos Peligrosos — dos subsecciones independientes.  
**Almacenamiento:** HTML-as-DB  
**API:** `/api/respel`  
**Archivo HTML público:** `herramientas/respel.html`

**Subsecciones:**

#### 5a. Documentos RESPEL

Tarjetas PDF en una grilla. Marcador: `<!-- END_RESPEL_GRID -->`

| Acción | Método | Endpoint |
|--------|--------|----------|
| Listar | GET | `/api/respel/documentos` |
| Subir | POST | `/api/respel/upload` |
| Crear | POST | `/api/respel/documentos` |
| Actualizar | PUT | `/api/respel/documentos/:id` |
| Eliminar | DELETE | `/api/respel/documentos/:id` |

**Campos:** Nombre, Archivo PDF  
**Carpeta de archivos:** `data/Herramientas/Respel/Documentos de Referencia/`

#### 5b. Tabla de Empresas RESPEL

Filas en una tabla HTML (`<tbody>`). El `data-id` va en el primer `<td>`.

| Acción | Método | Endpoint |
|--------|--------|----------|
| Listar | GET | `/api/respel/empresas` |
| Crear | POST | `/api/respel/empresas` |
| Actualizar | PUT | `/api/respel/empresas/:id` |
| Eliminar | DELETE | `/api/respel/empresas/:id` |

**Campos:** Nombre empresa, N° acto administrativo, Fecha acto, Archivo adjunto

**Archivos clave:**
```
src/models/respelModel.js      ← getAll/create/delete/update por sección ('documentos' | 'empresas')
src/controllers/respelController.js
src/routes/respelRoutes.js
```

---

### 6. 💧 RUA

**Descripción:** Registro Único Ambiental — documentos de referencia.  
**Almacenamiento:** HTML-as-DB  
**API:** `/api/rua`  
**Archivo HTML público:** `herramientas/rua.html`  
**Marcador:** `<!-- END_RUA_GRID -->`  
**Carpeta de archivos:** `data/Herramientas/Rua/Documentos de Referencia/`

| Acción | Método | Endpoint |
|--------|--------|----------|
| Listar | GET | `/api/rua` |
| Subir | POST | `/api/rua/upload` |
| Crear | POST | `/api/rua` |
| Actualizar | PUT | `/api/rua/:id` |
| Eliminar | DELETE | `/api/rua/:id` |

**Campos:** Nombre del documento, Archivo PDF/DOCX  
**Nota:** El `data-id` vive en el `<h4>` dentro de la tarjeta PDF.

**Archivos clave:**
```
src/models/ruaModel.js
src/controllers/ruaController.js
src/routes/ruaRoutes.js
```

---

### 7. 🔒 Boletines GIT

**Descripción:** Boletines de seguridad informática del Grupo de Infraestructura Tecnológica.  
**Almacenamiento:** HTML-as-DB  
**API:** `/api/boletines`  
**Archivo HTML público:** `header_menu/git/boletines.html`  
**Marcador:** `<!-- END_BOLETINES_GRID -->`  
**Carpeta de archivos:** `data/menu header/git/boletines/`

| Acción | Método | Endpoint |
|--------|--------|----------|
| Listar | GET | `/api/boletines` |
| Subir | POST | `/api/boletines/upload` |
| Crear | POST | `/api/boletines` |
| Actualizar | PUT | `/api/boletines/:id` |
| Eliminar | DELETE | `/api/boletines/:id` |

**Campos:** Título del boletín, Archivo PDF

**Archivos clave:**
```
src/models/boletinesModel.js
src/controllers/boletinesController.js
src/routes/boletinesRoutes.js
```

---

### 8. ⚡ PCB

**Descripción:** Bifenilos Policlorados — dos secciones gestionables.  
**Almacenamiento:** HTML-as-DB  
**API:** `/api/pcb`  
**Archivo HTML público:** `herramientas/pcb.html`

**Subsecciones:**

#### 8a. Documentos Inventario PCB

Tarjetas PDF. Marcador: `<!-- END_PCB_GRID -->`  
Carpeta de archivos: `data/Herramientas/pcb/Documentos Inventario PCB/`

| Acción | Método | Endpoint |
|--------|--------|----------|
| Listar | GET | `/api/pcb` |
| Subir | POST | `/api/pcb/upload` |
| Crear | POST | `/api/pcb` |
| Actualizar | PUT | `/api/pcb/:id` |
| Eliminar | DELETE | `/api/pcb/:id` |

**Campos:** Título del documento, Archivo PDF/DOCX

#### 8b. Tabla de Plazos de Inscripción

Filas `<tr>` dentro del `<tbody>`. Marcador: `<!-- END_PCB_TABLE -->`

| Acción | Método | Endpoint |
|--------|--------|----------|
| Listar | GET | `/api/pcb/tabla` |
| Crear | POST | `/api/pcb/tabla` |
| Actualizar | PUT | `/api/pcb/tabla/:id` |
| Eliminar | DELETE | `/api/pcb/tabla/:id` |

**Campos:** Tipo de propietario · Plazo de inscripción · Primer periodo de balance · Fecha límite primer reporte · Actualización anual

**Archivos clave:**
```
src/models/pcbModel.js         ← getAll/create/delete/update + getAllRows/createRow/deleteRow/updateRow
src/controllers/pcbController.js
src/routes/pcbRoutes.js
```

> **Estrategia de parsing PCB:** Se usa `.split('<div class="pdf-folder-card"')` en lugar de regex de cierre, para evitar fallos con divs anidados.

---

## 📌 Marcadores HTML usados por cada módulo

Cada módulo usa comentarios HTML especiales que actúan como puntos de inserción. El modelo inserta el nuevo bloque **justo antes** del marcador.

| Módulo | Marcador |
|--------|----------|
| RUA | `<!-- END_RUA_GRID -->` |
| RESPEL documentos | `<!-- END_RESPEL_GRID -->` |
| Boletines GIT | `<!-- END_BOLETINES_GRID -->` |
| PCB documentos | `<!-- END_PCB_GRID -->` |
| PCB tabla | `<!-- END_PCB_TABLE -->` |
| SGI estratégicos | Inserta en `<div class="file-list-grid">` por categoría |
| SGI misionales | Inserta en `<div class="file-list-grid">` por categoría |

---

## 🗃️ Estructura de carpetas de archivos

```
practicas/data/
├── imagenes/
│   └── noticias/                        ← imágenes de NotiCAS
├── Herramientas/
│   ├── Respel/
│   │   └── Documentos de Referencia/    ← PDFs de RESPEL
│   ├── Rua/
│   │   └── Documentos de Referencia/    ← PDFs de RUA
│   └── pcb/
│       └── Documentos Inventario PCB/   ← PDFs de PCB
└── menu header/
    ├── git/
    │   └── boletines/                   ← PDFs de Boletines
    └── sgi/
        ├── Procesos Estratégicos/
        │   ├── Planeación Estratégica/  ← PDFs SGI Planeación
        │   └── mejora continua/         ← PDFs SGI Mejora
        └── procesos misionales/
            ├── Administración de la Oferta.../
            │   ├── Caracterización/
            │   ├── Formato Único Nacional/
            │   ├── Procedimientos/
            │   ├── Formatos/
            │   ├── Instructivos/
            │   └── Anexos y Folletos/
            ├── Planeación y Ordenamiento Ambiental/
            │   ├── Caracterización/
            │   ├── Procedimientos/
            │   ├── Formatos/
            │   ├── Guías y Gestión de Riesgos/
            │   └── Anexos/
            └── Vigilancia, Seguimiento y Control Ambiental/
                ├── Caracterización/
                ├── Formato Único Nacional/
                ├── Formatos/
                ├── Procedimientos/
                └── Gestión de Riesgos y Anexos/
```

---

## ⚠️ Consideraciones importantes

### Upload de archivos — Orden del FormData
```javascript
// ✅ SIEMPRE así: texto antes del archivo
const fd = new FormData();
fd.append('section',  'vigilancia-control');
fd.append('category', 'Procedimientos');
fd.append('file',     archivo);
```
Si el archivo va primero, Multer no puede leer `section`/`category` y guarda en la ruta incorrecta.

### Eliminar un documento
Al eliminar, el sistema hace dos cosas:
1. Borra el elemento del HTML público (`<a>`, `<div>`, o `<tr>`)
2. Borra el archivo físico del disco usando la ruta guardada en el `href`

### Editar un documento
El update es: **delete → create**. Se elimina el elemento existente y se crea uno nuevo al final del listado. El archivo físico se conserva si no se sube uno nuevo.

---

*Generado el 28 de febrero de 2026*

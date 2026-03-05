# MANUAL TÉCNICO Y DE OPERACIÓN: INTRANET CAS
## 🏢 Corporación Autónoma Regional de Santander (CAS)

Este documento es la guía definitiva para la administración, mantenimiento y expansión del portal de Intranet de la CAS. Combina la documentación técnica de arquitectura con las instrucciones operativas para los administradores del sistema.

---

## 1. Resumen de Proyecto: "¿Qué se ha hecho?"

El portal ha evolucionado significativamente hacia una aplicación robusta. Los principales hitos alcanzados son:
- **Migración a MongoDB**: Transición de archivos JSON a una base de datos NoSQL para Noticias, Agenda y CITA, mejorando la escalabilidad y velocidad de consulta.
- **Arquitectura MVC**: Separación clara de rutas, modelos (Mongoose) y controladores.
- **CRUD SNIF, Provisión y Red**: Implementación de administradores especializados para la gestión de archivos técnicos y de talento humano.
- **Panel de Administración Unificado**: Interfaz centralizada para gestionar todos los módulos del portal.
- **Centralización de Activos**: Todos los archivos físicos se almacenan y sirven desde `/data`.

---

## 2. Estructura de Carpetas (Disposición de Archivos)

La organización del proyecto sigue estándares modernos:

### Directorio Raíz del Repositorio
- `practicas/`: Código fuente de la aplicación.
- `documentacion/`: Repositorio de manuales y documentos.

### Directorio `/practicas` (Corazón de la Web)
```text
/practicas
├── /administracion     # Interfaz de gestión unificada.
├── /data               # Repositorio central de documentos y activos.
│   ├── /imagenes       # Fotos de noticias y logos.
│   ├── /manuales       # Documentación SGI.
│   ├── /boletines      # Seguridad informática.
│   └── /uploads        # Archivos dinámicos (CITA, etc).
├── /src                # Backend (Node.js).
│   ├── /controllers    # Controladores.
│   ├── /models         # Modelos (Mongoose y Logic HTML).
│   └── /routes         # Rutas API.
├── /header_menu        # Secciones institucionales (CAS, SGI, GIT).
├── /herramientas       # REPSEL, RUA, PCB, CITA.
├── index.html          # Inicio.
├── server.js           # Punto de entrada.
└── generate_pages.ps1  # Script de automatización.
```

---

## 3. Procesos Técnicos y Gestión

### 3.1. Gestión de Datos con MongoDB
El sistema utiliza **Mongoose** como ODM para interactuar con MongoDB.
- Colecciones: `news`, `agenda`, `citas`.
- Las imágenes y PDFs asociados se guardan en el disco, y la base de datos almacena la ruta relativa.

### 3.2. Proceso de Generación de Páginas
Se mantiene el uso de `generate_pages.ps1` para asegurar que el menú superior sea consistente en todas las páginas HTML estáticas.

### 3.3. Middlewares Principales
- `multer`: Para el manejo de carga de archivos.
- `cors`: Para permitir peticiones desde el panel de administración.
- `express.static`: Para servir archivos de `/data` y archivos raíz.

---

## 4. Manual de Operación (Para el Administrador)

### Acceso al Panel
Entrar a: `http://localhost:3000/administracion`.

### Gestión por Módulo
1. **Noticias**: Crear, editar o borrar noticias. La imagen se optimiza y se guarda en `/data/imagenes/noticias`.
2. **Manuales CITA**: Permite subir PDFs categorizados. El sistema crea las subcarpetas automáticamente.
3. **Módulos de Archivos (SNIF/Provisión/Red)**: Gestión de documentos específicos de GIT y Talento Humano con carga directa al sistema de archivos.
4. **Módulos SGI/RESPEL**: Actualizan directamente los bloques de código en los archivos HTML correspondientes.

---

## 5. Requisitos y Ejecución Técnica

### Dependencias
El sistema requiere **Node.js** y **MongoDB**. Librerías clave:
- `express`, `mongoose`, `multer`, `cors`.

### Comando de Inicio
```powershell
cd /intranet/practicas
node server.js
```

---

## 6. Bitácora de Desarrollo (Log de Avances)

| Fecha | Actividad | Resultado |
| :--- | :--- | :--- |
| **Fase 4** | Documentación Maestra | Manuales técnicos y operativos. |
| **Fase 5** | Migración a MongoDB | Persistencia escalable para Noticias y Agenda. |
| **Fase 6** | Implementación CITA | CRUD completo para manuales técnicos CITA. |
| **Fase 7** | Módulos de Archivos | CRUD para SNIF, Provisión de Empleos y Revisión de Red. |
| **Fase 8** | Talento Humano y UX | Secciones de Convocatorias, Planes y ajuste de categorías. |

---

> [!TIP]
> **Expansión**: Para nuevos módulos, siga el patrón en `newsRoutes.js` y `newsController.js` si requiere base de datos, o `sgiController.js` si requiere inyección de HTML.

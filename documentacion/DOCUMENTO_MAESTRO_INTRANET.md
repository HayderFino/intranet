# Documento Maestro de la Intranet CAS
## Análisis Integral, Arquitectura y Gestión de Procesos

Este documento constituye la documentación oficial y técnica del portal de Intranet de la **Corporación Autónoma Regional de Santander (CAS)**. Ha sido diseñado para servir como guía de administración, mantenimiento y desarrollo futuro del sistema.

---

## 1. Introducción y Propósito

El portal de Intranet CAS es una plataforma centralizada diseñada para facilitar el acceso a la información institucional, la gestión de procesos del Sistema de Gestión Integrado (SGI), la administración de manuales CITA, y la comunicación interna.

**Objetivos clave:**
- Centralizar el acceso a documentos normativos y manuales.
- Automatizar la publicación de noticias institucional (NotiCAS).
- Ofrecer un punto único de acceso a herramientas transversales (RESPEL, RUA, CITA, etc.).
- Mantener una estética moderna y profesional ("Premium Design").

---

## 2. Arquitectura Técnica

El sistema ha evolucionado de un sitio estático a una aplicación web dinámica basada en el patrón **MVC (Model-View-Controller)** con persistencia en base de datos.

### Tecnologías Core
- **Frontend**: HTML5, CSS3 (Vanilla), JavaScript (ES6+).
- **Backend**: Node.js con el framework Express.
- **Gestión de Datos**:
  - **MongoDB**: Para datos estructurados dinámicos (Noticias, Agenda, CITA).
  - **Sistema de Archivos Local**: Para activos binarios (PDFs, Imágenes) en `/data`.
  - **HTML-as-DB**: Para secciones heredadas de documentos SGI/RESPEL donde la vista y el dato están vinculados.
- **Automatización**: Scripts de PowerShell para la generación masiva de estructuras HTML.

### Estructura de Directorios Principal
- `/practicas`: Directorio raíz de la aplicación activa.
  - `/src`: Lógica del servidor (Controladores, Modelos, Rutas).
  - `/data`: Repositorio central de activos (Imágenes, PDFs, Boletines).
  - `/administracion`: Panel de control unificado.
  - `/header_menu`: Contenido segmentado por áreas (CAS, SGI, GIT).
  - `/herramientas`: Enlaces a aplicaciones externas y recursos técnicos.
- `/documentacion`: Repositorio de guías técnicas y manuales de administración.

---

## 3. Gestión de Procesos y Datos

### 3.1. Centralización de Activos (`/data`)
Todos los archivos físicos (PDFs de manuales, imágenes de noticias) se gestionan en la carpeta `/data`. El servidor Node.js sirve esta carpeta de forma estática, permitiendo enlaces consistentes.

### 3.2. Panel de Administración
La gestión de contenido se realiza a través de `/administracion`. Módulos integrados:
1. **NotiCAS**: Gestión de noticias en MongoDB.
2. **Agenda CAS**: Programación de eventos en MongoDB.
3. **Manuales CITA**: Gestión documental técnica basada en MongoDB.
4. **SGI/RESPEL/RUA/Boletines**: Actualización dinámica de archivos HTML.

### 3.3. Ciclo de Vida de una Petición (MongoDB)
1. **Usuario**: Realiza una acción en el panel (ej. crear noticia).
2. **Router**: Captura la petición en `/api/news`.
3. **Controlador**: Procesa datos y archivos (Multer).
4. **Modelo (Mongoose)**: Guarda el documento en la colección correspondiente en MongoDB.
5. **Respuesta**: La UI se actualiza y el contenido se sirve dinámicamente en el portal.

---

## 4. Diseño y Experiencia de Usuario (UX/UI)

El portal utiliza un sistema de diseño "Premium" caracterizado por:
- **Navegación Intuitiva**: Sidebar lateral y menú superior desplegable.
- **Componentes Dinámicos**: Carruseles de noticias y grids de tarjetas para documentos.
- **Tipografía**: Fuente 'Inter'.
- **Responsive**: Adaptabilidad total.

---

## 5. Guía de Operación y Mantenimiento

### Ejecución del Servidor
```bash
cd c:\Users\HAYDER\Videos\intranet\practicas
node server.js
```
*Asegúrese de que el servicio de MongoDB esté iniciado.*

### Generación de Nuevas Secciones
El script `generate_pages.ps1` permite crear la carcasa de nuevas páginas manteniendo la coherencia estética.

---

## 6. Evolución del Proyecto (Roadmap Reales)

| Fase | Título | Descripción |
| :--- | :--- | :--- |
| **Fase 4** | Documentación Maestra | Entrega de manuales técnicos iniciales. |
| **Fase 5** | Migración NoSQL | Implementación de MongoDB para noticias y agenda. |
| **Fase 6** | CRUD CITA | Implementación de administración completa para manuales CITA. |

---

> [!IMPORTANT]
> **Respaldo de Base de Datos**: Es crítico realizar dumps periódicos de MongoDB (`mongodump`) además del respaldo de la carpeta `/data`.

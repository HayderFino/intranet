# Documento Maestro de la Intranet CAS
## Análisis Integral, Arquitectura y Gestión de Procesos

Este documento constituye la documentación oficial y técnica del portal de Intranet de la **Corporación Autónoma Regional de Santander (CAS)**. Ha sido diseñado para servir como guía de administración, mantenimiento y desarrollo futuro del sistema.

---

## 1. Introducción y Propósito

El portal de Intranet CAS es una plataforma centralizada diseñada para facilitar el acceso a la información institucional, la gestión de procesos del Sistema de Gestión Integrado (SGI), y la comunicación interna.

**Objetivos clave:**
- Centralizar el acceso a documentos normativos y manuales.
- Automatizar la publicación de noticias institucional (NotiCAS).
- Ofrecer un punto único de acceso a herramientas transversales (RESPEL, RUA, etc.).
- Mantener una estética moderna y profesional ("Premium Design").

---

## 2. Arquitectura Técnica

El sistema ha evolucionado de un sitio estático a una aplicación web dinámica basada en el patrón **MVC (Model-View-Controller)**.

### Tecnologías Core
- **Frontend**: HTML5, CSS3 (Vanilla), JavaScript (ES6+).
- **Backend**: Node.js con el framework Express.
- **Gestión de Datos**: Sistema de persistencia basado en archivos JSON y sistema de archivos local para activos.
- **Automatización**: Scripts de PowerShell para la generación masiva de estructuras HTML.

### Estructura de Directorios Principal
- `/practicas`: Directorio raíz de la aplicación activa.
  - `/src`: Lógica del servidor (Controladores, Modelos, Rutas).
  - `/data`: Repositorio central de activos (Imágenes, PDFs, Boletines).
  - `/administrador`: Panel de control para usuarios con permisos.
  - `/header_menu`: Contenido segmentado por áreas (CAS, SGI, GIT).
  - `/herramientas`: Enlaces a aplicaciones externas y recursos técnicos.
- `/documentacion`: Repositorio de guías técnicas y manuales de administración.

---

## 3. Gestión de Procesos y Datos

### 3.1. Centralización de Activos (`/data`)
Para mejorar la mantenibilidad y facilitar los respaldos, todos los archivos que no son código (PDFs de manuales, imágenes de noticias, logos) se gestionan en la carpeta `/data`. El servidor Node.js sirve esta carpeta de forma estática, permitiendo enlaces consistentes en todo el portal.

### 3.2. Panel de Administración
La gestión de contenido dinámico se realiza a través del `/administrador`. Este panel interactúa con la API REST del backend para:
1. **NotiCAS**: Carga de noticias con imagen y persistencia automática en el inicio y en la sección de noticias.
2. **Agenda CAS**: Programación de eventos que se reflejan en tiempo real.
3. **Control de Noticias**: Listado y eliminación de contenido dinámico generado.

### 3.3. Ciclo de Vida de una Petición
1. **Usuario**: Interactúa con la UI (ej. sube una noticia).
2. **Router**: Captura la petición en `/api/news`.
3. **Controlador**: Procesa la descarga del archivo (usando `multer`) y actualiza los punteros de datos.
4. **Modelo**: Escribe los cambios en el disco o actualiza los archivos HTML dinámicos.
5. **Respuesta**: La UI se actualiza sin necesidad de intervención manual en el código.

---

## 4. Diseño y Experiencia de Usuario (UX/UI)

El portal utiliza un sistema de diseño "Premium" caracterizado por:
- **Navegación Intuitiva**: Sidebar lateral para herramientas y menú superior desplegable para secciones institucionales.
- **Componentes Dinámicos**: Carruseles de imágenes para noticias destacadas y grids de tarjetas para documentos.
- **Tipografía**: Uso de la fuente 'Inter' para máxima legibilidad.
- **Responsive**: Adaptabilidad a diferentes tamaños de pantalla.

---

## 5. Guía de Operación y Mantenimiento

### Ejecución del Servidor
Para que las funciones dinámicas (Admin, Agenda, Noticias) funcionen, el servidor debe estar activo:
```bash
cd c:\Users\HAYDER\Documents\intranet\intranet\practicas
node server.js
```

### Generación de Nuevas Secciones
El script `generate_pages.ps1` permite crear rápidamente la carcasa de nuevas páginas manteniendo la coherencia estética y los menús actualizados. Este script utiliza entidades HTML para asegurar que los caracteres especiales (tildes, eñes) se visualicen correctamente en cualquier navegador.

---

## 6. Análisis de Seguridad y Ciberseguridad

El portal incluye una sección dedicada a la **Ciberseguridad (GIT)**, donde se gestionan:
- Boletines de seguridad mensuales.
- Manuales de políticas de protección de datos.
- Normatividad vigente sobre Gobierno Digital.

---

> [!IMPORTANT]
> **Recomendación de Respaldo**: Se recomienda realizar copias de seguridad periódicas de la carpeta `practicas/data` y de los archivos HTML raíz, ya que contienen la información dinámica generada por los usuarios.

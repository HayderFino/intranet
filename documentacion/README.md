# Portal de Intranet - CAS

Este es el repositorio oficial del Portal de Intranet de la Corporación Autónoma Regional de Santander (CAS). El sistema es una plataforma corporativa dinámica que incluye gestión de contenidos basada en MongoDB, visualización de documentos oficiales y un panel de administración centralizado.

---

## 📖 Documentación Completa

Toda la documentación detallada sobre el funcionamiento, arquitectura y administración se encuentra centralizada en la carpeta `documentacion/`:

1.  **[Guía General](./documentacion/general.md)**: Visión global y estructura del repositorio.
2.  **[Guía de Navegación](./documentacion/guia_navegacion.md)**: Estructura del portal, menús y dashboard.
3.  **[Documentación Técnica](./documentacion/tecnico.md)**: Instalación, ejecución y control de versiones.
4.  **[Arquitectura MVC](./documentacion/arquitectura_mvc.md)**: Detalle del patrón de diseño en el backend.
5.  **[Gestión de Datos](./documentacion/gestion_datos.md)**: Organización de archivos y activos (data).
6.  **[Administración](./documentacion/administracion.md)**: Guía del panel de gestión (Noticias, Agenda, CITA, SNIF, Provisión de Empleos y Revisión de Red).
7.  **[Herramientas](./documentacion/herramientas.md)**: Catálogo de utilidades y páginas especiales (RESPEL, RUA, PCB).
8.  **[Importación y Despliegue](./documentacion/GUIA_IMPORTACION_Y_DESPLIEGUE.md)**: Guía paso a paso para clonar e instalar el sistema desde cero.

---

## 🚀 Configuración y Despliegue del Servidor

Para poner en marcha la intranet en un servidor central dentro de la red, siga estos pasos:

### 1. Requisitos Previos
*   **Node.js** (v18 o superior)
*   **MongoDB Server** (v7.0 o superior) - Debe estar corriendo localmente o configurar la URI.
*   **Git** (para control de versiones)

### 2. Instalación de Dependencias
Navegue a la carpeta `intranet` y ejecute:
```bash
cd intranet
npm install
```

### 3. Migración Inicial de Datos
Si existen datos antiguos en formato JSON que no han sido migrados:
```bash
node migrate_to_mongo.js
```
*Nota: Este paso solo es necesario una vez para inicializar la base de datos de noticias y agenda.*

### 4. Iniciar el Servidor
Para poner la intranet en línea:
```bash
node server.js
```
El servidor estará disponible localmente en `http://localhost:3000`.

---

## 💻 Acceso para Usuarios Finales
Los usuarios de la oficina **NO NECESITAN INSTALAR NADA**. Simplemente deben abrir su navegador y escribir la dirección IP del servidor central. Ejemplo:
`http://192.168.1.50:3000`

---

## 📂 Estructura Principal del Proyecto

*   `documentacion/`: Guías técnicas y manuales de arquitectura.
*   `intranet/`: Núcleo del servidor (Backend Node.js).
    *   `/src/models`: Modelos de datos (Mongoose para Noticias, Agenda y CITA; Lógica HTML para SGI/RESPEL).
    *   `/src/controllers`: Lógica de negocio y procesamiento de peticiones.
    *   `/src/routes`: Definición de rutas API REST.
*   `data/`: Repositorio de archivos estáticos, imágenes y documentos institucionales.
*   `administracion/`: Módulos del panel de control para administradores.

---

## 🛠️ Guía para Desarrolladores
Si estás contribuyendo al código o realizando pruebas:
1. Asegúrate de tener una instancia de MongoDB activa localmente (`mongodb://127.0.0.1:27017/intranet_cas`).
2. Realiza siempre un `npm install` tras descargar cambios.
3. Prueba tus cambios ejecutando `node server.js` dentro de la carpeta `intranet`.
4. Todos los archivos de documentación deben actualizarse en la carpeta `documentacion/`.
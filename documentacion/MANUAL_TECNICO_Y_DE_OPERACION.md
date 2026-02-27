# MANUAL TÉCNICO Y DE OPERACIÓN: INTRANET CAS
## 🏢 Corporación Autónoma Regional de Santander (CAS)

Este documento es la guía definitiva para la administración, mantenimiento y expansión del portal de Intranet de la CAS. Combina la documentación técnica de arquitectura con las instrucciones operativas para los administradores del sistema.

---

## 1. Resumen de Proyecto: "¿Qué se ha hecho?"

El portal ha pasado de ser una colección de archivos HTML aislados a un sistema web dinámico y escalable. Los principales hitos alcanzados son:
- **Migración a Arquitectura MVC**: Separación de rutas, modelos y controladores en el servidor Node.js.
- **Unificación de Datos**: Centralización de todos los activos (PDF, imágenes) en un único directorio `/data`.
- **Panel de Administración**: Implementación de una interfaz web para cargar noticias y eventos sin editar código manualmente.
- **Automatización de Layouts**: Creación de scripts de generación masiva para asegurar que todas las páginas tengan el mismo diseño premium y menús actualizados.
- **Corrección de Codificación**: Implementación de entidades HTML y UTF-8 para evitar errores de visualización de caracteres especiales.

---

## 2. Estructura de Carpetas (Disposición de Archivos)

La organización del proyecto sigue estándares modernos de desarrollo web:

### Directorio Raíz del Repositorio
- `practicas/`: Contiene todo el código fuente de la aplicación web.
- `documentacion/`: Repositorio de manuales y documentos maestros.
- `.git/`: Sistema de control de versiones.

### Directorio `/practicas` (Corazón de la Web)
```text
/practicas
├── /administrador      # Interfaz de gestión para el personal de TIC.
├── /data               # Repositorio central de documentos y activos.
│   ├── /imagenes       # Logos, banners y fotos de noticias.
│   ├── /manuales       # Documentación oficial del SGI.
│   └── /boletines      # Boletines de ciberseguridad.
├── /src                # Lógica del servidor (Backend).
│   ├── /controllers    # Controladores (procesan las peticiones).
│   ├── /models         # Modelos (interactúan con los datos).
│   └── /routes         # Definición de rutas de la API.
├── /header_menu        # Secciones institucionales (CAS, SGI, GIT).
├── /herramientas       # Enlaces a aplicaciones internas.
├── index.html          # Página de inicio del portal.
├── server.js           # Archivo principal de ejecución del servidor.
├── styles.css          # Estilos globales (Premium UI).
└── generate_pages.ps1  # Script de automatización de páginas.
```

---

## 3. Procesos Técnicos y Gestión

### 3.1. Proceso de Generación de Páginas
Para añadir o actualizar masivamente las páginas, se utiliza el script `generate_pages.ps1`.
- **Función**: Toma una plantilla HTML premium y genera archivos individuales para cada ítem del menú.
- **Beneficio**: Garantiza que si se cambia un enlace en el menú superior, todas las páginas se actualicen simultáneamente.

### 3.2. Gestión de Activos y Persistencia
- Los datos dinámicos (noticias) se inyectan dinámicamente.
- El servidor Node.js utiliza el middleware `express.static` para servir la carpeta `/data`, permitiendo que cualquier página del portal acceda a los archivos con una ruta relativa estándar.

### 3.3. Estandarización de Caracteres
Se ha implementado un proceso de limpieza para que todas las páginas utilicen entidades como `&aacute;` o `&ntilde;`, asegurando la compatibilidad universal entre diferentes servidores y navegadores.

---

## 4. Manual de Operación (Para el Administrador)

### Acceso al Panel
El administrador puede gestionar el portal entrando a: `http://localhost:3000/administrador`.

### Gestión de Contenido
1. **Publicar Noticia**: Subir un título, descripción e imagen. El sistema actualizará automáticamente el carrusel de inicio y la sección de NotiCAS.
2. **Agenda CAS**: Registrar eventos institucionales.
3. **Mantenimiento**: Eliminar noticias antiguas o desactualizadas desde la pestaña "Listado".

---

## 5. Requisitos y Ejecución Técnica

### Dependencias
El sistema requiere **Node.js** y las siguientes librerías de `npm`:
- `express`: Servidor web.
- `multer`: Gestión de subida de archivos (imágenes/PDF).
- `cors`: Permisos de seguridad para el administrador.

### Comando de Inicio
```powershell
cd c:\Users\HAYDER\Documents\intranet\intranet\practicas
node server.js
```

---

## 6. Bitácora de Desarrollo (Log de Avances)

| Fecha | Actividad | Resultado |
| :--- | :--- | :--- |
| **Fase 1** | Migración MVC | Código más limpio y fácil de mantener. |
| **Fase 2** | Centralización de `/data` | Eliminación de archivos duplicados y rutas rotas. |
| **Fase 3** | Admin Panel v1 | Gestión autónoma de noticias por parte de los usuarios. |
| **Fase 4** | Documentación Maestra | Entrega de manuales técnicos y operativos completos. |

---

> [!TIP]
> **Expansión Futura**: El sistema está preparado para integrar una base de datos SQL o NoSQL si el volumen de noticias crece exponencialmente, ya que la lógica está aislada en la capa de `models`.

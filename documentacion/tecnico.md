# Documentación Técnica

Detalle técnico sobre el entorno, ejecución y mantenimiento de la **Intranet CAS**.

## 🚀 Instalación y Ejecución

### Requisitos
- **Node.js**: v18 o superior.
- **MongoDB**: v7.0 o superior (Instancia local o remota).
- **NPM**: Manejador de paquetes.

### Pasos de Lanzamiento
1. Abrir terminal en la carpeta `/intranet` del proyecto.
2. Ejecutar `npm install` para instalar dependencias (`express`, `mongoose`, `multer`, `cors`).
3. Iniciar el servicio de MongoDB en el servidor.
4. Ejecutar `node server.js`.

## 📄 Control de Versiones

| Versión | Descripción |
| :--- | :--- |
| **1.0 - 1.3** | Desarrollo inicial, MVC y estandarización HTML. |
| **2.0.0** | **Migración a MongoDB**: Persistencia NoSQL para noticias y agenda. |
| **2.1.0** | **Módulo CITA**: CRUD completo para manuales técnicos con carga dinámica. |
| **2.2.0** | **Módulos de Archivos**: Implementación de CRUD para SNIF, Provisión de Empleos y Revisión de Red. |
| **2.3.0** | **UX y Talento Humano**: Reestructuración de Convocatorias, Planes y categorías de manuales. |
| **Actual** | Estabilidad de base de datos y documentación maestra integral actualizada. |

## 🛠️ Herramientas de Mantenimiento
- **Visual Studio Code**: Recomendado para edición de código.
- **MongoDB Compass**: Para visualización y limpieza de datos en `intranet_cas`.
- **PowerShell**: Para  ejecutar el script de actualización de layouts `generate_pages.ps1`. 

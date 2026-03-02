# Guía General del Proyecto

Visión global de la estructura y el propósito de la **Intranet CAS**.

## Estructura del Repositorio

- `practicas/`: Servidor Node.js y lógica de negocio.
- `documentacion/`: Repositorio central de manuales y guías técnicas.
- `/data/`: Activos físicos (imágenes, manuales, PDFs).

## Resumen de Hitos Recientes

- **Migración a MongoDB**: Implementación de base de datos NoSQL para Noticias, Agenda y CITA, eliminando la dependencia de archivos JSON pesados.
- **Implementación CITA**: Creación de un módulo completo de administración para manuales técnicos con categorización automática.
- **Arquitectura MVC**: Backend organizado en controladores, modelos (Mongoose) y rutas API.
- **Panel de Administración SPA**: Interfaz modernizada para una gestión rápida desde una sola pestaña.
- **Centralización de Datos**: Todos los recursos externos servidos desde el directorio `/data`.

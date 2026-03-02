# Panel de Administración

Ubicado en `practicas/administracion`, este panel permite la gestión dinámica de los contenidos del portal mediante una API REST en Node.js conectada a MongoDB.

## Funciones Principales

### 1. Gestión de Noticias (MongoDB)
- **Carga Automática**: Al subir una noticia, el sistema la guarda en la colección `news` de MongoDB y la sirve dinámicamente en el carrusel de inicio y la sección de noticias.
- **Imagen**: Se guarda físicamente en `data/imagenes/noticias/`.
- **Listado y Edición**: Permite gestionar todo el historial de noticias de forma eficiente.

### 2. Gestión de Agenda CAS (MongoDB)
- Permite programar actividades institucionales.
- Los datos persisten en la colección `agenda`.

### 3. Manuales CITA (MongoDB - NUEVO)
- Permite la gestión de manuales técnicos.
- Los archivos se organizan automáticamente por categorías (`mecánica`, `eléctrica`, etc.) en la carpeta `data/uploads/citas/`.

### 4. Gestión de Documentos SGI/RESPEL/RUA
- Permite subir archivos y actualizar las listas de documentos en las páginas correspondientes mediante inyección directa de HTML.

## Solución de Problemas (Troubleshooting)

### Los datos no cargan o no se guardan
1. **Verificar MongoDB**: Asegúrate de que el servicio de MongoDB (`mongod`) esté activo.
2. **Verificar el Servidor**: Asegúrate de que el proceso `node server.js` esté corriendo.
3. **Logs de Error**: Revisa el archivo `practicas/error_log.txt` para ver detalles técnicos de cualquier fallo.

## Acceso Local
[http://localhost:3000/administracion](http://localhost:3000/administracion)

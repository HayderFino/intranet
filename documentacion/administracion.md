# Panel de Administración

Ubicado en `practicas/administrador`, este panel permite la gestión dinámica de los contenidos del portal mediante una API REST en Node.js.

## Funciones Principales

### 1. Gestión de Noticias
- **Carga Automática**: Al subir una noticia con título, imagen y descripción, el sistema la inyecta automáticamente en `index.html` y `header_menu/cas/noticas-cas.html`.
- **Listado y Eliminación**: En la pestaña "Listado", puedes ver todas las noticias que han sido creadas a través de este administrador y eliminarlas individualmente.
  > **Nota**: Las noticias que ya estaban en el código HTML de forma estática (sin un `data-id` numérico) no aparecerán en esta lista ni podrán ser borradas desde aquí.

### 2. Gestión de Agenda CAS
- Permite programar actividades institucionales.
- Se inyectan en tiempo real en la página `agenda.html`.

## Solución de Problemas (Troubleshooting)

### Las noticias nuevas no aparecen o no se guardan
1. **Verificar el Servidor**: Asegúrate de que el proceso `node server.js` esté corriendo en la terminal.
2. **Reiniciar el Servidor**: Si has hecho cambios manuales en los archivos HTML o en el código fuente, reinicia el comando `node server.js`.
3. **Dependencias**: Si es la primera vez que lo corres, ejecuta `npm install` en la carpeta `practicas`.
4. **Permisos de Escritura**: El servidor debe tener permisos para modificar los archivos `index.html` y las carpetas en `data/`.

## Acceso Local
[http://localhost:3000/administrador](http://localhost:3000/administrador)

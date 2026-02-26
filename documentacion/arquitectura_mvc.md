# Arquitectura MVC (Model-View-Controller)

El backend del portal se ha reestructurado bajo el patrón MVC para desacoplar la lógica de datos de la presentación.

## Directorio `practicas/src`

- **controllers/**: Contiene la lógica para procesar peticiones y enviar respuestas.
  - `newsController.js`: Maneja las noticias.
  - `agendaController.js`: Maneja los calendarios.
- **models/**: Interactúa con el sistema de archivos para leer/escribir datos JSON.
- **routes/**: Define los puntos de entrada (endpoints) de la API REST.

## Flujo de Datos
El cliente (Navegador) solicita a una ruta -> El Router la dirige al Controlador -> El Controlador pide datos al Modelo -> El Modelo lee de la carpeta `/data` -> El controlador responde con JSON.

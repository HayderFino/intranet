# Implementación de NoSQL "Estática" (Embebida)
## 📂 MongoDB sin necesidad de Servidor Externo para la Intranet CAS

Sí, es totalmente posible usar la lógica de MongoDB de forma "estática" o embebida dentro de tu proyecto. Esto significa que **no necesitas instalar MongoDB en tu computadora** ni correr un servicio de base de datos aparte; la base de datos es simplemente una dependencia de tu código y los datos se guardan en un archivo local (parecido a lo que ya tienes con los JSON, pero con el poder de búsqueda de Mongo).

---

## 1. El concepto de Base de Datos Embebida

En lugar de conectar tu servidor a un servicio externo (como `mongodb://localhost:27017`), tu código Node.js maneja directamente un archivo que actúa como base de datos.

### Beneficios para la CAS:
- **Portabilidad**: Copias la carpeta del proyecto a otra PC y todo sigue funcionando.
- **Simplicidad**: No requiere configuración de servidores de bases de datos.
- **Rendimiento**: Mucho más rápido que leer y escribir archivos JSON manualmente con `fs`.

---

## 2. Opciones Recomendadas (2026)

### A. AxioDB (La opción moderna)
Es una base de datos NoSQL diseñada para ser embebida.
- **API**: Usa objetos de JavaScript para filtrar, muy similar a MongoDB.
- **Almacenamiento**: Guarda todo en archivos locales automáticamente.
- **Panel**: Incluye una interfaz gráfica web para ver los datos.

### B. NeDB / Datastore
Es el estándar clásico para "Mongo sin servidor".
- **Sintaxis**: Es prácticamente idéntica a MongoDB (`db.find({ title: '...' })`).
- **Archivo**: Guarda cada "colección" en un archivo sencillo (ej: `noticias.db`).

---

## 3. Ejemplo de cómo se vería en tu `server.js`

Si quisiéramos usar una base de datos embebida para las noticias en lugar de archivos JSON sueltos:

```javascript
const Datastore = require('nedb');
const db = new Datastore({ filename: './data/database/noticias.db', autoload: true });

// Insertar una noticia (Igual que en MongoDB)
db.insert({ 
    titulo: "Noticia de Prueba", 
    fecha: new Date(), 
    imagen: "data/imagenes/foto.jpg" 
}, (err, newDoc) => {
    console.log("Noticia guardada estáticamente en el archivo .db");
});

// Buscar noticias
db.find({ titulo: /Prueba/ }, (err, docs) => {
    console.log("Resultados encontrados:", docs);
});
```

---

## 4. Comparativa con tu sistema actual

| Característica | Sistema Actual (JSON + fs) | Sistema Embebido (Mongo-like) |
| :--- | :--- | :--- |
| **Búsqueda** | Tienes que leer todo el archivo y filtrar manualmente. | Usas comandos rápidos como `.find()`. |
| **Escritura** | Sobrescribes el archivo completo cada vez. | Solo se añade el cambio al final del archivo (más seguro). |
| **Escalabilidad** | Se vuelve lento con miles de registros. | Maneja eficientemente cientos de miles de registros. |

---

## Conclusión

Para tu proyecto de la Intranet, **mi recomendación es usar una base de datos embebida**. Te permite mantener el proyecto "estático" dentro de una carpeta sin dependencias de red externas, pero ganando toda la potencia de una base de datos profesional.

¿Te gustaría que implementemos una prueba con **AxioDB** o **NeDB** en tu controlador de noticias?

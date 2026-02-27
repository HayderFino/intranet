# Integración de Bases de Datos NoSQL con Imágenes
## 📂 Análisis de Alternativas para la Intranet CAS

Al evolucionar un proyecto como la Intranet CAS, es común considerar el salto de archivos locales JSON a una base de datos NoSQL. A continuación, se analizan las mejores opciones que permiten gestionar imágenes.

---

## 1. Estrategias de Almacenamiento

Existen dos caminos principales para manejar imágenes en NoSQL:

| Estrategia | Descripción | Pros | Contras |
| :--- | :--- | :--- | :--- |
| **Por Referencia (Recomendado)** | Se guarda la imagen en el servidor (o nube) y en la DB solo se guarda el **URL o Path**. | Máximo rendimiento, la DB se mantiene ligera. | Requiere gestionar la limpieza de archivos huérfanos. |
| **Binario (BLOB/GridFS)** | La imagen se convierte en datos binarios y se guarda **dentro** de la base de datos. | Todo está en un solo lugar, copias de seguridad unificadas. | Crecimiento masivo de la DB, lentitud en consultas si no se gestiona bien. |

---

## 2. Bases de Datos NoSQL Recomendadas

### A. MongoDB (La Opción Más Popular)
Es la integración más natural para Node.js.
- **Para imágenes pequeñas**: Se usa el tipo `BinData`.
- **Para imágenes grandes o muchos archivos**: Posee **GridFS**, un sistema que divide el archivo en trozos (chunks) dentro de la base de datos.
- **Uso ideal en CAS**: Migrar los JSON actuales a colecciones de Mongo, manteniendo las imágenes en `/data` y guardando solo el string de la ruta en el documento.

### B. CouchDB
A diferencia de otras, CouchDB fue diseñada con la web en mente.
- **Attachments**: Permite adjuntar archivos directamente a los documentos JSON como si fueran correos electrónicos.
- **Ventaja**: Muy fácil de replicar si se planea tener servidores en diferentes sedes de la CAS.

### C. Firebase (Google Firestore + Storage)
Si se busca una solución en la nube (SaaS):
- **Firestore**: Almacena los metadatos de la noticia.
- **Cloud Storage**: Almacena la imagen física.
- **Ventaja**: Escalabilidad infinita y excelente seguridad nativa.

---

## 3. Propuesta de Migración para la Intranet

Si decidiéramos integrar **MongoDB**, el esquema de una noticia en el código cambiaría de esto:

**Actual (JSON):**
```json
{
  "id": 123,
  "titulo": "Nueva noticia",
  "imagen": "data/imagenes/noticia1.jpg"
}
```

**Propuesto (MongoDB Mongoose):**
```javascript
const noticiaSchema = new mongoose.Schema({
  titulo: String,
  descripcion: String,
  imagenPath: String, // Referencia al archivo en /data
  fecha: { type: Date, default: Date.now }
});
```

---

## 4. Conclusión y Recomendación

Para la infraestructura actual de la CAS, la recomendación técnica es:
1. **Implementar MongoDB**: Es la más documentada y compatible con el stack de Node.js actual.
2. **Usar el Modelo de Referencia**: Continuar usando la carpeta `/data/imagenes` para los archivos físicos, pero usar MongoDB para indexar, buscar y filtrar las noticias de forma mucho más rápida que con archivos JSON.

---

> [!TIP]
> **¿Por qué no guardar la imagen directamente en la DB?**
> Guardar imágenes como binarios hace que las copias de seguridad (dumps) pesen gigabytes rápidamente, dificultando el mantenimiento. Guardar la ruta (string) permite que la base de datos sea veloz y responda en milisegundos.

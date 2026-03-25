const express = require("express");
const path = require("path");
const fs = require("fs");

// --- Parche Global de Caché FS para DB en HTML ---
const originalReadFileSync = fs.readFileSync;
const originalWriteFileSync = fs.writeFileSync;
const htmlCache = new Map();

fs.readFileSync = (pathStr, options) => {
  if (typeof pathStr === "string" && pathStr.endsWith(".html") && (options === "utf8" || (options && options.encoding === "utf8"))) {
    if (htmlCache.has(pathStr)) return htmlCache.get(pathStr);
    const content = originalReadFileSync(pathStr, options);
    htmlCache.set(pathStr, content);
    return content;
  }
  return originalReadFileSync(pathStr, options);
};

fs.writeFileSync = (pathStr, data, options) => {
  if (typeof pathStr === "string" && pathStr.endsWith(".html")) {
    htmlCache.delete(pathStr); // Invalidamos al escribir
  }
  return originalWriteFileSync(pathStr, data, options);
};
// ------------------------------------------------

const cors = require("cors");
const mongoose = require("mongoose");

const session = require("express-session");

const app = express();
const PORT = 3000;

// Configuración de Sesiones
app.use(
  session({
    secret: "intranet_cas_secret_key_2024",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // true solo si usas HTTPS
      maxAge: 24 * 60 * 60 * 1000, // 24 horas
    },
  }),
);

// Configuración de MongoDB
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/intranet_cas";

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ Conectado a MongoDB"))
  .catch((err) => console.error("❌ Error de conexión a MongoDB:", err));

const newsRoutes = require("./src/routes/newsRoutes");

// Middleware
const whitelist = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://localhost",
  "http://127.0.0.1",
];
const corsOptions = {
  origin: function (origin, callback) {
    // Permitir solicitudes sin origen (como apps móviles o curl)
    if (!origin) return callback(null, true);
    if (
      whitelist.indexOf(origin) !== -1 ||
      origin.includes("ngrok") ||
      origin.includes("localtunnel")
    ) {
      callback(null, true);
    } else {
      callback(new Error("No permitido por CORS"));
    }
  },
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());

// ─────────────────────────────────────────────────────────────────────
// Middleware: invalida el índice del buscador en cualquier escritura
// (POST, PUT, DELETE) para que los nuevos archivos aparezcan al instante
// ─────────────────────────────────────────────────────────────────────
const UniversalCrawler = require("./src/models/universalCrawler");
app.use("/api", (req, res, next) => {
  if (["POST", "PUT", "DELETE"].includes(req.method)) {
    // 1) Global Auth Middleware: Proteger todas las acciones mutables
    if (!req.path.startsWith("/auth") && (!req.session || !req.session.userId)) {
      return res.status(401).json({
        success: false,
        message: "Acceso denegado. Se requiere iniciar sesión como Administrador.",
      });
    }

    // 2) Cache/Crawler invalidation injection
    const originalJson = res.json.bind(res);
    res.json = (body) => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        UniversalCrawler.invalidate();
      }
      return originalJson(body);
    };
  }
  next();
});

app.use(express.static(path.join(__dirname, "./")));
app.use("/data", express.static(path.join(__dirname, "data")));

// API Routes
app.get("/api/test-server", (req, res) =>
  res.json({ status: "ok", time: new Date() }),
);
app.use("/api/informe-gestion", require("./src/routes/informeGestionRoutes"));
console.log("✅ Rutas de servidor cargadas");

app.use("/api/news", newsRoutes);
app.use("/api/agenda", require("./src/routes/agendaRoutes"));
app.use("/api/politicas-sgi", require("./src/routes/sgiPoliticasRoutes"));
app.use("/api/sgi", require("./src/routes/sgiRoutes"));
app.use("/api/respel", require("./src/routes/respelRoutes"));
app.use("/api/rua", require("./src/routes/ruaRoutes"));
app.use("/api/boletines", require("./src/routes/boletinesRoutes"));
app.use("/api/pcb", require("./src/routes/pcbRoutes"));
app.use("/api/manuales-sgi", require("./src/routes/manualesRoutes"));
app.use("/api/cita", require("./src/routes/citaRoutes"));
app.use("/api/sirh", require("./src/routes/sirhRoutes"));
app.use("/api/revision-red", require("./src/routes/revisionRedRoutes"));
app.use("/api/snif", require("./src/routes/snifRoutes"));
app.use("/api/manual-funciones", require("./src/routes/manualFuncionesRoutes"));
app.use("/api/plan-monitoreo", require("./src/routes/planMonitoreoRoutes"));
app.use("/api/planes-talento", require("./src/routes/planesTalentoRoutes"));
app.use("/api/convocatorias", require("./src/routes/convocatoriasRoutes"));
app.use(
  "/api/estudios-tecnicos",
  require("./src/routes/estudiosTecnicosRoutes"),
);
app.use(
  "/api/provision-empleos",
  require("./src/routes/provisionEmpleosRoutes"),
);
app.use("/api/banner", require("./src/routes/bannerRoutes"));
app.use("/api/eventos", require("./src/routes/eventosRoutes"));
app.use("/api/directorio", require("./src/routes/directorioRoutes"));
app.use("/api/search", require("./src/routes/searchRoutes"));
app.use("/api/auth", require("./src/routes/authRoutes"));
app.use("/api/users", require("./src/routes/userRoutes"));

// Middleware para asegurar endpoints sensibles
const superadminOnly = (req, res, next) => {
  if (req.session && req.session.role === "superadmin") {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: "Acceso denegado. Se requiere ser Super Administrador.",
    });
  }
};

app.get("/api/debug/error", superadminOnly, (req, res) => {
  const logPath = path.join(__dirname, "error_log.txt");
  if (fs.existsSync(logPath)) {
    res.sendFile(logPath);
  } else {
    res.send("No hay logs de error.");
  }
});

app.use((err, req, res, next) => {
  const errorMsg = `[${new Date().toISOString()}] ${err.stack}\n`;
  fs.appendFileSync(path.join(__dirname, "error_log.txt"), errorMsg);
  res
    .status(500)
    .json({ message: "Error interno del servidor.", error: err.message });
});

app.get("/administrador", (req, res) => res.redirect("/administracion"));

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Servidor CAS corriendo en http://localhost:${PORT}`);
    console.log(
      `Panel de administración en http://localhost:${PORT}/administracion`,
    );
  });
}

module.exports = app;

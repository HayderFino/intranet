const request = require('supertest');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

// Asumimos que has modificado server.js para exportar app
// y que usas una DB de testing local
process.env.NODE_ENV = 'test';
process.env.MONGO_URI = 'mongodb://127.0.0.1:27017/intranet_cas_test'; // Evitar tocar prod

const app = require('../server');

describe('Integration Tests - Módulos (news, cita, sgi, search)', () => {
    
    // Conectar a MongoDB antes de los tests
    beforeAll(async () => {
        // En caso de que Mongoose no esté ya conectado por server.js
        if(mongoose.connection.readyState === 0){
            await mongoose.connect(process.env.MONGO_URI);
        }
    });

    // Cerrar conexiones después
    afterAll(async () => {
        await mongoose.connection.close();
    });

    describe('Módulo: News', () => {
        it('debería retornar el feed de noticias correctamente sin errores (status 200)', async () => {
            const res = await request(app).get('/api/news');
            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body)).toBeTruthy();
        });
    });

    describe('Módulo: CITA', () => {
        it('debería retornar datos del módulo CITA', async () => {
            const res = await request(app).get('/api/cita');
            expect(res.statusCode).toBe(200);
            // La mayoría de los módulos retornan una lista al hacer GET al bucket
            expect(Array.isArray(res.body)).toBeTruthy();
        });
    });

    describe("Módulo: SGI", () => {
        it("debería retornar el árbol de carpetas de sgi para planeacion", async () => {
            const res = await request(app).get("/api/sgi/planeacion");
            expect(res.statusCode).toBe(200);
        });
    });

    describe('Módulo: Search (Buscador Global)', () => {
        it("debería responder búsquedas y el endpoint debe existir", async () => {
            const res = await request(app).get("/api/search?q=test");
            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body)).toBeTruthy();
        });
    });

    describe('Integración Estática - HTML Layout', () => {
        it('el index.html principal debe cargar correctamente con los contenedores requeridos', async () => {
            const indexPath = path.join(__dirname, '../index.html');
            const htmlContent = fs.readFileSync(indexPath, 'utf-8');
            
            // Verificamos que los IDs esperados por el frontend (JS) no se hayan modificado/borrado accidentalmente
            expect(htmlContent).toContain('id="banner-container"');
            expect(htmlContent).toContain('id="news-grid-main"');     
            expect(htmlContent).toContain('id="recent-activity-feed"');     
        });

        it("la página de busqueda.html debe existir y contener los contenedores lógicos", async () => {
            const searchPath = path.join(__dirname, "../herramientas/busqueda.html");
            if (fs.existsSync(searchPath)) {
                const htmlContent = fs.readFileSync(searchPath, "utf-8");
                expect(htmlContent).toContain('id="resultsList"');
            }
        });
    });
});

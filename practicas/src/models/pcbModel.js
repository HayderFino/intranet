const fs = require('fs');
const path = require('path');

const PCB_HTML_PATH = path.join(__dirname, '../../herramientas/pcb.html');
const PCB_DATA_DIR = path.join(process.cwd(), 'data/Herramientas/pcb/Documentos Inventario PCB');

/**
 * Extrae el contenido de la sección pdf-grid hasta el marcador END_PCB_GRID
 * y la divide en cards individuales usando la apertura de <div class="pdf-folder-card".
 * Esto evita problemas con regex que buscan </div></div> anidados.
 */
function extractCards(gridContent) {
    const items = [];
    // Partir por inicio de cada card
    const parts = gridContent.split(/<div class="pdf-folder-card"/);
    // El primer elemento es texto antes de la primera card (lo ignoramos)
    for (let i = 1; i < parts.length; i++) {
        const chunk = parts[i]; // comienza en data-id="..." ...>  ...  </div>
        const idMatch = /data-id="([^"]*)"/.exec(chunk);
        const titleMatch = /<h4>([\s\S]*?)<\/h4>/.exec(chunk);
        // Tomar el ÚLTIMO href en el chunk (el del botón Ver PDF, no el SVG)
        const allHrefs = [...chunk.matchAll(/href="([^"]*)"/g)];
        const hrefVal = allHrefs.length > 0 ? allHrefs[allHrefs.length - 1][1] : '#';

        if (idMatch) {
            items.push({
                id: idMatch[1],
                title: titleMatch ? titleMatch[1].trim() : '',
                href: hrefVal
            });
        }
    }
    return items;
}

const PcbModel = {
    getAll: () => {
        if (!fs.existsSync(PCB_HTML_PATH)) return [];
        const content = fs.readFileSync(PCB_HTML_PATH, 'utf8');

        const gridRegex = /<div class="pdf-grid">([\s\S]*?)<!-- END_PCB_GRID -->/;
        const gridMatch = gridRegex.exec(content);
        if (!gridMatch) {
            console.error('[PCB] Marcador END_PCB_GRID no encontrado en pcb.html');
            return [];
        }
        return extractCards(gridMatch[1]);
    },

    create: (data) => {
        if (!fs.existsSync(PCB_HTML_PATH)) return null;
        let content = fs.readFileSync(PCB_HTML_PATH, 'utf8');
        const id = Date.now().toString();

        const newCard = `
                    <div class="pdf-folder-card" data-id="${id}">
                        <div class="file-icon">
                            <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor">
                                <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
                            </svg>
                        </div>
                        <h4>${data.title}</h4>
                        <a href="${data.fileUrl || '#'}" target="_blank" class="btn-pdf-download">Ver PDF</a>
                    </div>`;

        content = content.replace(
            '<!-- END_PCB_GRID -->',
            newCard + '\n                <!-- END_PCB_GRID -->'
        );
        fs.writeFileSync(PCB_HTML_PATH, content, 'utf8');
        return id;
    },

    delete: (id) => {
        if (!fs.existsSync(PCB_HTML_PATH)) return false;
        let content = fs.readFileSync(PCB_HTML_PATH, 'utf8');

        // Estrategia: partir el contenido en las cards, eliminar la que tiene el id
        // y reconstruir la sección pdf-grid
        const gridRegex = /(<div class="pdf-grid">)([\s\S]*?)(<!-- END_PCB_GRID -->)/;
        const gridMatch = gridRegex.exec(content);
        if (!gridMatch) return false;

        const gridContent = gridMatch[2];
        const parts = gridContent.split(/<div class="pdf-folder-card"/);
        const targetTag = `data-id="${id}"`;

        let found = false;
        const newParts = parts.filter((p, i) => {
            if (i === 0) return true; // texto previo, mantener
            if (p.includes(targetTag)) {
                // Intentar borrar el archivo físico
                const allHrefs = [...p.matchAll(/href="([^"]*)"/g)];
                const hrefVal = allHrefs.length > 0 ? allHrefs[allHrefs.length - 1][1] : '';
                if (hrefVal && hrefVal !== '#') {
                    try {
                        const abs = path.join(PCB_DATA_DIR, path.basename(hrefVal));
                        if (fs.existsSync(abs)) fs.unlinkSync(abs);
                    } catch (e) { /* ignorar */ }
                }
                found = true;
                return false; // eliminar esta card
            }
            return true;
        });

        if (!found) return false;

        // Reconstruir: las parts que no son la primera deben llevar el tag de apertura
        const newGrid = newParts
            .map((p, i) => i === 0 ? p : `<div class="pdf-folder-card"${p}`)
            .join('');

        content = content.replace(gridContent, newGrid);
        fs.writeFileSync(PCB_HTML_PATH, content, 'utf8');
        return true;
    },

    update: (id, data) => {
        const items = PcbModel.getAll();
        const existing = items.find(i => i.id === id);
        if (!existing) return null;
        if (!data.fileUrl || data.fileUrl === '#') data.fileUrl = existing.href;
        if (PcbModel.delete(id)) return PcbModel.create(data);
        return null;
    }
};

module.exports = PcbModel;

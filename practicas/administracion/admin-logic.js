document.addEventListener('DOMContentLoaded', () => {
    // Sync initial state
    loadNewsList();

    // --- UI Elements ---
    const toast = document.getElementById('toast');
    const sections = {
        newsForm: document.getElementById('newsFormSection'),
        newsList: document.getElementById('newsListSection'),
        agenda: document.getElementById('agendaSection'),
        sgi: document.getElementById('sgiSection'),
        dashboard: document.getElementById('dashboardSection'),
        preview: document.getElementById('previewArea')
    };

    const navItems = {
        dashboard: document.getElementById('nav-dashboard'),
        newNews: document.getElementById('nav-new-news'),
        listNews: document.getElementById('nav-list-news'),
        agenda: document.getElementById('nav-agenda'),
        sgi: document.getElementById('nav-sgi'),
        mejora: document.getElementById('nav-mejora')
    };

    // --- Navigation Logic ---
    function hideAll() {
        Object.values(sections).forEach(sec => sec.classList.add('hidden'));
        Object.values(navItems).forEach(nav => nav.classList.remove('active'));
    }

    navItems.dashboard.onclick = () => { hideAll(); sections.dashboard.classList.remove('hidden'); navItems.dashboard.classList.add('active'); updateStats(); };
    navItems.newNews.onclick = () => { hideAll(); sections.newsForm.classList.remove('hidden'); navItems.newNews.classList.add('active'); };
    navItems.listNews.onclick = () => { hideAll(); sections.newsList.classList.remove('hidden'); navItems.listNews.classList.add('active'); loadNewsList(); };
    navItems.agenda.onclick = () => { hideAll(); sections.agenda.classList.remove('hidden'); navItems.agenda.classList.add('active'); loadAgendaList(); };

    navItems.sgi.onclick = () => {
        hideAll();
        sections.sgi.classList.remove('hidden');
        navItems.sgi.classList.add('active');
        switchSgiSection('planeacion');
    };

    navItems.mejora.onclick = () => {
        hideAll();
        sections.sgi.classList.remove('hidden');
        navItems.mejora.classList.add('active');
        switchSgiSection('mejora');
    };

    navItems.respel = document.getElementById('nav-respel');
    sections.respel = document.getElementById('respelSection');

    navItems.respel.onclick = () => {
        hideAll();
        sections.respel.classList.remove('hidden');
        navItems.respel.classList.add('active');
        switchRespelSection('documentos');
    };

    navItems.rua = document.getElementById('nav-rua');
    sections.rua = document.getElementById('ruaSection');

    navItems.rua.onclick = () => {
        hideAll();
        sections.rua.classList.remove('hidden');
        navItems.rua.classList.add('active');
        loadRuaList();
    };

    navItems.boletines = document.getElementById('nav-boletines');
    sections.boletines = document.getElementById('boletinesSection');

    navItems.boletines.onclick = () => {
        hideAll();
        sections.boletines.classList.remove('hidden');
        navItems.boletines.classList.add('active');
        loadBoletinesList();
    };

    // --- Respel Logic ---
    const respelForm = document.getElementById('respelForm');
    const respelItemsList = document.getElementById('respelItemsList');
    const respelEditId = document.getElementById('respelEditId');
    const respelCurrentSection = document.getElementById('respelCurrentSection');
    const respelTabButtons = document.querySelectorAll('.respel-tab');

    let loadedRespelItems = [];

    function switchRespelSection(section) {
        respelCurrentSection.value = section;
        respelTabButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.target === section));

        // Update labels and show/hide fields
        const isEmpresas = section === 'empresas';
        document.getElementById('respelNameLabel').innerText = isEmpresas ? 'Nombre de la Empresa' : 'Nombre del Documento';
        document.getElementById('respelName').placeholder = isEmpresas ? 'Ej: Geoambiental LTDA.' : 'Ej: Manual de Residuos';
        document.getElementById('respelEmpresasFields').classList.toggle('hidden', !isEmpresas);

        cancelRespelEdit();
        loadRespelList();
    }

    respelTabButtons.forEach(btn => {
        btn.onclick = () => switchRespelSection(btn.dataset.target);
    });

    async function loadRespelList() {
        const section = respelCurrentSection.value;
        respelItemsList.innerHTML = '<p style="padding: 1rem;">Cargando listado...</p>';
        try {
            const res = await fetch(`/api/respel/${section}`);
            loadedRespelItems = await res.json();
            renderRespelList();
            updateStats();
        } catch (error) {
            showToast('Error al cargar items', 'error');
        }
    }

    function renderRespelList() {
        const section = respelCurrentSection.value;
        if (loadedRespelItems.length === 0) {
            respelItemsList.innerHTML = '<p style="padding: 1rem; color: #64748b;">No hay registros encontrados.</p>';
            return;
        }

        respelItemsList.innerHTML = '';
        loadedRespelItems.forEach(item => {
            const card = document.createElement('div');
            card.className = 'news-manage-card';

            let infoHtml = `<h4>${item.name}</h4><p style="font-size: 0.8rem; color: #64748b;">${item.href}</p>`;
            if (section === 'empresas') {
                infoHtml = `<h4>${item.name}</h4><p style="font-size: 0.8rem; color: #64748b;">Acto: ${item.actNum} (${item.actDate}) - ${item.fileName}</p>`;
            }

            card.innerHTML = `
                <div class="news-info">${infoHtml}</div>
                <div class="card-actions">
                    <button class="btn-secondary btn-edit" data-id="${item.id}">Editar</button>
                    <button class="btn-delete" data-id="${item.id}">Eliminar</button>
                </div>
            `;
            respelItemsList.appendChild(card);
        });

        respelItemsList.querySelectorAll('.btn-delete').forEach(btn => {
            btn.onclick = () => deleteRespelItem(btn.dataset.id);
        });

        respelItemsList.querySelectorAll('.btn-edit').forEach(btn => {
            btn.onclick = () => startRespelEdit(loadedRespelItems.find(i => i.id === btn.dataset.id));
        });
    }

    function startRespelEdit(item) {
        if (!item) return;
        respelEditId.value = item.id;
        document.getElementById('respelName').value = item.name;

        if (respelCurrentSection.value === 'empresas') {
            document.getElementById('respelActNum').value = item.actNum || '';
            document.getElementById('respelActDate').value = item.actDate || '';
            document.getElementById('respelFileName').value = item.fileName || '';
        }

        document.getElementById('respelSaveBtn').innerText = 'Actualizar Item';
        document.getElementById('respelCancelEditBtn').classList.remove('hidden');
        respelForm.setAttribute('data-current-url', item.href);
        respelForm.scrollIntoView({ behavior: 'smooth' });
    }

    function cancelRespelEdit() {
        respelForm.reset();
        respelEditId.value = '';
        document.getElementById('respelSaveBtn').innerText = 'Guardar Item';
        document.getElementById('respelCancelEditBtn').classList.add('hidden');
    }

    document.getElementById('respelCancelEditBtn').onclick = cancelRespelEdit;

    respelForm.onsubmit = async (e) => {
        e.preventDefault();
        const section = respelCurrentSection.value;
        const id = respelEditId.value;
        const fileInput = document.getElementById('respelFile');
        const file = fileInput.files[0];
        let fileUrl = respelForm.getAttribute('data-current-url') || '#';

        showToast(id ? 'Actualizando...' : 'Guardando...', 'info');

        try {
            if (file) {
                const fd = new FormData();
                fd.append('section', section);
                fd.append('file', file);
                const upRes = await fetch('/api/respel/upload', { method: 'POST', body: fd });
                const upData = await upRes.json();
                fileUrl = upData.fileUrl;
            }

            const payload = {
                name: document.getElementById('respelName').value,
                fileUrl: fileUrl
            };

            if (section === 'empresas') {
                payload.actNum = document.getElementById('respelActNum').value;
                payload.actDate = document.getElementById('respelActDate').value;
                payload.fileName = document.getElementById('respelFileName').value;
                payload.isAlternate = loadedRespelItems.length % 2 === 1; // Basic zebra striping for new items
            }

            const method = id ? 'PUT' : 'POST';
            const url = id ? `/api/respel/${section}/${id}` : `/api/respel/${section}`;

            const res = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                showToast(id ? 'Actualizado' : 'Guardado');
                cancelRespelEdit();
                loadRespelList();
            } else {
                showToast('Error al guardar', 'error');
            }
        } catch (error) {
            showToast('Error en el proceso', 'error');
        }
    };

    async function deleteRespelItem(id) {
        if (!confirm('¿Eliminar este registro? El archivo físico también se borrará.')) return;
        const section = respelCurrentSection.value;
        try {
            const res = await fetch(`/api/respel/${section}/${id}`, { method: 'DELETE' });
            if (res.ok) {
                showToast('Eliminado');
                loadRespelList();
            }
        } catch (e) { showToast('Error al eliminar', 'error'); }
    }

    // --- RUA Logic ---
    const ruaForm = document.getElementById('ruaForm');
    const ruaItemsList = document.getElementById('ruaItemsList');
    const ruaEditId = document.getElementById('ruaEditId');
    let loadedRuaItems = [];

    async function loadRuaList() {
        ruaItemsList.innerHTML = '<p style="padding: 1rem;">Cargando listado RUA...</p>';
        try {
            const res = await fetch('/api/rua');
            loadedRuaItems = await res.json();
            renderRuaList();
            updateStats();
        } catch (error) {
            showToast('Error al cargar RUA', 'error');
        }
    }

    function renderRuaList() {
        if (loadedRuaItems.length === 0) {
            ruaItemsList.innerHTML = '<p style="padding: 1rem; color: #64748b;">No hay registros RUA.</p>';
            return;
        }

        ruaItemsList.innerHTML = '';
        loadedRuaItems.forEach(item => {
            const card = document.createElement('div');
            card.className = 'news-manage-card';
            card.innerHTML = `
                <div class="news-info">
                    <h4>${item.name}</h4>
                    <p style="font-size:0.8rem; color:#64748b;">${item.href}</p>
                </div>
                <div class="card-actions">
                    <button class="btn-secondary btn-edit" data-id="${item.id}">Editar</button>
                    <button class="btn-delete" data-id="${item.id}">Eliminar</button>
                </div>
            `;
            ruaItemsList.appendChild(card);
        });

        ruaItemsList.querySelectorAll('.btn-delete').forEach(btn => {
            btn.onclick = () => deleteRuaItem(btn.dataset.id);
        });
        ruaItemsList.querySelectorAll('.btn-edit').forEach(btn => {
            btn.onclick = () => startRuaEdit(loadedRuaItems.find(i => i.id === btn.dataset.id));
        });
    }

    function startRuaEdit(item) {
        if (!item) return;
        ruaEditId.value = item.id;
        document.getElementById('ruaName').value = item.name;
        document.getElementById('ruaSaveBtn').innerText = 'Actualizar Item';
        document.getElementById('ruaCancelEditBtn').classList.remove('hidden');
        ruaForm.setAttribute('data-current-url', item.href);
    }

    function cancelRuaEdit() {
        ruaForm.reset();
        ruaEditId.value = '';
        document.getElementById('ruaSaveBtn').innerText = 'Guardar Item';
        document.getElementById('ruaCancelEditBtn').classList.add('hidden');
    }

    document.getElementById('ruaCancelEditBtn').onclick = cancelRuaEdit;

    ruaForm.onsubmit = async (e) => {
        e.preventDefault();
        const id = ruaEditId.value;
        const fileInput = document.getElementById('ruaFile');
        const file = fileInput.files[0];
        let fileUrl = ruaForm.getAttribute('data-current-url') || '#';

        showToast(id ? 'Actualizando...' : 'Guardando...', 'info');

        try {
            if (file) {
                const fd = new FormData();
                fd.append('file', file);
                const upRes = await fetch('/api/rua/upload', { method: 'POST', body: fd });
                const upData = await upRes.json();
                fileUrl = upData.fileUrl;
            }

            const payload = {
                name: document.getElementById('ruaName').value,
                fileUrl: fileUrl
            };

            const method = id ? 'PUT' : 'POST';
            const url = id ? `/api/rua/${id}` : '/api/rua';

            const res = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                showToast(id ? 'Actualizado' : 'Guardado');
                cancelRuaEdit();
                loadRuaList();
            } else {
                showToast('Error al guardar', 'error');
            }
        } catch (error) {
            showToast('Error en el proceso', 'error');
        }
    };

    async function deleteRuaItem(id) {
        if (!confirm('¿Eliminar este registro RUA?')) return;
        try {
            const res = await fetch(`/api/rua/${id}`, { method: 'DELETE' });
            if (res.ok) {
                showToast('Eliminado');
                loadRuaList();
            }
        } catch (e) { showToast('Error al eliminar', 'error'); }
    }

    // --- Boletines GIT Logic ---
    const boletinesForm = document.getElementById('boletinesForm');
    const boletinesItemsList = document.getElementById('boletinesItemsList');
    const boletinesEditId = document.getElementById('boletinesEditId');
    let loadedBoletinesItems = [];

    async function loadBoletinesList() {
        boletinesItemsList.innerHTML = '<p style="padding: 1rem;">Cargando boletines...</p>';
        try {
            const res = await fetch('/api/boletines');
            loadedBoletinesItems = await res.json();
            renderBoletinesList();
        } catch (error) {
            showToast('Error al cargar boletines', 'error');
        }
    }

    function renderBoletinesList() {
        if (loadedBoletinesItems.length === 0) {
            boletinesItemsList.innerHTML = '<p style="padding: 1rem; color: #64748b;">No hay boletines registrados.</p>';
            return;
        }
        boletinesItemsList.innerHTML = '';
        loadedBoletinesItems.forEach(item => {
            const card = document.createElement('div');
            card.className = 'news-manage-card';
            card.innerHTML = `
                <div class="news-info">
                    <h4>${item.title}</h4>
                    <p style="font-size:0.8rem; color:#64748b;">${item.subtitle || ''} &nbsp;|&nbsp; <a href="${item.href}" target="_blank" style="color:#2e7d32;">Ver archivo</a></p>
                </div>
                <div class="card-actions">
                    <button class="btn-secondary btn-edit" data-id="${item.id}">Editar</button>
                    <button class="btn-delete" data-id="${item.id}">Eliminar</button>
                </div>
            `;
            boletinesItemsList.appendChild(card);
        });

        boletinesItemsList.querySelectorAll('.btn-delete').forEach(btn => {
            btn.onclick = () => deleteBoletinItem(btn.dataset.id);
        });
        boletinesItemsList.querySelectorAll('.btn-edit').forEach(btn => {
            btn.onclick = () => startBoletinEdit(loadedBoletinesItems.find(i => i.id === btn.dataset.id));
        });
    }

    function startBoletinEdit(item) {
        if (!item) return;
        boletinesEditId.value = item.id;
        document.getElementById('boletinesTitle').value = item.title;
        document.getElementById('boletinesSubtitle').value = item.subtitle || '';
        document.getElementById('boletinesSaveBtn').innerText = 'Actualizar Boletín';
        document.getElementById('boletinesCancelEditBtn').classList.remove('hidden');
        boletinesForm.setAttribute('data-current-url', item.href);
    }

    function cancelBoletinEdit() {
        boletinesForm.reset();
        boletinesEditId.value = '';
        document.getElementById('boletinesSaveBtn').innerText = 'Guardar Boletín';
        document.getElementById('boletinesCancelEditBtn').classList.add('hidden');
    }

    document.getElementById('boletinesCancelEditBtn').onclick = cancelBoletinEdit;

    boletinesForm.onsubmit = async (e) => {
        e.preventDefault();
        const id = boletinesEditId.value;
        const fileInput = document.getElementById('boletinesFile');
        const file = fileInput.files[0];
        let fileUrl = boletinesForm.getAttribute('data-current-url') || '#';

        showToast(id ? 'Actualizando...' : 'Guardando...', 'info');
        try {
            if (file) {
                const fd = new FormData();
                fd.append('file', file);
                const upRes = await fetch('/api/boletines/upload', { method: 'POST', body: fd });
                const upData = await upRes.json();
                fileUrl = upData.fileUrl;
            }

            const payload = {
                title: document.getElementById('boletinesTitle').value,
                subtitle: document.getElementById('boletinesSubtitle').value,
                fileUrl
            };

            const method = id ? 'PUT' : 'POST';
            const url = id ? `/api/boletines/${id}` : '/api/boletines';
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                showToast(id ? 'Boletín actualizado' : 'Boletín guardado');
                cancelBoletinEdit();
                loadBoletinesList();
            } else {
                showToast('Error al guardar', 'error');
            }
        } catch (error) {
            showToast('Error en el proceso', 'error');
        }
    };

    async function deleteBoletinItem(id) {
        if (!confirm('¿Eliminar este boletín? El archivo físico también se borrará.')) return;
        try {
            const res = await fetch(`/api/boletines/${id}`, { method: 'DELETE' });
            if (res.ok) {
                showToast('Boletín eliminado');
                loadBoletinesList();
            }
        } catch (e) { showToast('Error al eliminar', 'error'); }
    }

    // --- News Logic ---
    // ... rest of the file ...
    const sgiForm = document.getElementById('sgiForm');
    const sgiItemsList = document.getElementById('sgiItemsList');
    const sgiEditId = document.getElementById('sgiEditId');
    const sgiCurrentSection = document.getElementById('sgiCurrentSection');
    const sgiCategory = document.getElementById('sgiCategory');
    const sgiSaveBtn = document.getElementById('sgiSaveBtn');
    const sgiCancelEditBtn = document.getElementById('sgiCancelEditBtn');
    const sgiSubtitle = document.getElementById('sgiSubtitle');
    const sgiFilterCategory = document.getElementById('sgiFilterCategory');
    const sgiTabButtons = document.querySelectorAll('.tab-btn');

    let loadedSgiItems = [];

    // --- Stats Logic ---
    async function updateStats() {
        try {
            const [newsR, agendaR, planeacionR, mejoraR, respelR, empresasR, ruaR] = await Promise.all([
                fetch('/api/news'),
                fetch('/api/agenda'),
                fetch('/api/sgi/planeacion'),
                fetch('/api/sgi/mejora'),
                fetch('/api/respel/documentos'),
                fetch('/api/respel/empresas'),
                fetch('/api/rua')
            ]);

            const news = await newsR.json();
            const agenda = await agendaR.json();
            const planeacion = await planeacionR.json();
            const mejora = await mejoraR.json();
            const respel = await respelR.json();
            const empresas = await empresasR.json();
            const rua = await ruaR.json();

            document.getElementById('stat-news-count').textContent = news.length;
            document.getElementById('stat-agenda-count').textContent = agenda.length;
            document.getElementById('stat-sgi-count').textContent = planeacion.length + mejora.length;
            document.getElementById('stat-respel-count').textContent = respel.length;
            document.getElementById('stat-empresas-count').textContent = empresas.length;
            document.getElementById('stat-rua-count').textContent = rua.length;
            document.getElementById('stat-last-update').textContent = new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
        } catch (e) {
            console.error('Error updating stats', e);
        }
    }

    // Initial call
    updateStats();

    const SGI_CATEGORIES = {
        'planeacion': ['Anexos', 'Caracterización', 'Formatos', 'Instructivo', 'Manuales', 'Mapa de riesgos', 'Procedimientos', 'Registros', 'Mejora Continua'],
        'mejora': ['Caracterización', 'Formatos', 'Instructivos', 'Mapa de Riesgos', 'Procedimientos']
    };

    function switchSgiSection(section) {
        sgiCurrentSection.value = section;
        sgiSubtitle.innerText = `Administra los documentos de ${section === 'planeacion' ? 'Planeación Estratégica' : 'Mejora Continua'}.`;

        // Update Tabs UI
        sgiTabButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.target === section);
        });

        // Update Categories Select & Filter Select
        const optionsHtml = SGI_CATEGORIES[section].map(cat => `<option value="${cat}">${cat}</option>`).join('');
        const filterOptionsHtml = `<option value="all">Todas las categor&iacute;as</option>` + optionsHtml;

        sgiCategory.innerHTML = optionsHtml;
        sgiFilterCategory.innerHTML = filterOptionsHtml;

        // Reset Form
        cancelSgiEdit();
        loadSgiList();
    }

    sgiFilterCategory.onchange = () => renderSgiList();

    sgiTabButtons.forEach(btn => {
        btn.onclick = () => switchSgiSection(btn.dataset.target);
    });

    async function loadSgiList() {
        const section = sgiCurrentSection.value;
        sgiItemsList.innerHTML = '<p style="padding: 1rem;">Cargando documentos...</p>';
        try {
            const res = await fetch(`/api/sgi/${section}`);
            loadedSgiItems = await res.json();
            renderSgiList();
        } catch (error) {
            showToast('Error al cargar items', 'error');
        }
    }

    function renderSgiList() {
        const filter = sgiFilterCategory.value;
        const filteredData = filter === 'all'
            ? loadedSgiItems
            : loadedSgiItems.filter(item => item.category === filter);

        if (filteredData.length === 0) {
            sgiItemsList.innerHTML = `<p style="padding: 1rem; color: #64748b;">No hay documentos ${filter !== 'all' ? `en la categoría "${filter}"` : 'en esta sección'}.</p>`;
            return;
        }

        sgiItemsList.innerHTML = '';
        filteredData.forEach(item => {
            const card = document.createElement('div');
            card.className = 'news-manage-card';
            card.innerHTML = `
                <div class="news-info">
                    <span class="category-tag" style="background: #e2e8f0; padding: 2px 8px; border-radius: 4px; font-size: 0.7rem;">${item.category}</span>
                    <h4>${item.name}</h4>
                    <p style="font-size: 0.8rem; color: #64748b; word-break: break-all;">${item.href}</p>
                </div>
                <div class="card-actions" style="display: flex; gap: 0.5rem; flex-shrink: 0;">
                    <button class="btn-secondary btn-edit" data-id="${item.id}" style="padding: 5px 10px; font-size: 0.8rem;">Editar</button>
                    <button class="btn-delete" data-id="${item.id}" style="padding: 5px 10px; font-size: 0.8rem;">Eliminar</button>
                </div>
            `;
            sgiItemsList.appendChild(card);
        });

        sgiItemsList.querySelectorAll('.btn-delete').forEach(btn => {
            btn.onclick = () => deleteSgiItem(btn.dataset.id);
        });

        sgiItemsList.querySelectorAll('.btn-edit').forEach(btn => {
            btn.onclick = () => startSgiEdit(loadedSgiItems.find(i => i.id === btn.dataset.id));
        });
    }

    function startSgiEdit(item) {
        if (!item) return;
        document.getElementById('sgiTitle').value = item.name;
        sgiCategory.value = item.category;
        sgiEditId.value = item.id;
        sgiSaveBtn.innerText = 'Actualizar Documento';
        sgiCancelEditBtn.classList.remove('hidden');
        document.getElementById('sgiFile').required = false;
        sgiForm.setAttribute('data-current-url', item.href);
        sgiForm.scrollIntoView({ behavior: 'smooth' });
    }

    function cancelSgiEdit() {
        sgiForm.reset();
        sgiEditId.value = '';
        sgiSaveBtn.innerText = 'Guardar Documento';
        sgiCancelEditBtn.classList.add('hidden');
        document.getElementById('sgiFile').required = true;
    }

    sgiCancelEditBtn.onclick = cancelSgiEdit;

    sgiForm.onsubmit = async (e) => {
        e.preventDefault();
        const section = sgiCurrentSection.value;
        const id = sgiEditId.value;
        const name = document.getElementById('sgiTitle').value;
        const category = sgiCategory.value;
        const fileInput = document.getElementById('sgiFile');
        const file = fileInput.files[0];
        let fileUrl = sgiForm.getAttribute('data-current-url');

        if (!id && !file) return showToast('Selecciona un archivo', 'error');

        showToast(id ? 'Actualizando...' : 'Subiendo...', 'info');

        try {
            if (file) {
                const fd = new FormData();
                fd.append('section', section);
                fd.append('category', category);
                fd.append('file', file);

                const upRes = await fetch('/api/sgi/upload', { method: 'POST', body: fd });
                if (!upRes.ok) {
                    const errorText = await upRes.text();
                    let errorMessage = 'Error al subir el archivo al servidor.';
                    try {
                        const errorJson = JSON.parse(errorText);
                        errorMessage = errorJson.message || errorMessage;
                    } catch (e) { }
                    throw new Error(errorMessage);
                }
                const upData = await upRes.json();
                fileUrl = upData.fileUrl;
            }

            const method = id ? 'PUT' : 'POST';
            const url = id ? `/api/sgi/${section}/${id}` : `/api/sgi/${section}`;

            const res = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, category, fileUrl })
            });

            if (res.ok) {
                showToast(id ? 'Actualizado' : 'Guardado');
                cancelSgiEdit();
                loadSgiList();
            } else {
                const err = await res.json();
                showToast(err.message, 'error');
            }
        } catch (error) {
            showToast('Error en el proceso', 'error');
        }
    };

    async function deleteSgiItem(id) {
        if (!confirm('¿Eliminar documento?')) return;
        const section = sgiCurrentSection.value;
        try {
            const res = await fetch(`/api/sgi/${section}/${id}`, { method: 'DELETE' });
            if (res.ok) {
                showToast('Eliminado');
                loadSgiList();
            }
        } catch (e) { showToast('Error al eliminar', 'error'); }
    }

    // --- News Logic ---
    async function loadNewsList() {
        const newsItemsList = document.getElementById('newsItemsList');
        newsItemsList.innerHTML = '<p>Cargando noticias...</p>';
        try {
            const res = await fetch('/api/news');
            const news = await res.json();

            // Actualizar el contador de noticias en el Dashboard
            const statValue = document.querySelector('.stat-value');
            if (statValue) statValue.textContent = news.length;

            newsItemsList.innerHTML = news.length ? '' : '<p style="padding: 1.5rem;">No hay noticias guardadas en el sistema JSON.</p>';
            news.forEach(item => {
                const card = document.createElement('div');
                card.className = 'news-manage-card';
                card.innerHTML = `
                    <img src="${item.imageUrl}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;">
                    <div class="news-info" style="flex: 1; margin-left: 1rem; overflow: hidden;">
                        <h4 style="margin: 0;">${item.title}</h4>
                        <p style="font-size: 0.8rem; color: #64748b; margin: 2px 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${item.description}</p>
                        <span style="font-size: 0.7rem; background: #e2e8f0; padding: 2px 6px; border-radius: 4px;">${item.category || 'General'}</span>
                    </div>
                    <button class="btn-delete" onclick="deleteNews('${item.id}')">Eliminar</button>
                `;
                newsItemsList.appendChild(card);
            });
        } catch (e) { showToast('Error al cargar noticias', 'error'); }
    }

    window.deleteNews = async (id) => {
        if (!confirm('¿Eliminar noticia?')) return;
        await fetch(`/api/news/${id}`, { method: 'DELETE' });
        loadNewsList();
        showToast('Eliminada');
    };

    // --- Preview dinámico de imagen seleccionada ---
    const imageInput = document.getElementById('imageInput');
    const previewArea = document.getElementById('previewArea');
    const previewCard = document.getElementById('previewCard');

    imageInput.addEventListener('change', () => {
        const file = imageInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                showPreview(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    });

    const previewBtn = document.getElementById('previewBtn');
    previewBtn.onclick = () => {
        const title = document.getElementById('title').value || 'Título de ejemplo';
        const description = document.getElementById('description').value || 'Descripción del contenido...';
        const category = document.getElementById('category').value;
        const file = imageInput.files[0];

        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                showPreview(e.target.result, title, description, category);
            };
            reader.readAsDataURL(file);
        } else {
            showPreview('../data/imagenes/placeholder.jpeg', title, description, category);
        }
    };

    function showPreview(imgSrc, title = '', desc = '', cat = '') {
        previewArea.classList.remove('hidden');
        previewCard.innerHTML = `
            <div class="card news-item" style="max-width: 400px; margin: 0 auto; background: white; border-radius: 1rem; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">
                <img src="${imgSrc}" style="width: 100%; height: 200px; object-fit: cover;">
                <div style="padding: 1.5rem;">
                    <span style="font-size: 0.7rem; color: #3b82f6; text-transform: uppercase; font-weight: 700;">${cat}</span>
                    <h3 style="margin: 0.5rem 0;">${title || 'Título de la Noticia'}</h3>
                    <p style="font-size: 0.9rem; color: #64748b;">${desc || 'Descripción de la noticia...'}</p>
                </div>
            </div>
        `;
        previewArea.scrollIntoView({ behavior: 'smooth' });
    }

    document.getElementById('newsForm').onsubmit = async (e) => {
        e.preventDefault();
        showToast('Subiendo imagen...', 'info');

        const fd = new FormData();
        fd.append('image', document.getElementById('imageInput').files[0]);

        try {
            const upRes = await fetch('/api/news/upload', { method: 'POST', body: fd });
            if (!upRes.ok) throw new Error('Error al subir imagen');
            const { imageUrl } = await upRes.json();

            const newsRes = await fetch('/api/news', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: document.getElementById('title').value,
                    category: document.getElementById('category').value,
                    description: document.getElementById('description').value,
                    imageUrl
                })
            });

            if (newsRes.ok) {
                showToast('Noticia publicada con éxito');
                document.getElementById('newsForm').reset();
                previewArea.classList.add('hidden');
                loadNewsList(); // Refrescar lista y estadísticas
            } else {
                showToast('Error al guardar noticia', 'error');
            }
        } catch (err) {
            showToast('Error en el servidor', 'error');
            console.error(err);
        }
    };

    // --- Agenda Logic ---
    async function loadAgendaList() {
        const list = document.getElementById('agendaItemsList');
        list.innerHTML = 'Cargando...';
        const res = await fetch('/api/agenda');
        const data = await res.json();
        list.innerHTML = '';
        data.forEach(item => {
            const card = document.createElement('div');
            card.className = 'news-manage-card';
            card.innerHTML = `<div><h4>${item.title}</h4><p>${item.time}</p></div><button class="btn-delete" onclick="deleteAgenda('${item.id}')">Eliminar</button>`;
            list.appendChild(card);
        });
    }

    window.deleteAgenda = async (id) => {
        await fetch(`/api/agenda/${id}`, { method: 'DELETE' });
        loadAgendaList();
    };

    if (document.getElementById('agendaForm')) {
        document.getElementById('agendaForm').onsubmit = async (e) => {
            e.preventDefault();
            const rawTime = document.getElementById('agendaTime').value;
            const time = new Date(rawTime).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' });
            await fetch('/api/agenda', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: document.getElementById('agendaTitle').value, time })
            });
            loadAgendaList();
            document.getElementById('agendaForm').reset();
        };
    }

    // --- Helper ---
    function showToast(message, type = 'success') {
        toast.innerHTML = message;
        toast.style.backgroundColor = type === 'success' ? '#10b981' : (type === 'error' ? '#ef4444' : '#3b82f6');
        toast.classList.remove('hidden');
        setTimeout(() => toast.classList.add('hidden'), 3000);
    }
});

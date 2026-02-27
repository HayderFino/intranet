document.addEventListener('DOMContentLoaded', () => {
    // --- UI Elements ---
    const toast = document.getElementById('toast');
    const sections = {
        newsForm: document.getElementById('newsFormSection'),
        newsList: document.getElementById('newsListSection'),
        agenda: document.getElementById('agendaSection'),
        sgi: document.getElementById('sgiSection'),
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

    navItems.dashboard.onclick = () => { hideAll(); sections.newsForm.classList.remove('hidden'); navItems.dashboard.classList.add('active'); };
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

    // --- SGI Logic (Planeación & Mejora) ---
    const sgiForm = document.getElementById('sgiForm');
    const sgiItemsList = document.getElementById('sgiItemsList');
    const sgiEditId = document.getElementById('sgiEditId');
    const sgiCurrentSection = document.getElementById('sgiCurrentSection');
    const sgiCategory = document.getElementById('sgiCategory');
    const sgiSaveBtn = document.getElementById('sgiSaveBtn');
    const sgiCancelEditBtn = document.getElementById('sgiCancelEditBtn');
    const sgiSubtitle = document.getElementById('sgiSubtitle');
    const sgiTabButtons = document.querySelectorAll('.tab-btn');

    let loadedSgiItems = [];

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

        // Update Categories Select
        sgiCategory.innerHTML = SGI_CATEGORIES[section].map(cat => `<option value="${cat}">${cat}</option>`).join('');

        // Reset Form
        cancelSgiEdit();
        loadSgiList();
    }

    sgiTabButtons.forEach(btn => {
        btn.onclick = () => switchSgiSection(btn.dataset.target);
    });

    async function loadSgiList() {
        const section = sgiCurrentSection.value;
        sgiItemsList.innerHTML = '<p style="padding: 1rem;">Cargando documentos...</p>';
        try {
            const res = await fetch(`/api/sgi/${section}`);
            const data = await res.json();
            loadedSgiItems = data;

            if (data.length === 0) {
                sgiItemsList.innerHTML = '<p style="padding: 1rem; color: #64748b;">No hay documentos en esta sección.</p>';
                return;
            }

            sgiItemsList.innerHTML = '';
            data.forEach(item => {
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
        } catch (error) {
            showToast('Error al cargar items', 'error');
        }
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
            newsItemsList.innerHTML = news.length ? '' : '<p>No hay noticias.</p>';
            news.forEach(item => {
                const card = document.createElement('div');
                card.className = 'news-manage-card';
                card.innerHTML = `
                    <img src="../${item.imageUrl}" style="width: 60px; height: 60px; object-fit: cover;">
                    <div class="news-info"><h4>${item.title}</h4></div>
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

    document.getElementById('newsForm').onsubmit = async (e) => {
        e.preventDefault();
        const fd = new FormData();
        fd.append('image', document.getElementById('imageInput').files[0]);
        const upRes = await fetch('/api/news/upload', { method: 'POST', body: fd });
        const { imageUrl } = await upRes.json();

        await fetch('/api/news', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title: document.getElementById('title').value,
                category: document.getElementById('category').value,
                description: document.getElementById('description').value,
                imageUrl
            })
        });
        showToast('Noticia publicada');
        document.getElementById('newsForm').reset();
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

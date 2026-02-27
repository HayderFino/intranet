document.addEventListener('DOMContentLoaded', () => {
    const newsForm = document.getElementById('newsForm');
    const previewBtn = document.getElementById('previewBtn');
    const previewArea = document.getElementById('previewArea');
    const previewCard = document.getElementById('previewCard');
    const toast = document.getElementById('toast');
    const newsFormSection = document.getElementById('newsFormSection');
    const newsListSection = document.getElementById('newsListSection');
    const newsItemsList = document.getElementById('newsItemsList');
    const refreshBtn = document.getElementById('refreshBtn');

    // Sidebar Navigation
    const navDashboard = document.getElementById('nav-dashboard');
    const navNewNews = document.getElementById('nav-new-news');
    const navListNews = document.getElementById('nav-list-news');
    const navAgenda = document.getElementById('nav-agenda');

    const agendaSection = document.getElementById('agendaSection');
    const agendaForm = document.getElementById('agendaForm');
    const agendaItemsList = document.getElementById('agendaItemsList');
    const imageInput = document.getElementById('imageInput');

    const sgiSection = document.getElementById('sgiSection');
    const sgiForm = document.getElementById('sgiForm');
    const sgiItemsList = document.getElementById('sgiItemsList');
    const navSgi = document.getElementById('nav-sgi');

    function setActiveNav(navElement) {
        [navDashboard, navNewNews, navListNews, navAgenda, navSgi].forEach(el => el.classList.remove('active'));
        navElement.classList.add('active');
    }

    const sections = [newsFormSection, newsListSection, agendaSection, sgiSection, previewArea];
    function hideAllSections() {
        sections.forEach(sec => sec.classList.add('hidden'));
    }

    navDashboard.addEventListener('click', (e) => {
        e.preventDefault();
        setActiveNav(navDashboard);
        hideAllSections();
        newsFormSection.classList.remove('hidden');
    });

    navNewNews.addEventListener('click', (e) => {
        e.preventDefault();
        setActiveNav(navNewNews);
        hideAllSections();
        newsFormSection.classList.remove('hidden');
    });

    navListNews.addEventListener('click', (e) => {
        e.preventDefault();
        setActiveNav(navListNews);
        hideAllSections();
        newsListSection.classList.remove('hidden');
        loadNewsList();
    });

    navAgenda.addEventListener('click', (e) => {
        e.preventDefault();
        setActiveNav(navAgenda);
        hideAllSections();
        agendaSection.classList.remove('hidden');
        loadAgendaList();
    });

    navSgi.addEventListener('click', (e) => {
        e.preventDefault();
        setActiveNav(navSgi);
        hideAllSections();
        sgiSection.classList.remove('hidden');
        loadSgiList();
    });

    refreshBtn.addEventListener('click', loadNewsList);

    // Load Agenda
    async function loadAgendaList() {
        agendaItemsList.innerHTML = '<p style="padding: 1rem;">Cargando agenda...</p>';
        try {
            const res = await fetch('/api/agenda');
            const data = await res.json();

            if (data.length === 0) {
                agendaItemsList.innerHTML = '<p style="padding: 1rem; color: #64748b;">No hay actividades dinámicas en la agenda.</p>';
                return;
            }

            agendaItemsList.innerHTML = '';
            data.forEach(item => {
                const card = document.createElement('div');
                card.className = 'news-manage-card';
                card.innerHTML = `
                    <div class="news-info">
                        <h4>${item.title}</h4>
                        <p>${item.time}</p>
                    </div>
                    <button class="btn-delete" data-id="${item.id}">Eliminar</button>
                `;
                agendaItemsList.appendChild(card);
            });

            agendaItemsList.querySelectorAll('.btn-delete').forEach(btn => {
                btn.addEventListener('click', () => deleteAgenda(btn.dataset.id));
            });
        } catch (error) {
            showToast('Error al cargar agenda', 'error');
        }
    }

    if (agendaForm) {
        agendaForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const title = document.getElementById('agendaTitle').value;
            const rawTime = document.getElementById('agendaTime').value;

            // Formatear fecha para que sea más legible
            const dateObj = new Date(rawTime);
            const options = { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' };
            const time = dateObj.toLocaleDateString('es-ES', options);

            try {
                const res = await fetch('/api/agenda', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ title, time })
                });
                if (res.ok) {
                    showToast('Actividad agregada');
                    agendaForm.reset();
                    loadAgendaList();
                }
            } catch (error) {
                showToast('Error al guardar', 'error');
            }
        });
    }

    async function deleteAgenda(id) {
        if (!confirm('¿Eliminar actividad?')) return;
        try {
            await fetch(`/api/agenda/${id}`, { method: 'DELETE' });
            loadAgendaList();
            showToast('Actividad eliminada');
        } catch (error) {
            showToast('Error al eliminar', 'error');
        }
    }

    // Fetch and render news
    async function loadNewsList() {
        newsItemsList.innerHTML = '<p style="padding: 1rem;">Cargando noticias...</p>';
        try {
            const res = await fetch('/api/news');
            if (!res.ok) {
                const text = await res.text();
                throw new Error(`Error ${res.status}: El servidor no reconoci&oacute; la ruta. Por favor reinicia el servidor node.`);
            }
            const news = await res.json();

            if (news.length === 0) {
                newsItemsList.innerHTML = '<p style="padding: 1rem; color: #64748b;">No hay noticias automatizadas para gestionar.</p>';
                return;
            }

            newsItemsList.innerHTML = '';
            news.forEach(item => {
                const card = document.createElement('div');
                card.className = 'news-manage-card';
                card.innerHTML = `
                    <img src="../${item.imageUrl}" alt="${item.title}" style="width: 80px; height: 60px; object-fit: cover; border-radius: 4px;">
                    <div class="news-info">
                        <h4>${item.title}</h4>
                        <p style="font-size: 0.85rem; color: #64748b; line-height: 1.2;">
                            ${item.description.substring(0, 100)}${item.description.length > 100 ? '...' : ''}
                        </p>
                    </div>
                    <button class="btn-delete" data-id="${item.id}">Eliminar</button>
                `;
                newsItemsList.appendChild(card);
            });

            // Add delete event listeners
            newsItemsList.querySelectorAll('.btn-delete').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const id = e.target.getAttribute('data-id');
                    if (confirm('\u00BFESt\u00E1s seguro de que deseas eliminar esta noticia?')) {
                        deleteNews(id);
                    }
                });
            });

        } catch (error) {
            console.error(error);
            showToast('Error al cargar noticias', 'error');
        }
    }

    // Delete News
    async function deleteNews(id) {
        showToast('Eliminando...', 'info');
        try {
            const res = await fetch(`/api/news/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Error al eliminar');

            showToast('Noticia eliminada con éxito');
            loadNewsList();
        } catch (error) {
            console.error(error);
            showToast('Error: ' + error.message, 'error');
        }
    }

    // Handle Preview
    previewBtn.addEventListener('click', () => {
        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;
        const file = imageInput.files[0];

        if (!title || !description) {
            showToast('Por favor completa el t&iacute;tulo y la descripci&oacute;n', 'error');
            return;
        }

        let previewImg = '../data/imagenes/placeholder.jpeg';
        if (file) {
            previewImg = URL.createObjectURL(file);
        }

        previewArea.classList.remove('hidden');
        previewCard.innerHTML = `
            <img src="${previewImg}" alt="Preview" style="width: 100%; height: 200px; object-fit: cover;">
            <div style="padding: 1.5rem;">
                <h4 style="margin-bottom: 0.5rem; font-size: 1.1rem;">${title}</h4>
                <p style="font-size: 0.9rem; color: #64748b;">${description}</p>
            </div>
        `;

        previewArea.scrollIntoView({ behavior: 'smooth' });
    });

    // Handle Submit
    newsForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const title = document.getElementById('title').value;
        const category = document.getElementById('category').value;
        const description = document.getElementById('description').value;
        const file = imageInput.files[0];

        if (!file) {
            showToast('Por favor selecciona una imagen', 'error');
            return;
        }

        showToast('Subiendo y publicando...', 'info');

        try {
            // 1. Subir Imagen
            const formData = new FormData();
            formData.append('image', file);

            const uploadRes = await fetch('/api/news/upload', {
                method: 'POST',
                body: formData
            });

            if (!uploadRes.ok) throw new Error('Error al subir la imagen');
            const { imageUrl } = await uploadRes.json();

            // 2. Publicar Noticia
            const newsRes = await fetch('/api/news', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title,
                    category,
                    description,
                    imageUrl
                })
            });

            if (!newsRes.ok) throw new Error('Error al publicar la noticia');

            showToast('¡Noticia publicada con éxito!');
            newsForm.reset();
            previewArea.classList.add('hidden');

        } catch (error) {
            console.error(error);
            showToast('Error: ' + error.message, 'error');
        }
    });

    // --- SGI Planeación Logic ---
    let loadedSgiItems = [];
    const sgiEditId = document.getElementById('sgiEditId');
    const sgiSaveBtn = document.getElementById('sgiSaveBtn');
    const sgiCancelEditBtn = document.getElementById('sgiCancelEditBtn');

    async function loadSgiList() {
        sgiItemsList.innerHTML = '<p style="padding: 1rem;">Cargando documentos SGI...</p>';
        try {
            const res = await fetch('/api/sgi/planeacion');
            const data = await res.json();
            loadedSgiItems = data;

            if (data.length === 0) {
                sgiItemsList.innerHTML = '<p style="padding: 1rem; color: #64748b;">No hay documentos gestionables.</p>';
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
                        <p style="font-size: 0.8rem; color: #64748b;">URL: ${item.href}</p>
                    </div>
                    <div class="card-actions" style="display: flex; gap: 0.5rem;">
                        <button class="btn-secondary btn-edit" data-id="${item.id}" style="padding: 5px 10px; font-size: 0.8rem;">Editar</button>
                        <button class="btn-delete" data-id="${item.id}" style="padding: 5px 10px; font-size: 0.8rem;">Eliminar</button>
                    </div>
                `;
                sgiItemsList.appendChild(card);
            });

            sgiItemsList.querySelectorAll('.btn-delete').forEach(btn => {
                btn.addEventListener('click', () => deleteSgiItem(btn.dataset.id));
            });

            sgiItemsList.querySelectorAll('.btn-edit').forEach(btn => {
                btn.addEventListener('click', () => {
                    const item = loadedSgiItems.find(i => i.id === btn.dataset.id);
                    if (item) startSgiEdit(item);
                });
            });
        } catch (error) {
            showToast('Error al cargar items SGI', 'error');
        }
    }

    function startSgiEdit(item) {
        document.getElementById('sgiTitle').value = item.name;
        document.getElementById('sgiCategory').value = item.category;
        sgiEditId.value = item.id;
        sgiSaveBtn.innerText = 'Actualizar Documento';
        sgiCancelEditBtn.classList.remove('hidden');
        document.getElementById('sgiFile').required = false;

        sgiForm.setAttribute('data-current-url', item.href);
        sgiSection.scrollIntoView({ behavior: 'smooth' });
    }

    sgiCancelEditBtn.addEventListener('click', () => {
        sgiForm.reset();
        sgiEditId.value = '';
        sgiSaveBtn.innerText = 'Guardar Documento';
        sgiCancelEditBtn.classList.add('hidden');
        document.getElementById('sgiFile').required = true;
    });

    sgiForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = sgiEditId.value;
        const name = document.getElementById('sgiTitle').value;
        const category = document.getElementById('sgiCategory').value;
        const fileInput = document.getElementById('sgiFile');
        const file = fileInput.files[0];
        let fileUrl = sgiForm.getAttribute('data-current-url');

        if (!id && !file) {
            showToast('Selecciona un archivo', 'error');
            return;
        }

        showToast(id ? 'Actualizando documento...' : 'Subiendo archivo...', 'info');

        try {
            if (file) {
                const formData = new FormData();
                formData.append('category', category);
                formData.append('file', file);
                const uploadRes = await fetch('/api/sgi/upload', {
                    method: 'POST',
                    body: formData
                });
                const uploadData = await uploadRes.json();
                fileUrl = uploadData.fileUrl;
            }

            const method = id ? 'PUT' : 'POST';
            const url = id ? `/api/sgi/planeacion/${id}` : '/api/sgi/planeacion';

            const res = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, category, fileUrl })
            });

            if (res.ok) {
                showToast(id ? 'Documento actualizado' : 'Documento guardado');
                sgiForm.reset();
                sgiEditId.value = '';
                sgiSaveBtn.innerText = 'Guardar Documento';
                sgiCancelEditBtn.classList.add('hidden');
                document.getElementById('sgiFile').required = true;
                loadSgiList();
            } else {
                const err = await res.json();
                showToast(err.message, 'error');
            }
        } catch (error) {
            showToast('Error al procesar el documento', 'error');
        }
    });

    async function deleteSgiItem(id) {
        if (!confirm('¿Eliminar este documento del portal?')) return;
        try {
            const res = await fetch(`/api/sgi/planeacion/${id}`, { method: 'DELETE' });
            if (res.ok) {
                showToast('Documento eliminado');
                loadSgiList();
            }
        } catch (error) {
            showToast('Error al eliminar', 'error');
        }
    }

    function showToast(message, type = 'success') {
        toast.innerHTML = message;
        toast.style.backgroundColor = type === 'success' ? '#10b981' : (type === 'error' ? '#ef4444' : '#3b82f6');
        toast.classList.remove('hidden');

        setTimeout(() => {
            toast.classList.add('hidden');
        }, 3000);
    }
});

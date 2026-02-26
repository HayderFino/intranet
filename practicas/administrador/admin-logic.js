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

    function setActiveNav(navElement) {
        [navDashboard, navNewNews, navListNews, navAgenda].forEach(el => el.classList.remove('active'));
        navElement.classList.add('active');
    }

    const sections = [newsFormSection, newsListSection, agendaSection, previewArea];
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
                    <div class="news-info">
                        <h4>${item.title}</h4>
                        <p>${item.description}</p>
                    </div>
                    <button class="btn-delete" data-id="${item.id}">Eliminar</button>
                `;
                newsItemsList.appendChild(card);
            });

            // Add delete event listeners
            document.querySelectorAll('.btn-delete').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const id = e.target.getAttribute('data-id');
                    if (confirm('¿Est&aacute;s seguro de que deseas eliminar esta noticia?')) {
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

    function showToast(message, type = 'success') {
        toast.innerHTML = message;
        toast.style.backgroundColor = type === 'success' ? '#10b981' : (type === 'error' ? '#ef4444' : '#3b82f6');
        toast.classList.remove('hidden');

        setTimeout(() => {
            toast.classList.add('hidden');
        }, 3000);
    }
});

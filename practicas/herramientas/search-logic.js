document.addEventListener('DOMContentLoaded', () => {
    const resultsList = document.getElementById('resultsList');
    const resultsCount = document.getElementById('resultsCount');
    const form = document.getElementById('advancedSearchForm');
    const queryInput = document.getElementById('filterQuery');
    const categorySelect = document.getElementById('filterCategory');
    const startDateInput = document.getElementById('filterStartDate');
    const endDateInput = document.getElementById('filterEndDate');

    // Parse URL params
    const params = new URLSearchParams(window.location.search);
    const initialQuery = params.get('q');

    if (initialQuery) {
        queryInput.value = initialQuery;
        performSearch(initialQuery);
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        performSearch();
    });

    async function performSearch(qOverride = null) {
        const query = qOverride !== null ? qOverride : queryInput.value;
        const category = categorySelect.value;
        const startDate = startDateInput.value;
        const endDate = endDateInput.value;

        if (!query && !startDate && !endDate && category === 'all') {
            resultsList.innerHTML = `
                <div class="card" style="text-align: center; padding: 4rem; color: #94a3b8;">
                    <p>Ingresa un término o selecciona un filtro para comenzar la búsqueda.</p>
                </div>`;
            resultsCount.innerText = '';
            return;
        }

        resultsList.innerHTML = '<div class="loading" style="text-align:center; padding: 2rem;">Buscando coincidencias...</div>';
        resultsCount.innerText = 'Buscando...';

        try {
            const searchUrl = `/api/search?q=${encodeURIComponent(query)}&category=${category}&startDate=${startDate}&endDate=${endDate}`;
            const res = await fetch(searchUrl);
            const data = await res.json();

            renderResults(data);
        } catch (error) {
            console.error(error);
            resultsList.innerHTML = '<p class="error">Hubo un error al conectar con el motor de búsqueda.</p>';
            resultsCount.innerText = 'Error';
        }
    }

    function renderResults(results) {
        if (results.length === 0) {
            resultsList.innerHTML = `
                <div class="card" style="text-align: center; padding: 4rem; color: #94a3b8;">
                    <p>No se encontraron resultados para los criterios seleccionados.</p>
                </div>`;
            resultsCount.innerText = '0 resultados encontrados';
            return;
        }

        resultsCount.innerText = `${results.length} resultados encontrados`;
        resultsList.innerHTML = results.map(res => `
            <div class="search-result-card card" style="display: flex; flex-direction: column; gap: 0.5rem; transition: transform 0.2s; cursor: pointer;" onclick="window.open('${res.href}', '_blank')">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="background: rgba(34, 197, 94, 0.1); color: #22c55e; padding: 4px 10px; border-radius: 4px; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; display: flex; align-items: center; gap: 6px;">
                        ${getIconByType(res.type)} ${res.type}
                    </span>
                    <span style="font-size: 0.75rem; color: #94a3b8;">${formatDate(res.date)}</span>
                </div>
                <h3 style="margin: 0; font-size: 1.1rem; color: #1e293b;">${res.title}</h3>
                <p style="margin: 0; color: #64748b; font-size: 0.9rem; line-height: 1.5;">${res.snippet || ''}</p>
                <div style="margin-top: 0.5rem; color: #3b82f6; font-size: 0.8rem; font-weight: 600; display: flex; align-items: center; gap: 4px;">
                    Ver recurso <svg style="width: 12px; height: 12px;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                </div>
            </div>
        `).join('');
    }

    function getIconByType(type) {
        const lower = type.toLowerCase();
        // SVG para Noticias
        if (lower.includes('noticia')) return '<svg style="width: 14px; height: 14px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10l4 4v10a2 2 0 01-2 2z"></path><path d="M7 8h5"></path><path d="M7 12h10"></path><path d="M7 16h10"></path></svg>';
        // SVG para Manuales
        if (lower.includes('manual')) return '<svg style="width: 14px; height: 14px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z"></path><path d="M14 2v6h6"></path><path d="M16 13H8"></path><path d="M16 17H8"></path><path d="M10 9H8"></path></svg>';
        // SVG para Informe
        if (lower.includes('informe')) return '<svg style="width: 14px; height: 14px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 21V3"></path><path d="M4 11h16"></path><path d="M4 16h16"></path><path d="M4 6h16"></path></svg>';
        // Default
        return '<svg style="width: 14px; height: 14px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"></path></svg>';
    }

    function formatDate(dateStr) {
        if (!dateStr || dateStr === '2024-01-01') return 'Fecha no disponible';
        try {
            const date = new Date(dateStr);
            return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
        } catch (e) {
            return dateStr;
        }
    }
});

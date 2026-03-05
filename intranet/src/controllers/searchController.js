const NewsModel = require('../models/newsModel');
const InformeGestionModel = require('../models/informeGestionModel');
const CitaModel = require('../models/citaModel');
const SirhModel = require('../models/sirhModel');
const SnifModel = require('../models/snifModel');
const RevisionRedModel = require('../models/revisionRedModel');
const ManualFuncionesModel = require('../models/manualFuncionesModel');
const PlanMonitoreoModel = require('../models/planMonitoreoModel');
const PlanesTalentoModel = require('../models/planesTalentoModel');
const ConvocatoriasModel = require('../models/convocatoriasModel');
const EstudiosTecnicosModel = require('../models/estudiosTecnicosModel');
const ProvisionEmpleosModel = require('../models/provisionEmpleosModel');
const BoletinesModel = require('../models/boletinesModel');
const ManualesModel = require('../models/manualesModel');
const SgiModel = require('../models/sgiModel');
const PcbModel = require('../models/pcbModel');
const RespelModel = require('../models/respelModel');
const RuaModel = require('../models/ruaModel');
const AgendaModel = require('../models/agendaModel');

const SearchController = {
    search: async (req, res) => {
        try {
            const { q, category, startDate, endDate } = req.query;
            const query = (q || '').toLowerCase();
            const results = [];

            // 1. Noticias (MongoDB)
            if (!category || category === 'all' || category === 'noticias') {
                try {
                    const news = await NewsModel.getAll();
                    news.forEach(item => {
                        if (item.title.toLowerCase().includes(query) || item.description.toLowerCase().includes(query)) {
                            results.push({
                                title: item.title,
                                type: 'Noticia',
                                href: '/header_menu/cas/noticas-cas.html',
                                date: item.createdAt ? new Date(item.createdAt).toISOString().split('T')[0] : '2024-01-01',
                                snippet: item.description.substring(0, 150) + '...'
                            });
                        }
                    });
                } catch (e) { console.error('Search error in News:', e); }
            }

            // 2. Informe de Gestión
            if (!category || category === 'all' || category === 'informes') {
                try {
                    const informes = InformeGestionModel.getAll();
                    informes.forEach(item => {
                        if (item.title.toLowerCase().includes(query) || (item.description && item.description.toLowerCase().includes(query))) {
                            results.push({
                                title: item.title,
                                type: 'Informe',
                                href: '/header_menu/cas/informe-gestion.html',
                                date: '2024-01-01',
                                snippet: item.description ? item.description.substring(0, 150) + '...' : ''
                            });
                        }
                    });
                } catch (e) { console.error('Search error in Informes:', e); }
            }

            // 3. Manuales y Documentos
            if (!category || category === 'all' || category === 'manuales') {
                const manualModels = [
                    { model: CitaModel, type: 'Manual CITA' },
                    { model: SirhModel, type: 'Manual SIRH' },
                    { model: SnifModel, type: 'Manual SNIF' },
                    { model: RevisionRedModel, type: 'Revisión Red' },
                    { model: ManualFuncionesModel, type: 'Manual Funciones' },
                    { model: PlanMonitoreoModel, type: 'Plan Monitoreo' },
                    { model: PlanesTalentoModel, type: 'Planes Talento' },
                    { model: ConvocatoriasModel, type: 'Convocatoria' },
                    { model: EstudiosTecnicosModel, type: 'Estudios Técnicos' },
                    { model: ProvisionEmpleosModel, type: 'Provisión Empleos' },
                    { model: BoletinesModel, type: 'Boletín Seguridad' },
                    { model: ManualesModel, type: 'Manual SGI' },
                    { model: PcbModel, type: 'PCB' },
                    { model: RespelModel, type: 'RESPEL' },
                    { model: RuaModel, type: 'RUA' }
                ];

                for (const mObj of manualModels) {
                    try {
                        const items = mObj.model.getAll();
                        items.forEach(item => {
                            const name = item.name || item.title || '';
                            const desc = item.description || item.subtitle || item.category || item.code || '';
                            if (name.toLowerCase().includes(query) || desc.toLowerCase().includes(query)) {
                                results.push({
                                    title: name,
                                    type: mObj.type,
                                    href: item.href || item.fileUrl || '#',
                                    date: item.date || '2024-01-01',
                                    snippet: desc
                                });
                            }
                        });
                    } catch (e) { console.error(`Search error in ${mObj.type}:`, e); }
                }

                // SGI Sections
                const sgiSections = ['planeacion', 'mejora', 'admin-recursos', 'planeacion-ambiental', 'vigilancia-control', 'control-interno'];
                for (const section of sgiSections) {
                    try {
                        const items = SgiModel.getAll(section);
                        items.forEach(item => {
                            if (item.name.toLowerCase().includes(query) || item.category.toLowerCase().includes(query)) {
                                results.push({
                                    title: item.name,
                                    type: `SGI - ${section}`,
                                    href: item.fileUrl || '#',
                                    date: '2024-01-01',
                                    snippet: `Categoría: ${item.category}`
                                });
                            }
                        });
                    } catch (e) { console.error(`Search error in SGI ${section}:`, e); }
                }

                // Agenda
                try {
                    const agenda = AgendaModel.getAll();
                    agenda.forEach(item => {
                        if (item.title.toLowerCase().includes(query) || item.description.toLowerCase().includes(query)) {
                            results.push({
                                title: item.title,
                                type: 'Agenda',
                                href: '/header_menu/cas/agenda.html',
                                date: item.date || '2024-01-01',
                                snippet: item.description
                            });
                        }
                    });
                } catch (e) { console.error('Search error in Agenda:', e); }
            }

            // 4. Filtrado por fecha
            let filteredResults = results;
            if (startDate) {
                const start = new Date(startDate);
                filteredResults = filteredResults.filter(r => new Date(r.date) >= start);
            }
            if (endDate) {
                const end = new Date(endDate);
                filteredResults = filteredResults.filter(r => new Date(r.date) <= end);
            }

            filteredResults.sort((a, b) => new Date(b.date) - new Date(a.date));

            res.json(filteredResults);
        } catch (error) {
            console.error('Global search error:', error);
            res.status(500).json({ message: 'Error interno en el buscador' });
        }
    }
};

module.exports = SearchController;

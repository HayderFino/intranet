# Estructura con entidades HTML pre-convertidas para evitar errores de encoding
$menuMap = @{
    'cas'          = @(
        @{ 'id' = 'resena'; 'title' = 'Rese&ntilde;a Hist&oacute;rica' },
        @{ 'id' = 'mision-vision'; 'title' = 'Misi&oacute;n y Visi&oacute;n' },
        @{ 'id' = 'objetivos'; 'title' = 'Objetivos de la CAS' },
        @{ 'id' = 'funciones'; 'title' = 'Funciones de la CAS' },
        @{ 'id' = 'estructura'; 'title' = 'Estructura Organizacional' },
        @{ 'id' = 'politica-ambiental'; 'title' = 'Pol&iacute;tica Ambiental' },
        @{ 'id' = 'normativa-cas'; 'title' = 'Normativa CAS' },
        @{ 'id' = 'informe-gestion'; 'title' = 'Informe de Gesti&oacute;n' },
        @{ 'id' = 'talento-humano'; 'title' = 'Talento Humano' },
        @{ 'id' = 'postalcas'; 'title' = 'PostalCAS' },
        @{ 'id' = 'noticas-cas'; 'title' = 'NotiCAS' },
        @{ 'id' = 'agenda'; 'title' = 'Agenda CAS' },
        @{ 'id' = 'ciberseguridad'; 'title' = 'GIT - Ciberseguridad' }
    )
    'sgi'          = @(
        @{ 'id' = 'sgi'; 'title' = 'Sistema de Gesti&oacute;n Integrado' },
        @{ 'id' = 'procesos-estrategicos'; 'title' = 'Procesos Estrat&eacute;gicos' },
        @{ 'id' = 'procesos-misionales'; 'title' = 'Procesos Misionales' },
        @{ 'id' = 'procesos-apoyo'; 'title' = 'Procesos de Apoyo' },
        @{ 'id' = 'evaluacion'; 'title' = 'Proceso de Evaluaci&oacute;n y Seguimiento' },
        @{ 'id' = 'politicas'; 'title' = 'Pol&iacute;ticas' },
        @{ 'id' = 'objetivos-calidad'; 'title' = 'Objetivos de Calidad' },
        @{ 'id' = 'alcance'; 'title' = 'Alcance de SGI' },
        @{ 'id' = 'documentos'; 'title' = 'Documentos Institucionales' },
        @{ 'id' = 'manuales'; 'title' = 'Manuales SGI' }
    )
    'git'          = @(
        @{ 'id' = 'normatividad'; 'title' = 'Normatividad GIT' },
        @{ 'id' = 'gobierno-digital'; 'title' = 'Gobierno Digital' },
        @{ 'id' = 'manuales-usuario'; 'title' = 'Manuales de Usuario' },
        @{ 'id' = 'boletines'; 'title' = 'Boletines de Seguridad' },
        @{ 'id' = 'responsables'; 'title' = 'Responsables de la informaci&oacute;n en pagina WEB' },
        @{ 'id' = 'proteccion-datos'; 'title' = 'Proteccion de datos personales' }
    )
    'herramientas' = @(
        @{ 'id' = 'noticas-sidebar'; 'title' = 'NotiCAS' },
        @{ 'id' = 'respel'; 'title' = 'RESPEL' },
        @{ 'id' = 'rua'; 'title' = 'RUA' },
        @{ 'id' = 'pcb'; 'title' = 'PCB' },
        @{ 'id' = 'cartografia'; 'title' = 'Cartograf&iacute;a en L&iacute;nea' },
        @{ 'id' = 'soporte'; 'title' = 'Soporte' },
        @{ 'id' = 'galeria'; 'title' = 'Galeria' },
        @{ 'id' = 'correo'; 'title' = 'Correo' },
        @{ 'id' = 'calendario'; 'title' = 'Calendario' },
        @{ 'id' = 'busqueda'; 'title' = 'Busqueda Avanzada' }
    )
}

$labels = @{ 'cas' = 'La CAS'; 'sgi' = 'SGI'; 'git' = 'GIT' }

$template = @"
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{TITLE}} - Intranet CAS</title>
    <link rel="stylesheet" href="{{REL}}styles.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
</head>
<body>
    <aside class="sidebar">
        <div class="logo-container">
            <img class="placeholder-img" src="{{REL}}data/imagenes/logo.png" alt="LOGO CAS">
            <h2>Intranet CAS</h2>
        </div>
        <nav>
            <ul class="nav-links">
                <li><a href="{{REL}}header_menu/cas/noticas-cas.html">NotiCAS</a></li>
                <li><a href="{{REL}}herramientas/respel.html">RESPEL</a></li>
                <li><a href="{{REL}}herramientas/rua.html">RUA</a></li>
                <li><a href="{{REL}}herramientas/pcb.html">PCB</a></li>
                <li><a href="{{REL}}herramientas/cartografia.html">Cartograf&iacute;a en L&iacute;nea</a></li>
                <li><a href="{{REL}}herramientas/soporte.html">Soporte</a></li>
                <li><a href="{{REL}}herramientas/galeria.html">Galeria</a></li>
                <li><a href="{{REL}}herramientas/correo.html">Correo</a></li>
                <li><a href="{{REL}}herramientas/calendario.html">Calendario</a></li>
                <li><a href="{{REL}}herramientas/busqueda.html">Busqueda Avanzada</a></li>
            </ul>
        </nav>
    </aside>

    <main>
        <header class="top-nav">
            <div class="header-menu">
                <a href="{{REL}}index.html">Inicio</a>
                
                <div class="dropdown">
                    <a href="{{REL}}header_menu/cas/resena.html">La CAS &#9662;</a>
                    <div class="dropdown-content">
                        <a href="{{REL}}header_menu/cas/mision-vision.html">Misi&oacute;n y Visi&oacute;n</a>
                        <a href="{{REL}}header_menu/cas/objetivos.html">Objetivos de la CAS</a>
                        <a href="{{REL}}header_menu/cas/funciones.html">Funciones de la CAS</a>
                        <a href="{{REL}}header_menu/cas/estructura.html">Estructura Organizacional</a>
                        <a href="{{REL}}header_menu/cas/politica-ambiental.html">Pol&iacute;tica Ambiental</a>
                        <a href="{{REL}}header_menu/cas/normativa-cas.html">Normativa CAS</a>
                        <a href="{{REL}}header_menu/cas/informe-gestion.html">Informe de Gesti&oacute;n</a>
                        <div class="dropdown-submenu">
                            <a href="{{REL}}header_menu/cas/talento-humano.html">Talento Humano <span
                                    class="submenu-arrow">&#9656;</span></a>
                            <div class="dropdown-content">
                                <a href="#">Manual de Funciones</a>
                                <a href="#">Directorio de Funcionarios</a>
                                <a href="#">Plan de monitoreo del SIGEP</a>
                                <a href="#">Planes</a>
                                <a href="#">Convocatorias</a>
                                <a href="#">Estudios T&eacute;cnicos</a>
                                <a href="{{REL}}header_menu/cas/provision-empleos.html">Provisi&oacute;n de empleos</a>
                                <a href="https://cas.delfineco.com/gdpagos_cas/" target="_blank">Desprendibles de Nomina</a>
                            </div>
                        </div>
                        <a href="{{REL}}header_menu/cas/postalcas.html">PostalCAS</a>
                        <a href="{{REL}}header_menu/cas/noticas-cas.html">NotiCAS</a>
                        <a href="{{REL}}header_menu/cas/agenda.html">Agenda CAS</a>
                        <a href="{{REL}}header_menu/cas/ciberseguridad.html">GIT - Ciberseguridad</a>
                    </div>
                </div>

                <div class="dropdown">
                    <a href="{{REL}}header_menu/sgi/sgi.html">SGI &#9662;</a>
                    <div class="dropdown-content">
                        <a href="{{REL}}header_menu/sgi/procesos-estrategicos.html">Procesos Estrat&eacute;gicos</a>
                        <a href="{{REL}}header_menu/sgi/procesos-misionales.html">Procesos Misionales</a>

                        <a href="{{REL}}header_menu/sgi/procesos-apoyo.html">Procesos de Apoyo</a>
                        <a href="{{REL}}header_menu/sgi/evaluacion.html">Proceso de Evaluaci&oacute;n y Seguimiento</a>
                        <a href="{{REL}}header_menu/sgi/politicas.html">Pol&iacute;ticas</a>
                        <a href="{{REL}}header_menu/sgi/objetivos-calidad.html">Objetivos de Calidad</a>
                        <a href="{{REL}}header_menu/sgi/alcance.html">Alcance de SGI</a>
                        <a href="{{REL}}header_menu/sgi/documentos.html">Documentos Institucionales</a>
                        <a href="{{REL}}header_menu/sgi/manuales.html">Manuales SGI</a>
                    </div>
                </div>

                <div class="dropdown">
                    <a href="#">GIT &#9662;</a>
                    <div class="dropdown-content">
                        <a href="{{REL}}header_menu/git/normatividad.html">Normatividad GIT</a>
                        <a href="{{REL}}header_menu/git/gobierno-digital.html">Gobierno Digital</a>
                        <a href="{{REL}}header_menu/git/manuales-usuario.html">Manuales de Usuario</a>
                        <a href="{{REL}}header_menu/git/boletines.html">Boletines de Seguridad</a>
                        <a href="{{REL}}header_menu/git/responsables.html">Responsables de la informaci&oacute;n en pagina WEB</a>
                        <a href="{{REL}}header_menu/git/proteccion-datos.html">Proteccion de datos personales</a>
                    </div>
                </div>

                <a href="{{REL}}meci.html">MECI</a>
                <a href="#" class="btn-login">Ingresar</a>
                <div class="search-bar">
                    <input type="text" placeholder="Buscar...">
                </div>
            </div>
        </header>

        <div class="main-scroll-area">
            <nav class="breadcrumbs">
                {{BREADCRUMB}}
            </nav>
            <section class="welcome-header">
                <h1>{{TITLE}}</h1>
                <p>Secci&oacute;n del Portal Interno de la CAS.</p>
            </section>
            <div class="card">
                <h3>Informaci&oacute;n de la Secci&oacute;n</h3>
                <p>Esta es la p&aacute;gina dedicada a <strong>{{TITLE}}</strong>. Aqu&iacute; se cargar&aacute; el contenido relevante seg&uacute;n el Sistema de Gesti&oacute;n Institucional.</p>
                <p style="margin-top: 1rem; color: #666;">Ruta: <code>{{PATH}}</code></p>
            </div>
        </div>
    </main>
    <script src="{{REL}}script.js"></script>
</body>
</html>
"@

# Generar Header Menu
foreach ($cat in @('cas', 'sgi', 'git')) {
    $dir = "header_menu/$cat"
    if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Path $dir }
    foreach ($item in $menuMap[$cat]) {
        $id = $item.id
        $title = $item.title
        $targetFile = "$(Get-Location)/$dir/$id.html"
        
        # PROTECCIÓN: No sobrescribir si el archivo ya existe y tiene contenido personalizado
        if (Test-Path $targetFile) {
            $existingContent = Get-Content $targetFile -Raw
            if ($existingContent -match 'info-card' -or $existingContent -match 'content-grid') {
                Write-Host "Saltando $id.html: Contenido personalizado detectado." -ForegroundColor Yellow
                continue
            }
        }

        $bc = "<a href='../../index.html'>Inicio</a> <span>/</span> <a href='#'>$($labels[$cat])</a> <span>/</span> $title"
        $html = $template.Replace('{{TITLE}}', $title).Replace('{{REL}}', '../../').Replace('{{PATH}}', "header_menu/$cat/$id.html").Replace('{{BREADCRUMB}}', $bc)
        [System.IO.File]::WriteAllText($targetFile, $html)
    }
}

# Generar Herramientas
if (-not (Test-Path 'herramientas')) { New-Item -ItemType Directory -Path 'herramientas' }
foreach ($item in $menuMap['herramientas']) {
    if ($item.id -eq 'noticas-sidebar') { continue }
    $id = $item.id
    $title = $item.title
    $bc = "<a href='../index.html'>Inicio</a> <span>/</span> Herramientas <span>/</span> $title"
    $html = $template.Replace('{{TITLE}}', $title).Replace('{{REL}}', '../').Replace('{{PATH}}', "herramientas/$id.html").Replace('{{BREADCRUMB}}', $bc)
    [System.IO.File]::WriteAllText("$(Get-Location)/herramientas/$id.html", $html)
}

# MECI
$bc_meci = "<a href='index.html'>Inicio</a> <span>/</span> MECI"
$html_meci = $template.Replace('{{REL}}', '').Replace('{{TITLE}}', 'MECI').Replace('{{PATH}}', 'meci.html').Replace('{{BREADCRUMB}}', $bc_meci)
[System.IO.File]::WriteAllText("$(Get-Location)/meci.html", $html_meci)

Write-Host "Portal re-generado con entidades HTML."


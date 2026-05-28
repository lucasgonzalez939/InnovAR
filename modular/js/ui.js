// ============================================================
//  UI — Componentes de interfaz de usuario
//  No necesitas editar este archivo para cambiar modelos.
// ============================================================

let currentAppUrl = window.location.href;

// Genera el código QR con la URL actual de la app
function generateQRCode() {
    const size = 200;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(currentAppUrl)}`;
    document.getElementById('qrCode').innerHTML =
        `<img src="${qrUrl}" alt="App QR Code" style="width:${size}px;height:${size}px;display:block;">`;
}

// Genera las tarjetas de marcadores en el panel lateral
function generateMarkerCards() {
    const list = document.getElementById('markerList');
    list.innerHTML = '';

    markerConfig.forEach(marker => {
        if (!marker.active) return;

        const card = document.createElement('div');
        card.className = 'marker-card';

        if (marker.markerType === 'pattern') {
            // Marcador de patrón (Hiro)
            card.style.border = '2px solid #4CAF50';
            const imgSrc = '../markers/hiro.png';
            card.innerHTML = `
                <div class="marker-preview">
                    <img src="${imgSrc}" alt="Marcador Hiro" style="width:80px;height:80px;object-fit:contain;">
                </div>
                <div class="marker-info">
                    <h5>${marker.model}</h5>
                    <span class="marker-badge" style="background:#4CAF50;">MARCADOR DE PRUEBA</span>
                </div>
                <button class="download-btn" style="background:#4CAF50;"
                    onclick="downloadMarker('${imgSrc}', '${marker.model}_Prueba')">
                    📥 Descargar
                </button>`;
        } else {
            // Marcador de código de barras 3x3
            const imgSrc = `../markers/3x3_parity_6_5/${marker.id}.png`;
            card.innerHTML = `
                <div class="marker-preview">
                    <img src="${imgSrc}" alt="Marcador ${marker.id}" style="width:80px;height:80px;object-fit:contain;">
                </div>
                <div class="marker-info">
                    <h5>${marker.model}</h5>
                    <span class="marker-badge">CÓDIGO DE BARRAS 3x3 ${marker.id}</span>
                </div>
                <button class="download-btn"
                    onclick="downloadMarker('${imgSrc}', '${marker.model}_${marker.id}')">
                    📥 Descargar
                </button>`;
        }

        list.appendChild(card);
    });
}

// Descarga un marcador individual
function downloadMarker(url, name) {
    const link     = document.createElement('a');
    link.href      = url;
    link.download  = `AR_Marker_${name}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showStatus(`✓ Marcador ${name} descargado`, 'success');
}

// Descarga todos los marcadores activos
async function downloadAllMarkers() {
    const status = document.getElementById('statusIndicator');
    status.textContent = 'Descargando todos los marcadores...';
    status.classList.add('show');

    const activeMarkers = markerConfig.filter(m => m.active);

    for (const marker of activeMarkers) {
        await new Promise(r => setTimeout(r, 500));

        if (marker.markerType === 'pattern') {
            downloadMarker('../markers/hiro.png', `${marker.model}_Prueba`);
        } else {
            downloadMarker(
                `../markers/3x3_parity_6_5/${marker.id}.png`,
                `${marker.model}_${marker.id}`
            );
        }
    }

    setTimeout(() => showStatus(`✓ ${activeMarkers.length} marcadores descargados`, 'success'), 1000);
}

// Comparte la app por Web Share API o copia al portapapeles
async function shareApp() {
    if (navigator.share) {
        try {
            await navigator.share({
                title : 'Exploradores del Espacio AR',
                text  : '¡Mira esta increíble experiencia AR!',
                url   : currentAppUrl
            });
            showStatus('✓ Compartido exitosamente', 'success');
        } catch { /* cancelado */ }
    } else {
        try {
            await navigator.clipboard.writeText(currentAppUrl);
            showStatus('✓ Enlace copiado al portapapeles', 'success');
        } catch {
            showStatus('✕ No se pudo copiar el enlace', 'error');
        }
    }
}

// Muestra un mensaje de estado temporal
function showStatus(text, type, duration = 2000) {
    const el = document.getElementById('statusIndicator');
    el.textContent = text;
    el.className   = `show ${type}`;
    setTimeout(() => el.classList.remove('show', type), duration);
}

// Inicialización de UI al cargar la página
window.addEventListener('DOMContentLoaded', () => {
    generateQRCode();
    generateMarkerCards();
});

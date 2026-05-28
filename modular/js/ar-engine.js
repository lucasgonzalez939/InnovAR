// ============================================================
//  AR Engine — Genera y gestiona la escena AR a partir de config.js
//  No necesitas editar este archivo para cambiar modelos.
// ============================================================

// Escapa caracteres especiales para usarlos como atributos HTML
function escapeAttr(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

// Genera el HTML del bloque de iluminación para un marcador
function buildLightingHTML(lighting) {
    const ambient     = lighting.ambient     ?? AR_CONFIG.AMBIENT_INTENSITY;
    const directional = lighting.directional ?? AR_CONFIG.DIRECTIONAL_INTENSITY;
    return `
            <a-light type="ambient" color="#fff" intensity="${ambient}"></a-light>
            <a-light type="directional" color="#fff" intensity="${directional}" position="${AR_CONFIG.DIRECTIONAL_POSITION}"></a-light>`;
}

// Genera el HTML completo de un marcador y su contenido 3D
function buildMarkerHTML(marker) {
    if (!marker.active) return '';

    const height = marker.height ?? AR_CONFIG.PLANET_HEIGHT;

    // Etiqueta de apertura del marcador (patrón o código de barras)
    const markerOpen = marker.markerType === 'pattern'
        ? `<a-marker preset="${escapeAttr(marker.preset)}" smooth="true" smoothCount="10" smoothTolerance="0.01" smoothThreshold="5">`
        : `<a-marker type="barcode" value="${escapeAttr(marker.id)}" smooth="true" smoothCount="10" smoothTolerance="0.01" smoothThreshold="5">`;

    // Texto de ayuda flotante (opcional)
    const hintHTML = marker.hint
        ? `
            <a-text
                value="${escapeAttr(marker.hint.text)}"
                align="center"
                position="0 0 ${AR_CONFIG.HINT_DISTANCE}"
                rotation="${AR_CONFIG.HINT_ROTATION}"
                scale="${AR_CONFIG.HINT_SCALE}"
                color="${escapeAttr(marker.hint.color || '#FFF')}"
                shader="msdf"
                font="https://raw.githubusercontent.com/etiennepinchon/aframe-fonts/master/fonts/roboto/Roboto-Bold.json">
            </a-text>`
        : '';

    return `
        ${markerOpen}
            ${buildLightingHTML(marker.lighting)}
            <a-entity
                gltf-model="url(${escapeAttr(marker.file)})"
                position="0 ${height} 0"
                scale="${escapeAttr(marker.scale)}"
                rotation="0 0 0"
                animation="property: rotation; to: 0 360 0; loop: true; dur: 20000; easing: linear">
            </a-entity>${hintHTML}
        </a-marker>`;
}

// Construye el HTML completo de la escena A-Frame
function buildArSceneHTML() {
    const markersHTML = markerConfig.map(buildMarkerHTML).join('\n');
    return `
    <a-scene
        arjs="sourceType: webcam; debugUIEnabled: false; detectionMode: mono_and_matrix; matrixCodeType: 3x3;"
        renderer="logarithmicDepthBuffer: true; precision: mediump; antialias: true;"
        vr-mode-ui="enabled: false">
        ${markersHTML}
        <a-entity camera></a-entity>
    </a-scene>`;
}

// Aplica correcciones de visibilidad a los meshes de un modelo glTF
function applyModelFixes(model) {
    model.visible       = true;
    model.frustumCulled = false;
    model.traverse(node => {
        if (!node.isMesh) return;
        node.visible       = true;
        node.frustumCulled = false;
        node.renderOrder   = 999;
        if (node.material) {
            node.material.visible     = true;
            node.material.opacity     = 1.0;
            node.material.transparent = false;
            node.material.depthTest   = true;
            node.material.depthWrite  = true;
            node.material.side        = 2; // THREE.DoubleSide
            node.material.needsUpdate = true;
        }
    });
}

// Configura los listeners de detección de marcadores
function setupMarkerListeners(statusIndicator) {
    markerConfig.forEach(marker => {
        if (!marker.active) return;

        const selector = marker.markerType === 'pattern'
            ? `a-marker[preset="${marker.preset}"]`
            : `a-marker[value="${marker.id}"]`;

        const el = document.querySelector(selector);
        if (!el) return;

        el.addEventListener('markerFound', () => {
            statusIndicator.textContent = `¡${marker.model} detectado!`;
            statusIndicator.classList.remove('error');
            statusIndicator.classList.add('success', 'show');
            console.log(`✅ ${marker.model} detectado`);
        });

        el.addEventListener('markerLost', () => {
            statusIndicator.textContent = 'Buscando marcadores...';
            statusIndicator.classList.remove('success');
            statusIndicator.classList.add('show');
        });
    });
}

// Aplica correcciones de visibilidad a todos los modelos después de cargar
function setupModelFixes() {
    markerConfig.forEach(marker => {
        if (!marker.active) return;

        const selector = marker.markerType === 'pattern'
            ? `a-marker[preset="${marker.preset}"] a-entity[gltf-model]`
            : `a-marker[value="${marker.id}"] a-entity[gltf-model]`;

        const entity = document.querySelector(selector);
        if (!entity) return;

        entity.addEventListener('model-loaded', e => {
            console.log(`✅ Modelo cargado: ${marker.model}`);
            applyModelFixes(e.detail.model);
        });

        entity.addEventListener('model-error', e => {
            console.error(`❌ Error en modelo ${marker.model}:`, e.detail);
        });

        // Corrección adicional retardada (por si el evento se perdió)
        setTimeout(() => {
            const model = entity.components['gltf-model']?.model;
            if (model) applyModelFixes(model);
        }, 3000);
    });
}

// Punto de entrada principal — inicializa la experiencia AR
async function initAR() {
    const overlay         = document.getElementById('permissionOverlay');
    const startBtn        = document.getElementById('startBtn');
    const spinner         = document.getElementById('loadingSpinner');
    const statusIndicator = document.getElementById('statusIndicator');

    try {
        startBtn.style.display  = 'none';
        spinner.style.display   = 'block';

        if (!navigator.mediaDevices?.getUserMedia) {
            throw new Error(
                'La API de cámara no es compatible con este navegador. Usa Chrome, Firefox o Safari.'
            );
        }

        // Ocultar overlay y mostrar UI
        overlay.style.display                          = 'none';
        document.getElementById('mainUI').style.display = 'flex';
        statusIndicator.textContent                    = 'Inicializando AR...';
        statusIndicator.classList.add('show');

        // Inyectar escena AR generada dinámicamente desde la configuración
        document.getElementById('sceneContainer').innerHTML = buildArSceneHTML();

        console.log(`🚀 Escena AR creada con ${markerConfig.filter(m => m.active).length} marcadores`);

        // Esperar a que A-Frame y AR.js inicialicen
        setTimeout(() => {
            const scene = document.querySelector('a-scene');
            if (!scene) { console.error('No se encontró la escena A-Frame'); return; }

            scene.addEventListener('arjs-video-loaded', () => {
                statusIndicator.textContent = '✓ Cámara lista — buscando marcadores...';
                statusIndicator.classList.remove('error');
                statusIndicator.classList.add('show');
            });

            scene.addEventListener('camera-error', () => {
                statusIndicator.textContent = '✕ Falló la inicialización de la cámara';
                statusIndicator.classList.add('error', 'show');
            });

            setupMarkerListeners(statusIndicator);
            setupModelFixes();

            // Segunda pasada después de que la escena termine de cargar
            scene.addEventListener('loaded', () => {
                setupMarkerListeners(statusIndicator);
                setupModelFixes();
            });
        }, 2000);

    } catch (error) {
        console.error('Error de cámara:', error);

        spinner.style.display = 'none';
        statusIndicator.textContent = '✕ Falló el acceso a la cámara';
        statusIndicator.classList.add('error', 'show');

        const messages = {
            NotAllowedError   : 'Se denegó el permiso de la cámara. Permítelo en la configuración del navegador.',
            NotFoundError     : 'No se encontró ninguna cámara en este dispositivo.',
            NotReadableError  : 'La cámara ya está en uso por otra aplicación.',
            OverconstrainedError: 'Las restricciones de la cámara no son compatibles.'
        };

        const detail = messages[error.name]
            || (error.message.includes('not supported')
                ? 'Tu navegador no soporta el acceso a la cámara.'
                : `Error: ${error.message}`);

        const errorMsg = document.createElement('div');
        errorMsg.style.cssText = `
            background: rgba(255,59,48,0.1); border: 2px solid #FF3B30;
            border-radius: 12px; color: #FF3B30; padding: 20px;
            margin-top: 20px; max-width: 400px; line-height: 1.5;`;
        errorMsg.innerHTML = `
            <strong style="font-size:1.2em;">⚠️ Error de Cámara</strong><br><br>${detail}
            <br><br><strong>Solución de problemas:</strong><br>
            • Asegúrate de estar en HTTPS o localhost<br>
            • Verifica los permisos de cámara del navegador<br>
            • Cierra otras aplicaciones que usen la cámara<br>
            • Prueba con un navegador diferente`;

        overlay.appendChild(errorMsg);
        startBtn.style.display  = 'block';
        startBtn.textContent    = 'Intentar de Nuevo';
    }
}

function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {
            const s = document.getElementById('statusIndicator');
            s.textContent = '✕ Pantalla completa no disponible';
            s.classList.add('error', 'show');
            setTimeout(() => s.classList.remove('show', 'error'), 2000);
        });
    } else {
        document.exitFullscreen();
    }
}

function toggleConfig() {
    document.getElementById('configPanel').classList.toggle('open');
}

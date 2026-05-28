// ============================================================
//  CONFIGURACIÓN MODULAR DE MODELOS 3D
//  ► Este es el ÚNICO archivo que necesitas editar para cambiar
//    los modelos 3D, marcadores, escalas y textos de ayuda.
// ============================================================
//
//  CÓMO AGREGAR O CAMBIAR UN MODELO:
//  1. Coloca tu archivo .glb en la carpeta ../models/
//  2. Edita o agrega una entrada en markerConfig (ver abajo).
//  3. Guarda este archivo — no toques ningún otro archivo.
//
//  ESTRUCTURA DE CADA ENTRADA EN markerConfig:
//  {
//    id          : número de marcador de código de barras 3x3
//                  (o 'hiro' para el marcador de patrón de prueba)
//    markerType  : 'barcode' | 'pattern'
//    preset      : solo para markerType 'pattern' (ej. 'hiro')
//    model       : nombre que se muestra en la interfaz
//    file        : ruta al archivo .glb (relativa a esta carpeta)
//    scale       : escala 3D como string "x y z"
//    height      : altura del modelo sobre el marcador (metros)
//    hint        : { text: '...', color: '#HEX' }  ← texto flotante
//    lighting    : { ambient: número, directional: número }
//    isTest      : true solo para el marcador de prueba Hiro
//    active      : true para mostrar, false para ocultar
//  }
// ============================================================

const AR_CONFIG = {
    // ── Posición de los modelos ─────────────────────────────
    PLANET_HEIGHT: 2.0,         // Altura general sobre el marcador (metros)

    // ── Texto de ayuda flotante ─────────────────────────────
    HINT_DISTANCE: 2.5,         // Distancia del texto al centro del marcador
    HINT_ROTATION: '-90 0 0',   // Rotación del texto (plano sobre el marcador)
    HINT_SCALE: '1.5 1.5 1.5', // Tamaño del texto

    // ── Iluminación por defecto ─────────────────────────────
    AMBIENT_INTENSITY: 2.0,
    DIRECTIONAL_INTENSITY: 4.0,
    DIRECTIONAL_POSITION: '8 8 8',

    // ── IDs de marcadores de código de barras 3x3 ──────────
    // Cambia estos valores para reasignar qué marcador
    // activa cada modelo.
    MARKERS: {
        HIRO    : 'hiro',
        SUN     : 0,
        MERCURY : 10,
        VENUS   : 29,
        EARTH   : 3,
        MARS    : 12,
        JUPITER : 5,
        SATURN  : 6,
        URANUS  : 20,
        NEPTUNE : 18,
        PLUTO   : 9
    },

    // ── Escalas de los modelos ──────────────────────────────
    // Ajusta para que cada modelo tenga un tamaño visual similar.
    SCALES: {
        SUN     : '0.18 0.18 0.18',
        MERCURY : '0.1375 0.1375 0.1375',
        VENUS   : '0.02 0.02 0.02',
        EARTH   : '0.8 0.8 0.8',
        MARS    : '0.04 0.04 0.04',
        JUPITER : '0.002 0.002 0.002',
        SATURN  : '0.8 0.8 0.8',
        URANUS  : '7 7 7',
        NEPTUNE : '0.005 0.005 0.005',
        PLUTO   : '0.25 0.25 0.25'
    }
};

// ============================================================
//  LISTA DE MODELOS
//  Agrega, quita o modifica entradas para cambiar lo que
//  aparece en la experiencia AR.
// ============================================================
const markerConfig = [

    // ── Marcador de prueba (patrón Hiro) ───────────────────
    // Funciona desde pantallas sin necesidad de imprimir.
    {
        id         : AR_CONFIG.MARKERS.HIRO,
        markerType : 'pattern',
        preset     : 'hiro',
        model      : 'Tierra (Prueba)',
        file       : '../models/earth.glb',
        scale      : AR_CONFIG.SCALES.EARTH,
        height     : AR_CONFIG.PLANET_HEIGHT,
        hint       : { text: '¡Soy el planeta de prueba!', color: '#FFF' },
        lighting   : {
            ambient     : AR_CONFIG.AMBIENT_INTENSITY,
            directional : AR_CONFIG.DIRECTIONAL_INTENSITY
        },
        isTest     : true,
        active     : true
    },

    // ── Sol ────────────────────────────────────────────────
    {
        id         : AR_CONFIG.MARKERS.SUN,
        markerType : 'barcode',
        model      : 'Sol',
        file       : '../models/sun.glb',
        scale      : AR_CONFIG.SCALES.SUN,
        height     : 2.5,   // El Sol es grande; necesita más espacio
        hint       : {
            text  : 'Soy la estrella reina,\ncaliente y brillante.\n¡Nadie está antes que yo!',
            color : '#FFD700'
        },
        lighting   : {
            ambient     : AR_CONFIG.AMBIENT_INTENSITY,
            directional : AR_CONFIG.DIRECTIONAL_INTENSITY
        },
        active     : true
    },

    // ── Mercurio ───────────────────────────────────────────
    {
        id         : AR_CONFIG.MARKERS.MERCURY,
        markerType : 'barcode',
        model      : 'Mercurio',
        file       : '../models/mercury.glb',
        scale      : AR_CONFIG.SCALES.MERCURY,
        height     : AR_CONFIG.PLANET_HEIGHT,
        hint       : {
            text  : 'Soy el más pequeño\ny el más cercano al Sol.\n¡Nadie se interpone entre nosotros!',
            color : '#FFF'
        },
        lighting   : {
            ambient     : AR_CONFIG.AMBIENT_INTENSITY,
            directional : AR_CONFIG.DIRECTIONAL_INTENSITY
        },
        active     : true
    },

    // ── Venus ──────────────────────────────────────────────
    {
        id         : AR_CONFIG.MARKERS.VENUS,
        markerType : 'barcode',
        model      : 'Venus',
        file       : '../models/venus.glb',
        scale      : AR_CONFIG.SCALES.VENUS,
        height     : AR_CONFIG.PLANET_HEIGHT,
        hint       : {
            text  : 'Brillo más que nadie.\nEstoy después del pequeño Mercurio\npero antes de la Tierra.',
            color : '#FFF'
        },
        lighting   : {
            ambient     : AR_CONFIG.AMBIENT_INTENSITY,
            directional : AR_CONFIG.DIRECTIONAL_INTENSITY
        },
        active     : true
    },

    // ── Tierra ─────────────────────────────────────────────
    {
        id         : AR_CONFIG.MARKERS.EARTH,
        markerType : 'barcode',
        model      : 'Tierra',
        file       : '../models/earth.glb',
        scale      : AR_CONFIG.SCALES.EARTH,
        height     : AR_CONFIG.PLANET_HEIGHT,
        hint       : {
            text  : 'Tu hogar azul y verde.\nVivo justo después de Venus\ny antes del planeta rojo.',
            color : '#4CC3D9'
        },
        lighting   : {
            ambient     : AR_CONFIG.AMBIENT_INTENSITY,
            directional : AR_CONFIG.DIRECTIONAL_INTENSITY
        },
        active     : true
    },

    // ── Marte ──────────────────────────────────────────────
    {
        id         : AR_CONFIG.MARKERS.MARS,
        markerType : 'barcode',
        model      : 'Marte',
        file       : '../models/mars.glb',
        scale      : AR_CONFIG.SCALES.MARS,
        height     : AR_CONFIG.PLANET_HEIGHT,
        hint       : {
            text  : 'Soy rojo y polvoriento.\nSigo a la Tierra,\npero el gigante Júpiter viene detrás.',
            color : '#FF6B6B'
        },
        lighting   : {
            ambient     : AR_CONFIG.AMBIENT_INTENSITY,
            directional : AR_CONFIG.DIRECTIONAL_INTENSITY
        },
        active     : true
    },

    // ── Júpiter ────────────────────────────────────────────
    {
        id         : AR_CONFIG.MARKERS.JUPITER,
        markerType : 'barcode',
        model      : 'Júpiter',
        file       : '../models/jupiter.glb',
        scale      : AR_CONFIG.SCALES.JUPITER,
        height     : AR_CONFIG.PLANET_HEIGHT,
        hint       : {
            text  : '¡Soy el rey gigante!\nProtejo a Marte que está antes,\ny Saturno me sigue.',
            color : '#FFF'
        },
        lighting   : {
            ambient     : AR_CONFIG.AMBIENT_INTENSITY,
            directional : AR_CONFIG.DIRECTIONAL_INTENSITY
        },
        active     : true
    },

    // ── Saturno ────────────────────────────────────────────
    {
        id         : AR_CONFIG.MARKERS.SATURN,
        markerType : 'barcode',
        model      : 'Saturno',
        file       : '../models/saturn.glb',
        scale      : AR_CONFIG.SCALES.SATURN,
        height     : AR_CONFIG.PLANET_HEIGHT,
        hint       : {
            text  : 'Mis anillos son famosos.\nVoy después del gigante Júpiter\ny antes del helado Urano.',
            color : '#FFF'
        },
        lighting   : {
            ambient     : AR_CONFIG.AMBIENT_INTENSITY,
            directional : AR_CONFIG.DIRECTIONAL_INTENSITY
        },
        active     : true
    },

    // ── Urano ──────────────────────────────────────────────
    {
        id         : AR_CONFIG.MARKERS.URANUS,
        markerType : 'barcode',
        model      : 'Urano',
        file       : '../models/uranus.glb',
        scale      : AR_CONFIG.SCALES.URANUS,
        height     : AR_CONFIG.PLANET_HEIGHT,
        hint       : {
            text  : 'Giro de lado y hace frío.\nSaturno está detrás de mí,\ny Neptuno está delante.',
            color : '#AEEEEE'
        },
        lighting   : {
            ambient     : AR_CONFIG.AMBIENT_INTENSITY,
            directional : AR_CONFIG.DIRECTIONAL_INTENSITY
        },
        active     : true
    },

    // ── Neptuno ────────────────────────────────────────────
    {
        id         : AR_CONFIG.MARKERS.NEPTUNE,
        markerType : 'barcode',
        model      : 'Neptuno',
        file       : '../models/neptune.glb',
        scale      : AR_CONFIG.SCALES.NEPTUNE,
        height     : AR_CONFIG.PLANET_HEIGHT,
        hint       : {
            text  : 'Soy azul y ventoso.\nUrano es mi vecino anterior,\ny solo queda el pequeño Plutón.',
            color : '#4169E1'
        },
        lighting   : {
            ambient     : 2.0,   // Iluminación especial para Neptuno
            directional : AR_CONFIG.DIRECTIONAL_INTENSITY
        },
        active     : true
    },

    // ── Plutón ─────────────────────────────────────────────
    {
        id         : AR_CONFIG.MARKERS.PLUTO,
        markerType : 'barcode',
        model      : 'Plutón',
        file       : '../models/pluto.glb',
        scale      : AR_CONFIG.SCALES.PLUTO,
        height     : AR_CONFIG.PLANET_HEIGHT,
        hint       : {
            text  : 'Soy el último de la fila.\nEstoy tan lejos que Neptuno\napenas se ve desde aquí.',
            color : '#FFF'
        },
        lighting   : {
            ambient     : 1.2,   // Iluminación especial para Plutón
            directional : 4.0
        },
        active     : true
    }

    // ── EJEMPLO: cómo agregar un nuevo modelo ──────────────
    // Descomenta y adapta el bloque de abajo:
    //
    // {
    //     id         : 7,                    // ID de marcador 3x3 libre
    //     markerType : 'barcode',
    //     model      : 'Mi Objeto',
    //     file       : '../models/mi_objeto.glb',
    //     scale      : '1 1 1',
    //     height     : 1.5,
    //     hint       : { text: '¡Soy un nuevo objeto!', color: '#FFF' },
    //     lighting   : {
    //         ambient     : 2.0,
    //         directional : 4.0
    //     },
    //     active     : true
    // },
];

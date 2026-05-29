# Exploradores del Espacio AR — Versión Modular

Esta carpeta contiene una versión refactorizada del proyecto original diseñada para que puedas **cambiar los modelos 3D sin modificar el código**.

## Estructura de archivos

```
modular/
├── index.html          ← Shell HTML (no editar)
├── css/
│   └── style.css       ← Estilos (no editar)
├── js/
│   ├── config.js       ← ★ ÚNICO ARCHIVO QUE NECESITAS EDITAR
│   ├── ar-engine.js    ← Motor AR data-driven (no editar)
│   └── ui.js           ← Componentes de UI (no editar)
└── README.md

# Carpetas compartidas con el proyecto original:
../models/              ← Archivos .glb de los modelos 3D
../markers/             ← Imágenes de los marcadores AR
```

## ¿Cómo cambiar un modelo 3D?

1. Coloca tu archivo `.glb` en la carpeta `../models/`.
2. Abre **`js/config.js`** — es el único archivo que necesitas editar.
3. Encuentra la entrada del modelo que quieres cambiar y edita el campo `file`:

```js
{
    id    : AR_CONFIG.MARKERS.EARTH,
    model : 'Tierra',
    file  : '../models/mi_nuevo_modelo.glb',  // ← cambia esto
    scale : '0.8 0.8 0.8',
    // ...
}
```

4. Guarda el archivo y recarga la página. ¡Listo!

## ¿Cómo agregar un modelo nuevo?

1. Coloca el `.glb` en `../models/`.
2. En `js/config.js`, descomenta el bloque de ejemplo al final de `markerConfig` y adapta los valores:

```js
{
    id         : 7,                          // ID de marcador 3x3 libre (0-63)
    markerType : 'barcode',
    model      : 'Mi Objeto',
    file       : '../models/mi_objeto.glb',
    scale      : '1 1 1',
    height     : 1.5,
    hint       : { text: '¡Hola!', color: '#FFF' },
    lighting   : { ambient: 2.0, directional: 4.0 },
    active     : true
},
```

3. Descarga el marcador de código de barras 3x3 para el ID elegido e imprímelo.

## ¿Qué controla cada campo en `config.js`?

| Campo         | Descripción |
|---------------|-------------|
| `id`          | ID del marcador (número 0-63 para barcode, o `'hiro'` para patrón) |
| `markerType`  | `'barcode'` o `'pattern'` |
| `model`       | Nombre que aparece en la interfaz |
| `file`        | Ruta al archivo `.glb` |
| `scale`       | Escala 3D `"x y z"` — ajusta el tamaño visual |
| `height`      | Altura del modelo sobre el marcador (metros) |
| `hint.text`   | Texto que flota cerca del marcador |
| `hint.color`  | Color del texto en hexadecimal |
| `lighting`    | Intensidad de luz ambiental y direccional |
| `active`      | `true` para mostrar, `false` para ocultar sin borrar |

## Diferencias respecto al proyecto original

| Aspecto | Original (`index.html`) | Modular |
|---------|------------------------|---------|
| Tamaño del archivo principal | ~65 KB (todo en uno) | ~5 KB (solo shell) |
| Para cambiar un modelo | Editar varias secciones del HTML | Editar solo `js/config.js` |
| Para agregar un modelo | Copiar bloque de marcador en el template string | Agregar una entrada en el array |
| Estilos | Inline en `<style>` | `css/style.css` |
| Lógica AR | Mezclada con HTML | `js/ar-engine.js` |
| Componentes UI | Mezclados con HTML | `js/ui.js` |

# Sistema de Skins - Walkthrough Técnico

## Resumen
Se implementó exitosamente un sistema de skins para las piezas de Shogi que permite a los usuarios seleccionar entre estilos de texto predeterminados o skins personalizados basados en imágenes.

## Estructura de Archivos

### Directorio de Skins
```
public/skins/
├── skins.json                    # Configuración global de skins disponibles
└── example_skin/
    ├── config.json               # Mapeo de tipos de pieza a archivos de imagen
    ├── pawn.png                  # Imágenes para cada tipo de pieza
    ├── lance.png
    ├── knight.png
    ├── silver.png
    ├── gold.png
    ├── bishop.png
    ├── rook.png
    ├── king.png
    ├── pawn_promoted.png         # Imágenes de piezas promocionadas
    ├── lance_promoted.png
    ├── knight_promoted.png
    ├── silver_promoted.png
    ├── bishop_promoted.png
    └── rook_promoted.png
```

### Archivos Modificados

#### 1. [PlayerStyleContext.tsx](file:///home/lucho/Proyectos/Shogi/src/contexts/PlayerStyleContext.tsx)
**Cambios principales:**
- Cambiado `PieceStyle` de tipo estricto a `string` para soportar IDs dinámicos
- Agregado estado `availableSkins` para almacenar skins cargados
- Agregado estado `skinConfigs` para cachear configuraciones
- Implementado `useEffect` para cargar `skins.json` y configuraciones individuales
- Agregado helper `getSkinConfig()` para obtener mapeo de piezas
- Agregado helper `getSkinPath()` para resolver rutas de directorio
- Uso de `import.meta.env.BASE_URL` para compatibilidad con base path de Vite

#### 2. [Piece.tsx](file:///home/lucho/Proyectos/Shogi/src/components/Piece.tsx)
**Cambios principales:**
- Agregada lógica de detección de skins usando `getSkinConfig()`
- Implementado renderizado condicional:
  - **Skin personalizado**: Renderiza `<img>` con source desde config del skin
  - **Estilo predeterminado**: Renderiza `PieceShape` tradicional con texto
- Las imágenes rotan 180° para perspectiva del oponente (prop `flipped`)
- Agregado `z-index: 2` y `position: relative` a imágenes para visibilidad correcta
- Uso de `getSkinPath()` para resolver rutas de imágenes correctamente

#### 3. [StyleSelector.tsx](file:///home/lucho/Proyectos/Shogi/src/components/StyleSelector.tsx)
**Cambios principales:**
- Reemplazados `styleLabels` hardcodeados con `defaultStyleLabels`
- Agregado `availableSkins` del contexto
- Construida lista combinada de estilos predeterminados y skins personalizados
- Implementado helper `getCurrentStyleName()` para display dinámico
- El dropdown ahora muestra ambos: estilos predeterminados y skins dinámicamente

## Funcionamiento del Sistema

### Flujo de Carga
1. **Inicio**: Al montar `PlayerStyleContext`, se hace fetch de `/Shogi/skins/skins.json`
2. **Configuración**: Para cada skin listado, se carga su `config.json`
3. **Caché**: Las configuraciones se almacenan en `skinConfigs` state
4. **Selección**: Usuario selecciona skin desde dropdown "Estilo"
5. **Renderizado**: Componente `Piece` verifica si el estilo actual es un skin:
   - Si sí: renderiza imagen desde `/Shogi/skins/{skin_path}/{piece_image}`
   - Si no: renderiza forma tradicional con texto

### Resolución de Rutas
- Base path de Vite: `/Shogi/`
- Skins JSON: `${BASE_URL}skins/skins.json` → `/Shogi/skins/skins.json`
- Config de skin: `${BASE_URL}skins/{path}/config.json`
- Imágenes: `${BASE_URL}skins/{path}/{image_file}`

## Problemas Encontrados y Soluciones

### Problema 1: Error 404 al cargar skins.json
**Causa:** Rutas absolutas (`/skins/`) no consideraban el base path de Vite `/Shogi/`  
**Solución:** Usar `import.meta.env.BASE_URL` en todos los fetches

### Problema 2: Las imágenes no eran visibles
**Causa:** El pseudo-elemento `::after` de `PieceContainer` tenía `z-index: 1` que cubría las imágenes  
**Solución:** Agregar `z-index: 2` y `position: relative` al estilo de las imágenes

### Problema 3: Usar ID en lugar de path para imágenes
**Causa:** El skin tiene tanto `id` como `path`, y se usaba incorrectamente el ID  
**Solución:** Implementar `getSkinPath()` helper para mapear ID → path

## Agregar Nuevos Skins

Para agregar un skin nuevo:

1. Crear carpeta en `public/skins/` (ej: `mi_skin/`)
2. Agregar `config.json` mapeando todos los tipos de pieza:
```json
{
  "FU": "mi_peon.png",
  "KY": "mi_lanza.png",
  ...
}
```
3. Agregar 14 imágenes (8 piezas base + 6 promocionadas)
4. Actualizar `public/skins/skins.json`:
```json
[
  {
    "id": "mi_skin",
    "name": "Mi Skin Personalizado",
    "path": "mi_skin"
  }
]
```
5. Reiniciar servidor dev

## Especificaciones de Imágenes

- **Formato**: PNG con transparencia recomendado
- **Dimensiones**: 128x128px o 256x256px para nitidez
- **Aspecto**: Cuadrado (1:1)
- **Naming**: Debe coincidir exactamente con valores en config.json

## Estado Actual

✅ **Funcional:**
- Carga dinámica de skins desde `skins.json`
- Selección de skins desde dropdown "Estilo"
- Renderizado de imágenes de piezas
- Rotación correcta para perspectiva del oponente
- Skin de ejemplo con imágenes placeholder

⚠️ **Nota:**
- Actualmente usando imágenes placeholder grises para el ejemplo
- Reemplazar con artwork real para producción
- El panel de controles del jugador Black a veces no se expande en la interfaz - problema separado no relacionado con skins

## Archivos de Configuración

### skins.json
```json
[
  {
    "id": "example_skin",
    "name": "Skin de Ejemplo",
    "path": "example_skin"
  }
]
```

### example_skin/config.json
```json
{
  "FU": "pawn.png",
  "KY": "lance.png",
  "KE": "knight.png",
  "GI": "silver.png",
  "KI": "gold.png",
  "KA": "bishop.png",
  "HI": "rook.png",
  "OU": "king.png",
  "TO": "pawn_promoted.png",
  "NY": "lance_promoted.png",
  "NK": "knight_promoted.png",
  "NG": "silver_promoted.png",
  "UM": "bishop_promoted.png",
  "RY": "rook_promoted.png"
}
```

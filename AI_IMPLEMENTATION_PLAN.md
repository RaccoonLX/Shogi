# Implementación de Modo IA con USI/Stockfish

Agregar un nuevo modo de juego "Jugar contra la IA" al menú principal, con selectores de dificultad y color, integrando un motor USI para Shogi.

## User Review Required

> [!IMPORTANT]
> **Elección del Motor USI**: Hay dos opciones principales disponibles:
> 1. **ffish.js (Fairy-Stockfish)**: Motor multi-variantes que soporta Shogi con protocolo USI, disponible como paquete npm. Más fácil de integrar.
> 2. **YaneuraOu.wasm**: Motor específico de Shogi muy fuerte, requiere compilación WebAssembly personalizada y es más complejo de integrar.
>
> **Recomiendo usar ffish.js** por su facilidad de integración, aunque YaneuraOu es más fuerte. Si prefieres YaneuraOu, la integración será más compleja.

> [!WARNING]
> **Ejecutión del Motor**: Los motores USI necesitan ejecutarse en Web Workers para no bloquear la UI principal del navegador durante el cálculo de movimientos.

## Proposed Changes

### Frontend - Componentes de UI

#### [NEW] [AIGameSetup.tsx](file:///home/lucho/Proyectos/Shogi/src/components/AIGameSetup.tsx)
Nuevo componente para configurar la partida contra la IA:
- Selector de dificultad con 3 niveles:
  - **Fácil**: Tiempo de búsqueda limitado (1 segundo)
  - **Medio**: Tiempo de búsqueda moderado (3 segundos)
  - **Difícil**: Tiempo de búsqueda extendido (5 segundos)
- Selector de color con 3 opciones:
  - **Blanco (Gote)**: Usuario juega como Blanco
  - **Negro (Sente)**: Usuario juega como Negro
  - **Aleatorio**: Se asigna un color al azar
- Botón para iniciar la partida con la configuración seleccionada

#### [MODIFY] [MainMenu.tsx](file:///home/lucho/Proyectos/Shogi/src/components/MainMenu.tsx)
Agregar nuevo botón "🤖 Jugar contra la IA" que lleva a la pantalla de configuración de IA

#### [MODIFY] [App.tsx](file:///home/lucho/Proyectos/Shogi/src/App.tsx)
- Agregar nuevo estado `view` con valor `'ai-setup'` para la pantalla de configuración
- Actualizar el tipo de `gameMode` para incluir `'ai'`
- Agregar estados para configuración de IA:
  - `aiDifficulty`: 'easy' | 'medium' | 'hard'
  - `aiColor`: Color (el color que jugará la IA)
- Integrar lógica para que la IA haga movimientos automáticamente cuando sea su turno
- Manejar la navegación entre menu → ai-setup → game

---

### Backend - Motor USI

#### [NEW] [usiEngine.ts](file:///home/lucho/Proyectos/Shogi/src/services/usiEngine.ts)
Servicio para comunicación con el motor USI:
- Clase `USIEngine` que encapsula la comunicación con el motor vía Web Worker
- Métodos principales:
  - `initialize()`: Inicializar el motor y enviar comando `usi`
  - `setDifficulty(level)`: Configurar tiempo de búsqueda según dificultad
  - `getBestMove(fen)`: Obtener el mejor movimiento para una posición dada
  - `stop()`: Detener el motor y liberar recursos
- Parsing de respuestas USI (especialmente `bestmove`)
- Conversión entre notación USI y coordenadas internas del juego

#### [NEW] [usiWorker.ts](file:///home/lucho/Proyectos/Shogi/src/workers/usiWorker.ts)
Web Worker para ejecutar el motor USI sin bloquear la UI:
- Importar ffish.js o el motor USI elegido
- Implementar comunicación bidireccional con el thread principal
- Procesar comandos USI y enviar respuestas

---

### Lógica del Juego

#### [MODIFY] [useShogiGame.ts](file:///home/lucho/Proyectos/Shogi/src/hooks/useShogiGame.ts)
- Agregar capacidad de obtener posición en formato FEN/USI
- Agregar método `makeAIMove(move)` para ejecutar movimientos de la IA

## Verification Plan

### Automated Tests
Dado que el proyecto no tiene tests automatizados configurados actualmente, no se incluyen tests automáticos en esta etapa.

### Manual Verification

1. **Navegación del Menú**:
   - Ejecutar `npm run dev`
   - Verificar que aparece el botón "🤖 Jugar contra la IA" en el menú principal
   - Click en el botón debe llevar a la pantalla de configuración

2. **Configuración de IA**:
   - En la pantalla de configuración, verificar que hay 3 opciones de dificultad (Fácil, Medio, Difícil)
   - Verificar que hay 3 opciones de color (Blanco, Negro, Aleatorio)
   - Probar la opción "Aleatorio" varias veces para confirmar que asigna colores de forma aleatoria
   - Click en "Iniciar Partida" debe iniciar el juego con la configuración seleccionada

3. **Juego contra IA**:
   - **Como Negro (jugador inicia)**: Verificar que el usuario puede hacer el primer movimiento, y que la IA responde automáticamente después de cada movimiento del usuario
   - **Como Blanco (IA inicia)**: Verificar que la IA hace el primer movimiento automáticamente al iniciar la partida
   - Verificar que los movimientos de la IA son legales y se muestran correctamente en el tablero
   - Probar los 3 niveles de dificultad y verificar que la IA toma más tiempo en niveles superiores

4. **Funcionalidad Completa**:
   - Verificar que el botón "Reset" funciona correctamente
   - Verificar que el botón "Exit" regresa al menú principal
   - Verificar que todas las reglas de Shogi se respetan (captura, promoción, etc.)

5. **Integración con Modos Existentes**:
   - Verificar que el modo "Jugar en Solitario" sigue funcionando
   - Verificar que el modo "Multiplayer" sigue funcionando

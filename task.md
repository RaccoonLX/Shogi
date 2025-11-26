# Implementar Modo IA con Stockfish/USI

## Componentes de UI
- [x] Agregar botón "Jugar contra la IA" al MainMenu
- [x] Crear componente AIGameSetup para configuración (dificultad y color)
- [x] Integrar selector de dificultad (Fácil, Medio, Difícil)
- [x] Integrar selector de color (Blanco, Negro, Aleatorio)

## Motor USI
- [x] Investigar engines USI disponibles para Shogi
- [x] Crear servicio USI para comunicación con el engine
- [x] Implementar protocolo USI básico (usi, isready, position, go)
- [x] Integrar engine en el flujo del juego

## Lógica del Juego
- [x] Actualizar App.tsx para soportar modo 'ai'
- [x] Implementar lógica de turnos contra IA
- [x] Aplicar movimientos de la IA al tablero
- [x] Manejar selector de color aleatorio

## Testing
- [/] Probar flujo completo del modo IA
- [ ] Verificar diferentes niveles de dificultad
- [ ] Verificar selector de color en todos los modos

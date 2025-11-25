# Cómo Ejecutar el Servidor para Modo Versus

## El Problema

El juego en modo versus requiere que **dos servidores** estén corriendo simultáneamente:

1. **Servidor Express** (puerto 3000) - Maneja la lógica del juego multijugador y los tokens
2. **Servidor Vite** (puerto 5174) - Sirve la aplicación frontend

Anteriormente, cuando ejecutabas `npm run server`, el servidor Express se iniciaba pero se quedaba corriendo en primer plano, bloqueando la terminal. Si cerrabas esa terminal, el servidor se detenía.

## La Solución

He agregado un nuevo script `dev:full` que ejecuta **ambos servidores simultáneamente** usando `concurrently`.

### Pasos para Ejecutar

1. **Detén el proceso actual** de `npm run dev` si está corriendo (Ctrl+C en la terminal)

2. **Ejecuta el nuevo comando:**
   ```bash
   npm run dev:full
   ```

3. **Verás ambos servidores iniciándose:**
   ```
   [0] Multiplayer server listening on port 3000
   [1] VITE v7.2.4  ready in XXX ms
   [1] ➜  Local:   http://localhost:5174/Shogi/
   ```

4. **Abre tu navegador** en `http://localhost:5174/Shogi/`

5. **¡Listo!** Ahora puedes crear tokens y jugar en modo versus

### Verificación Rápida

Para verificar que el servidor está funcionando correctamente, abre otra terminal y ejecuta:

```bash
curl -X POST http://localhost:3000/api/create
```

Deberías ver una respuesta como:
```json
{"token":"ABC123"}
```

## Comandos Disponibles

- `npm run dev` - Solo el servidor Vite (para jugar en solitario)
- `npm run server` - Solo el servidor Express (se queda en primer plano)
- `npm run dev:full` - **Ambos servidores** (recomendado para modo versus)
- `npm run build` - Construir para producción

## Notas Importantes

- Mantén la terminal abierta mientras juegas en modo versus
- Si cierras la terminal, ambos servidores se detendrán
- Para detener los servidores, presiona `Ctrl+C` en la terminal

---

**¡Ahora puedes probar el modo versus!** 🎮

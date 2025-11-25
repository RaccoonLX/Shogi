# Plan de Despliegue para Modo Multijugador

## Problema

GitHub Pages solo sirve archivos estáticos (HTML, CSS, JS). No puede ejecutar servidores Node.js como nuestro servidor Express. Para que el modo versus funcione en producción, necesitamos:

1. **Frontend** → GitHub Pages (ya funciona)
2. **Backend** → Servicio de hosting para Node.js (necesita ser desplegado)

## Solución Propuesta

### Opción 1: Render.com (Recomendada - Gratis)

**Ventajas:**
- ✅ Tier gratuito generoso
- ✅ Fácil de configurar
- ✅ Se mantiene activo (aunque puede dormir después de 15 min de inactividad)
- ✅ HTTPS automático

**Pasos:**
1. Crear cuenta en [Render.com](https://render.com)
2. Conectar repositorio de GitHub
3. Crear un "Web Service" apuntando a `server/index.js`
4. Configurar variables de entorno si es necesario
5. Obtener la URL del servidor (ej: `https://shogi-server.onrender.com`)

### Opción 2: Railway.app (Alternativa - Gratis con límites)

**Ventajas:**
- ✅ Muy fácil de usar
- ✅ Despliegue automático desde GitHub
- ✅ $5 de crédito gratis mensual

### Opción 3: Vercel (Para proyectos pequeños)

**Ventajas:**
- ✅ Mismo servicio que usa GitHub Pages
- ✅ Serverless functions
- ⚠️ Requiere adaptar el código a funciones serverless

## Cambios Necesarios en el Código

### 1. Configuración de Variables de Entorno

#### [NEW] [.env.example](file:///home/lucho/Proyectos/Shogi/.env.example)
```env
VITE_API_URL=http://localhost:3000
```

#### [NEW] [.env.production](file:///home/lucho/Proyectos/Shogi/.env.production)
```env
VITE_API_URL=https://tu-servidor.onrender.com
```

### 2. Actualizar el Módulo API

#### [MODIFY] [api.ts](file:///home/lucho/Proyectos/Shogi/src/services/api.ts)

Cambiar las URLs hardcodeadas por una variable de entorno:

```typescript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const api = {
    createGame: async (): Promise<{ token: string }> => {
        const response = await fetch(`${API_URL}/api/create`, {
            method: 'POST',
        });
        // ...
    },
    // ... resto de métodos
};
```

### 3. Configurar CORS en el Servidor

#### [MODIFY] [server/index.js](file:///home/lucho/Proyectos/Shogi/server/index.js)

Actualizar la configuración de CORS para permitir requests desde GitHub Pages:

```javascript
app.use(cors({
  origin: [
    'http://localhost:5174',
    'https://raccoonlx.github.io'
  ]
}));
```

### 4. Agregar Archivos de Configuración para Render

#### [NEW] [render.yaml](file:///home/lucho/Proyectos/Shogi/render.yaml)
```yaml
services:
  - type: web
    name: shogi-server
    env: node
    buildCommand: npm install
    startCommand: node server/index.js
    envVars:
      - key: NODE_ENV
        value: production
```

## Plan de Implementación

1. **Fase 1: Preparar el código** (Local)
   - [ ] Agregar variables de entorno
   - [ ] Actualizar `api.ts` para usar `VITE_API_URL`
   - [ ] Actualizar CORS en `server/index.js`
   - [ ] Crear archivos de configuración para Render

2. **Fase 2: Desplegar el servidor** (Render.com)
   - [ ] Crear cuenta en Render
   - [ ] Conectar repositorio
   - [ ] Configurar el servicio
   - [ ] Obtener URL del servidor

3. **Fase 3: Actualizar frontend** (GitHub Pages)
   - [ ] Actualizar `.env.production` con la URL del servidor
   - [ ] Hacer build y desplegar a GitHub Pages
   - [ ] Probar la funcionalidad

## Verificación

### Local
```bash
# Terminal 1
npm run dev:full

# Terminal 2
curl -X POST http://localhost:3000/api/create
```

### Producción
```bash
# Probar el servidor desplegado
curl -X POST https://tu-servidor.onrender.com/api/create

# Abrir la app en GitHub Pages
# https://raccoonlx.github.io/Shogi/
```

## Notas Importantes

> [!WARNING]
> El tier gratuito de Render duerme el servidor después de 15 minutos de inactividad. La primera petición después de dormir puede tardar 30-60 segundos en responder.

> [!TIP]
> Para mantener el servidor activo, puedes usar un servicio como [UptimeRobot](https://uptimerobot.com) que haga ping al servidor cada 5 minutos.

## Próximos Pasos

¿Prefieres que:
1. **Implemente los cambios de código primero** y luego te guíe para desplegar en Render?
2. **Te muestre cómo desplegar en Render primero** y luego actualice el código?
3. **Use una alternativa diferente** (Railway, Vercel, etc.)?

# Guía de Despliegue - Servidor Multijugador

## 📋 Resumen de Cambios Realizados

He preparado el código para que funcione tanto en desarrollo local como en producción (GitHub Pages). Los cambios incluyen:

### Archivos Modificados
- ✅ `src/services/api.ts` - Usa variables de entorno para la URL del API
- ✅ `server/index.js` - CORS configurado para localhost y GitHub Pages
- ✅ `package.json` - Agregado script `dev:full` para desarrollo
- ✅ `.gitignore` - Configurado para proteger `.env` local

### Archivos Nuevos
- ✅ `.env` - Variables de entorno para desarrollo local
- ✅ `.env.example` - Ejemplo de configuración
- ✅ `.env.production` - Variables para producción (GitHub Pages)
- ✅ `render.yaml` - Configuración para despliegue en Render.com
- ✅ `server/package.json` - Package.json específico para el servidor

## 🚀 Paso 1: Probar Localmente

Antes de desplegar, verifica que todo funcione en local:

```bash
# Detén npm run dev si está corriendo (Ctrl+C)

# Inicia ambos servidores
npm run dev:full
```

Deberías ver:
```
[0] Multiplayer server listening on port 3000
[1] VITE v7.2.4  ready in XXX ms
[1] ➜  Local:   http://localhost:5174/Shogi/
```

Abre `http://localhost:5174/Shogi/` y prueba crear un token. Si funciona, continúa al Paso 2.

## 🌐 Paso 2: Desplegar el Servidor en Render.com

### 2.1 Crear Cuenta en Render

1. Ve a [render.com](https://render.com)
2. Haz clic en "Get Started for Free"
3. Regístrate con tu cuenta de GitHub

### 2.2 Conectar Repositorio

1. En el dashboard de Render, haz clic en "New +"
2. Selecciona "Web Service"
3. Conecta tu repositorio de GitHub: `RaccoonLX/Shogi`
4. Autoriza a Render para acceder al repositorio

### 2.3 Configurar el Servicio

Usa la siguiente configuración:

| Campo | Valor |
|-------|-------|
| **Name** | `shogi-server` (o el nombre que prefieras) |
| **Region** | Selecciona la más cercana (ej: Oregon, USA) |
| **Branch** | `main` |
| **Root Directory** | Dejar vacío |
| **Runtime** | Node |
| **Build Command** | `npm install` |
| **Start Command** | `node server/index.js` |
| **Instance Type** | Free |

### 2.4 Variables de Entorno (Opcional)

En la sección "Environment Variables", agrega:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `PORT` | `3000` |

### 2.5 Desplegar

1. Haz clic en "Create Web Service"
2. Render comenzará a construir y desplegar tu servidor
3. Espera 2-3 minutos hasta que veas "Live" en verde
4. **Copia la URL** que Render te da (ej: `https://shogi-server.onrender.com`)

## 📝 Paso 3: Actualizar la Configuración de Producción

### 3.1 Actualizar `.env.production`

Abre el archivo `.env.production` y reemplaza la URL con la que obtuviste de Render:

```env
VITE_API_URL=https://tu-servidor.onrender.com
```

**Importante:** Reemplaza `tu-servidor.onrender.com` con la URL real de tu servidor.

### 3.2 Hacer Commit y Push

```bash
git add .
git commit -m "Configure production server URL"
git push origin main
```

## 🏗️ Paso 4: Desplegar en GitHub Pages

### 4.1 Construir para Producción

```bash
npm run build
```

Esto creará la carpeta `dist/` con los archivos optimizados.

### 4.2 Desplegar a GitHub Pages

```bash
# Si usas gh-pages
npm install -g gh-pages
gh-pages -d dist

# O manualmente
git add dist -f
git commit -m "Deploy to GitHub Pages"
git subtree push --prefix dist origin gh-pages
```

### 4.3 Configurar GitHub Pages

1. Ve a tu repositorio en GitHub: `https://github.com/RaccoonLX/Shogi`
2. Ve a Settings → Pages
3. En "Source", selecciona la rama `gh-pages`
4. Haz clic en "Save"
5. Espera 1-2 minutos

## ✅ Paso 5: Verificar que Todo Funcione

### 5.1 Probar el Servidor

```bash
curl -X POST https://tu-servidor.onrender.com/api/create
```

Deberías ver:
```json
{"token":"ABC123"}
```

### 5.2 Probar la Aplicación

1. Abre `https://raccoonlx.github.io/Shogi/`
2. Haz clic en "🤝 Desafiar a un Amigo"
3. Deberías ver una sala de espera con un token de 6 caracteres
4. ¡Listo! Comparte el token con un amigo para jugar

## 🐛 Solución de Problemas

### Error: "Failed to create game"

**Causa:** El servidor no está respondiendo.

**Solución:**
1. Verifica que el servidor en Render esté "Live" (verde)
2. Prueba la URL del servidor con curl
3. Revisa los logs en Render: Dashboard → tu servicio → Logs

### Error: CORS

**Causa:** La URL de GitHub Pages no está en la lista de CORS.

**Solución:**
1. Verifica que `server/index.js` tenga `https://raccoonlx.github.io` en el array de origins
2. Haz push de los cambios
3. Render se redesplegaráautomáticamente

### El servidor "duerme" después de 15 minutos

**Causa:** El tier gratuito de Render duerme los servicios inactivos.

**Solución:**
- La primera petición después de dormir tardará 30-60 segundos
- Opcional: Usa [UptimeRobot](https://uptimerobot.com) para hacer ping cada 5 minutos

## 📚 Comandos de Referencia Rápida

```bash
# Desarrollo local (ambos servidores)
npm run dev:full

# Solo frontend
npm run dev

# Solo backend
npm run server

# Construir para producción
npm run build

# Probar el servidor desplegado
curl -X POST https://tu-servidor.onrender.com/api/create
```

## 🎯 Próximos Pasos Opcionales

1. **Agregar persistencia:** Usar una base de datos (MongoDB, PostgreSQL) en lugar de memoria
2. **WebSockets:** Implementar comunicación en tiempo real para sincronizar movimientos
3. **Autenticación:** Agregar login de usuarios
4. **Matchmaking:** Sistema para emparejar jugadores automáticamente

---

**¿Necesitas ayuda?** Si encuentras algún problema durante el despliegue, avísame y te ayudo a resolverlo.

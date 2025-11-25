# Configuración del Bot de Telegram

Esta guía te ayudará a configurar tu bot de Telegram para usar la aplicación de Shogi como Web App.

## Paso 1: Crear el Bot con BotFather

1. Abre Telegram y busca **@BotFather**
2. Inicia una conversación y envía el comando `/newbot`
3. BotFather te pedirá un nombre para tu bot (ejemplo: "Shogi Game")
4. Luego te pedirá un username (debe terminar en 'bot', ejemplo: "shogi_game_bot")
5. BotFather te dará un **token de API**. Guárdalo en un lugar seguro (lo necesitarás si quieres agregar funcionalidades backend más adelante)

## Paso 2: Configurar la Web App

Una vez creado el bot, configura la Web App:

1. En la conversación con BotFather, envía el comando `/mybots`
2. Selecciona tu bot de la lista
3. Selecciona **"Bot Settings"**
4. Selecciona **"Menu Button"**
5. Selecciona **"Configure menu button"**
6. Envía la URL de tu aplicación:
   ```
   https://raccoonlx.github.io/Shogi/
   ```
7. Envía el texto del botón (ejemplo: "🎮 Jugar Shogi")

## Paso 3: Probar la Web App

1. Busca tu bot en Telegram usando el username que creaste
2. Inicia una conversación con `/start`
3. Verás un botón en la parte inferior con el texto que configuraste
4. Haz clic en el botón para abrir la Web App

## Características de la Integración

Tu aplicación ahora incluye:

✅ **Feedback Háptico**: Vibraciones al mover piezas, seleccionar estilos y colores
✅ **Botón de Retroceso**: Aparece automáticamente en la parte superior
✅ **Confirmación al Cerrar**: Previene salidas accidentales
✅ **Tema de Telegram**: Los colores se adaptan al tema del usuario
✅ **Pantalla Completa**: La app se expande automáticamente

## Opcional: Agregar Descripción y Foto

Para hacer tu bot más profesional:

1. En BotFather, selecciona tu bot con `/mybots`
2. **Edit Bot** → **Edit Description**: Agrega una descripción
3. **Edit Bot** → **Edit About**: Agrega un texto corto
4. **Edit Bot** → **Edit Botpic**: Sube una imagen de perfil

## Solución de Problemas

### La Web App no carga
- Verifica que la URL esté correcta: `https://raccoonlx.github.io/Shogi/`
- Asegúrate de que GitHub Pages esté activo y desplegado
- Espera unos minutos después de configurar la URL

### El botón no aparece
- Verifica que hayas configurado el "Menu Button" correctamente
- Reinicia la conversación con el bot usando `/start`

### Los colores no se ven bien
- La app usa automáticamente los colores del tema de Telegram
- Prueba cambiar el tema en Telegram para ver diferentes estilos

## Próximos Pasos

Ahora que tu bot está configurado, puedes:
- Compartir el bot con amigos
- Agregar comandos personalizados (requiere backend)
- Implementar un sistema de puntuación
- Agregar modo multijugador

¡Disfruta jugando Shogi en Telegram! 🎮

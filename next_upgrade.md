## Next Upgrade

# 🚀 Especificación de Desarrollo: Menú Principal y Multijugador para Shogi

## 🎯 Objetivo General

Implementar un **Menú Principal** como la vista de entrada inicial de la aplicación, y añadir la funcionalidad base para el **Modo Multijugador Online** mediante tokens, manteniendo la opción de **Juego Solitario** existente.

## I. Vista Inicial: Menú Principal

Al cargar la aplicación/web, el usuario debe ser dirigido a una nueva vista de **Menú Principal** que debe contener los siguientes elementos de interacción:

1.  **Botón 🤝 Desafiar a un Amigo** (Generar Token)
2.  **Botón ✍️ Aceptar Desafío** (Ingresar Token)
3.  **Botón ♟️ Jugar en Solitario** (Modo Singleplayer)

---

## II. Flujo de "Desafiar a un Amigo" (Creación de Partida)

| Paso | Requerimiento Funcional | Estado de la Interfaz |
| :--- | :--- | :--- |
| **1.** | Al hacer clic en "Desafiar a un Amigo": | |
| **1.1** | Se debe generar un **token alfanumérico de 6 dígitos** único y aleatorio. | |
| **1.2** | Este token debe ser **almacenado temporalmente** en el servidor, marcando al jugador generador como "Jugador 1 / Sente (Blanco)". | |
| **2.** | **Actualización de la Interfaz:** El Menú Principal debe cambiar temporalmente a una vista de espera, mostrando: | |
| **2.1** | El **Token de 6 dígitos generado** (para compartir). |
| **2.2** | Mensaje de **"Esperando a que un amigo ingrese el código..."** |
| **2.3** | Un **Botón de ❌ Cancelar** (Ver Sección IV). |
| **3.** | **Inicio de Partida (Multijugador):** El sistema debe esperar la acción del "Jugador 2" (Ver Sección III). |

---

## III. Flujo de "Aceptar Desafío" (Unión a Partida)

| Paso | Requerimiento Funcional | Resultado (Si es exitoso) |
| :--- | :--- | :--- |
| **1.** | Al hacer clic en **"Aceptar Desafío"**: | Se debe mostrar un campo de entrada (input) para que el usuario escriba un token de 6 dígitos. |
| **2.** | El usuario ingresa un token y confirma. | |
| **3.** | El sistema debe **validar** si el token existe y si está en estado de espera. | |
| **4.** | **Si el Token es válido y la partida está en espera:** |
| **4.1** | Marcar al usuario como "Jugador 2 / Gote (Negro)". |
| **4.2** | El **Token debe ser inmediatamente eliminado** del servidor. |
| **4.3** | **Ambos jugadores** deben ser **llevados a la Vista del Tablero** (Ver Sección V). |
| **5.** | **Si el Token es inválido/No existe/Ya en uso:** | Mostrar mensaje de error ("Desafío no encontrado o expirado") y regresar al Menú Principal. |

---

## IV. Flujo de "Cancelar" Token (Desde Vista de Espera)

* Si el jugador que generó el token toca el **Botón ❌ Cancelar**, el sistema debe:
    1.  **Eliminar el token** del servidor.
    2.  **Regresar la interfaz** a la vista original del **Menú Principal**.

---

## V. Flujo de "Jugar en Solitario"

* Al hacer clic en el **Botón ♟️ Jugar en Solitario**:
    * El usuario debe ser llevado directamente a la **Vista del Tablero** existente (funcionalidad *singleplayer*).

---

## VI. Cambios en la Vista del Tablero (In-Game)

1.  **Botón de Salida:**
    * La Vista del Tablero (en ambos modos) debe incluir un **Botón de Salir/Menú**.
    * Al hacer clic, el usuario debe ser devuelto a la **Vista del Menú Principal**.
2.  **Lógica de Movimiento (Multijugador):**
    * **Restricción:** En partidas iniciadas por desafío, el jugador **solo podrá interactuar y mover las piezas de su color asignado** (Sente/Blanco o Gote/Negro).
    * Debe **impedirse** la interacción con las piezas del oponente.
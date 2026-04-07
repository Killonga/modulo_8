# Kanban API & App (Full-Stack)

Esta es una aplicación de tablero Kanban completa con un backend robusto basado en Node.js, Express y Sequelize (PostgreSQL), protegida mediante autenticación JWT y con un frontend dinámico renderizado con Handlebars (chupate esa)

## Características
- **Gestión de Tareas**: Crear, editar, mover de estado y eliminar tareas.
- **Soporte Multimedia**: Carga de imágenes para las tareas.
- **Comentarios Reales**: Sistema de comentarios por tarea vinculados a los usuarios.
- **Autenticación Segura**: Registro e inicio de sesión con contraseñas cifradas y JWT.
- **Renderizado Dinámico**: Los datos se cargan y actualizan desde la base de datos PostgreSQL.

---

## Requisitos Previos e Instalación

### 1. Variables de Entorno
Crea un archivo `.env` en la raíz del proyecto con la siguiente configuración:

```env
DB_NAME=name
DB_USER=user
DB_PASSWORD=passwrd
DB_HOST=localhost
DB_PORT=5432
JWT_SECRET=password
PORT=3000
```

### 2. Instalación de Dependencias
Ejecuta el siguiente comando para instalar todos los paquetes necesarios:

```bash
npm install
```

### 3. Iniciar la Aplicación
Para arrancar el servidor en modo desarrollo:

```bash
npm start
```
El servidor se sincronizará automáticamente con la base de datos (`sequelize.sync({ alter: true })`).

---

## Documentación de la API RESTful

La API se encuentra bajo el prefijo `/api` para las operaciones de datos. Todas las rutas de la API requieren un token JWT válido.

### 🔐 Autenticación
Estas rutas se gestionan directamente en la raíz `/`:

- **POST `/register`**
  - **Cuerpo**: `{ "username": "...", "email": "...", "password": "..." }`
  - **Respuesta**: 201 Created. Registra un nuevo usuario.

- **POST `/login`**
  - **Cuerpo**: `{ "email": "...", "password": "..." }`
  - **Respuesta**: 200 OK. Devuelve un token JWT y establece una cookie `token`.

- **GET `/logout`**
  - **Acción**: Limpia la cookie de autenticación y redirige al inicio.

### 📋 Tareas (`/api/tasks`)
*Requiere `Authorization: Bearer <token>` o cookie válida.*

- **GET `/api/tasks`**
  - **Respuesta**: Listado de tareas pertenecientes al usuario autenticado, incluyendo sus comentarios y el autor de los mismos.

- **POST `/api/tasks`**
  - **Cuerpo (FormData)**: `title`, `description`, `status` (`todo`, `in-progress`, `done`), `image` (archivo opcional).
  - **Respuesta**: 201 Created. Crea una nueva tarea.

- **PUT `/api/tasks/:id`**
  - **Cuerpo (FormData/JSON)**: Permite actualizar cualquier campo de la tarea y/o la imagen de portada.
  - **Respuesta**: 200 OK.

- **DELETE `/api/tasks/:id`**
  - **Respuesta**: 200 OK. Elimina la tarea si pertenece al usuario.

### 💬 Comentarios
- **POST `/api/tasks/:taskId/comments`**
  - **Cuerpo**: `{ "text": "..." }`
  - **Respuesta**: 201 Created. Añade un comentario a la tarea especificada vinculándolo al usuario actual.

---

## Seguridad y Protección
- **JWT (JSON Web Tokens)**: El sistema utiliza tokens firmados para validar la identidad del usuario. El middleware `auth.js` verifica el token en cada petición a la API.
- **Passwords**: Las contraseñas se gestionan de forma segura (normalmente mediante `bcrypt` en el modelo `User`).
- **Middleware de Protección**: Si un usuario no está autenticado, las rutas `/api` devolverán un código `401 Unauthorized`.

---

## Estructura del Proyecto
- `/models`: Definición de esquemas de Sequelize (User, Task, Comment).
- `/routes`: Lógica de los endpoints de Auth y API.
- `/middleware`: Control de acceso y protección de rutas.
- `/public`: Archivos estáticos y lógica del frontend (`js/board.js`).
- `/views`: Plantillas Handlebars para el renderizado del lado del servidor.

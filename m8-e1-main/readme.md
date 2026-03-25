# API de Tareas

API RESTful para la gestión de tareas (CRUD) desarrollada con **Node.js**, **Express** y **Sequelize**.

---

## Características

- Crear tareas
- Obtener todas las tareas
- Obtener tarea por ID
- Actualizar tareas
- Eliminar tareas
- Validación de datos (manual o con Zod)
- Manejo de errores

---

## Tecnologías

- Node.js
- Express
- Sequelize
- MySQL / PostgreSQL (según configuración)
- Zod (opcional para validaciones)
- Swagger / OpenAPI (documentación)

---

## Estructura del proyecto

```
/controllers
/models
/routes
/middlewares
/schemas
/config
```

---

## Instalación

1. Clonar el repositorio

```bash
git clone https://github.com/emeaereceo/m8-e1.git
cd m8-e1
```

2. Instalar dependencias

```bash
npm install
```

3. Configurar variables de entorno (`.env`)

```env
PORT=3000
DB_NAME=nombre_db
DB_USER=usuario
DB_PASSWORD=password
DB_HOST=localhost
```

4. Ejecutar el proyecto

```bash
npm run dev
```

---

## Endpoints

### Obtener todas las tareas

```
GET /tareas
```

---

### Obtener tarea por ID

```
GET /tareas/:id
```

---

### Crear tarea

```
POST /tareas
```

#### Body:

```json
{
  "titulo": "Estudiar Node",
  "descripcion": "Aprender Zod",
  "completada": false
}
```

---

### Actualizar tarea

```
PUT /tareas/:id
```

---

### Eliminar tarea

```
DELETE /tareas/:id
```

## Documentación API

Visitar para revisar la documentacion de la API

```
http://localhost:3000/docs
```

---

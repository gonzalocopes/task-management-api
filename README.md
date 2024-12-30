# Proyecto de Gestión de Proyectos

Este proyecto es una aplicación para gestionar proyectos, usuarios y tareas. Permite registrar usuarios, autenticarse, crear proyectos, asignar tareas y mucho más.

## Índice

- [Instrucciones de Configuración y Ejecución](#instrucciones-de-configuración-y-ejecución)
- [Documentación de la API](#documentación-de-la-api)
  - [Autenticación de Usuarios](#autenticación-de-usuarios)
  - [CRUD Proyectos](#crud-proyectos)
  - [CRUD Tareas](#crud-tareas)
- [Arquitectura y Decisiones](#arquitectura-y-decisiones)

## Instrucciones de Configuración y Ejecución
npm run dev:
Conexión a MongoDB exitosa

Autenticación de Usuarios 

Registrar un Usuario 

Realiza una solicitud POST a la siguiente URL con el siguiente cuerpo JSON: 

POST http://localhost:3000/api/auth/register 
 

Cuerpo JSON: 

{  

  "username": "gonzalo",  

  "password": "123456"  

} 

 
 

Iniciar Sesión 

Realiza una solicitud POST a la siguiente URL con el mismo cuerpo JSON: 

POST http://localhost:3000/api/auth/login 
 

Cuerpo JSON: 

{  

  "username": "gonzalo",  

  "password": "123456"  

} 

 

 
nos devuelve este mensaje con el token: 
 

{ 

    "message": "Login success", 

    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImdvbnphbG8iLCJpYXQiOjE3MzU0OTA5ODksImV4cCI6MTczNTQ5NDU4OX0.BVfdbo_XRebmeYVABT9uXx9LxO7-zCYNv8xl6fWknqI" 

} 

 

La respuesta será un token JWT, que debes incluir en las solicitudes posteriores en el encabezado Authorization como un Bearer Token. 

Cerrar Sesión 

Realiza una solicitud POST a la siguiente URL y proporciona el token en el encabezado Authorization como Bearer Token para cerrar sesión: 

POST http://localhost:3000/api/auth/logout 
nos devuelve : 

Cierre de sesión exitoso 

 
 

 

CRUD Proyectos 

Crear un Proyecto 

Realiza una solicitud POST a la siguiente URL con el siguiente cuerpo JSON: 

POST http://localhost:3000/api/projects 
 

Cuerpo JSON: 

{  

  "name": "Nuevo Proyecto1",  

  "description": "Descripción del nuevo proyecto"  

} 

 
Y nos devuelve: 
{ 

    "name": "Nuevo Proyecto1", 

    "description": "Descripción del nuevo proyecto", 

    "users": [], 

    "_id": "67717df93509c767c51e471f", 

    "tasks": [], 

    "__v": 0 

} 

 

Ver los Proyectos Existentes 

Realiza una solicitud GET a la siguiente URL para obtener una lista de los proyectos creados: 
GET http://localhost:3000/api/projects 
 

La respuesta podría ser algo como: 

[ 

    { 

        "_id": "6770555e3d9a5a75b669d50e", 

        "name": "Nuevo Proyecto1", 

        "description": "Descripción del nuevo proyecto", 

        "users": [ 

            null 

        ], 

        "__v": 1, 

        "tasks": [] 

    }, 

    { 

        "_id": "67705bfb2c7a714edffb637f", 

        "name": "prueba1", 

        "description": "Descripción del nuevo proyecto", 

        "users": [ 

            null 

        ], 

        "__v": 5, 

        "tasks": [ 

            { 

                "title": "Nueva tarea", 

                "description": "Descripción de la nueva tarea", 

                "assignedTo": "642f89a5b6f6fb63c08e63f2", 

                "dueDate": "2024-12-31T23:59:59.000Z", 

                "status": "pendiente", 

                "_id": "67705ebbaddf35468d524aee" 

            }, 

 
 

Actualizar un Proyecto 

Realiza una solicitud PUT a la siguiente URL con el siguiente cuerpo JSON: 

PUT http://localhost:3000/api/projects/{projectId} 
 

Cuerpo JSON: 

{  

  "name": "Proyecto Actualizado",  

  "description": "Descripción actualizada"  

} 

 
 

Asegúrate de reemplazar {projectId} con el ID del proyecto que deseas actualizar. 

Y nos devuelve: 

{ 

    "_id": "6770555e3d9a5a75b669d50e", 

    "name": "Proyecto Actualizado", 

    "description": "Descripción actualizada", 

    "users": [ 

        null 

    ], 

    "__v": 1, 

    "tasks": [] 

} 

 
 

Eliminar un Proyecto 

Realiza una solicitud DELETE a la siguiente URL: 

DELETE http://localhost:3000/api/projects/{projectId} 
 

La respuesta será un mensaje como: 

{ 

    "message": "Proyecto eliminado" 

} 

 
 

Agregar un Usuario a un Proyecto 

Realiza una solicitud POST a la siguiente URL con el siguiente cuerpo JSON: 

POST http://localhost:3000/api/projects/{projectId}/assign-user 
 

Cuerpo JSON: 

{  

  "username": "gonzalo"  

} 

 
 

La respuesta será un mensaje indicando que el usuario fue asignado correctamente al proyecto, algo como: 

{  

  "message": "Usuario asignado correctamente al proyecto",  

  "project": {  

    "_id": "67705bfb2c7a714edffb637f",  

    "name": "prueba1",  

    "description": "Descripción del nuevo proyecto",  

    "users": [null],  

    "__v": 1  

  }  

} 

 
 

 

CRUD Tareas 

Crear una Tarea 

Realiza una solicitud POST a la siguiente URL con el siguiente cuerpo JSON: 

POST http://localhost:3000/api/projects/{projectId}/tasks 
 

Cuerpo JSON: 

{  

  "title": "Tarea de prueba",  

  "description": "Descripción de la tarea",  

  "dueDate": "2024-12-31T23:59:59Z",  

  "assignedTo": "59b99db4cfa9a34dcd7885b6",   

  "status": "pendiente"  

} 

 
 

La respuesta será algo como: 

{ 

    "title": "Tarea de prueba", 

    "description": "Descripción de la tarea", 

    "assignedTo": "59b99db4cfa9a34dcd7885b6", 

    "dueDate": "2024-12-31T23:59:59Z", 

    "status": "pendiente" 

} 

 

La assignedTo la sacamos desde la base de datos de mongo: 
 para actualizar la tarea por ejemplo : http://localhost:3000/api/tasks/tasks/677186777fba9f31ec0bf0ea 

{ 

  "title": "Nueva tarea actualizada", 

  "description": "tarea nueva actualizada", 

  "status": "en progreso" 

} 

 

Y devuelve: 
 
ID de tarea a actualizar: 677186777fba9f31ec0bf0ea 

Datos recibidos: { 

  title: 'Nueva tarea actualizada', 

  description: 'tarea nueva actualizada', 

  status: 'en progreso' 

} 

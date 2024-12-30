import { createTask } from 'C:/Users/Gonza/Desktop/task-management-api/src/application/task.controller';
import Task from 'C:/Users/Gonza/Desktop/task-management-api/src/application/task.controller';
import { mocked } from 'ts-jest';
import request from 'supertest';
import app from 'C:/Users/Gonza/Desktop/task-management-api/src/index'; // Ruta correcta para importar app

jest.mock('C:/Users/Gonza/Desktop/task-management-api/src/application/task.controller'); // Mocks el modelo de Task

describe('Task Controller', () => {
  
  it('debería crear una tarea correctamente', async () => {
    const newTask = { title: 'Tarea de prueba', description: 'Descripción', status: 'pendiente' };

    // Mocks para simular el comportamiento de save
    mocked(Task.prototype.save).mockResolvedValue(newTask as any);

    const result = await createTask(newTask);
    expect(result).toEqual(newTask);
    expect(Task.prototype.save).toHaveBeenCalled();
  });

  it('debería lanzar un error si no se puede crear la tarea', async () => {
    const newTask = { title: 'Tarea de prueba', description: 'Descripción', status: 'pendiente' };

    // Mocks para simular un rechazo en save
    mocked(Task.prototype.save).mockRejectedValue(new Error('Error en la base de datos'));

    await expect(createTask(newTask)).rejects.toThrow('Error en la base de datos');
  });

  it('debería crear una tarea correctamente a través de la API', async () => {
    const newTask = { title: 'Tarea de prueba', description: 'Descripción', status: 'pendiente' };

    const response = await request(app)
      .post('/tasks')  // Ruta para crear una tarea
      .send(newTask);

    expect(response.status).toBe(201);
    expect(response.body.title).toBe('Tarea de prueba');
    expect(response.body.description).toBe('Descripción');
    expect(response.body.status).toBe('pendiente');
  });
});



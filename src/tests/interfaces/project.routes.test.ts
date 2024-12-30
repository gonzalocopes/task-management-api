import request from 'supertest';
import app from 'C:/Users/Gonza/Desktop/task-management-api/src/index';  // Importación por defecto


describe('Project Routes', () => {
  it('debería crear un proyecto correctamente', async () => {
    const newProject = { name: 'Nuevo Proyecto', description: 'Descripción del proyecto' };

    const response = await request(app)
      .post('/api/projects') // Asegúrate de que esta ruta sea correcta
      .set('Authorization', `Bearer your-token-here`) // Sustituye por un token válido
      .send(newProject);

    expect(response.status).toBe(201);
    expect(response.body.name).toBe('Nuevo Proyecto');
    expect(response.body.description).toBe('Descripción del proyecto');
  });

  it('debería obtener todos los proyectos', async () => {
    const response = await request(app)
      .get('/api/projects') // Ruta para obtener los proyectos
      .set('Authorization', `Bearer your-token-here`); // Sustituye por un token válido

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('debería retornar error 401 si el usuario no está autenticado', async () => {
    const response = await request(app)
      .post('/api/projects') // Ruta para crear un proyecto
      .send({ name: 'Proyecto sin autenticación', description: 'Descripción' });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Usuario no autenticado'); // Asegúrate de que esta sea la respuesta correcta en tu aplicación
  });
});

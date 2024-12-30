// src/interfaces/project.routes.ts
import { Router, Request, Response, NextFunction } from 'express';
import Project from '../domain/project.model';
import { authenticateJWT } from '../middleware/authenticateJWT';

// Extender la interfaz Request para incluir el tipo de user
interface CustomRequest extends Request {
  user?: {
    _id: string;
    username: string;
  };
}

const router = Router();

// Crear un proyecto
router.post('/', authenticateJWT, async (req: CustomRequest, res: Response, next: NextFunction) => {
  const { name, description } = req.body;
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Usuario no autenticado' });
      return;
    }

    const newProject = new Project({ name, description, users: [] });
    await newProject.save();
    res.status(201).json(newProject);
  } catch (error) {
    next(error); // Pasa el error al middleware de manejo de errores
  }
});

// Obtener todos los proyectos
router.get('/', authenticateJWT, async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Usuario no autenticado' });
      return;
    }

    const projects = await Project.find();
    res.json(projects);
  } catch (error) {
    next(error); // Pasa el error al middleware de manejo de errores
  }
});

// Actualizar un proyecto
router.put('/:id', authenticateJWT, async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Usuario no autenticado' });
      return;
    }

    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!project) {
      res.status(404).json({ message: 'Proyecto no encontrado' });
      return;
    }
    res.json(project);
  } catch (error) {
    next(error); // Pasa el error al middleware de manejo de errores
  }
});

// Eliminar un proyecto
router.delete('/:id', authenticateJWT, async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Usuario no autenticado' });
      return;
    }

    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) {
      res.status(404).json({ message: 'Proyecto no encontrado' });
      return;
    }
    res.json({ message: 'Proyecto eliminado' });
  } catch (error) {
    next(error); // Pasa el error al middleware de manejo de errores
  }
});

// Asignar un usuario a un proyecto
router.post('/:projectId/assign-user', authenticateJWT, async (req: CustomRequest, res: Response, next: NextFunction) => {
  const { projectId } = req.params; // ID del proyecto
  const { userId } = req.body; // ID del usuario a asignar

  try {
    if (!req.user) {
      res.status(401).json({ message: 'Usuario no autenticado' });
      return;
    }

    // Buscar el proyecto por ID
    const project = await Project.findById(projectId);
    if (!project) {
      res.status(404).json({ message: 'Proyecto no encontrado' });
      return;
    }

    // Verificar si el usuario ya está asignado
    if (project.users.includes(userId)) {
      res.status(400).json({ message: 'El usuario ya está asignado a este proyecto' });
      return;
    }

    // Asignar el usuario al proyecto
    project.users.push(userId);
    await project.save();

    res.status(200).json({ message: 'Usuario asignado correctamente al proyecto', project });
  } catch (error) {
    next(error); // Pasa el error al middleware de manejo de errores
  }
});

// Crear una tarea en un proyecto
router.post('/:projectId/tasks', authenticateJWT, async (req: CustomRequest, res: Response, next: NextFunction) => {
  const { title, description, assignedTo, dueDate, status } = req.body;
  const { projectId } = req.params;

  try {
    if (!req.user) {
      res.status(401).json({ message: 'Usuario no autenticado' });
      return;
    }

    // Buscar el proyecto por ID
    const project = await Project.findById(projectId);
    if (!project) {
      res.status(404).json({ message: 'Proyecto no encontrado' });
      return;
    }

    // Crear la nueva tarea
    const newTask = {
      title,
      description,
      assignedTo,
      dueDate,
      status,
    };

    // Agregar la tarea al proyecto
    project.tasks.push(newTask);
    await project.save();

    res.status(201).json(newTask); // Devolver la tarea creada
  } catch (error) {
    next(error); // Pasa el error al middleware de manejo de errores
  }
});

export default router;

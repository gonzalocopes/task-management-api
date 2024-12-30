import { Router, Request, Response, NextFunction } from 'express';
import { authenticateJWT } from '../middleware/authenticateJWT';
import Task from '../domain/task.model';
import Project from '../domain/project.model'; // Asegúrate de que esta importación esté presente
import mongoose from 'mongoose';

interface CustomRequest extends Request {
  user?: {
    _id: string;
    username: string;
  };
}

const router = Router();

// Ruta para obtener todas las tareas de un proyecto específico
router.get('/projects/:projectId/tasks', authenticateJWT, async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Usuario no autenticado' });
      return;
    }

    const { projectId } = req.params;
    const tasks = await Task.find({ userId: req.user._id, projectId: projectId });
    res.json(tasks);
  } catch (error) {
    next(error);
  }
});

// Ruta para obtener todos los proyectos y sus tareas
router.get('/projects', authenticateJWT, async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Usuario no autenticado' });
      return;
    }

    const projects = await Project.find({ userId: req.user._id }).populate('tasks');
    res.json(projects);
  } catch (error) {
    next(error);
  }
});

// Ruta para obtener una tarea específica por su ID
router.get('/tasks/:id', authenticateJWT, async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Usuario no autenticado' });
      return;
    }

    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: 'ID de tarea no válido' });
      return;
    }

    const task = await Task.findOne({ _id: id, userId: req.user._id });
    if (!task) {
      res.status(404).json({ message: 'Tarea no encontrada o no autorizada' });
      return;
    }

    res.json(task);
  } catch (error) {
    next(error);
  }
});

// Ruta para actualizar una tarea
router.put('/tasks/:id', authenticateJWT, async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Usuario no autenticado' });
      return;
    }

    const { id } = req.params;
    const { title, description, assignedTo, dueDate, status, projectId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: 'ID de tarea no válido' });
      return;
    }

    const task = await Task.findOne({ _id: id, userId: req.user._id });
    if (!task) {
      res.status(404).json({ message: 'Tarea no encontrada o no autorizada' });
      return;
    }

    if (projectId) {
      const project = await Project.findOne({ _id: projectId, userId: req.user._id });
      if (!project) {
        res.status(400).json({ message: 'Proyecto no encontrado o no autorizado' });
        return;
      }
    }

    task.title = title || task.title;
    task.description = description || task.description;
    task.assignedTo = assignedTo || task.assignedTo;
    task.dueDate = dueDate || task.dueDate;
    task.status = status || task.status;
    task.projectId = projectId || task.projectId;

    await task.save();

    res.json(task);
  } catch (error) {
    next(error);
  }
});

// Ruta para eliminar una tarea
router.delete('/tasks/:id', authenticateJWT, async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Usuario no autenticado' });
      return;
    }

    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: 'ID de tarea no válido' });
      return;
    }

    const task = await Task.findOneAndDelete({ _id: id, userId: req.user._id });
    if (!task) {
      res.status(404).json({ message: 'Tarea no encontrada o no autorizada' });
      return;
    }

    res.json({ message: 'Tarea eliminada correctamente' });
  } catch (error) {
    next(error);
  }
});

export default router;

// src/application/task.controller.ts
import { Request, Response } from 'express';
import Task from '../domain/task.model';
import Project from '../domain/project.model';

// Exporta las funciones
export const getTasksByProject = async (req: Request, res: Response) => {
  try {
    const project = await Project.findById(req.params.projectId).populate('tasks');
    if (!project) {
      return res.status(404).json({ message: 'Proyecto no encontrado' });
    }
    res.status(200).json(project.tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las tareas' });
  }
};

export const getTaskById = async (req: Request, res: Response) => {
  try {
    const task = await Task.findById(req.params.taskId).populate('assignedTo');
    if (!task) {
      return res.status(404).json({ message: 'Tarea no encontrada' });
    }
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener la tarea' });
  }
};

export const updateTask = async (req: Request, res: Response) => {
  try {
    const { taskId } = req.params;
    const { status, assignedTo, dueDate } = req.body;

    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      { status, assignedTo, dueDate },
      { new: true }
    ).populate('assignedTo');

    if (!updatedTask) {
      return res.status(404).json({ message: 'Tarea no encontrada' });
    }

    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar la tarea' });
  }
};

// Agregar la función createTask
export const createTask = async (req: Request, res: Response) => {
  try {
    const { name, description, projectId } = req.body;
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: 'Proyecto no encontrado' });
    }

    const newTask = new Task({ name, description, project: projectId });
    await newTask.save();

    // Relacionar la tarea con el proyecto
    project.tasks.push(newTask._id);
    await project.save();

    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear la tarea' });
  }
};

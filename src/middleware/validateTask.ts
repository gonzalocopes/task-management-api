// src/middleware/validateTask.ts
import { Request, Response, NextFunction } from 'express';
import { createTaskValidation } from '../application/validations/task.validation';

export const validateCreateTask = (req: Request, res: Response, next: NextFunction) => {
  const { error } = createTaskValidation.validate(req.body);

  if (error) {
    return res.status(400).json({
      message: 'Error de validación',
      details: error.details.map((err) => err.message)
    });
  }
  
  // Si la validación es exitosa, continuar con la ejecución
  next();
};

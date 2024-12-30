// src/application/validations/task.validation.ts
import Joi from 'joi';

// Validación para la creación de tareas
export const createTaskValidation = Joi.object({
  name: Joi.string()
    .min(3)
    .max(255)
    .required()
    .messages({
      'string.base': 'El nombre debe ser una cadena de texto.',
      'string.min': 'El nombre debe tener al menos 3 caracteres.',
      'string.max': 'El nombre no puede superar los 255 caracteres.',
      'any.required': 'El nombre es obligatorio.',
    }),
  
  description: Joi.string()
    .min(10)
    .max(1000)
    .required()
    .messages({
      'string.base': 'La descripción debe ser una cadena de texto.',
      'string.min': 'La descripción debe tener al menos 10 caracteres.',
      'string.max': 'La descripción no puede superar los 1000 caracteres.',
      'any.required': 'La descripción es obligatoria.',
    }),
  
  status: Joi.string()
    .valid('pending', 'in_progress', 'completed')
    .required()
    .messages({
      'any.only': 'El estado debe ser uno de los siguientes: pending, in_progress, completed.',
      'any.required': 'El estado es obligatorio.',
    }),
  
  dueDate: Joi.date()
    .greater('now')
    .optional()
    .messages({
      'date.base': 'La fecha de vencimiento debe ser una fecha válida.',
      'date.greater': 'La fecha de vencimiento debe ser en el futuro.',
    }),

  projectId: Joi.string()
    .hex()
    .length(24)
    .required()
    .messages({
      'string.base': 'El projectId debe ser una cadena de texto.',
      'string.hex': 'El projectId debe ser un ID de MongoDB válido.',
      'string.length': 'El projectId debe tener 24 caracteres.',
      'any.required': 'El projectId es obligatorio.',
    }),

  assignedTo: Joi.string()
    .hex()
    .length(24)
    .optional()
    .messages({
      'string.base': 'assignedTo debe ser una cadena de texto.',
      'string.hex': 'assignedTo debe ser un ID de usuario válido.',
      'string.length': 'assignedTo debe tener 24 caracteres.',
    })
});

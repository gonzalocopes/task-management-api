// src/middleware/errorHandler.ts

import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../utils/CustomError';

const errorHandler = (
  err: Error | CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Si es un error personalizado (CustomError), usamos sus detalles
  if (err instanceof CustomError) {
    return res.status(err.statusCode).json({
      message: err.message,
      error: err.isOperational ? null : err.stack,
    });
  }

  // Para errores no controlados (como errores internos del servidor)
  console.error(err); // En un entorno de producción, puedes logearlo con una librería como Winston
  return res.status(500).json({
    message: 'Algo salió mal. Por favor intente más tarde.',
    error: err.stack,
  });
};

export default errorHandler;

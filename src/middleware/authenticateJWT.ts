// src/middleware/authenticateJWT.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface CustomRequest extends Request {
  user?: any;
}

export const authenticateJWT = (req: CustomRequest, res: Response, next: NextFunction): void => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    res.status(403).send('Acceso denegado');
    return;
  }

  jwt.verify(token, process.env.JWT_SECRET!, (err: any, user: any) => {
    if (err) {
      res.status(403).send('Token no válido');
      return;
    }
    req.user = user;
    next();
  });
};

import { authenticateJWT } from 'C:/Users/Gonza/Desktop/task-management-api/src/middleware/authenticateJWT'; 
import { Request, Response, NextFunction } from 'express';

describe('authenticateJWT Middleware', () => {
  it('debería pasar si el token es válido', () => {
    const req = { headers: { authorization: 'Bearer valid-token' } } as Partial<Request>;
    const res = {} as Partial<Response>;
    const next = jest.fn();

    authenticateJWT(req as Request, res as Response, next as NextFunction);

    expect(next).toHaveBeenCalled();
  });

  it('debería retornar error 401 si el token es inválido', () => {
    const req = { headers: { authorization: 'Bearer invalid-token' } } as Partial<Request>;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as Partial<Response>;
    const next = jest.fn();

    authenticateJWT(req as Request, res as Response, next as NextFunction);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Token no válido' });
  });
});



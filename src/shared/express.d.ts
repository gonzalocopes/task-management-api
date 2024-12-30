// src/shared/express.d.ts
import { IUser } from '../domain/user.model'; // Asegúrate de que la ruta sea correcta

declare global {
  namespace Express {
    interface Request {
      user?: IUser; // Agregar la propiedad user
    }
  }
}

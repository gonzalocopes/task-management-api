import express, { Request, Response, NextFunction, RequestHandler } from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import authRoutes from './interfaces/auth.routes'; // Rutas de autenticación
import errorHandler from './middleware/errorHandler'; // Middleware de manejo de errores
import taskRoutes from './interfaces/tasks.routes'; // Rutas de tareas
import projectRoutes from './interfaces/project.routes'; // Rutas de proyectos
import { authenticateJWT } from './middleware/authenticateJWT'; // Middleware de autenticación JWT
import { setupSwagger } from './config/swagger'; // Importar configuración Swagger

dotenv.config();

if (!process.env.MONGO_URI || !process.env.JWT_SECRET || !process.env.JWT_EXPIRES_IN) {
  console.error('Faltan variables de entorno necesarias');
  process.exit(1); // Detiene la aplicación si falta alguna variable
}

const app = express();
app.use(express.json());

// Conexión a MongoDB
mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGO_URI as string)
  .then(() => console.log('Conexión a MongoDB exitosa'))
  .catch((err: any) => console.error('Error de conexión a MongoDB:', err));

// Configurar Swagger para la documentación de la API
setupSwagger(app); // Aquí se configura Swagger

// Modelo de Usuario
const User = mongoose.model('User', new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
}));

const revokedTokens: string[] = [];

// Ruta de registro de usuario
app.post('/api/auth/register', async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      res.status(400).send('El nombre de usuario ya está en uso');
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();
    
    res.status(201).send('Usuario registrado');
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).send('Error al registrar usuario');
  }
});

// Ruta de inicio de sesión
app.post('/api/auth/login', async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      res.status(400).send('Usuario o contraseña incorrectos');
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(400).send('Usuario o contraseña incorrectos');
      return;
    }

    const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET as string, { expiresIn: process.env.JWT_EXPIRES_IN });
    
    res.json({ message: 'Login success', token });
  } catch (error) {
    console.error('Error durante el login:', error);
    res.status(500).send('Error durante el login');
  }
});

// Ruta de cierre de sesión
app.post('/api/auth/logout', authenticateJWT as RequestHandler, (req: Request, res: Response): void => {
  revokedTokens.push(req.header('Authorization')?.replace('Bearer ', '') || '');
  res.send('Cierre de sesión exitoso');
});

// Usar las rutas importadas para la autenticación, tareas y proyectos
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/projects', projectRoutes);  // Aquí se usan las rutas de proyectos

// Configuración del puerto y arranque del servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

// Manejo global de errores
app.use((err: any, req: Request, res: Response, next: NextFunction): void => {
  console.error(err.stack);
  res.status(500).send('Algo salió mal');
});

// Exportar la app como predeterminada
export default app;

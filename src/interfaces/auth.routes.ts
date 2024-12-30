import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = Router();

// Función de login
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;

  try {
    const user = { username: 'admin', password: '$2a$10$kFx.kRiTcPBnVVgVZWu5t.s98M0mYvM6I9q/uw0ho2akngql9cqaG' }; // Contraseña cifrada de ejemplo

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).send('Credenciales inválidas');
      return;
    }

    const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET!, { expiresIn: '1h' });

    res.json({ message: 'Login success', token });

  } catch (error) {
    console.error('Error durante el login:', error);
    res.status(500).send('Error durante el login');
  }
});

export default router;

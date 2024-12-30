import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User, { IUser } from "../domain/user.model";

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Usuario ya registrado" });

    // Crear nuevo usuario
    const newUser: IUser = new User({ name, email, password });
    await newUser.save();

    // Generar token
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET as string, {
      expiresIn: "1h",
    });

    res.status(201).json({ token });
  } catch (error) {
    res.status(500).json({ message: "Error al registrar el usuario", error });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Verificar si el usuario existe
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    // Verificar contraseña
    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: "Contraseña incorrecta" });

    // Generar token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, {
      expiresIn: "1h",
    });

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: "Error al iniciar sesión", error });
  }
};

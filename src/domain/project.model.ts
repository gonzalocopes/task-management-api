// src/domain/project.model.ts
import { Schema, model, Document } from 'mongoose';

// Define el esquema para las tareas
interface ITask {
  title: string;
  description: string;
  assignedTo: Schema.Types.ObjectId; // Cambiado a ObjectId para hacer referencia a un usuario
  dueDate?: Date;
  status: 'pendiente' | 'en progreso' | 'completado';  // Restringir los posibles valores de status
}

interface IProject extends Document {
  name: string;
  description: string;
  users: Schema.Types.ObjectId[];  // Referencia a los usuarios
  tasks: ITask[];  // Tareas asociadas al proyecto
}

// Define el esquema de tareas
const taskSchema = new Schema<ITask>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  assignedTo: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // Referencia al modelo User
  dueDate: {
    type: Date,
    validate: {
      validator: (value: Date) => !value || value > new Date(),  // Validación para que la fecha de vencimiento no sea anterior a la actual
      message: 'La fecha de vencimiento no puede ser anterior a la fecha actual',
    },
  },
  status: { type: String, enum: ['pendiente', 'en progreso', 'completado'], default: 'pendiente', required: true },
});

// Define el esquema del proyecto
const projectSchema = new Schema<IProject>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  users: [{ type: Schema.Types.ObjectId, ref: 'User' }],  // Usuarios asociados al proyecto
  tasks: [taskSchema],  // Campo para las tareas asociadas al proyecto
}, {
  timestamps: true,  // Agregar campos createdAt y updatedAt automáticamente
});

const Project = model<IProject>('Project', projectSchema);

export default Project;

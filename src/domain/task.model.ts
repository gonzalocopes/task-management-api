import mongoose, { Schema, Document } from 'mongoose';

export interface Task extends Document {
  title: string;
  description: string;
  userId: mongoose.Schema.Types.ObjectId;
  projectId: mongoose.Schema.Types.ObjectId;
  status: 'pending' | 'in-progress' | 'completed';
  dueDate: Date;
  assignedTo?: mongoose.Schema.Types.ObjectId; // Usuario asignado a la tarea (opcional)
}

// Definir el esquema para las tareas
const taskSchema = new Schema<Task>(
  {
    title: {
      type: String,
      required: [true, 'El título es obligatorio'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'La descripción es obligatoria'],
      trim: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'El ID de usuario es obligatorio'],
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: [true, 'El ID de proyecto es obligatorio'],
    },
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'completed'],
      default: 'pending',
    },
    dueDate: {
      type: Date,
      required: [true, 'La fecha de vencimiento es obligatoria'],
      validate: {
        validator: (value: Date) => value > new Date(),
        message: 'La fecha de vencimiento no puede ser anterior a la fecha actual',
      },
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Referencia al modelo User
      required: false, // Puede ser opcional
    },
  },
  {
    timestamps: true, // Crea los campos createdAt y updatedAt automáticamente
  }
);

// Crear el modelo de la tarea
const Task = mongoose.model<Task>('Task', taskSchema);

export default Task;

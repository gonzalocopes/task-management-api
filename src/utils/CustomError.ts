// src/utils/CustomError.ts

export class CustomError extends Error {
    public statusCode: number;
    public message: string;
    public isOperational: boolean;
  
    constructor(message: string, statusCode: number) {
      super(message);
      this.statusCode = statusCode;
      this.isOperational = true; // Indica que este es un error controlado
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
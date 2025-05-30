export type TaskStatus = 'pendiente' | 'completada';

export interface Task {
    id: number;
    titulo: string;
    descripcion: string;
    status: TaskStatus;
    fechaCreacion: Date;
    fechaActualizacion: Date;
}
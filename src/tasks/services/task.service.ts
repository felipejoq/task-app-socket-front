import type { Task, TaskStatus } from "../types/task.types";
import type { AllTasksResponse, TaskCreatedAndUpdateResponse, TaskDeletedResponse } from "../types/task.types.response";

export class TaskService {

    static async getTasks(): Promise<AllTasksResponse> {
        try {
            const response = await fetch(`${import.meta.env.VITE_SERVICE_URL}/tasks`);
            if (!response.ok) {
                throw new Error('Error al obtener las tareas');
            }
            return await response.json() as AllTasksResponse;
        } catch (error) {
            console.error('Error en getTasks:', error);
            throw error;
        }
    }

    static async createTask(task: Pick<Task, "titulo" | "status" | "descripcion">): Promise<TaskCreatedAndUpdateResponse> {
        try {
            const response = await fetch(`${import.meta.env.VITE_SERVICE_URL}/tasks`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(task),
            });
            if (!response.ok) {
                throw new Error('Error al crear la tarea');
            }
            return await response.json() as TaskCreatedAndUpdateResponse;
        } catch (error) {
            console.error('Error en createTask:', error);
            throw error;
        }
    }

    static async toggleStatus(task: Task): Promise<TaskCreatedAndUpdateResponse> {

        const { id, status } = task;

        const newStatus: TaskStatus = status === 'pendiente' ? 'completada' : 'pendiente';

        try {
            const response = await fetch(`${import.meta.env.VITE_SERVICE_URL}/tasks/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: newStatus }),
            });
            if (!response.ok) {
                throw new Error('Error al actualizar el estado de la tarea');
            }
            return await response.json() as TaskCreatedAndUpdateResponse;
        } catch (error) {
            console.error('Error en toggleStatus:', error);
            throw error;
        }
    }

    static async deleteTask(id: number): Promise<TaskDeletedResponse> {
        try {
            const response = await fetch(`${import.meta.env.VITE_SERVICE_URL}/tasks/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Error al eliminar la tarea');
            }
            return await response.json() as TaskDeletedResponse;
        } catch (error) {
            console.error('Error en deleteTask:', error);
            throw error;
        }
    }

}
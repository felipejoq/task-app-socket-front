import type { Task } from "./task.types";

export interface AllTasksResponse {
    result: {
        tasks: Task[];
    };
}

export interface Result {
    message?: string;
    task:    Task;
}
export interface TaskCreatedAndUpdateResponse {
    result: Result;
}

export interface TaskDeletedResponse {
    result: Result;
}

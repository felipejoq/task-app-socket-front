import "./styles/globals.css";
import { useEffect, useState } from "react";
import { TaskService } from "./tasks/services/task.service";
import type { Task } from "./tasks/types/task.types";
import { parseDateToChile } from "./tasks/utils/task.date";
import { socket } from "./socket/socket";
import { TaskEvent } from "./tasks/types/task.events";
import { toast } from "sonner";

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
      console.log("Conectado al servidor de tareas");

    }

    function onDisconnect() {
      setIsConnected(false);
      console.log("Desconectado del servidor de tareas");
    }

    function onUpdateTask(task: Task) {
      setTasks(tasks => tasks.map(t => t.id === task.id ? task : t));
      console.log("Tarea actualizada:", task.id);
    }

    function onCreateTask(task: Task) {
      setTasks(tasks => [task, ...tasks]);
      console.log("Tarea creada:", task.id);
    }

    function onDeleteTask(taskId: number) {
      setTasks(tasks => tasks.filter(t => t.id !== taskId));
      console.log("Tarea eliminada:", taskId);
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on(TaskEvent.TASK_UPDATED, onUpdateTask);
    socket.on(TaskEvent.TASK_CREATED, onCreateTask);
    socket.on(TaskEvent.TASK_DELETED, onDeleteTask);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off(TaskEvent.TASK_UPDATED, onUpdateTask);
      socket.off(TaskEvent.TASK_CREATED, onCreateTask);
      socket.off(TaskEvent.TASK_DELETED, onDeleteTask);
    };
  }, []);

  useEffect(() => {
    TaskService.getTasks()
      .then(response => {
        setTasks(response.result.tasks);
      })
      .catch(error => {
        console.error("Error al obtener las tareas:", error);
      })
      .finally(() => setLoading(false));
  }, [tasks]);

  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");

  const toggleStatus = (task: Task) => {
    TaskService.toggleStatus(task)
      .then(response => {
        toast(response.result.message || "Estado de la tarea actualizado exitosamente");
      })
      .catch(error => {
        console.error("Error al cambiar el estado de la tarea:", error);
      });
  };

  const deleteTask = (id: number) => {
    TaskService.deleteTask(id)
      .then(response => {
        toast(response.result.message || "Tarea eliminada exitosamente");
      })
      .catch(error => {
        console.error("Error al eliminar la tarea:", error);
      });

  };

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo.trim()) return;

    TaskService.createTask({ titulo, status: "pendiente" })
      .then(response => {
        toast(response.result.message || "Tarea creada exitosamente");
      })
      .catch(error => {
        console.error("Error al crear la tarea:", error);
      });

    setTitulo("");
    setDescripcion("");
  };

  return (
    <div className="max-w-xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-blue-700">TO-DO List ({isConnected ? <span className="text-green-600">conectado</span> : <span className="text-orange-400">desconectado</span>})</h1>
      {loading ? (
        <div className="text-center text-gray-500 py-8">Cargando tareas...</div>
      ) : (
        <>
          <form onSubmit={addTask} className="mb-6">
            <input
              type="text"
              placeholder="Título de la tarea"
              value={titulo}
              onChange={e => setTitulo(e.target.value)}
              required
              className="w-full p-2 mb-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <textarea
              placeholder="Descripción (opcional)"
              value={descripcion}
              onChange={e => setDescripcion(e.target.value)}
              className="w-full p-2 mb-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors">
              Agregar tarea
            </button>
          </form>
          <ul className="list-none p-0">
            {tasks.map(task => (
              <li key={task.id} className="flex items-start justify-between p-3 border-b border-gray-100">
                <div className="flex-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={task.status === "completada"}
                      onChange={() => toggleStatus(task)}
                      className="accent-blue-600 w-4 h-4"
                    />
                    <span className={task.status === "completada" ? "line-through font-semibold text-gray-400" : "font-semibold text-gray-800"}>{task.titulo}</span>
                  </label>
                  <div className="text-gray-600 text-sm mt-1">{task.descripcion}</div>
                  <div className="text-gray-400 text-xs mt-1">
                    <span className="font-bold">Creada:</span> {parseDateToChile(new Date(task.fechaCreacion))}
                  </div>
                  <div className="text-gray-400 text-xs mt-1">
                    <span className="font-bold">Última actualización:</span> {parseDateToChile(new Date(task.fechaActualizacion))}
                  </div>
                </div>
                <button onClick={() => deleteTask(task.id)} className="ml-4 bg-red-500 hover:bg-red-600 text-white rounded px-3 py-1 text-sm transition-colors">
                  Eliminar
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default App;

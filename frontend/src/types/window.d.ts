// Declaraciones globales para propiedades personalizadas en window
export {};

declare global {
  interface Window {
    deleteTask: (taskId: number) => Promise<void>;
    handleDelete: (taskId: number) => Promise<void>;
    
    // Funciones para gestión de listas
    openTaskListsManager: () => void;
    closeTaskListsManager: () => void;
    openCreateListForm: () => void;
    editTaskList: (listId: number) => void;
    deleteTaskList: (listId: number) => void;
    closeListForm: () => void;
    populateTaskFormListSelector: () => void;
  }
}

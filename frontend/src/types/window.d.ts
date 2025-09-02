// Declaraciones globales para propiedades personalizadas en window
export {};

declare global {
  interface Window {
    deleteTask: (taskId: number) => Promise<void>;
    handleDelete: (taskId: number) => Promise<void>;
  }
}

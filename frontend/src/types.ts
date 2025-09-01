// types.ts - Tipos de datos para TurifyTasks

export interface Task {
  id: number;
  title: string;
  description?: string;
  priority: 'baja' | 'media' | 'alta';
  completed: boolean;
  due_date?: string;
  list_id?: number;
  list_name?: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: number;
  email: string;
  name?: string;
}

export interface TaskFormData {
  title: string;
  description?: string;
  priority: 'baja' | 'media' | 'alta';
  due_date?: string;
  list_id?: number;
}

// Extender la interfaz Window con nuestras funciones globales
declare global {
  interface Window {
    // Task management
    showTaskForm: (mode?: 'create' | 'edit', taskData?: Task | null) => void;
    closeTaskForm: () => void;
    handleTaskFormSubmit: (event: Event) => Promise<void>;
    submitTask: (taskData: TaskFormData) => Promise<void>;
    
    // Task operations
    refreshTasks: () => void;
    handleToggle: (taskId: number, completed: boolean) => Promise<void>;
    handleEdit: (taskId: number) => void;
    handleDelete: (taskId: number) => Promise<void>;
    
    // Search and filters
    handleSearch: (searchTerm: string) => void;
    handleFilter: () => void;
    
    // UI utilities
    showToast: (message: string, type?: 'success' | 'error' | 'info', duration?: number) => void;
    toggleTaskListLoading: (show: boolean) => void;
    
    // Auth
    logout: () => Promise<void>;
  }
}

import path from "path";
import { fileURLToPath } from "url";

// Get the directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class AsanaService {
  private asanaApi: any = null;
  private initialized = false;

  constructor() {
    this.loadAsanaApi();
  }

  private async loadAsanaApi() {
    try {
      // Import the ES module version of asana.js
      this.asanaApi = await import('../../../../asana/index.js');
      this.initialized = true;
      console.debug("Asana API loaded successfully");
    } catch (error: any) {
      console.debug("Error loading Asana API:", error.message);
      console.debug("Using stub implementations instead");
      this.initialized = false;
    }
  }

  private async ensureInitialized() {
    if (!this.initialized && !this.asanaApi) {
      await this.loadAsanaApi();
    }
  }

  // Task methods
  async createTask(name: string, description?: string, dueDate?: string, assignee?: string, project?: string) {
    await this.ensureInitialized();
    
    if (this.asanaApi) {
      return await this.asanaApi.createTask(name, description, dueDate, assignee, project);
    } else {
      // Stub implementation
      return {
        data: {
          gid: Math.floor(Math.random() * 10000000000).toString(),
          name: name
        }
      };
    }
  }

  async listTasks(projectId?: string) {
    await this.ensureInitialized();
    
    if (this.asanaApi) {
      return await this.asanaApi.listTasks(projectId);
    } else {
      // Stub implementation
      return {
        data: [
          {
            gid: "1234567890",
            name: "Example Task 1",
            completed: false,
            due_on: "2025-04-01",
            assignee: null
          },
          {
            gid: "0987654321", 
            name: "Example Task 2",
            completed: true,
            due_on: "2025-03-15",
            assignee: { name: "Test User" }
          }
        ]
      };
    }
  }

  async updateTask(taskId: string, updatedFields: any) {
    await this.ensureInitialized();
    
    if (this.asanaApi) {
      return await this.asanaApi.updateTask(taskId, updatedFields);
    } else {
      // Stub implementation
      return { data: { gid: taskId } };
    }
  }

  async deleteTask(taskId: string) {
    await this.ensureInitialized();
    
    if (this.asanaApi) {
      return await this.asanaApi.deleteTask(taskId);
    } else {
      // Stub implementation
      return { data: {} };
    }
  }

  // Subtask methods
  async createSubtask(parentTaskId: string, name: string, description?: string, dueDate?: string, assignee?: string) {
    await this.ensureInitialized();
    
    if (this.asanaApi) {
      return await this.asanaApi.createSubtask(parentTaskId, name, description, dueDate, assignee);
    } else {
      // Stub implementation
      return {
        data: {
          gid: Math.floor(Math.random() * 10000000000).toString(),
          name: name
        }
      };
    }
  }

  async listSubtasks(parentTaskId: string) {
    await this.ensureInitialized();
    
    if (this.asanaApi) {
      return await this.asanaApi.listSubtasks(parentTaskId);
    } else {
      // Stub implementation
      return {
        data: [
          {
            gid: "1111111111",
            name: "Example Subtask 1",
            completed: false,
            due_on: "2025-04-01"
          },
          {
            gid: "2222222222",
            name: "Example Subtask 2", 
            completed: true,
            due_on: "2025-03-15"
          }
        ]
      };
    }
  }

  async updateSubtask(subtaskId: string, updatedFields: any) {
    await this.ensureInitialized();
    
    if (this.asanaApi) {
      return await this.asanaApi.updateSubtask(subtaskId, updatedFields);
    } else {
      // Stub implementation
      return { data: { gid: subtaskId } };
    }
  }

  async deleteSubtask(subtaskId: string) {
    await this.ensureInitialized();
    
    if (this.asanaApi) {
      return await this.asanaApi.deleteSubtask(subtaskId);
    } else {
      // Stub implementation
      return { data: {} };
    }
  }

  // Project methods
  async createProject(name: string, notes?: string, color?: string, isPublic?: boolean, workspaceId?: string) {
    await this.ensureInitialized();
    
    if (this.asanaApi) {
      return await this.asanaApi.createProject(name, notes, color, isPublic, workspaceId);
    } else {
      // Stub implementation
      return {
        data: {
          gid: Math.floor(Math.random() * 10000000000).toString(),
          name: name
        }
      };
    }
  }

  async listProjects(workspaceId?: string) {
    await this.ensureInitialized();
    
    if (this.asanaApi) {
      return await this.asanaApi.listProjects(workspaceId);
    } else {
      // Stub implementation
      return { data: [] };
    }
  }

  async deleteProject(projectId: string) {
    await this.ensureInitialized();
    
    if (this.asanaApi) {
      return await this.asanaApi.deleteProject(projectId);
    } else {
      // Stub implementation
      return { data: {} };
    }
  }

  // Section methods
  async createSection(projectId: string, name: string, insertBefore?: string, insertAfter?: string) {
    await this.ensureInitialized();
    
    if (this.asanaApi) {
      return await this.asanaApi.createSection(projectId, name, insertBefore, insertAfter);
    } else {
      // Stub implementation
      return {
        data: {
          gid: Math.floor(Math.random() * 10000000000).toString(),
          name: name
        }
      };
    }
  }

  async addTaskToSection(sectionId: string, taskId: string) {
    await this.ensureInitialized();
    
    if (this.asanaApi) {
      return await this.asanaApi.addTaskToSection(sectionId, taskId);
    } else {
      // Stub implementation
      return { data: {} };
    }
  }

  // Dependency methods
  async addDependenciesToTask(taskId: string, dependencyIds: string[]) {
    await this.ensureInitialized();
    
    if (this.asanaApi) {
      return await this.asanaApi.addDependenciesToTask(taskId, dependencyIds);
    } else {
      // Stub implementation
      return { data: {} };
    }
  }

  async removeDependenciesFromTask(taskId: string, dependencyIds: string[]) {
    await this.ensureInitialized();
    
    if (this.asanaApi) {
      return await this.asanaApi.removeDependenciesFromTask(taskId, dependencyIds);
    } else {
      // Stub implementation
      return { data: {} };
    }
  }

  async getDependenciesForTask(taskId: string) {
    await this.ensureInitialized();
    
    if (this.asanaApi) {
      return await this.asanaApi.getDependenciesForTask(taskId);
    } else {
      // Stub implementation
      return {
        data: [
          { gid: "12345", name: "Stub dependency 1", completed: false },
          { gid: "67890", name: "Stub dependency 2", completed: true }
        ]
      };
    }
  }

  // Utility method to check if real API is available
  isRealApiAvailable(): boolean {
    return this.initialized && this.asanaApi !== null;
  }
}

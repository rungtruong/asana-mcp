// Type definitions for asana.js
// Task Management
export function createTask(name: string, notes?: string, dueDate?: string | null, assignee?: string | null, projectId?: string | null): Promise<any>;
export function listTasks(): Promise<any>;
export function updateTask(taskId: string, updatedFields: any): Promise<any>;
export function completeTask(taskId: string): Promise<any>;
export function deleteTask(taskId: string): Promise<any>;

// Subtask Management
export function createSubtask(parentTaskId: string, name: string, notes?: string, dueDate?: string | null, assignee?: string | null): Promise<any>;
export function listSubtasks(parentTaskId: string): Promise<any>;
export function updateSubtask(subtaskId: string, updatedFields: any): Promise<any>;
export function deleteSubtask(subtaskId: string): Promise<any>;

// Project Management
export function createProject(name: string, notes?: string, color?: string, isPublic?: boolean, workspaceId?: string): Promise<any>;
export function listProjects(workspaceId?: string): Promise<any>;
export function deleteProject(projectId: string): Promise<any>;

// Section Management
export function createSection(projectId: string, name: string): Promise<any>;
export function listSections(projectId: string): Promise<any>;
export function addTaskToSection(taskId: string, sectionId: string): Promise<any>;

// Dependencies Management
export function addDependenciesToTask(taskId: string, dependencies: string[]): Promise<any>;
export function removeDependenciesFromTask(taskId: string, dependencies: string[]): Promise<any>;
export function getDependenciesForTask(taskId: string): Promise<any>;

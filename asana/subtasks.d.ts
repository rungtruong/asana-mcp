/**
 * TypeScript declarations for subtask management functions
 */

export interface SubtaskData {
  name: string;
  notes?: string;
  parent: string;
  due_on?: string;
  assignee?: string;
}

export interface SubtaskUpdateData {
  name?: string;
  notes?: string;
  due_on?: string;
  assignee?: string;
  completed?: boolean;
}

export interface AsanaResponse<T> {
  data: T;
}

export interface SubtaskObject {
  gid: string;
  name: string;
  completed: boolean;
  due_on?: string;
  assignee?: {
    gid: string;
    name: string;
  };
  notes?: string;
  parent?: {
    gid: string;
    name: string;
  };
}

/**
 * Creates a new subtask under an existing task
 * @param parentTaskId - The ID of the parent task
 * @param name - The name of the subtask
 * @param notes - Optional description/notes for the subtask
 * @param dueDate - Optional due date in ISO format
 * @param assignee - Optional assignee ID
 * @returns Promise with the created subtask data
 */
export declare function createSubtask(
  parentTaskId: string,
  name: string,
  notes?: string,
  dueDate?: string | null,
  assignee?: string | null
): Promise<AsanaResponse<SubtaskObject>>;

/**
 * Lists all subtasks for a given parent task
 * @param parentTaskId - The ID of the parent task
 * @returns Promise with array of subtasks
 */
export declare function listSubtasks(
  parentTaskId: string
): Promise<AsanaResponse<SubtaskObject[]>>;

/**
 * Updates an existing subtask
 * @param subtaskId - The ID of the subtask to update
 * @param updatedFields - Object containing fields to update
 * @returns Promise with the updated subtask data
 */
export declare function updateSubtask(
  subtaskId: string,
  updatedFields: SubtaskUpdateData
): Promise<AsanaResponse<SubtaskObject>>;

/**
 * Deletes a subtask
 * @param subtaskId - The ID of the subtask to delete
 * @returns Promise with success confirmation
 */
export declare function deleteSubtask(
  subtaskId: string
): Promise<{ success: boolean; subtaskId: string }>;
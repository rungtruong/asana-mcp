import { FastMCP } from "fastmcp";
import { z } from "zod";
import * as services from "../services/index.js";

export function registerAsanaTools(server: FastMCP) {
  // Create a shared AsanaService instance
  const asanaService = new services.AsanaService();

  // Setup custom logging to ensure stdout is only used for MCP JSON messages
  // Override console.log to use stderr instead of stdout
  const originalConsoleLog = console.log;
  console.log = function(...args: any[]) {
    console.debug(...args);
  };

  // Task Tools
  server.addTool({
    name: "create-task",
    description: "Create a new Asana task",
    parameters: z.object({
      name: z.string().describe("Task name"),
      description: z.string().optional().describe("Task description"),
      dueDate: z.string().optional().describe("Due date (YYYY-MM-DD format)"),
      assignee: z.string().optional().describe("Assignee email or ID"),
      project: z.string().optional().describe("Project ID")
    }),
    execute: async ({ name, description, dueDate, assignee, project }) => {
      console.debug(`Creating Asana task: ${name}`);
      console.debug(`Description: ${description || 'N/A'}`);
      console.debug(`Due Date: ${dueDate || 'N/A'}`);
      console.debug(`Assignee: ${assignee || 'N/A'}`);
      console.debug(`Project: ${project || 'N/A'}`);
      
      try {
        const result = await asanaService.createTask(name, description, dueDate, assignee, project);
        console.debug("Task created with ID:", result.data.gid);
        
        return `Task "${name}" created successfully with ID: ${result.data.gid}`;
      } catch (error: any) {
        console.debug("Error creating task:", error);
        throw new Error(`Error creating task: ${error.message || 'Unknown error'}`);
      }
    }
  });

  server.addTool({
    name: "list-tasks",
    description: "List Asana tasks",
    parameters: z.object({
      projectId: z.string().optional().describe("Project ID to filter tasks")
    }),
    execute: async ({ projectId }) => {
      console.debug("Listing Asana tasks");
      if (projectId) {
        console.debug(`For project: ${projectId}`);
      }
      
      try {
        const result = await asanaService.listTasks(projectId);
        console.debug(`Found ${result.data?.length || 0} tasks`);
        
        // Format tasks for display
        const taskList = result.data?.map((task: any) => {
          return {
            id: task.gid,
            name: task.name,
            assignee: task.assignee?.name || "Unassigned",
            completed: task.completed ? "✓" : "✗",
            dueDate: task.due_on || "No due date"
          };
        }) || [];
        
        // Create a formatted response
        let responseText = "## Tasks\n\n";
        
        if (taskList.length === 0) {
          responseText += "No tasks found.";
        } else {
          responseText += "| ID | Name | Assignee | Completed | Due Date |\n";
          responseText += "|---|------|----------|-----------|----------|\n";
          
          taskList.forEach((task: any) => {
            responseText += `| ${task.id} | ${task.name} | ${task.assignee} | ${task.completed} | ${task.dueDate} |\n`;
          });
        }
        
        return responseText;
      } catch (error: any) {
        console.debug("Error listing tasks:", error);
        throw new Error(`Error listing tasks: ${error.message || 'Unknown error'}`);
      }
    }
  });

  server.addTool({
    name: "update-task",
    description: "Update an existing Asana task",
    parameters: z.object({
      taskId: z.string().describe("Task ID"),
      name: z.string().optional().describe("New task name"),
      description: z.string().optional().describe("New task description"),
      dueDate: z.string().optional().describe("New due date (YYYY-MM-DD format)"),
      assignee: z.string().optional().describe("New assignee email or ID"),
      completed: z.boolean().optional().describe("Task completion status")
    }),
    execute: async ({ taskId, name, description, dueDate, assignee, completed }) => {
      console.debug(`Updating Asana task: ${taskId}`);
      
      if (name) console.debug(`New name: ${name}`);
      if (description) console.debug(`New description: ${description}`);
      if (dueDate) console.debug(`New due date: ${dueDate}`);
      if (assignee) console.debug(`New assignee: ${assignee}`);
      if (completed !== undefined) console.debug(`Completed: ${completed}`);
      
      try {
        const updatedFields: any = {};
        if (name) updatedFields.name = name;
        if (description) updatedFields.notes = description;
        if (dueDate) updatedFields.due_on = dueDate;
        if (assignee) updatedFields.assignee = assignee;
        if (completed !== undefined) updatedFields.completed = completed;
        
        const result = await asanaService.updateTask(taskId, updatedFields);
        console.debug("Task updated successfully");
        
        return `Task ${taskId} updated successfully`;
      } catch (error: any) {
        console.debug("Error updating task:", error);
        throw new Error(`Error updating task: ${error.message || 'Unknown error'}`);
      }
    }
  });

  server.addTool({
    name: "delete-task",
    description: "Delete an Asana task",
    parameters: z.object({
      taskId: z.string().describe("Task ID to delete")
    }),
    execute: async ({ taskId }) => {
      console.debug(`Deleting task: ${taskId}`);
      
      try {
        await asanaService.deleteTask(taskId);
        console.debug("Task deleted successfully");
        
        const suffix = asanaService.isRealApiAvailable() ? "" : " (stub implementation)";
        return `Task ${taskId} deleted successfully${suffix}`;
      } catch (error: any) {
        console.debug("Error deleting task:", error.message);
        throw new Error(`Error deleting task: ${error.message}`);
      }
    }
  });

  // Subtask Tools
  server.addTool({
    name: "create-subtask",
    description: "Create a subtask for an existing Asana task",
    parameters: z.object({
      parentTaskId: z.string().describe("Parent task ID"),
      name: z.string().describe("Subtask name"),
      description: z.string().optional().describe("Subtask description"),
      dueDate: z.string().optional().describe("Due date (YYYY-MM-DD format)"),
      assignee: z.string().optional().describe("Assignee email or ID")
    }),
    execute: async ({ parentTaskId, name, description, dueDate, assignee }) => {
      console.debug(`Creating subtask for parent task: ${parentTaskId}`);
      console.debug(`Subtask name: ${name}`);
      console.debug(`Description: ${description || 'N/A'}`);
      console.debug(`Due Date: ${dueDate || 'N/A'}`);
      console.debug(`Assignee: ${assignee || 'N/A'}`);
      
      try {
        const result = await asanaService.createSubtask(parentTaskId, name, description, dueDate, assignee);
        console.debug("Subtask created with ID:", result.data.gid);
        
        return `Subtask "${name}" created successfully with ID: ${result.data.gid}`;
      } catch (error: any) {
        console.debug("Error creating subtask:", error);
        throw new Error(`Error creating subtask: ${error.message || 'Unknown error'}`);
      }
    }
  });

  server.addTool({
    name: "list-subtasks",
    description: "List subtasks for a parent task",
    parameters: z.object({
      parentTaskId: z.string().describe("Parent task ID")
    }),
    execute: async ({ parentTaskId }) => {
      console.debug(`Listing subtasks for parent task: ${parentTaskId}`);
      
      try {
        const result = await asanaService.listSubtasks(parentTaskId);
        console.debug(`Found ${result.data?.length || 0} subtasks`);
        
        // Format subtasks for display
        const subtaskList = result.data?.map((subtask: any) => {
          return {
            id: subtask.gid,
            name: subtask.name,
            completed: subtask.completed ? "✓" : "✗",
            dueDate: subtask.due_on || "No due date"
          };
        }) || [];
        
        // Create a formatted response
        let responseText = `## Subtasks for Task ${parentTaskId}\n\n`;
        
        if (subtaskList.length === 0) {
          responseText += "No subtasks found.";
        } else {
          responseText += "| ID | Name | Completed | Due Date |\n";
          responseText += "|---|------|-----------|----------|\n";
          
          subtaskList.forEach((subtask: any) => {
            responseText += `| ${subtask.id} | ${subtask.name} | ${subtask.completed} | ${subtask.dueDate} |\n`;
          });
        }
        
        const suffix = asanaService.isRealApiAvailable() ? "" : " (Stub)";
        return responseText.replace("##", `##${suffix}`);
      } catch (error: any) {
        console.debug("Error listing subtasks:", error);
        throw new Error(`Error listing subtasks: ${error.message || 'Unknown error'}`);
      }
    }
  });

  server.addTool({
    name: "update-subtask",
    description: "Update an existing subtask",
    parameters: z.object({
      subtaskId: z.string().describe("Subtask ID"),
      name: z.string().optional().describe("New subtask name"),
      description: z.string().optional().describe("New subtask description"),
      dueDate: z.string().optional().describe("New due date (YYYY-MM-DD format)"),
      assignee: z.string().optional().describe("New assignee email or ID"),
      completed: z.boolean().optional().describe("Subtask completion status")
    }),
    execute: async ({ subtaskId, name, description, dueDate, assignee, completed }) => {
      console.debug(`Updating subtask: ${subtaskId}`);
      
      if (name) console.debug(`New name: ${name}`);
      if (description) console.debug(`New description: ${description}`);
      if (dueDate) console.debug(`New due date: ${dueDate}`);
      if (assignee) console.debug(`New assignee: ${assignee}`);
      if (completed !== undefined) console.debug(`Completed: ${completed}`);
      
      try {
        const updatedFields: any = {};
        if (name) updatedFields.name = name;
        if (description) updatedFields.notes = description;
        if (dueDate) updatedFields.due_on = dueDate;
        if (assignee) updatedFields.assignee = assignee;
        if (completed !== undefined) updatedFields.completed = completed;
        
        const result = await asanaService.updateSubtask(subtaskId, updatedFields);
        console.debug("Subtask updated successfully");
        
        const suffix = asanaService.isRealApiAvailable() ? "" : " (stub)";
        return `Subtask ${subtaskId} updated successfully${suffix}`;
      } catch (error: any) {
        console.debug("Error updating subtask:", error);
        throw new Error(`Error updating subtask: ${error.message || 'Unknown error'}`);
      }
    }
  });

  server.addTool({
    name: "delete-subtask",
    description: "Delete a subtask",
    parameters: z.object({
      subtaskId: z.string().describe("Subtask ID to delete")
    }),
    execute: async ({ subtaskId }) => {
      console.debug(`Deleting subtask: ${subtaskId}`);
      
      try {
        await asanaService.deleteSubtask(subtaskId);
        console.debug("Subtask deleted successfully");
        
        const suffix = asanaService.isRealApiAvailable() ? "" : " (stub implementation)";
        return `Subtask ${subtaskId} deleted successfully${suffix}`;
      } catch (error: any) {
        console.debug("Error deleting subtask:", error.message);
        throw new Error(`Error deleting subtask: ${error.message}`);
      }
    }
  });

  // Project Tools
  server.addTool({
    name: "create-project",
    description: "Create a new Asana project",
    parameters: z.object({
      name: z.string().describe("Project name"),
      notes: z.string().optional().describe("Project notes"),
      color: z.string().optional().describe("Project color"),
      isPublic: z.boolean().optional().describe("Whether the project is public"),
      workspaceId: z.string().optional().describe("Workspace ID")
    }),
    execute: async ({ name, notes, color, isPublic, workspaceId }) => {
      console.debug(`Creating Asana project: ${name}`);
      console.debug(`Notes: ${notes || 'N/A'}`);
      console.debug(`Color: ${color || 'N/A'}`);
      console.debug(`Public: ${isPublic !== undefined ? isPublic : 'N/A'}`);
      console.debug(`Workspace ID: ${workspaceId || 'Using default from .env'}`);
      
      try {
        const result = await asanaService.createProject(name, notes, color, isPublic, workspaceId);
        console.debug("Project created with ID:", result.data.gid);
        
        const suffix = asanaService.isRealApiAvailable() ? "" : " (stub implementation)";
        return `Project "${name}" created successfully with ID: ${result.data.gid}${suffix}`;
      } catch (error: any) {
        console.debug("Error creating project:", error);
        throw new Error(`Error creating project: ${error.message || error.error?.errors[0].message || 'Unknown error'}`);
      }
    }
  });

  server.addTool({
    name: "delete-project",
    description: "Delete an Asana project",
    parameters: z.object({
      projectId: z.string().describe("Project ID to delete")
    }),
    execute: async ({ projectId }) => {
      console.debug(`Deleting project: ${projectId}`);
      
      try {
        await asanaService.deleteProject(projectId);
        console.debug("Project deleted successfully");
        
        const suffix = asanaService.isRealApiAvailable() ? "" : " (stub implementation)";
        return `Project ${projectId} deleted successfully${suffix}`;
      } catch (error: any) {
        console.debug("Error deleting project:", error.message);
        throw new Error(`Error deleting project: ${error.message}`);
      }
    }
  });

  server.addTool({
    name: "list-projects",
    description: "List Asana projects",
    parameters: z.object({
      workspaceId: z.string().optional().describe("Workspace ID to filter projects")
    }),
    execute: async ({ workspaceId }) => {
      console.debug(`Listing projects${workspaceId ? ` in workspace ${workspaceId}` : ''}`);
      
      try {
        const result = await asanaService.listProjects(workspaceId);
        console.debug(`Found ${result.data?.length || 0} projects`);
        
        // Format projects for display
        if (result.data && result.data.length > 0) {
          // Create a markdown table
          let markdown = "## Projects\n\n";
          markdown += "| ID | Name | Notes |\n";
          markdown += "|---|------|-------|\n";
          
          result.data.forEach((project: any) => {
            markdown += `| ${project.gid} | ${project.name} | ${project.notes ? project.notes.substring(0, 50) + (project.notes.length > 50 ? '...' : '') : 'No notes'} |\n`;
          });
          
          return markdown;
        } else {
          const suffix = asanaService.isRealApiAvailable() ? "" : " (stub implementation)";
          return `## Projects\n\nNo projects found${suffix}.`;
        }
      } catch (error: any) {
        console.debug("Error listing projects:", error.message);
        throw new Error(`Error listing projects: ${error.message}`);
      }
    }
  });

  // Section Tools
  server.addTool({
    name: "create-section",
    description: "Create a section in an Asana project",
    parameters: z.object({
      projectId: z.string().describe("Project ID"),
      name: z.string().describe("Section name"),
      insertBefore: z.string().optional().describe("Insert before this section ID"),
      insertAfter: z.string().optional().describe("Insert after this section ID")
    }),
    execute: async ({ projectId, name, insertBefore, insertAfter }) => {
      console.debug(`Creating section "${name}" in project ${projectId}`);
      if (insertBefore) console.debug(`Insert before: ${insertBefore}`);
      if (insertAfter) console.debug(`Insert after: ${insertAfter}`);
      
      try {
        const result = await asanaService.createSection(projectId, name, insertBefore, insertAfter);
        console.debug("Section created with ID:", result.data.gid);
        
        const suffix = asanaService.isRealApiAvailable() ? "" : " (stub implementation)";
        return `Section "${name}" created successfully in project ${projectId} with ID: ${result.data.gid}${suffix}`;
      } catch (error: any) {
        console.debug("Error creating section:", error);
        throw new Error(`Error creating section: ${error.message || error.originalResponse?.errors?.[0]?.message || 'Unknown error'}`);
      }
    }
  });

  server.addTool({
    name: "add-task-to-section",
    description: "Add a task to a specific section",
    parameters: z.object({
      sectionId: z.string().describe("Section ID"),
      taskId: z.string().describe("Task ID")
    }),
    execute: async ({ sectionId, taskId }) => {
      console.debug(`Adding task ${taskId} to section ${sectionId}`);
      
      try {
        const result = await asanaService.addTaskToSection(sectionId, taskId);
        console.debug("Task added to section successfully");
        
        const suffix = asanaService.isRealApiAvailable() ? "" : " (stub implementation)";
        return `Task ${taskId} added to section ${sectionId} successfully${suffix}`;
      } catch (error: any) {
        console.debug("Error adding task to section:", error);
        throw new Error(`Error adding task to section: ${error.message || error.originalResponse?.errors?.[0]?.message || 'Unknown error'}`);
      }
    }
  });

  // Dependency Tools
  server.addTool({
    name: "add-dependencies",
    description: "Add dependencies to a task",
    parameters: z.object({
      taskId: z.string().describe("Task ID"),
      dependencyIds: z.array(z.string()).describe("Array of dependency task IDs")
    }),
    execute: async ({ taskId, dependencyIds }) => {
      console.debug(`Adding dependencies ${dependencyIds.join(', ')} to task ${taskId}`);
      
      try {
        const result = await asanaService.addDependenciesToTask(taskId, dependencyIds);
        console.debug("Dependencies added successfully");
        
        const suffix = asanaService.isRealApiAvailable() ? "" : " (stub implementation)";
        return `Dependencies ${dependencyIds.join(', ')} added to task ${taskId} successfully${suffix}`;
      } catch (error: any) {
        console.debug("Error adding dependencies to task:", error);
        throw new Error(`Error adding dependencies to task: ${error.message || error.originalResponse?.errors?.[0]?.message || 'Unknown error'}`);
      }
    }
  });

  server.addTool({
    name: "remove-dependencies",
    description: "Remove dependencies from a task",
    parameters: z.object({
      taskId: z.string().describe("Task ID"),
      dependencyIds: z.array(z.string()).describe("Array of dependency task IDs to remove")
    }),
    execute: async ({ taskId, dependencyIds }) => {
      console.debug(`Removing dependencies ${dependencyIds.join(', ')} from task ${taskId}`);
      
      try {
        const result = await asanaService.removeDependenciesFromTask(taskId, dependencyIds);
        console.debug("Dependencies removed successfully");
        
        const suffix = asanaService.isRealApiAvailable() ? "" : " (stub implementation)";
        return `Dependencies ${dependencyIds.join(', ')} removed from task ${taskId} successfully${suffix}`;
      } catch (error: any) {
        console.debug("Error removing dependencies from task:", error);
        throw new Error(`Error removing dependencies from task: ${error.message || error.originalResponse?.errors?.[0]?.message || 'Unknown error'}`);
      }
    }
  });

  server.addTool({
    name: "get-dependencies",
    description: "Get dependencies for a task",
    parameters: z.object({
      taskId: z.string().describe("Task ID")
    }),
    execute: async ({ taskId }) => {
      console.debug(`Getting dependencies for task ${taskId}`);
      
      try {
        const result = await asanaService.getDependenciesForTask(taskId);
        console.debug("Dependencies retrieved successfully:", result.data);
        
        // Format the dependencies for display
        const dependencies = result.data.map((dep: any) => ({
          id: dep.gid,
          name: dep.name,
          completed: dep.completed
        }));
        
        const suffix = asanaService.isRealApiAvailable() ? "" : " (stub implementation)";
        return `Dependencies for task ${taskId}${suffix}:\n${JSON.stringify(dependencies, null, 2)}`;
      } catch (error: any) {
        console.debug("Error getting dependencies for task:", error);
        throw new Error(`Error getting dependencies for task: ${error.message || error.originalResponse?.errors?.[0]?.message || 'Unknown error'}`);
      }
    }
  });
}

import { FastMCP } from "fastmcp";
import { z } from "zod";

// Import the Asana API functions
let asanaApi: any = null;

async function loadAsanaApi() {
  try {
    // Import the ES module version of asana.js
    asanaApi = await import("../asana/index.js");
    console.debug("Asana API loaded successfully");
  } catch (error: any) {
    console.debug("Error loading Asana API:", error.message);
    console.debug("Using stub implementations instead");
  }
}

// Create a FastMCP server
const server = new FastMCP({
  name: "Asana Tasks Manager",
  version: "1.0.0",
});

// Define tool for creating a new Asana task
server.addTool({
  name: "create-task",
  description: "Create a new Asana task",
  parameters: z.object({
    name: z.string().describe("Task name"),
    description: z.string().optional().describe("Task description"),
    dueDate: z.string().optional().describe("Due date (YYYY-MM-DD format)"),
    assignee: z.string().optional().describe("Assignee email or ID"),
    project: z.string().optional().describe("Project ID"),
  }),
  execute: async ({ name, description, dueDate, assignee, project }) => {
    console.debug(`Creating Asana task: ${name}`);
    console.debug(`Description: ${description || "N/A"}`);
    console.debug(`Due Date: ${dueDate || "N/A"}`);
    console.debug(`Assignee: ${assignee || "N/A"}`);
    console.debug(`Project: ${project || "N/A"}`);

    try {
      if (asanaApi) {
        // Call the actual Asana API
        const result = await asanaApi.createTask(
          name,
          description,
          dueDate,
          assignee,
          project
        );
        console.debug("Task created with ID:", result.data.gid);

        return `Task "${name}" created successfully with ID: ${result.data.gid}`;
      } else {
        // Stub implementation
        return `Task "${name}" created successfully (stub)`;
      }
    } catch (error: any) {
      console.debug("Error creating task:", error);
      throw new Error(
        `Error creating task: ${error.message || "Unknown error"}`
      );
    }
  },
});

// Define tool for listing tasks
server.addTool({
  name: "list-tasks",
  description: "List Asana tasks",
  parameters: z.object({
    projectId: z.string().optional().describe("Project ID to filter tasks"),
  }),
  execute: async ({ projectId }) => {
    console.debug("Listing Asana tasks");
    if (projectId) {
      console.debug(`For project: ${projectId}`);
    }

    try {
      if (asanaApi) {
        // Call the actual Asana API
        const result = await asanaApi.listTasks(projectId);
        console.debug(`Found ${result.data?.length || 0} tasks`);

        // Format tasks for display
        const taskList =
          result.data?.map((task: any) => {
            return {
              id: task.gid,
              name: task.name,
              assignee: task.assignee?.name || "Unassigned",
              completed: task.completed ? "✓" : "✗",
              dueDate: task.due_on || "No due date",
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
      } else {
        // Stub implementation
        return "## Tasks (Stub)\n\n| ID | Name | Completed | Due Date |\n|---|------|-----------|----------|\n| 1234567890 | Example Task 1 | ✗ | 2025-04-01 |\n| 0987654321 | Example Task 2 | ✓ | 2025-03-15 |";
      }
    } catch (error: any) {
      console.debug("Error listing tasks:", error);
      throw new Error(
        `Error listing tasks: ${error.message || "Unknown error"}`
      );
    }
  },
});

// Define tool for updating an existing Asana task
server.addTool({
  name: "update-task",
  description: "Update an existing Asana task",
  parameters: z.object({
    taskId: z.string().describe("Task ID"),
    name: z.string().optional().describe("New task name"),
    description: z.string().optional().describe("New task description"),
    dueDate: z.string().optional().describe("New due date (YYYY-MM-DD format)"),
    assignee: z.string().optional().describe("New assignee email or ID"),
    completed: z.boolean().optional().describe("Task completion status"),
  }),
  execute: async ({
    taskId,
    name,
    description,
    dueDate,
    assignee,
    completed,
  }) => {
    console.debug(`Updating Asana task: ${taskId}`);

    if (name) console.debug(`New name: ${name}`);
    if (description) console.debug(`New description: ${description}`);
    if (dueDate) console.debug(`New due date: ${dueDate}`);
    if (assignee) console.debug(`New assignee: ${assignee}`);
    if (completed !== undefined) console.debug(`Completed: ${completed}`);

    try {
      if (asanaApi) {
        // Call the actual Asana API
        const updatedFields: any = {};
        if (name) updatedFields.name = name;
        if (description) updatedFields.notes = description;
        if (dueDate) updatedFields.due_on = dueDate;
        if (assignee) updatedFields.assignee = assignee;
        if (completed !== undefined) updatedFields.completed = completed;

        const result = await asanaApi.updateTask(taskId, updatedFields);
        console.debug("Task updated successfully");

        return `Task ${taskId} updated successfully`;
      } else {
        // Stub implementation
        return `Task ${taskId} updated successfully (stub)`;
      }
    } catch (error: any) {
      console.debug("Error updating task:", error);
      throw new Error(
        `Error updating task: ${error.message || "Unknown error"}`
      );
    }
  },
});

// Define tool for deleting a task
server.addTool({
  name: "delete-task",
  description: "Delete an Asana task",
  parameters: z.object({
    taskId: z.string().describe("Task ID to delete"),
  }),
  execute: async ({ taskId }) => {
    console.debug(`Deleting task: ${taskId}`);

    try {
      if (asanaApi) {
        // Call the actual Asana API
        await asanaApi.deleteTask(taskId);
        console.debug("Task deleted successfully");

        return `Task ${taskId} deleted successfully`;
      } else {
        // Stub implementation
        console.debug("Using stub implementation for delete-task");

        return `Task ${taskId} deleted successfully (stub implementation)`;
      }
    } catch (error: any) {
      console.debug("Error deleting task:", error.message);

      throw new Error(`Error deleting task: ${error.message}`);
    }
  },
});

// Define tool for creating a subtask
server.addTool({
  name: "create-subtask",
  description: "Create a subtask for an existing Asana task",
  parameters: z.object({
    parentTaskId: z.string().describe("Parent task ID"),
    name: z.string().describe("Subtask name"),
    description: z.string().optional().describe("Subtask description"),
    dueDate: z.string().optional().describe("Due date (YYYY-MM-DD format)"),
    assignee: z.string().optional().describe("Assignee email or ID"),
  }),
  execute: async ({ parentTaskId, name, description, dueDate, assignee }) => {
    console.debug(`Creating subtask for parent task: ${parentTaskId}`);
    console.debug(`Subtask name: ${name}`);
    console.debug(`Description: ${description || "N/A"}`);
    console.debug(`Due Date: ${dueDate || "N/A"}`);
    console.debug(`Assignee: ${assignee || "N/A"}`);

    try {
      if (asanaApi) {
        // Call the actual Asana API
        const result = await asanaApi.createSubtask(
          parentTaskId,
          name,
          description,
          dueDate,
          assignee
        );
        console.debug("Subtask created with ID:", result.data.gid);

        return `Subtask "${name}" created successfully with ID: ${result.data.gid}`;
      } else {
        // Stub implementation
        return `Subtask "${name}" created successfully for parent task ${parentTaskId} (stub)`;
      }
    } catch (error: any) {
      console.debug("Error creating subtask:", error);
      throw new Error(
        `Error creating subtask: ${error.message || "Unknown error"}`
      );
    }
  },
});

// Define tool for listing subtasks
server.addTool({
  name: "list-subtasks",
  description: "List subtasks for a parent task",
  parameters: z.object({
    parentTaskId: z.string().describe("Parent task ID"),
  }),
  execute: async ({ parentTaskId }) => {
    console.debug(`Listing subtasks for parent task: ${parentTaskId}`);

    try {
      if (asanaApi) {
        // Call the actual Asana API
        const result = await asanaApi.listSubtasks(parentTaskId);
        console.debug(`Found ${result.data?.length || 0} subtasks`);

        // Format subtasks for display
        const subtaskList =
          result.data?.map((subtask: any) => {
            return {
              id: subtask.gid,
              name: subtask.name,
              completed: subtask.completed ? "✓" : "✗",
              dueDate: subtask.due_on || "No due date",
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

        return responseText;
      } else {
        // Stub implementation
        return `## Subtasks for Task ${parentTaskId} (Stub)\n\n| ID | Name | Completed | Due Date |\n|---|------|-----------|----------|\n| 1111111111 | Example Subtask 1 | ✗ | 2025-04-01 |\n| 2222222222 | Example Subtask 2 | ✓ | 2025-03-15 |`;
      }
    } catch (error: any) {
      console.debug("Error listing subtasks:", error);
      throw new Error(
        `Error listing subtasks: ${error.message || "Unknown error"}`
      );
    }
  },
});

// Define tool for updating a subtask
server.addTool({
  name: "update-subtask",
  description: "Update an existing subtask",
  parameters: z.object({
    subtaskId: z.string().describe("Subtask ID"),
    name: z.string().optional().describe("New subtask name"),
    description: z.string().optional().describe("New subtask description"),
    dueDate: z.string().optional().describe("New due date (YYYY-MM-DD format)"),
    assignee: z.string().optional().describe("New assignee email or ID"),
    completed: z.boolean().optional().describe("Subtask completion status"),
  }),
  execute: async ({
    subtaskId,
    name,
    description,
    dueDate,
    assignee,
    completed,
  }) => {
    console.debug(`Updating subtask: ${subtaskId}`);

    if (name) console.debug(`New name: ${name}`);
    if (description) console.debug(`New description: ${description}`);
    if (dueDate) console.debug(`New due date: ${dueDate}`);
    if (assignee) console.debug(`New assignee: ${assignee}`);
    if (completed !== undefined) console.debug(`Completed: ${completed}`);

    try {
      if (asanaApi) {
        // Call the actual Asana API
        const updatedFields: any = {};
        if (name) updatedFields.name = name;
        if (description) updatedFields.notes = description;
        if (dueDate) updatedFields.due_on = dueDate;
        if (assignee) updatedFields.assignee = assignee;
        if (completed !== undefined) updatedFields.completed = completed;

        const result = await asanaApi.updateSubtask(subtaskId, updatedFields);
        console.debug("Subtask updated successfully");

        return `Subtask ${subtaskId} updated successfully`;
      } else {
        // Stub implementation
        return `Subtask ${subtaskId} updated successfully (stub)`;
      }
    } catch (error: any) {
      console.debug("Error updating subtask:", error);
      throw new Error(
        `Error updating subtask: ${error.message || "Unknown error"}`
      );
    }
  },
});

// Define tool for deleting a subtask
server.addTool({
  name: "delete-subtask",
  description: "Delete a subtask",
  parameters: z.object({
    subtaskId: z.string().describe("Subtask ID to delete"),
  }),
  execute: async ({ subtaskId }) => {
    console.debug(`Deleting subtask: ${subtaskId}`);

    try {
      if (asanaApi) {
        // Call the actual Asana API
        await asanaApi.deleteSubtask(subtaskId);
        console.debug("Subtask deleted successfully");

        return `Subtask ${subtaskId} deleted successfully`;
      } else {
        // Stub implementation
        console.debug("Using stub implementation for delete-subtask");

        return `Subtask ${subtaskId} deleted successfully (stub implementation)`;
      }
    } catch (error: any) {
      console.debug("Error deleting subtask:", error.message);

      throw new Error(`Error deleting subtask: ${error.message}`);
    }
  },
});

// Define tool for creating a new project
server.addTool({
  name: "create-project",
  description: "Create a new Asana project",
  parameters: z.object({
    name: z.string().describe("Project name"),
    notes: z.string().optional().describe("Project notes"),
    color: z.string().optional().describe("Project color"),
    isPublic: z.boolean().optional().describe("Whether the project is public"),
    workspaceId: z.string().optional().describe("Workspace ID"),
  }),
  execute: async ({ name, notes, color, isPublic, workspaceId }) => {
    console.debug(`Creating Asana project: ${name}`);
    console.debug(`Notes: ${notes || "N/A"}`);
    console.debug(`Color: ${color || "N/A"}`);
    console.debug(`Public: ${isPublic !== undefined ? isPublic : "N/A"}`);
    console.debug(`Workspace ID: ${workspaceId || "Using default from .env"}`);

    try {
      if (asanaApi) {
        // Call the actual Asana API
        const result = await asanaApi.createProject(
          name,
          notes,
          color,
          isPublic,
          workspaceId
        );
        console.debug("Project created with ID:", result.data.gid);

        return `Project "${name}" created successfully with ID: ${result.data.gid}`;
      } else {
        // Stub implementation
        console.debug("Using stub implementation for create-project");
        const projectId = Math.floor(Math.random() * 10000000000);

        return `Project "${name}" created successfully with ID: ${projectId} (stub implementation)`;
      }
    } catch (error: any) {
      console.debug("Error creating project:", error);
      throw new Error(
        `Error creating project: ${
          error.message || error.error?.errors[0].message || "Unknown error"
        }`
      );
    }
  },
});

// Define tool for deleting a project
server.addTool({
  name: "delete-project",
  description: "Delete an Asana project",
  parameters: z.object({
    projectId: z.string().describe("Project ID to delete"),
  }),
  execute: async ({ projectId }) => {
    console.debug(`Deleting project: ${projectId}`);

    try {
      if (asanaApi) {
        // Call the actual Asana API
        await asanaApi.deleteProject(projectId);
        console.debug("Project deleted successfully");

        return `Project ${projectId} deleted successfully`;
      } else {
        // Stub implementation
        console.debug("Using stub implementation for delete-project");

        return `Project ${projectId} deleted successfully (stub implementation)`;
      }
    } catch (error: any) {
      console.debug("Error deleting project:", error.message);

      throw new Error(`Error deleting project: ${error.message}`);
    }
  },
});

// Define tool for listing projects
server.addTool({
  name: "list-projects",
  description: "List Asana projects",
  parameters: z.object({
    workspaceId: z
      .string()
      .optional()
      .describe("Workspace ID to filter projects"),
  }),
  execute: async ({ workspaceId }) => {
    console.debug(
      `Listing projects${workspaceId ? ` in workspace ${workspaceId}` : ""}`
    );

    try {
      if (asanaApi) {
        // Call the actual Asana API
        const result = await asanaApi.listProjects(workspaceId);
        console.debug(`Found ${result.data?.length || 0} projects`);

        // Format projects for display
        if (result.data && result.data.length > 0) {
          // Create a markdown table
          let markdown = "## Projects\n\n";
          markdown += "| ID | Name | Notes |\n";
          markdown += "|---|------|-------|\n";

          result.data.forEach((project: any) => {
            markdown += `| ${project.gid} | ${project.name} | ${
              project.notes
                ? project.notes.substring(0, 50) +
                  (project.notes.length > 50 ? "..." : "")
                : "No notes"
            } |\n`;
          });

          return markdown;
        } else {
          return "## Projects\n\nNo projects found.";
        }
      } else {
        // Stub implementation
        console.debug("Using stub implementation for list-projects");

        return "## Projects\n\nNo projects found (stub implementation).";
      }
    } catch (error: any) {
      console.debug("Error listing projects:", error.message);

      throw new Error(`Error listing projects: ${error.message}`);
    }
  },
});

// Define tool for creating sections
server.addTool({
  name: "create-section",
  description: "Create a section in an Asana project",
  parameters: z.object({
    projectId: z.string().describe("Project ID"),
    name: z.string().describe("Section name"),
    insertBefore: z
      .string()
      .optional()
      .describe("Insert before this section ID"),
    insertAfter: z.string().optional().describe("Insert after this section ID"),
  }),
  execute: async ({ projectId, name, insertBefore, insertAfter }) => {
    console.debug(`Creating section "${name}" in project ${projectId}`);
    if (insertBefore) console.debug(`Insert before: ${insertBefore}`);
    if (insertAfter) console.debug(`Insert after: ${insertAfter}`);

    try {
      if (asanaApi) {
        // Call the actual Asana API
        const result = await asanaApi.createSection(
          projectId,
          name,
          insertBefore,
          insertAfter
        );
        console.debug("Section created with ID:", result.data.gid);

        return `Section "${name}" created successfully in project ${projectId} with ID: ${result.data.gid}`;
      } else {
        // Stub implementation
        console.debug("Using stub implementation for create-section");
        const sectionId = Math.floor(Math.random() * 10000000000);

        return `Section "${name}" created successfully in project ${projectId} with ID: ${sectionId} (stub implementation)`;
      }
    } catch (error: any) {
      console.debug("Error creating section:", error);

      throw new Error(
        `Error creating section: ${
          error.message ||
          error.originalResponse?.errors?.[0]?.message ||
          "Unknown error"
        }`
      );
    }
  },
});

// Define tool for adding a task to a section
server.addTool({
  name: "add-task-to-section",
  description: "Add a task to a specific section",
  parameters: z.object({
    sectionId: z.string().describe("Section ID"),
    taskId: z.string().describe("Task ID"),
  }),
  execute: async ({ sectionId, taskId }) => {
    console.debug(`Adding task ${taskId} to section ${sectionId}`);

    try {
      if (asanaApi) {
        // Call the actual Asana API
        const result = await asanaApi.addTaskToSection(sectionId, taskId);
        console.debug("Task added to section successfully");

        return `Task ${taskId} added to section ${sectionId} successfully`;
      } else {
        // Stub implementation
        console.debug("Using stub implementation for add-task-to-section");

        return `Task ${taskId} added to section ${sectionId} successfully (stub implementation)`;
      }
    } catch (error: any) {
      console.debug("Error adding task to section:", error);

      throw new Error(
        `Error adding task to section: ${
          error.message ||
          error.originalResponse?.errors?.[0]?.message ||
          "Unknown error"
        }`
      );
    }
  },
});

// Define tool for adding dependencies to a task
server.addTool({
  name: "add-dependencies",
  description: "Add dependencies to a task",
  parameters: z.object({
    taskId: z.string().describe("Task ID"),
    dependencyIds: z.array(z.string()).describe("Array of dependency task IDs"),
  }),
  execute: async ({ taskId, dependencyIds }) => {
    console.debug(
      `Adding dependencies ${dependencyIds.join(", ")} to task ${taskId}`
    );

    try {
      if (asanaApi) {
        // Call the actual Asana API
        const result = await asanaApi.addDependenciesToTask(
          taskId,
          dependencyIds
        );
        console.debug("Dependencies added successfully");

        return `Dependencies ${dependencyIds.join(
          ", "
        )} added to task ${taskId} successfully`;
      } else {
        // Stub implementation
        console.debug("Using stub implementation for add-dependencies");

        return `Dependencies ${dependencyIds.join(
          ", "
        )} added to task ${taskId} successfully (stub implementation)`;
      }
    } catch (error: any) {
      console.debug("Error adding dependencies to task:", error);

      throw new Error(
        `Error adding dependencies to task: ${
          error.message ||
          error.originalResponse?.errors?.[0]?.message ||
          "Unknown error"
        }`
      );
    }
  },
});

// Define tool for removing dependencies from a task
server.addTool({
  name: "remove-dependencies",
  description: "Remove dependencies from a task",
  parameters: z.object({
    taskId: z.string().describe("Task ID"),
    dependencyIds: z
      .array(z.string())
      .describe("Array of dependency task IDs to remove"),
  }),
  execute: async ({ taskId, dependencyIds }) => {
    console.debug(
      `Removing dependencies ${dependencyIds.join(", ")} from task ${taskId}`
    );

    try {
      if (asanaApi) {
        // Call the actual Asana API
        const result = await asanaApi.removeDependenciesFromTask(
          taskId,
          dependencyIds
        );
        console.debug("Dependencies removed successfully");

        return `Dependencies ${dependencyIds.join(
          ", "
        )} removed from task ${taskId} successfully`;
      } else {
        // Stub implementation
        console.debug("Using stub implementation for remove-dependencies");

        return `Dependencies ${dependencyIds.join(
          ", "
        )} removed from task ${taskId} successfully (stub implementation)`;
      }
    } catch (error: any) {
      console.debug("Error removing dependencies from task:", error);

      throw new Error(
        `Error removing dependencies from task: ${
          error.message ||
          error.originalResponse?.errors?.[0]?.message ||
          "Unknown error"
        }`
      );
    }
  },
});

// Define tool for getting dependencies for a task
server.addTool({
  name: "get-dependencies",
  description: "Get dependencies for a task",
  parameters: z.object({
    taskId: z.string().describe("Task ID"),
  }),
  execute: async ({ taskId }) => {
    console.debug(`Getting dependencies for task ${taskId}`);

    try {
      if (asanaApi) {
        // Call the actual Asana API
        const result = await asanaApi.getDependenciesForTask(taskId);
        console.debug("Dependencies retrieved successfully:", result.data);

        // Format the dependencies for display
        const dependencies = result.data.map((dep: any) => ({
          id: dep.gid,
          name: dep.name,
          completed: dep.completed,
        }));

        return `Dependencies for task ${taskId}:\n${JSON.stringify(
          dependencies,
          null,
          2
        )}`;
      } else {
        // Stub implementation
        console.debug("Using stub implementation for get-dependencies");

        const stubDependencies = [
          { id: "12345", name: "Stub dependency 1", completed: false },
          { id: "67890", name: "Stub dependency 2", completed: true },
        ];

        return `Dependencies for task ${taskId} (stub implementation):\n${JSON.stringify(
          stubDependencies,
          null,
          2
        )}`;
      }
    } catch (error: any) {
      console.debug("Error getting dependencies for task:", error);

      throw new Error(
        `Error getting dependencies for task: ${
          error.message ||
          error.originalResponse?.errors?.[0]?.message ||
          "Unknown error"
        }`
      );
    }
  },
});

// Function to start the server with stdio transport (for command-line usage)
async function startStdioServer() {
  await loadAsanaApi();

  // Start the FastMCP server
  await server.start();

  console.debug("FastMCP Asana server running with stdio transport");
  console.debug(
    "Use tools: create-task, list-tasks, update-task, delete-task, create-project, list-projects, delete-project, create-section, add-task-to-section, add-dependencies, remove-dependencies, get-dependencies"
  );
}

// Start the server
startStdioServer();

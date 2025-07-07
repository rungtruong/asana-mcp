# Asana MCP Server

A Model Context Protocol (MCP) server that provides integration with Asana's project management platform. This server enables AI assistants to interact with Asana tasks, projects, and workspaces through a standardized interface.

## Features

- **Task Management**: Create, read, update, and delete Asana tasks
- **Subtask Support**: Full support for Asana subtasks
- **Project Management**: Create and manage Asana projects
- **Section Organization**: Create sections and organize tasks within projects
- **Dependencies**: Add and manage task dependencies
- **Real-time Integration**: Direct integration with Asana's API

## Architecture

This MCP server follows a modular architecture similar to the atlassian-mcp project:

```
src/
├── core/                 # Core business logic
│   ├── services/        # Service layer for API interactions
│   │   └── asana/       # Asana-specific services
│   ├── tools/           # MCP tool definitions
│   ├── resources/       # MCP resources (future)
│   ├── prompts/         # MCP prompts (future)
│   └── *.ts            # Core registries
├── server/              # Server initialization
└── index.ts            # Main entry point
```

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd asana-mcp
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables by creating a `.env` file:
```env
ASANA_TOKEN=your_asana_personal_access_token
ASANA_WORKSPACE_ID=your_workspace_id
ASANA_PROJECT_ID=your_default_project_id  # Optional
```

## Usage

### Development
```bash
npm run dev
```

### Production
```bash
npm run build
npm start
```

## Available Tools

### Task Management
- `create-task` - Create a new Asana task
- `list-tasks` - List tasks (optionally filtered by project)
- `update-task` - Update an existing task
- `delete-task` - Delete a task

### Subtask Management
- `create-subtask` - Create a subtask for an existing task
- `list-subtasks` - List subtasks for a parent task
- `update-subtask` - Update an existing subtask
- `delete-subtask` - Delete a subtask

### Project Management
- `create-project` - Create a new Asana project
- `list-projects` - List all projects
- `delete-project` - Delete a project

### Organization
- `create-section` - Create a section in a project
- `add-task-to-section` - Add a task to a specific section

### Dependencies
- `add-dependencies` - Add dependencies to a task
- `remove-dependencies` - Remove dependencies from a task
- `get-dependencies` - Get dependencies for a task

## Configuration

### Environment Variables

- `ASANA_TOKEN`: Your Asana Personal Access Token (required)
- `ASANA_WORKSPACE_ID`: Your Asana workspace ID (required)
- `ASANA_PROJECT_ID`: Default project ID for task creation (optional)

### Getting Asana Credentials

1. Go to [Asana Developer Console](https://app.asana.com/0/my-apps)
2. Create a new Personal Access Token
3. Find your workspace ID by visiting your Asana workspace in a browser and copying the ID from the URL

## Examples

### Creating a Task
```typescript
// Using the MCP tool
{
  "name": "create-task",
  "arguments": {
    "name": "Review documentation",
    "description": "Review and update the project documentation",
    "dueDate": "2025-01-15",
    "project": "1234567890"
  }
}
```

### Listing Tasks in a Project
```typescript
{
  "name": "list-tasks",
  "arguments": {
    "projectId": "1234567890"
  }
}
```

## Development

### Project Structure

- **Services**: Business logic and API interactions in `src/core/services/`
- **Tools**: MCP tool definitions in `src/core/tools/`
- **Server**: Server initialization in `src/server/`

### Adding New Features

1. Add service methods in `src/core/services/asana/asana-service.ts`
2. Create tool definitions in `src/core/tools/asana-tools.ts`
3. Register tools in `src/core/tools.ts`

## License

MIT

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Support

For issues and feature requests, please use the GitHub issues tracker.

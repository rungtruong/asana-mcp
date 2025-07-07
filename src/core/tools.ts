import { FastMCP } from "fastmcp";
import { registerAsanaTools } from "./tools/asana-tools.js";

/**
 * Register all tools with the MCP server
 * 
 * @param server The FastMCP server instance
 */
export function registerTools(server: FastMCP) {
  // Register Asana tools
  registerAsanaTools(server);
}

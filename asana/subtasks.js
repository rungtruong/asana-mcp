import axios from 'axios';
import { getHeaders, ASANA_BASE_URL } from './config.js';

// Create Subtask
async function createSubtask(parentTaskId, name, notes = '', dueDate = null, assignee = null) {
  try {
    const subtaskData = {
      name,
      notes,
      parent: parentTaskId
    };

    if (dueDate) subtaskData.due_on = dueDate;
    if (assignee) subtaskData.assignee = assignee;

    console.debug('Creating subtask with data:', JSON.stringify(subtaskData, null, 2));
    
    const response = await axios.post(
      `${ASANA_BASE_URL}/tasks`,
      { data: subtaskData },
      { headers: getHeaders() }
    );
    return response.data;
  } catch (error) {
    console.debug('Error creating subtask:', error.response?.data || error.message);
    throw error;
  }
}

// List Subtasks
async function listSubtasks(parentTaskId) {
  try {
    console.debug(`Listing subtasks for parent task ${parentTaskId}`);
    
    const response = await axios.get(
      `${ASANA_BASE_URL}/tasks/${parentTaskId}/subtasks`,
      { headers: getHeaders() }
    );
    return response.data;
  } catch (error) {
    console.debug('Error listing subtasks:', error.response?.data || error.message);
    throw error;
  }
}

// Update Subtask
async function updateSubtask(subtaskId, updatedFields) {
  try {
    console.debug(`Updating subtask ${subtaskId} with data:`, JSON.stringify(updatedFields, null, 2));
    
    const response = await axios.put(
      `${ASANA_BASE_URL}/tasks/${subtaskId}`,
      { data: updatedFields },
      { headers: getHeaders() }
    );
    return response.data;
  } catch (error) {
    console.debug('Error updating subtask:', error.response?.data || error.message);
    throw error;
  }
}

// Delete Subtask
async function deleteSubtask(subtaskId) {
  try {
    console.debug(`Deleting subtask ${subtaskId}`);
    
    const response = await axios.delete(
      `${ASANA_BASE_URL}/tasks/${subtaskId}`,
      { headers: getHeaders() }
    );
    return { success: true, subtaskId };
  } catch (error) {
    console.debug('Error deleting subtask:', error.response?.data || error.message);
    throw error;
  }
}

// Export functions
export {
  createSubtask,
  listSubtasks,
  updateSubtask,
  deleteSubtask
};
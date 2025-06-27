#!/usr/bin/env node

import { listTasks } from './asana/index.js';

async function testListTasks() {
  try {
    console.log('Testing listTasks with completed status...');
    
    const result = await listTasks();
    
    console.log('\n=== Raw API Response ===');
    console.log(JSON.stringify(result, null, 2));
    
    if (result.data && Array.isArray(result.data)) {
      console.log('\n=== Formatted Task List ===');
      console.log('| ID | Name | Completed | Due Date |');
      console.log('|---|------|-----------|----------|');
      
      result.data.forEach(task => {
        const completedStatus = task.completed ? '✓' : '✗';
        const dueDate = task.due_on || 'No due date';
        console.log(`| ${task.gid} | ${task.name} | ${completedStatus} | ${dueDate} |`);
      });
      
      console.log(`\nTotal tasks: ${result.data.length}`);
      const completedCount = result.data.filter(task => task.completed).length;
      console.log(`Completed tasks: ${completedCount}`);
      console.log(`Pending tasks: ${result.data.length - completedCount}`);
    } else {
      console.log('No tasks found or unexpected response format.');
    }
    
  } catch (error) {
    console.error('Error testing listTasks:', error.message);
    if (error.response?.data) {
      console.error('API Error Details:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

testListTasks();
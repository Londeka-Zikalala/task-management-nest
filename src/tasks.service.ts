import { Inject, Injectable } from '@nestjs/common';
import { IDatabase } from 'pg-promise';
import { TasksCrud } from '../Types/ITasks';

@Injectable()
export class TaskService implements TasksCrud {
      private readonly db: IDatabase<any>;
    
        constructor(
            @Inject('PG_CONNECTION') db: IDatabase<any>)
            
        {
            this.db = db; 
        }

  // Function to create a task
  async createTask(
    user_id: number,
    title: string,
    description: string,
    due_date: Date,
    status: boolean,
  ): Promise<string> {
    try {
      // Insert task information into the table
      const task = await this.db.one(
        `INSERT INTO tasks (title, description, due_date, status) 
         VALUES ($1, $2, $3, $4) RETURNING id`,
        [title, description, due_date, status],
      );

      // Link the task to the logged-in user
      await this.db.none(`INSERT INTO user_tasks (user_id, task_id) VALUES ($1, $2)`, [
        user_id,
        task.id,
      ]);
      
      console.log(task)
      return 'Task created!';
    } catch (error) {
      console.error('Error creating task:', error);
      return 'Error creating task';
    }
  }

  // Function to update task status to complete
  async updateTask(title: string): Promise<string> {
    try {
      // Set the status to true (completed)
      await this.db.none(`UPDATE tasks SET status = true WHERE title = $1`, [title]);
      return 'Task completed!';
    } catch (error) {
      console.error('Error updating task:', error);
      return 'Error updating task';
    }
  }

  // Function to delete a task based on title
  async deleteTask(title: string): Promise<string> {
    try {
      await this.db.none(`DELETE FROM tasks WHERE title = $1`, [title]);
      return 'Task deleted!';
    } catch (error) {
      console.error('Error deleting task:', error);
      return 'Error deleting task';
    }
  }
}

import { Inject, Injectable } from '@nestjs/common';
import { IDatabase } from 'pg-promise';
import { TasksCrud } from '../Types/ITasks';

@Injectable()
export class TaskService implements TasksCrud {
  private readonly db: IDatabase<any>;

  constructor(
    @Inject('PG_CONNECTION') db: IDatabase<any>) {
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
  async updateTask(id: number): Promise<string> {
    try {
      // Get the current status
      const current = await this.db.one(`SELECT status FROM tasks WHERE id = $1`, [id]);
      if (current.status === false) {
        // Set the status to true (completed)
        await this.db.none(`UPDATE tasks SET status = true WHERE id = $1`, [id]);
        return 'Task completed!';
      } else {
        // Set the status to false (incomplete) 
        await this.db.none(`UPDATE tasks SET status = false WHERE id = $1`, [id]);
        return 'Task marked incomplete!';
      }

    } catch (error) {
      console.error('Error updating task:', error);
      return 'Error updating task';
    }
  }

  // Function to delete a task based on title
  async deleteTask(id: number): Promise<string> {
    try {
      // Check if task exists
      const taskExists = await this.db.oneOrNone(`SELECT * FROM tasks WHERE id = $1`, [id]);
        console.log(taskExists)
      if (!taskExists) {
        return 'Task not found!';
      }
      // Delete the task
      await this.db.none(`DELETE FROM tasks WHERE id = $1`, [taskExists.id]);
      return 'Task deleted successfully!';

    } catch (error) {
      console.error('Error deleting task:', error);
      return 'Error deleting task';
    }
  }
}

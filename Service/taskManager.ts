import db from "../db";
import { TasksCrud } from "../Types/ITasks";
import { IDatabase } from "pg-promise";

export default class TaskManager implements TasksCrud {
    constructor(private db: IDatabase<any>){}
    //Function to create a task 
    async  createTask( user_id: number , title: string, description: string, due_date: Date, status:boolean): Promise<string>{
       try{

        //Insert task information in the table 
       let task:any = await db.one(`INSERT INTO tasks (title, description, due_date, status) VALUES ($1, $2, $3, $4) RETURNING id`, [title, description, due_date,status])
            let id : number = task.id
       // Link the task to a loggned in user 
       await db.none(`INSERT INTO user_tasks (user_id, task_id) VALUES ($1, $2)`,[user_id, id])
        return 'Task created!'
    } catch(error){
        console.error(`Error setting task `, error)
        return 'Error creating task'
    }
}

// Function tp update the task status to complete

async updateTask(title: string):Promise<string>{
    try{
        //Set the boolean to true
        await db.none(`UPDATE tasks SET status = true WHERE id = $1`,[title])
        return `Task completed`;
    } catch(error){
        console.error(`Error updating task `,error)
        return `Error updating task`
    }
}
    //function to delete task

    async  deleteTask(title:string):Promise<string>{
        // remove the task based on task title
        try{
            await db.none(`DELETE FROM tasks WHERE title = $1`, [title])
            return `Task deleted!`
        }catch(error){
        console.error(`error deleting task`, error)
        return `Error deleting task`
    }
}

}


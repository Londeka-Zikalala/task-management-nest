import { Injectable } from '@nestjs/common';
import db from '../db';
import { Users } from '../Types/IUsers';
import { Tasks } from '../Types/ITasks';

@Injectable()
export class AppService {

    // function to register a user by ensuringg that the username and password are unuque
    async userRegistration(username: string , password : string): Promise<string>{
      // Insert the username and password into the users table, only when they are unique
      try{
          await db.none(`INSERT INTO users (username, password) VALUES ($1,$2) ON CONFLICT DO NOTHING`, [username,password])
          return 'user registered'
      }catch(error){
          console.error(`Error registering user`, error)
          return 'error registering user'
      }
  } 

  //Function to login a user using the password and username 
  async  userLogin(username: string, password:string): Promise<Users | null> {
      try{
           // fetch the user 
           const user = await db.one(`SELECT * FROM users WHERE username = $1 and password = $2`,[username, password])
           return user
      }catch(error){
          console.error(`Error fetching user information`, error)
          return null
      }  
  }

  // function to view all tasks by a user, it joins the tasks table and the users table 
  async  viewUserTasks(id:number):Promise<Tasks[]>{
      //fetch tasks for a user using the useridi
      try{
          const userTasks: Tasks[] = await db.manyOrNone(`SELECT tasks.id, tasks.title, tasks.due_date, tasks.status FROM tasks JOIN  user_tasks ON tasks.id = user_tasks.task_id WHERE user_tasks.user_id = $1 ORDER BY tasks.due_date ASC`,[id]);
          // iterating and filtering throught the Task array for the user's task by due date
          const tasks: Tasks[] = [];
          for (const task of userTasks){
              tasks.push({... task, due_date: new Date(task.due_date)})
          }
          return tasks
          
      } catch(error){
          console.error(`Error fetching user tasks`, error)
          return []
      }
  }
}

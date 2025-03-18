import { Inject, Injectable } from '@nestjs/common';
import { Users } from '../Types/IUsers';
import { LoginResponse } from '../Types/IUsers';
import { Tasks } from '../Types/ITasks';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { IDatabase } from 'pg-promise';

@Injectable()
export class AppService {
  
    private readonly db: IDatabase<any>;

    constructor(
        @Inject('PG_CONNECTION') db: IDatabase<any>, 
        private readonly jwtService: JwtService
    ) {
        this.db = db; 
    }
    
    // function to register a user by ensuringg that the username and password are unuque
    async userRegistration(username: string , password : string): Promise<string>{
      // Insert the username and password into the users table, only when they are unique
      try{
        const hashedPassword = await bcrypt.hash(password, 10);
          await this.db.none(`INSERT INTO users (username, password) VALUES ($1,$2) ON CONFLICT DO NOTHING`, [username,hashedPassword])
          return 'user registered'
      }catch(error){
          console.error(`Error registering user`, error)
          return 'error registering user'
      }
  } 

  //Function to login a user using the password and username 
  async  userLogin(username: string, password:string): Promise<LoginResponse | null> {
      try{
           // fetch the user 
           const user = await this.db.one(`SELECT * FROM users WHERE username = $1`,[username])
           console.log('User:', user);
           const isPasswordMatching = await bcrypt.compare(password, user.password);
           console.log('Password matches:', isPasswordMatching);
           if (!isPasswordMatching) {
             return null;
           }
           else{
            const payload = { username: user.username, sub: user.id };
            const accessToken = this.jwtService.sign(payload);
            console.log('Generated Access Token:', accessToken);
            return { accessToken };
           }    
        
      }catch(error){
          console.error(`Error fetching user information`, error)
          return null
      }  
  }

  // function to view all tasks by a user, it joins the tasks table and the users table 
  async  viewUserTasks(id:number):Promise<Tasks[]>{
      //fetch tasks for a user using the useridi
      try{
          const userTasks: Tasks[] = await this.db.manyOrNone(`SELECT tasks.id, tasks.title, tasks.due_date, tasks.status FROM tasks JOIN  user_tasks ON tasks.id = user_tasks.task_id WHERE user_tasks.user_id = $1 ORDER BY tasks.due_date ASC`,[id]);
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

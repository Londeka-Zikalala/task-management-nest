import { Controller, Post, Patch, Delete, Body, UseGuards, HttpException, HttpStatus, Headers } from '@nestjs/common';
import { TaskService } from './tasks.service';
import { JwtAuthGuard } from './Auth/jwt-auth.guard';
import { JwtService } from '@nestjs/jwt';
import { Tasks } from 'Types/ITasks';

@Controller('tasks')
export class TasksController {
    constructor(
        private readonly taskService: TaskService,
        private readonly jwtService: JwtService,  
      ) {}
      
  @UseGuards(JwtAuthGuard)
  @Post('create')
  async create(
    @Body() createUserTask: { title: string; description: string; due_date: Date; status: boolean },
    @Headers('Authorization') authHeader: string,  // Get Authorization header from the request
  ) {
    // Extract token from the Authorization header 
    const token = authHeader?.split(' ')[1]; 
    
    // Check if the token is provided
    if (!token) {
      throw new HttpException('Token not provided', HttpStatus.FORBIDDEN);
    }

    // Decode the token to get the user_id
    const userId: number = this.decodeToken(token);
    
    if (!userId) {
      throw new HttpException('Invalid token or user not found', HttpStatus.FORBIDDEN);
    }

    // Pass the user_id and task details to the service to create the task
    return this.taskService.createTask(
      userId, 
      createUserTask.title, 
      createUserTask.description, 
      createUserTask.due_date, 
      createUserTask.status
    );
  }

    decodeToken(token: string) {
        try {
            const decoded = this.jwtService.verify(token);
            return decoded.sub; 
          } catch (error) {
            throw new HttpException('Invalid token', HttpStatus.FORBIDDEN);
          }
    }

  @UseGuards(JwtAuthGuard)
  @Patch('update')
  async updateTaskStatus(@Body() tasks:Tasks): Promise<string> {
    return this.taskService.updateTask(tasks.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('delete')
  async deleteTask(@Body() tasks:Tasks): Promise<string> {
    return this.taskService.deleteTask(tasks.id);
  }
}

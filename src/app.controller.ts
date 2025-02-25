import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { Tasks } from 'Types/ITasks';
import { Users } from 'Types/IUsers';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('register')
  async registerUser(@Body('username') username: string, @Body('password') password: string): Promise<string> {
    return this.appService.userRegistration(username, password);
  }

  @Post('login')
  async loginUser(@Body('username') username: string, @Body('password') password: string): Promise<Users | null> {
    return this.appService.userLogin(username, password);
  }
 
  @Get(':id/tasks')
  async getUserTasks(@Param('id') id: number): Promise<Tasks[]> {
    return this.appService.viewUserTasks(id);
  }

}


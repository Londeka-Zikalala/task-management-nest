import { Module } from '@nestjs/common';
import { AppController } from './user.controller';
import { AppService } from './user.service';
import { JwtStrategy } from './Auth/jwt.strategy';
import { AuthModule } from './Auth/auth.module';
import { TasksController } from './tasks.controller';
import { TaskService } from './tasks.service';
import db from '../db';


@Module({
  imports: [AuthModule],
  controllers: [AppController, TasksController],
  providers: [{provide:'PG_CONNECTION', useFactory:function(){
  return db
  }

  },AppService, JwtStrategy, TaskService], 
})
export class AppModule {}

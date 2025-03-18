import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './user.controller';
import { AppService } from './user.service';
import { TaskService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { JwtService } from '@nestjs/jwt';
import { JwtStrategy } from './Auth/jwt.strategy';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController, TasksController],
      providers: [AppService, TaskService, JwtService, JwtStrategy],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it("It should return AppService", () => {
    });
  });
});

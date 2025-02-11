import { Module } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { UsersController } from './controllers/users.controller';
import { DataModule } from 'src/data/data.module';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
<<<<<<< HEAD
import { HousesController } from './controllers/houses.controller';
import { HousesService } from './services/houses.service';

@Module({
  controllers: [AuthController, UsersController, HousesController],
=======

@Module({
  controllers: [AuthController, UsersController],
>>>>>>> 18ad784 (HSA-51: Add Auth Guard & Swagger Authorization)
  imports: [DataModule],
  providers: [UsersService, AuthService],
  exports: [UsersService, AuthService],
})
export class UsersModule {}

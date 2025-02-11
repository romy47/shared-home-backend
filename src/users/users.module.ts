import { Module } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { UsersController } from './controllers/users.controller';
import { DataModule } from 'src/data/data.module';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
<<<<<<< HEAD
<<<<<<< HEAD
import { HousesController } from './controllers/houses.controller';
import { HousesService } from './services/houses.service';

@Module({
  controllers: [AuthController, UsersController, HousesController],
=======

@Module({
  controllers: [AuthController, UsersController],
>>>>>>> 18ad784 (HSA-51: Add Auth Guard & Swagger Authorization)
=======
import { HousesController } from './controllers/houses.controller';
import { HousesService } from './services/houses.service';

@Module({
  controllers: [AuthController, UsersController, HousesController],
>>>>>>> 10f4f11 (HSA-52: Add role based Authorization for a house)
  imports: [DataModule],
  providers: [UsersService, AuthService, HousesService],
  exports: [UsersService, AuthService, HousesService],
})
export class UsersModule {}

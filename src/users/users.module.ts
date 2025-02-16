import { Module } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { UsersController } from './controllers/users.controller';
import { DataModule } from 'src/data/data.module';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { HousesController } from './controllers/houses.controller';
import { HousesService } from './services/houses.service';

@Module({
  controllers: [AuthController, UsersController, HousesController],
  imports: [DataModule],
  providers: [UsersService, AuthService, HousesService],
  exports: [UsersService, AuthService, HousesService],
})
export class UsersModule {}

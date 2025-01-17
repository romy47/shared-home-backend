import { Module } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { UsersController } from './controllers/users.controller';
import { DataModule } from 'src/data/data.module';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';

@Module({
  controllers: [AuthController, UsersController],
  imports: [DataModule],
  providers: [UsersService, AuthService],
  exports: [UsersService, AuthService],
})
export class UsersModule {}

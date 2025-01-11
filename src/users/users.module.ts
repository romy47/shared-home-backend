import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { DataModule } from 'src/data/data.module';

@Module({
  controllers: [UsersController],
  imports: [DataModule],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}

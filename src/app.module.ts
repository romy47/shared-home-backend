import { Module } from '@nestjs/common';
import { DataModule } from './data/data.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [DataModule, UsersModule],
  controllers: [],
  providers: [],
})
export class AppModule {}

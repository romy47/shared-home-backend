import { Module } from '@nestjs/common';
import { DataModule } from './data/data.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), DataModule, UsersModule],
  controllers: [],
  providers: [],
})
export class AppModule {}

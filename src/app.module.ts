import { Module } from '@nestjs/common';
import { DataModule } from './data/data.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './guards/auth.guard';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), DataModule, UsersModule],
  controllers: [],
  // Providing the app guard here, ensures the guard is centrally activated for all controllers and, all API endpoints.
  // For making a particular API public put @public() decorator with that endpoint.
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}

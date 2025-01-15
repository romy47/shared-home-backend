import { Module } from '@nestjs/common';
import { PrismaService } from './services/prisma/prisma.service';
import { ConfigModule } from '@nestjs/config';
import { FirebaseAdminService } from './services/firebase/firebase.service';
import { PrismaSeederCommand } from './services/seeder/seeder.service';

@Module({
  imports: [ConfigModule],
  providers: [PrismaService, FirebaseAdminService, PrismaSeederCommand],
  exports: [PrismaService, FirebaseAdminService, PrismaSeederCommand],
})
export class DataModule {}

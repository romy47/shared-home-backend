import { Module } from '@nestjs/common';
import { PrismaService } from './services/prisma/prisma.service';
import { ConfigModule } from '@nestjs/config';
import { FirebaseAdminService } from './services/firebase/firebase-admin.service';
import { PrismaSeederCommand } from './services/seeder/seeder.service';
import { FirebaseClientService } from './services/firebase/firebase-client.service';
import { PaginationService } from './common/pagination-service';

@Module({
  imports: [ConfigModule],
  providers: [
    PrismaService,
    FirebaseAdminService,
    FirebaseClientService,
    PrismaSeederCommand,
    PaginationService
  ],
  exports: [
    PrismaService,
    FirebaseAdminService,
    FirebaseClientService,
    PrismaSeederCommand,
    PaginationService
  ],
})
export class DataModule {}

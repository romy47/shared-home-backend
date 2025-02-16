import { Module } from '@nestjs/common';
import { PrismaService } from './services/prisma/prisma.service';
import { ConfigModule } from '@nestjs/config';
import { FirebaseAdminService } from './services/firebase/firebase-admin.service';
import { PrismaSeederCommand } from './services/seeder/seeder.service';
import { FirebaseClientService } from './services/firebase/firebase-client.service';

@Module({
  imports: [ConfigModule],
  providers: [
    PrismaService,
    FirebaseAdminService,
    FirebaseClientService,
    PrismaSeederCommand,
  ],
  exports: [
    PrismaService,
    FirebaseAdminService,
    FirebaseClientService,
    PrismaSeederCommand,
  ],
})
export class DataModule {}

import { Module } from '@nestjs/common';
import { PrismaService } from './services/prisma/prisma.service';
import { ConfigModule } from '@nestjs/config';
import { FirebaseAdminService } from './services/firebase/firebase-admin.service';
import { PrismaSeederCommand } from './services/seeder/seeder.service';
import { FirebaseClientService } from './services/firebase/firebase-client.service';
<<<<<<< HEAD
import { PaginationService } from './common/pagination-service';
=======
>>>>>>> 18ad784 (HSA-51: Add Auth Guard & Swagger Authorization)

@Module({
  imports: [ConfigModule],
  providers: [
    PrismaService,
    FirebaseAdminService,
    FirebaseClientService,
    PrismaSeederCommand,
<<<<<<< HEAD
    PaginationService
=======
>>>>>>> 18ad784 (HSA-51: Add Auth Guard & Swagger Authorization)
  ],
  exports: [
    PrismaService,
    FirebaseAdminService,
    FirebaseClientService,
    PrismaSeederCommand,
<<<<<<< HEAD
    PaginationService
=======
>>>>>>> 18ad784 (HSA-51: Add Auth Guard & Swagger Authorization)
  ],
})
export class DataModule {}

import { Command, CommandRunner, Option } from 'nest-commander';
import { PrismaService } from '../prisma/prisma.service';
import { faker } from '@faker-js/faker';
import { FirebaseAdminService } from '../firebase/firebase.service';

@Command({
  name: 'db:seed',
  description: 'Seed the database with initial data',
})
export class PrismaSeederCommand extends CommandRunner {
  constructor(
    private prismaService: PrismaService,
    private firebaseAdminService: FirebaseAdminService,
  ) {
    super();
  }

  async run(
    passedParams: string[],
    options?: Record<string, any>,
  ): Promise<void> {
    const numHouses = options?.houses || 1;
    for (let i = 0; i < numHouses; i++) {
      const email = faker.internet.email();
      try {
        // Start the transaction
        await this.prismaService.$transaction(async (tx) => {
          // Create user in Firebase
          const userRecord = await this.firebaseAdminService
            .getAuth()
            .createUser({
              email,
              password: '123456',
              displayName: faker.person.fullName(),
              emailVerified: true,
              disabled: false,
            });

          console.log(
            'Successfully created new ADMIN  user in Firebase:',
            userRecord.uid,
          );

          // Create corresponding user in Prisma
          const user = await tx.user.create({
            data: {
              auth_id: userRecord.uid,
              email: userRecord.email,
              first_name: userRecord.displayName?.split(' ')[0],
              last_name: userRecord.displayName?.split(' ')[1] || '',
            },
          });

          console.log(
            'Successfully created ADMIN  user in Prisma:',
            userRecord.email,
          );

          // Find the admin role by passing 'ADMIN'
          const adminRole = await tx.role.findFirst({
            where: { role: 'ADMIN' },
          });

          if (!adminRole) {
            throw new Error('Admin role not found!');
          }

          // Create the house and link the current user as the admin
          const house = await tx.house.create({
            data: {
              title: faker.commerce.productName(),
              created_by: user.id, // This user is the creator of the house
            },
          });

          console.log('House created:', house.id);

          // Create HouseUser for the admin user (with the admin role)
          await tx.houseUser.create({
            data: {
              house_id: house.id,
              user_id: user.id,
              role_id: adminRole.id,
            },
          });

          console.log(`HouseUser created for admin: ${user.email}`);

          // Now, create 2 more users and add them to the house
          for (let j = 0; j < 2; j++) {
            const additionalUserEmail = faker.internet.email();
            const additionalUserRecord = await this.firebaseAdminService
              .getAuth()
              .createUser({
                email: additionalUserEmail,
                password: '123456',
                displayName: faker.person.fullName(),
                emailVerified: true,
                disabled: false,
              });

            console.log(
              'Successfully created additional member user in Firebase:',
              additionalUserRecord.uid,
            );

            const additionalUser = await tx.user.create({
              data: {
                auth_id: additionalUserRecord.uid,
                email: additionalUserRecord.email,
                first_name: additionalUserRecord.displayName?.split(' ')[0],
                last_name:
                  additionalUserRecord.displayName?.split(' ')[1] || '',
              },
            });

            console.log(
              'Successfully created additional member user in Prisma:',
              additionalUserRecord.email,
            );

            // Add the additional user to the house (as a member, default role)
            const memberRole = await tx.role.findFirst({
              where: { role: 'TENANT' }, // Assuming 'USER' is the default member role
            });

            if (!memberRole) {
              throw new Error('Member role not found!');
            }

            await tx.houseUser.create({
              data: {
                house_id: house.id,
                user_id: additionalUser.id,
                role_id: memberRole.id,
              },
            });

            console.log(
              `HouseUser created for member: ${additionalUser.email}`,
            );
          }
        });
      } catch (error) {
        console.error('Error creating user and house:', error);
      }
    }
  }
  @Option({
    flags: '-h, --houses [number]',
    description: 'A basic number parser',
  })
  parseNumber(val: string): number {
    return Number(val);
  }
}

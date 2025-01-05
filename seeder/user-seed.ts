import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { firebaseAuth } from '../src/services/firebase';
const prisma = new PrismaClient();

const createFakeUsers = async (numUsers: number) => {
    for (let i = 0; i < numUsers; i++) {
      const email = faker.internet.email();
      // const password = faker.internet.password();
  
      try {
        // Create user in Firebase
        const userRecord = await firebaseAuth().createUser({
          email,
          password:'1234',
          displayName: faker.person.fullName(),
          emailVerified: false,
          disabled: false,
          
        });
  
        console.log('Successfully created new user in Firebase:', userRecord.uid);
  
        // Create corresponding user in Prisma
        await prisma.user.create({
          data: {
            auth_id: userRecord.uid,
            email: userRecord.email,
            first_name: userRecord.displayName?.split(' ')[0],
            last_name: userRecord.displayName?.split(' ')[0],
          },
        });
  
        console.log('Successfully created user in Prisma:', userRecord.email);
      } catch (error) {
        console.error('Error creating user:', error);
      }
    }
};

//VERY VERY DANGEROUS, WILL DELETE ALL USER
const deleteAllUsers = async () => {
    try {
      // Delete all users in Firebase
      const listUsersResult = await firebaseAuth().listUsers();
      const uids = listUsersResult.users.map(user => user.uid);
  
      if (uids.length > 0) {
        //VERY VERY DANGEROUS
        await firebaseAuth().deleteUsers(uids);
        console.log('Successfully deleted all users in Firebase');
      }
  
      // Delete WILL DELETE ALL USER
      await prisma.house.deleteMany({});
      await prisma.houseUser.deleteMany({});
      await prisma.user.deleteMany({});
      console.log('Successfully deleted all users, houses, houseUsers in Prisma');
    } catch (error) {
      console.error('Error deleting users:', error);
    }
};

const main = async () => {
    const args = process.argv.slice(2);
    const action = args[0];
    const numUsers = args[1] ? parseInt(args[1], 10) : 10;
  
    if (action === 'seed') {
      await createFakeUsers(numUsers);
    } else if (action === 'delete') {
      await deleteAllUsers();
    } else {
      console.log('Invalid action. Use "seed" to seed data or "delete" to delete all users.');
    }
  
    await prisma.$disconnect();
  };
  
  main().catch(error => {
    console.error('Error in seed script:', error);
    process.exit(1);
  });
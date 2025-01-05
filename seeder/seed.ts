import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { firebaseAuth } from '../src/services/firebase';
const prisma = new PrismaClient();

const createFakeUsers = async (numUsers: number) => {
    for (let i = 0; i < numUsers; i++) {
      const email = faker.internet.email();
      // const password = faker.internet.password();
  
      // try {
      //   // Create user in Firebase
      //   const userRecord = await firebaseAuth().createUser({
      //     email,
      //     password:'1234',
      //     displayName: faker.person.fullName(),
      //     emailVerified: false,
      //     disabled: false,
          
      //   });
  
      //   console.log('Successfully created new user in Firebase:', userRecord.uid);
  
      //   // Create corresponding user in Prisma
      //   await prisma.user.create({
      //     data: {
      //       auth_id: userRecord.uid,
      //       email: userRecord.email,
      //       first_name: userRecord.displayName?.split(' ')[0],
      //       last_name: userRecord.displayName?.split(' ')[0],
      //     },
      //   });
  
      //   console.log('Successfully created user in Prisma:', userRecord.email);


      // } catch (error) {
      //   console.error('Error creating user:', error);
      // }
      try {
        // Start the transaction
        await prisma.$transaction(async (tx) => {
          // Create user in Firebase
          const userRecord = await firebaseAuth().createUser({
            email,
            password:'123456',
            displayName: faker.person.fullName(),
            emailVerified: true,
            disabled: false,
          });
      
          console.log('Successfully created new ADMIN  user in Firebase:', userRecord.uid);
      
          // Create corresponding user in Prisma
          const user = await tx.user.create({
            data: {
              auth_id: userRecord.uid,
              email: userRecord.email,
              first_name: userRecord.displayName?.split(' ')[0],
              last_name: userRecord.displayName?.split(' ')[1] || '',
            },
          });
      
          console.log('Successfully created ADMIN  user in Prisma:', userRecord.email);
    
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
            const additionalUserRecord = await firebaseAuth().createUser({
              email: additionalUserEmail,
              password:'123456',
              displayName: faker.person.fullName(),
              emailVerified: true,
              disabled: false,
            });
    
            console.log('Successfully created additional member user in Firebase:', additionalUserRecord.uid);
    
            const additionalUser = await tx.user.create({
              data: {
                auth_id: additionalUserRecord.uid,
                email: additionalUserRecord.email,
                first_name: additionalUserRecord.displayName?.split(' ')[0],
                last_name: additionalUserRecord.displayName?.split(' ')[1] || '',
              },
            });
    
            console.log('Successfully created additional member user in Prisma:', additionalUserRecord.email);
    
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
    
            console.log(`HouseUser created for member: ${additionalUser.email}`);
          }
        });
  
      } catch (error) {
        console.error('Error creating user and house:', error);
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
      await prisma.houseUser.deleteMany({});
      await prisma.house.deleteMany({});
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
# Shared Home: Express Backend

## How to set it running?
**Have nodejs installed on the system.**

- clone the project
- have a postgres db running in docker/cloud, have the user, connecting url handy.
- have an .env file in the project root, with the variable mentioned as .env-example file.
- also have a .env.develop file inside the src\environment folder. follow the example file.
- Now run an initial migration to create the tables, `npx prisma migrate dev`
- generate client files, these are typescript models generated from prisma schema. you must need to generate it initially and everytime u migrate database. `npx prisma generate`
- run the project with command `npm start`

## How to seed data?
Right now seeding data means, user will be created with username, password(123456).
for each user, a house will be created, and 2 more users will be created, and attached to the house.

* **How to seed data**: Goto seeder folder, and then run `ts-node user-seed.ts seed <user_count>`
if u pass 3, it will create (1 house, 1user as houseadmin, 2 user has housetenant) 3 times.

* **How to delete data**: it will delete all house, all housemembers, all users from firebase and all users from db. Goto seeder folder, and then run`ts-node user-seed.ts delete`

### How to migrate when u changed the database?
- Change the prisma schema file for migration based on your project requirement.
- Now generate and run DB migration, `npx prisma migrate dev --name <migration-name>`. 

    This command will:

    * Generate a new migration file in the prisma/migrations folder.
    * Apply the migration to your database.
    * Update your Prisma client to reflect the schema changes.
- Generate new client files: as you know prisma
generates typescript models from the schema file
for validation and everything, everytime you migrate you need to generate new client files to update the typescript models prisma use. `npx prisma generate`.



### Troubleshooting
- Migrated, but in a query where you are using the generated model's fields, it is not updated yet. **Solution**: just wait 5-15 minutes. if it does not work, delete the client folder and regenerate client files. 
# Shared Home Backend

## Contributin Guideline for Developers

The following pre-requisites are required in order to run the application

1. Node.js (>= 16.x)
2. npm (>= 8.x)
3. PostgreSQL
4. Git
5. Docker

### Installing the requirements

```
npm install
```

### Development Workflow

1. Branching strategy

```
git checkout -b feature/<feature-name>
git checkout -b bugfix/<bug-name>
git checkout -b refactor/<refactor-name>
git checkout -b test/<test-name>
```

2. Commit message

```
HSA<ticket-number>: Commit Message
Example:
HSA-16: Add/Fix/Refactor/Bug expense rest api
```

### Guideline for commit message

1. The subject line must not exceed 50 characters.
2. The subject line should be capitalized and must not end in a period.
3. The subject line must be written in imperative mood (Fix, not Fixed / Fixes etc.).
4. The body must be wrapped at 72 columns.
5. The body must only contain explanations as to what adn why, never how. The latter belongs to documentation and implementations.

### Run the project

```
npm run start:dev
```

### DB Seeding

edit the last integer based on the number of houses you want

```
node dist/main.js db:seed --cli --houses 3
```

### Swagger Guideline
<<<<<<< HEAD

The routes are guarded with token validation. Only signup and login is public. Here is the guideline for authorizing in Swagger.

=======

The routes are guarded with token validation. Only signup and login is public. Here is the guideline for authorizing in Swagger.

1. Open Swagger and locate the login endpoint under the Authentication section.
2. Click "Try it out," enter valid credentials, and execute the request.
3. Copy the token from the response.
4. Click the "Authorize" button at the top right corner of the Swagger UI.
5. Paste the token in the modal (No extra prefix needed).
6. Confirm authorization, ensuring the token is applied globally for secured routes.
7. Test guarded routes by clicking "Try it out" to verify they are accessible.

<<<<<<< HEAD
### Authentication

1. The AuthGuard is centrally placed in the app module, and all API endpoints are automatically protected.
2. To create a public (non-secure) API endpoint, use the @Public() decorator on the endpoint.
3. The AuthGuard expects a valid Firebase token in the requests.
4. After validation, it attaches the logged-in User to the request. You can access the User object in your controller.

### Role Based Authorization

1. The HouseRolesGuard decorator works with RolesGuard. Add these two together to protect an API endpoint with defined roles.

2. Make sure some where (either in parent or in the current controller function) there is a param named 'house_id'. The role uses this route_param to check if the user is a member of the house, then it checks role.

Below is an example:
@‌Get(':house_id')
@‌UseGuards(HouseRolesGuard)
@‌HouseRoles(HouseRole.TENANT, HouseRole.ADMIN)
<<<<<<< HEAD
=======
>>>>>>> 18ad784 (HSA-51: Add Auth Guard & Swagger Authorization)
### Authentication

1. The AuthGuard is centrally placed in the app module, and all API endpoints are automatically protected.
2. To create a public (non-secure) API endpoint, use the @Public() decorator on the endpoint.
3. The AuthGuard expects a valid Firebase token in the requests.
4. After validation, it attaches the logged-in User to the request. You can access the User object in your controller.

### Role Based Authorization

1. The HouseRolesGuard decorator works with RolesGuard. Add these two together to protect an API endpoint with defined roles.

2. Make sure some where (either in parent or in the current controller function) there is a param named 'house_id'. The role uses this route_param to check if the user is a member of the house, then it checks role.

Below is an example:
@‌Get(':house_id')
@‌UseGuards(HouseRolesGuard)
@‌HouseRoles(HouseRole.TENANT, HouseRole.ADMIN)
=======
>>>>>>> f2d6a44 (added pagiantion)


### How to use the standard paginated API response method?
This standard method ensures that we are sending consistent list api response always.

example can be found in task service.

```
  async listByTaskCategoryByHouse(house_id: number) {
    
    //this type means, the type for creating query that results in a list,
    //it is generated from the prisma models already, for our TaskCategory model
    //prisma generated it for us..
    const query:Prisma.TaskCategoryFindManyArgs ={
      where: { house_id },
      include: {
        house: true, 
        user: true,  
        image:true
      },
    };
    //thes parameters are supposed to come from request, here we are demosntarting an example
    const params:PaginationParams = {
      page: 1,
      pageSize: 5
    }
    return this.paginationService.paginate(
      this.prismaService.taskCategory, 
      params, 
      query
    );

    
  }
```
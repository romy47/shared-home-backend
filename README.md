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
The routes are guarded with token validation. Only signup and login is public. Here is the guideline for authorizing in Swagger.
1. Open Swagger and locate the login endpoint under the Authentication section.
2. Click "Try it out," enter valid credentials, and execute the request.
3. Copy the token from the response.
4. Click the "Authorize" button at the top right corner of the Swagger UI.
5. Paste the token in the modal (No extra prefix needed).
6. Confirm authorization, ensuring the token is applied globally for secured routes.
7. Test guarded routes by clicking "Try it out" to verify they are accessible.


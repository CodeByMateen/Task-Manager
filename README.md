# To simply install the project, make sure to have the package.json file in this folder
-- simply write command "npm i" in terminal and it will install the required packages.
-- to run the project, run command "npm start" or preferred "npm run dev" and it'll run server and connect to database
-- to test API's, sample routes are given below
-- to test jest, use command "npx jest" or you can also use "npm test"

<h3><u>Using type: module for this project</u></h3>

# If you don't have package.json file, follow the installation commands below

# To create project:
npm init (to manually setup project) OR
npm init -y (to automatically setup project by default)

# Packages to install:
npm i express dotenv bcrypt mongoose cors validator jsonwebtoken

# To install devDependency
npm i -D nodemon jest supertest babel-jest @babel/preset-env

# Testing Routes for User
(POST)
http://localhost:3000/api/v1/user/signup
(BODY)
{
"name": "John Doe",
"email": "john.doe@gmail.com",
"password": "Password123!"
}

(POST)
http://localhost:3000/api/v1/user/signin
(BODY)
{
"email": "john.doe@gmail.com",
"password": "Password123!"
}

# Testing Routes for Task
(GET)
http://localhost:3000/api/v1/task/get-complete-tasks
(BEARER TOKEN REQUIRED)

(GET)
http://localhost:3000/api/v1/task/get-paginated-tasks?page=2&limit=3

(GET)
http://localhost:3000/api/v1/task/get-all

(GET)
http://localhost:3000/api/v1/task/get-tasks
(BEARER TOKEN REQUIRED)

(GET)
http://localhost:3000/api/v1/task/get-complete-tasks
(BEARER TOKEN REQUIRED)

(GET)
http://localhost:3000/api/v1/task/get-incomplete-tasks
(BEARER TOKEN REQUIRED)

(GET)
http://localhost:3000/api/v1/task/get/:id
(BEARER TOKEN REQUIRED)

(POST)
http://localhost:3000/api/v1/task/update-complete-task/:id
(BEARER TOKEN REQUIRED)
(BODY)
{
"title": "Updated task title",
"description": "Updated task description"
"completed": true
}

(PATCH) http://localhost:3000/api/v1/task/update-task/:id
(BEARER TOKEN REQUIRED)
(BODY)
{
"description": "Updated task description"
}

(DELETE)
http://localhost:3000/api/v1/task/delete-task/:id
(BEARER TOKEN REQUIRED)

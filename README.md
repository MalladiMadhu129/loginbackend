# MERN Stack Application - Backend

This is the backend server for a MERN (MongoDB, Express, React, Node.js) stack application. It provides RESTful API endpoints to manage employee data and user authentication.



## Features

- User authentication with JWT
- CRUD operations for employee management
- Protected routes for authenticated users
- Data validation and error handling

## Installation

1. **Clone the repository:**

   ```sh
   git clone https://github.com/yourusername/your-repository.git
   cd your-repository/backend

**Install dependencies:**

npm install

Start the server:

node server.js

**API Endpoints**

**Authentication**

POST /api/auth/login: Log in a user

POST /api/auth/register: Register a new user

GET /api/auth/me: Get the logged-in user's details

**Employees**

GET /api/employees: Get all employees

POST /api/employees: Create a new employee

GET /api/employees/

: Get an employee by ID

PUT /api/employees/

: Update an employee by ID

DELETE /api/employees/

: Delete an employee by ID

**Environment Variables**

MONGO_URI: The MongoDB connection string

JWT_SECRET: The secret key for JWT

PORT: The port on which the server runs (default is 5000)

MONGO_URI=mongodb://localhost:27017/yourdatabase

JWT_SECRET=yourjwtsecret

PORT=5000

**Technologies Used**

Node.js

Express

MongoDB

Mongoose

JWT (JSON Web Tokens) for authentication

**License**

This project is licensed under the MIT License. See the LICENSE file for details.




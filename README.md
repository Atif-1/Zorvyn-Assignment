# Finance Manager Backend

## Description

A Node.js backend application for managing personal finance data with user authentication, transaction tracking, and dashboard analytics. Built as part of the Zorvyn assignment, this application provides secure access control and data processing for financial transactions.

## Features

- **User Management**: User registration, login, and profile updates with role-based access control
- **Transaction Management**: Create, read, update, and soft delete financial transactions
- **Dashboard Analytics**: Summary statistics, category breakdowns, recent activity, and monthly trends
- **Authentication**: JWT-based authentication with password hashing
- **Authorization**: Role-based permissions (Admin and regular users)
- **Data Validation**: Input validation using express-validator
- **Database**: MySQL database with Sequelize ORM

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL with Sequelize ORM
- **Authentication**: JSON Web Tokens (JWT)
- **Password Hashing**: bcrypt
- **Validation**: express-validator
- **Security**: Helmet, CORS
- **Other**: UUID for user IDs, dotenv for environment variables

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd zrvn_assgnmt
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables (see Environment Variables section)

4. Start the server:
   ```bash
   npm start
   ```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
PORT=3000
DB_HOST=localhost
DB_USER=your_db_username
DB_PASSWORD=your_db_password
DB_NAME=finance_manager
SECRET_KEY=your_jwt_secret_key
SALT=10
```

## Database Schema

### Users
- `user_id` (UUID, Primary Key)
- `username` (String, required)
- `email` (String, required, unique)
- `password` (String, required, hashed)
- `role_id` (Integer, required)
- `active` (Boolean, default: true)

### Roles
- `role_id` (Integer, Primary Key, Auto Increment)
- `role_name` (String, required, unique)

### Categories
- `category_id` (Integer, Primary Key, Auto Increment)
- `category` (String, required)

### Transactions
- `transaction_id` (Integer, Primary Key, Auto Increment)
- `amount` (Integer, required)
- `type` (ENUM: 'income', 'expense', required)
- `notes` (Text, optional)
- `category_id` (Integer, required)
- `user_id` (UUID, required)
- `date` (Date, default: NOW)
- `is_delete` (Boolean, default: false)

## Relationships

- User belongs to Role (many-to-one)
- Role has many Users (one-to-many)
- Transaction belongs to User (many-to-one)
- Transaction belongs to Category (many-to-one)
- Category has many Transactions (one-to-many)

## API Endpoints

### Authentication

#### POST /user/login
Login user
- **Body**: `{ "username"?: string, "email"?: string, "password": string }`
- **Response**: `{ "status": boolean, "message": string, "token"?: string }`

### User Management (Admin Only)

#### POST /user/signup
Create new user (requires authentication and admin role)
- **Headers**: `Authorization: Bearer <token>`
- **Body**: `{ "username": string, "email": string, "password": string, "role_id": number }`
- **Response**: `{ "success": boolean, "message": string, "user"?: object }`

#### PATCH /user/update/:id
Update user (requires authentication and admin role)
- **Headers**: `Authorization: Bearer <token>`
- **Body**: `{ "username"?: string, "email"?: string, "password"?: string, "role_id"?: number, "active"?: boolean }`
- **Response**: `{ "status": boolean, "message": string }`

#### GET /user/
Get users with pagination (requires authentication and admin role)
- **Headers**: `Authorization: Bearer <token>`
- **Query**: `page=1&limit=10&search=&type=`
- **Response**: `{ "success": boolean, "data": array, "meta": object }`

### Transaction Management

#### POST /transaction/create
Create transaction (requires authentication)
- **Headers**: `Authorization: Bearer <token>`
- **Body**: `{ "amount": number, "type": "income"|"expense", "notes"?: string, "category_id": number, "date"?: date }`
- **Response**: `{ "success": boolean, "message": string }`

#### PATCH /transaction/update/:id
Update transaction (requires authentication)
- **Headers**: `Authorization: Bearer <token>`
- **Body**: `{ "amount"?: number, "type"?: "income"|"expense", "notes"?: string, "category_id"?: number, "date"?: date }`
- **Response**: `{ "success": boolean, "message": string }`

#### PATCH /transaction/delete/:id
Soft delete transaction (requires authentication)
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `{ "success": boolean, "message": string }`

#### GET /transaction/
Get transactions with pagination and filters (requires authentication, admin/manager for all, users see their own)
- **Headers**: `Authorization: Bearer <token>`
- **Query**: `page=1&limit=10&search=&type=income|expense&category=`
- **Response**: `{ "success": boolean, "data": array, "meta": object }`

### Dashboard

#### GET /dashboard/
Get dashboard summary (requires authentication)
- **Headers**: `Authorization: Bearer <token>`
- **Response**: 
  ```json
  {
    "success": true,
    "summary": {
      "totalIncome": number,
      "totalExpenses": number,
      "netBalance": number
    },
    "categoryBreakdown": array,
    "recentActivity": array,
    "monthlyTrends": array
  }
  ```

### Root

#### GET /
Welcome message
- **Response**: `{ "success": true, "message": "Welcome to FinSol -: Finance Solution" }`

## Usage

1. Start the server with `npm start`
2. Use tools like Postman or curl to interact with the API endpoints
3. First, create an admin user or login with existing credentials
4. Use the JWT token in Authorization header for protected routes

## Project Structure

```
zrvn_assgnmt/
├── app.js                 # Main Express app setup
├── server.js              # Server entry point
├── package.json           # Dependencies and scripts
├── config/
│   └── database.js        # Database configuration
├── controller/
│   ├── userController.js      # User-related logic
│   ├── transactionsController.js  # Transaction logic
│   └── dashboardController.js # Dashboard analytics
├── middleware/
│   ├── auth.js            # Authentication middleware
│   └── validate.js        # Validation middleware
├── models/
│   ├── index.js           # Database connection and model associations
│   ├── User.js            # User model
│   ├── Role.js            # Role model
│   ├── Category.js        # Category model
│   └── Transactions.js    # Transaction model
├── routes/
│   ├── userRouter.js      # User routes
│   ├── transactionRouter.js   # Transaction routes
│   └── dashboardRouter.js # Dashboard routes
└── validators/
    └── validator.js       # Input validation rules
```

## Security Features

- JWT authentication for API access
- Password hashing with bcrypt
- Role-based access control
- Input validation and sanitization
- Helmet for security headers
- CORS configuration

## Error Handling

The application includes comprehensive error handling:
- 400: Bad Request (validation errors)
- 401: Unauthorized (missing/invalid token)
- 403: Forbidden (insufficient permissions)
- 404: Not Found
- 500: Internal Server Error

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

ISC License

## Author

SAA
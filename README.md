# Admin Portal

A modular, scalable admin panel application with a Node.js/Express backend using MySQL and a React.js frontend with Material UI.

## Features

- **Authentication System**: Secure login/logout with JWT tokens
- **Dashboard**: Overview with statistics for all modules
- **Team Management**: CRUD operations for team members
- **Blog Management**: CRUD operations for blog posts
- **Portfolio Management**: CRUD operations for portfolio items
- **User Management**: Admin user management
- **Responsive Design**: Modern UI with Material UI components

## Tech Stack

### Backend
- Node.js with Express.js
- MySQL database with Sequelize ORM
- JWT authentication
- bcryptjs for password hashing
- CORS enabled

### Frontend
- React.js with TypeScript
- Material UI for components
- React Router for navigation
- Axios for API calls
- Context API for state management

## Project Structure

```
Admin-Portal/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── Blog.js
│   │   ├── Portfolio.js
│   │   ├── Team.js
│   │   ├── User.js
│   │   └── index.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── blog.js
│   │   ├── portfolio.js
│   │   ├── team.js
│   │   └── users.js
│   ├── seeders/
│   │   └── seed.js
│   ├── app.js
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout/
│   │   │   │   ├── Layout.tsx
│   │   │   │   └── Sidebar.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   ├── contexts/
│   │   │   └── AuthContext.tsx
│   │   ├── pages/
│   │   │   ├── Blog.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── Portfolio.tsx
│   │   │   ├── Team.tsx
│   │   │   └── Users.tsx
│   │   ├── App.tsx
│   │   └── index.tsx
│   ├── package.json
│   └── tsconfig.json
└── README.md
```

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a MySQL database named `admin_portal`

4. Configure database connection in `config/database.js`:
```javascript
module.exports = {
  development: {
    username: 'your_username',
    password: 'your_password',
    database: 'admin_portal',
    host: 'localhost',
    dialect: 'mysql'
  }
};
```

5. Run database migrations and seed data:
```bash
node seeders/seed.js
```

6. Start the backend server:
```bash
npm start
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## Password Security: RSA Encryption

This project uses RSA encryption to secure passwords in transit between the frontend and backend.

### How it works
- The backend generates an RSA key pair (private and public keys).
- The public key is served to the frontend at `/api/auth/public-key`.
- The frontend encrypts passwords with the public key before sending them to the backend (for login, add user, and change password).
- The backend decrypts the password using the private key before authentication or updating.

### Key Generation (one-time setup)
1. Make sure you have OpenSSL installed (or use an online tool for development).
2. From the project root, run:
   ```bash
   mkdir -p backend/config
   openssl genrsa -out backend/config/private.pem 2048
   openssl rsa -in backend/config/private.pem -pubout -out backend/config/public.pem
   ```
3. The private key (`private.pem`) must remain secret and only on the backend. The public key (`public.pem`) is safe to share.

### Notes
- If the keys are missing, the backend will not start.
- For production, always generate a new, secure key pair and keep the private key safe.
- The frontend will fallback to sending plain passwords if the public key is not available (for backward compatibility).

## Default Admin Credentials

After running the seed script, you can log in with:
- **Email**: `admin@example.com`
- **Password**: `admin123`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Users (Admin only)
- `GET /api/users` - Get all users
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Blog
- `GET /api/blog` - Get all blog posts
- `POST /api/blog` - Create new blog post (protected)
- `PUT /api/blog/:id` - Update blog post (protected)
- `DELETE /api/blog/:id` - Delete blog post (protected)

### Team
- `GET /api/team` - Get all team members
- `POST /api/team` - Create new team member (protected)
- `PUT /api/team/:id` - Update team member (protected)
- `DELETE /api/team/:id` - Delete team member (protected)

### Portfolio
- `GET /api/portfolio` - Get all portfolio items
- `POST /api/portfolio` - Create new portfolio item (protected)
- `PUT /api/portfolio/:id` - Update portfolio item (protected)
- `DELETE /api/portfolio/:id` - Delete portfolio item (protected)

## Features

### Dashboard
- Overview statistics for all modules
- Quick access to recent activities
- Visual representation of data

### Team Management
- Add, edit, and delete team members
- Upload profile images
- Manage team member information

### Blog Management
- Create and edit blog posts
- Rich text editor for content
- Category and tag management
- Image upload support

### Portfolio Management
- Manage portfolio projects
- Upload project images
- Track project status

### User Management
- Admin user management
- Role-based access control
- User profile management

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Protected routes with middleware
- Role-based access control
- Input validation and sanitization

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue on GitHub. 
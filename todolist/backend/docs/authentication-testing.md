# Authentication System Testing Guide

## Overview

Phase 2 of the Todo Garden backend is now complete! The authentication system includes:

- User registration with password hashing (Web Crypto API)
- User login with JWT token generation
- Token refresh mechanism
- JWT middleware for protecting routes
- Cloudflare Workers compatible implementation

## Available Endpoints

### Authentication Endpoints

#### 1. User Registration
```bash
POST /auth/register
Content-Type: application/json

{
  "username": "testuser",
  "email": "test@example.com",
  "password": "TestPassword123"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "uuid",
      "username": "testuser",
      "email": "test@example.com",
      "created_at": "timestamp"
    },
    "tokens": {
      "access_token": "jwt_token",
      "refresh_token": "refresh_jwt_token",
      "expires_in": 86400
    }
  }
}
```

#### 2. User Login
```bash
POST /auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "TestPassword123"
}
```

#### 3. Token Refresh
```bash
POST /auth/refresh
Content-Type: application/json

{
  "refreshToken": "your_refresh_token_here"
}
```

### Protected Endpoints

#### 4. Get Current User Profile
```bash
GET /user/me
Authorization: Bearer your_access_token_here
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "uuid",
      "username": "testuser",
      "email": "test@example.com",
      "created_at": "timestamp"
    },
    "achievement_stats": {
      "current_streak": 0,
      "longest_streak": 0,
      "total_tasks_completed": 0,
      "total_tasks_created": 0,
      "days_active": 0,
      "average_completion_rate": 0.00
    }
  }
}
```

## Testing Steps

### Step 1: Test User Registration

```bash
curl -X POST http://localhost:49465/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "TestPassword123"
  }'
```

### Step 2: Test User Login

```bash
curl -X POST http://localhost:49465/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPassword123"
  }'
```

### Step 3: Test Protected Route

Replace `YOUR_ACCESS_TOKEN` with the token from registration/login:

```bash
curl -X GET http://localhost:49465/user/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Step 4: Test Token Refresh

Replace `YOUR_REFRESH_TOKEN` with the refresh token:

```bash
curl -X POST http://localhost:49465/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "YOUR_REFRESH_TOKEN"
  }'
```

## Validation Rules

### Password Requirements
- Minimum 8 characters
- Maximum 100 characters
- Must contain at least one lowercase letter
- Must contain at least one uppercase letter
- Must contain at least one number

### Username Requirements
- Minimum 3 characters
- Maximum 50 characters
- Only letters, numbers, and underscores allowed

### Email Requirements
- Valid email format
- Maximum 255 characters

## Security Features

1. **Password Hashing**: Uses PBKDF2 with 100,000 iterations and SHA-256
2. **JWT Tokens**: 
   - Access tokens expire in 24 hours
   - Refresh tokens expire in 7 days
   - Signed with HMAC-SHA256
3. **Row Level Security**: Database policies ensure users can only access their own data
4. **Input Validation**: Comprehensive validation using Zod schemas
5. **Error Handling**: Secure error messages that don't leak sensitive information

## Next Steps

Once authentication testing is complete, Phase 3 will implement:
- Todo CRUD operations
- Daily record management
- Achievement system calculations
- Real-time statistics updates

## Troubleshooting

### Common Issues

1. **"User already exists"**: Try a different email/username
2. **"Invalid email or password"**: Check credentials and validation rules
3. **"Authentication failed"**: Ensure Bearer token is correctly formatted
4. **Database errors**: Verify Supabase schema is properly set up

### Database Setup Reminder

Make sure you've run both SQL scripts in your Supabase dashboard:
1. `backend/database/schema.sql`
2. `backend/database/rls-policies.sql`

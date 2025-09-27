# Postman Collection Guide - Todo Garden API

## Overview

This guide explains how to use the Postman collection to test the Todo Garden authentication API. The collection includes automated tests, environment variables, and comprehensive error scenario testing.

## 📥 Import Instructions

### Method 1: Import from File
1. Open Postman
2. Click "Import" button
3. Select "Upload Files"
4. Choose `backend/docs/Todo-Garden-API.postman_collection.json`
5. Click "Import"

### Method 2: Import from URL (if hosted)
1. Open Postman
2. Click "Import" button
3. Select "Link"
4. Paste the collection URL
5. Click "Continue" and "Import"

## 🔧 Setup

### Environment Variables
The collection automatically sets up these variables:
- `base_url`: API base URL (default: http://localhost:49465)
- `access_token`: JWT access token (auto-populated)
- `refresh_token`: JWT refresh token (auto-populated)
- `user_id`: Current user ID (auto-populated)

### Prerequisites
1. **Backend server running**: Make sure your development server is running
   ```bash
   cd backend && npm run dev
   ```
2. **Database setup**: Ensure Supabase database schema is created
3. **Environment variables**: Verify your `.env` or `wrangler.jsonc` configuration

## 📋 Collection Structure

### 1. Health & Status
- **Health Check**: Verify API is running
- **Database Test**: Check database connectivity and table access

### 2. Authentication
- **Register User**: Create new user account
- **Login User**: Authenticate existing user
- **Refresh Token**: Get new access token using refresh token

### 3. Protected Routes
- **Get Current User**: Fetch authenticated user profile and stats

### 4. Error Testing
- **Register - Invalid Email**: Test email validation
- **Register - Weak Password**: Test password requirements
- **Login - Wrong Password**: Test authentication failure
- **Protected Route - No Token**: Test unauthorized access
- **Protected Route - Invalid Token**: Test invalid JWT handling
- **Refresh - Invalid Token**: Test refresh token validation

## 🚀 Usage Workflow

### Basic Testing Flow
1. **Start with Health Check**
   - Run "Health Check" to verify API is running
   - Run "Database Test" to verify database connectivity

2. **Test User Registration**
   - Run "Register User" 
   - ✅ Tokens are automatically saved to variables
   - ✅ User ID is automatically saved

3. **Test Authentication**
   - Run "Login User" with same credentials
   - ✅ New tokens automatically replace old ones

4. **Test Protected Routes**
   - Run "Get Current User"
   - ✅ Uses automatically saved access token

5. **Test Token Refresh**
   - Run "Refresh Token"
   - ✅ New tokens automatically saved

### Error Testing Flow
1. **Test Validation Errors**
   - Run requests in "Error Testing" folder
   - Verify proper error responses and status codes

2. **Test Security**
   - Try accessing protected routes without tokens
   - Verify JWT validation works correctly

## 🔍 Automated Tests

### Built-in Test Scripts
Each request includes automated tests that verify:

**Global Tests (all requests):**
- Response time < 2000ms
- Valid JSON response format

**Registration Tests:**
- Status code 201 for success
- Correct user data returned
- Tokens automatically extracted and saved

**Login Tests:**
- Status code 200 for success
- User email matches expected value
- Tokens automatically extracted and saved

**Refresh Tests:**
- Status code 200 for success
- New access token is string type
- Tokens automatically updated

### Viewing Test Results
1. Run any request
2. Check the "Test Results" tab
3. Green checkmarks indicate passing tests
4. Red X marks indicate failing tests

## 📊 Expected Responses

### Successful Registration (201)
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

### Successful Login (200)
```json
{
  "status": "success",
  "message": "Login successful",
  "data": {
    "user": { /* user object */ },
    "tokens": { /* token object */ }
  }
}
```

### Validation Error (400)
```json
{
  "status": "error",
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

### Authentication Error (401)
```json
{
  "status": "error",
  "message": "Authentication failed",
  "error": "Invalid or expired token"
}
```

## 🛠️ Customization

### Changing Base URL
1. Go to collection variables
2. Update `base_url` value
3. Save changes

### Adding Custom Tests
Add test scripts in the "Tests" tab of any request:
```javascript
pm.test("Custom test name", function () {
    const response = pm.response.json();
    pm.expect(response.status).to.eql("success");
});
```

### Environment-Specific Variables
Create different environments for:
- Local development (localhost:49465)
- Staging server
- Production server

## 🔧 Troubleshooting

### Common Issues

**1. Connection Refused**
- Verify backend server is running
- Check if port 49465 is correct
- Update `base_url` if needed

**2. Database Errors**
- Run "Database Test" to check connectivity
- Verify Supabase configuration
- Check database schema is created

**3. Token Issues**
- Tokens expire after 24 hours (access) / 7 days (refresh)
- Re-run registration or login to get fresh tokens
- Check JWT_SECRET environment variable

**4. Validation Errors**
- Check request body format
- Verify required fields are included
- Review password complexity requirements

### Debug Tips
1. **Check Console**: View detailed error messages
2. **Inspect Headers**: Verify Content-Type and Authorization
3. **Review Body**: Ensure JSON format is correct
4. **Test Variables**: Check if tokens are properly saved

## 📝 Notes

- **Automatic Token Management**: Tokens are automatically extracted and used
- **Test Coverage**: Collection covers happy path and error scenarios
- **Realistic Data**: Uses valid test data that meets validation requirements
- **Security Testing**: Includes unauthorized access attempts
- **Performance**: Includes response time validation

## 🎯 Next Steps

After successful API testing:
1. Integrate with frontend application
2. Add more complex test scenarios
3. Set up automated testing pipeline
4. Monitor API performance in production

This Postman collection provides comprehensive testing coverage for the Todo Garden authentication system and serves as both a testing tool and API documentation.

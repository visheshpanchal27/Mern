# Token and Cookie Separation Implementation

## Overview
This implementation separates authentication tokens and cookies for web and mobile frontends to enhance security and prevent token conflicts.

## Changes Made

### Backend Changes

#### 1. Environment Variables (`.env`)
```env
# Separate JWT secrets for web and mobile
JWT_WEB_SECRET=web_sdfjlkjclkjleofido_secure_key_2024
JWT_MOBILE_SECRET=mobile_klmnoprstu_secure_key_2024
```

#### 2. Token Creation (`utils/createToken.js`)
- Added `clientType` parameter to distinguish between web and mobile
- Uses different JWT secrets: `JWT_WEB_SECRET` for web, `JWT_MOBILE_SECRET` for mobile
- Sets different cookie names: `webToken` for web, `mobileToken` for mobile
- Includes `clientType` in JWT payload for validation

#### 3. Authentication Middleware (`middlewares/authentication.js`)
- Detects client type from `x-client-type` header or cookie presence
- Uses appropriate JWT secret for token verification
- Validates that token client type matches request client type
- Adds `req.clientType` for downstream use

#### 4. User Controller (`controllers/userController.js`)
- Updated login, Google auth, and email verification to use client-specific tokens
- Updated logout to clear appropriate cookie based on client type
- Determines client type from `x-client-type` header

### Frontend Changes

#### 1. Web Frontend (`frontend/`)

**API Configuration (`src/redux/api/apiSlice.js`)**
- Added `x-client-type: 'web'` header to all requests

**Auth Slice (`src/redux/features/auth/authSlice.js`)**
- Updated logout to clear `webToken` instead of generic `token`

**Login Component (`src/pages/Auth/Login.jsx`)**
- Stores `webToken` in localStorage on successful login
- Adds `x-client-type: 'web'` header to Google auth requests

**Register Component (`src/pages/Auth/Register.jsx`)**
- Adds `x-client-type: 'web'` header to Google auth requests
- Stores `webToken` in localStorage on successful Google auth

#### 2. Mobile Frontend (`mobile-frontend/`)

**API Configuration (`src/api/apiSlice.js`)**
- Added `x-client-type: 'mobile'` header to all requests
- Uses `mobileToken` from localStorage for authorization header

**Auth Slice (`src/store/authSlice.js`)**
- Updated logout to clear `mobileToken` instead of generic `token`

**Login Component (`src/pages/Login.jsx`)**
- Stores `mobileToken` in localStorage on successful login

## Security Benefits

1. **Token Isolation**: Web and mobile tokens are completely separate
2. **Different Secrets**: Each client type uses different JWT secrets
3. **Cookie Separation**: Different cookie names prevent conflicts
4. **Client Validation**: Tokens are validated against their intended client type
5. **Header Identification**: Client type is explicitly declared in requests

## Usage

### Web Frontend
- Automatically sends `x-client-type: 'web'` header
- Receives and stores `webToken` cookie and localStorage token
- Uses `JWT_WEB_SECRET` for token validation

### Mobile Frontend
- Automatically sends `x-client-type: 'mobile'` header
- Receives and stores `mobileToken` cookie and localStorage token
- Uses `JWT_MOBILE_SECRET` for token validation

## Token Flow

1. **Login Request**: Client sends credentials with `x-client-type` header
2. **Token Generation**: Backend creates token with appropriate secret and client type
3. **Cookie Setting**: Backend sets client-specific cookie (`webToken` or `mobileToken`)
4. **Token Storage**: Frontend stores token in localStorage with client-specific key
5. **Subsequent Requests**: Client sends token via cookie or Authorization header
6. **Token Validation**: Backend validates using appropriate secret and client type

## Testing

To test the implementation:

1. **Web Login**: Login via web frontend - should receive `webToken` cookie
2. **Mobile Login**: Login via mobile frontend - should receive `mobileToken` cookie
3. **Cross-Client**: Try using web token on mobile endpoint - should fail validation
4. **Logout**: Logout should clear appropriate token/cookie for each client

## Notes

- Tokens are not interchangeable between web and mobile clients
- Each client type maintains its own authentication state
- Existing sessions will need to re-authenticate after deployment
- Both cookie-based and header-based authentication are supported
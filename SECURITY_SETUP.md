# 🔒 Security Setup Guide

## ⚠️ CRITICAL: Environment Variables Security

### Step 1: Generate Strong JWT Secrets

Run these commands to generate cryptographically secure secrets:

```bash
# For JWT_WEB_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# For JWT_MOBILE_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Step 2: Update Environment Variables

#### Backend (.env)
1. Copy `backend/.env.example` to `backend/.env`
2. Replace all placeholder values with your actual credentials
3. Use the generated secrets from Step 1 for JWT secrets
4. **NEVER commit the .env file to git**

#### Frontend (.env)
1. Copy `frontend/.env.example` to `frontend/.env`
2. Update with your actual values
3. **NEVER commit the .env file to git**

### Step 3: Update Deployment Platforms

#### Render (Backend)
1. Go to your Render dashboard
2. Select your backend service
3. Navigate to Environment → Environment Variables
4. Add/Update all variables from `backend/.env.example`
5. Use the new strong JWT secrets

#### Netlify (Frontend)
1. Go to your Netlify dashboard
2. Select your site
3. Navigate to Site settings → Environment variables
4. Add/Update all variables from `frontend/.env.example`

### Step 4: Verify .gitignore

Ensure these lines exist in `.gitignore`:
```
.env
.env.local
backend/.env
frontend/.env
```

### Step 5: Remove Exposed Credentials from Git History

If you've already committed .env files:

```bash
# Remove from git tracking
git rm --cached backend/.env frontend/.env

# Commit the removal
git commit -m "Remove sensitive environment files"

# Push changes
git push origin main
```

### Step 6: Rotate All Credentials

Since credentials were exposed, rotate these immediately:

1. **MongoDB**: Create new database user with new password
2. **JWT Secrets**: Use newly generated secrets
3. **Cloudinary**: Regenerate API keys
4. **PayPal**: Regenerate client ID/secret
5. **Google OAuth**: Create new OAuth credentials
6. **Email**: Generate new app-specific password

## 🛡️ Security Best Practices

1. ✅ Never commit `.env` files
2. ✅ Use strong, random secrets (32+ characters)
3. ✅ Rotate credentials regularly
4. ✅ Use different secrets for development and production
5. ✅ Enable 2FA on all service accounts
6. ✅ Use environment-specific configurations
7. ✅ Monitor for unauthorized access

## 📝 Example Strong Secrets

```bash
# Generate 64-character secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Generate base64 secret
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## 🚨 Emergency Response

If credentials are compromised:
1. Immediately rotate all credentials
2. Check access logs for unauthorized activity
3. Update all deployment environments
4. Notify team members
5. Review recent commits for suspicious changes

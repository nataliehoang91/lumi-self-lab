# How to Enable Social Login with Clerk

## Quick Setup Guide

### Step 1: Enable Social Providers in Clerk Dashboard

1. **Go to Clerk Dashboard:**
   - Visit [https://dashboard.clerk.com/](https://dashboard.clerk.com/)
   - Select your application

2. **Navigate to SSO Connections:**
   - Go to **Configure** → **SSO Connections**
   - Or directly: https://dashboard.clerk.com/apps/your-app/configure/connections

3. **Add a Social Connection:**
   - Click **"Add connection"** button
   - Select **"For all users"**
   - Choose your provider from the dropdown:
     - **Google** - Most common
     - **Facebook** - Popular choice
     - **GitHub** - Great for developers
     - **Apple** - iOS users
     - **Microsoft** - Enterprise users
     - And 25+ more options
   - Click **"Add connection"**

4. **For Development:**
   - ✅ Clerk provides **pre-configured shared OAuth credentials**
   - ✅ No additional setup needed
   - ✅ Works immediately for testing

5. **For Production:**
   - ⚠️ You'll need to configure custom OAuth credentials
   - Get Client ID and Client Secret from the provider
   - Add them in Clerk Dashboard under provider settings
   - Configure authorized redirect URLs

## Step 2: Provider-Specific Setup (Production Only)

### Google OAuth Setup:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `https://your-domain.clerk.accounts.dev/v1/oauth_callback`
6. Copy Client ID and Client Secret to Clerk Dashboard

### Facebook OAuth Setup:
1. Go to [Meta Developers](https://developers.facebook.com/)
2. Create a new app
3. Add Facebook Login product
4. Get App ID and App Secret
5. Add authorized redirect URI in Facebook app settings
6. Copy credentials to Clerk Dashboard

### GitHub OAuth Setup:
1. Go to GitHub Settings → Developer settings → OAuth Apps
2. Create new OAuth App
3. Set Authorization callback URL: `https://your-domain.clerk.accounts.dev/v1/oauth_callback`
4. Copy Client ID and Client Secret to Clerk Dashboard

## Step 3: Code is Already Set Up! ✅

Our sign-in and sign-up pages already include:
- ✅ Google login button
- ✅ Facebook login button
- ✅ GitHub login button
- ✅ Loading states
- ✅ Error handling
- ✅ Automatic redirects

**The buttons will work once you enable the providers in Clerk Dashboard!**

## Current Implementation

**Sign-In Page (`/sign-in`):**
- Social login buttons at the top
- Email/password form below
- Uses `signIn.authenticateWithRedirect()` for OAuth flow

**Sign-Up Page (`/sign-up`):**
- Social login buttons at the top
- Email/password form below
- Uses `signUp.authenticateWithRedirect()` for OAuth flow

## How It Works

1. User clicks "Continue with Google" (or Facebook/GitHub)
2. Clerk redirects to the OAuth provider (Google/Facebook/GitHub)
3. User authenticates with the provider
4. Provider redirects back to Clerk
5. Clerk handles the authentication and redirects to your app
6. User is now signed in!

## Testing

1. Enable at least one provider in Clerk Dashboard
2. Visit `/sign-in` or `/sign-up`
3. Click a social login button
4. You'll be redirected to the provider
5. After authentication, you'll be redirected back to your app

## Troubleshooting

**"Provider not found" error:**
- Make sure the provider is enabled in Clerk Dashboard
- Check that you're using the correct strategy name (e.g., `oauth_google`)

**"Redirect URL not authorized" error:**
- For production, check that redirect URLs are configured correctly
- Clerk automatically adds the correct redirect URL when you use `authenticateWithRedirect`

**Social login button not working:**
- Check browser console for errors
- Verify Clerk environment variables are set
- Ensure provider is enabled in Clerk Dashboard

## Next Steps

1. **Enable providers in Clerk Dashboard** (most important!)
2. Test social login on `/sign-in` and `/sign-up` pages
3. For production, configure custom OAuth credentials for each provider
4. Customize the social buttons if needed (see `SocialLoginButtons.tsx`)

## Resources

- [Clerk Social Connections Docs](https://clerk.com/docs/authentication/social-connections/overview)
- [Google OAuth Setup](https://clerk.com/docs/authentication/social-connections/google)
- [Facebook OAuth Setup](https://clerk.com/docs/authentication/social-connections/facebook)
- [GitHub OAuth Setup](https://clerk.com/docs/authentication/social-connections/github)

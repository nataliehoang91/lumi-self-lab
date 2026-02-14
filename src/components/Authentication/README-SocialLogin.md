# Social Login with Clerk

## Overview

Clerk supports multiple social login providers including Google, Facebook, GitHub, and many more. This guide shows you how to configure and use social login in your application.

## Supported Providers

Clerk supports 30+ social providers including:

- **Google** (`oauth_google`)
- **Facebook** (`oauth_facebook`)
- **GitHub** (`oauth_github`)
- **Apple** (`oauth_apple`)
- **Microsoft** (`oauth_microsoft`)
- **LinkedIn** (`oauth_linkedin`)
- **Discord** (`oauth_discord`)
- And many more... See [full list](https://clerk.com/docs/authentication/social-connections/oauth)

## Configuration Steps

### 1. Enable Social Providers in Clerk Dashboard

1. Go to [Clerk Dashboard](https://dashboard.clerk.com/)
2. Select your application
3. Navigate to **Configure → SSO Connections**
4. Click **Add connection** → Select **For all users**
5. Choose your provider (e.g., Google, Facebook, GitHub)
6. Click **Add connection**

**For Development:**

- Clerk provides pre-configured shared OAuth credentials
- No additional setup needed for testing

**For Production:**

- You'll need to configure custom OAuth credentials
- Get Client ID and Client Secret from the provider
- Add them in Clerk Dashboard under the provider settings

### 2. Using Social Login in Your Code

We're using Clerk hooks with custom buttons. Here's how it works:

```tsx
import { useSignIn } from "@clerk/nextjs";

export default function SignInPage() {
  const { isLoaded, signIn } = useSignIn();
  const [socialLoading, setSocialLoading] = useState<string | null>(null);

  const handleSocialSignIn = async (
    strategy: "oauth_google" | "oauth_facebook" | "oauth_github"
  ) => {
    if (!isLoaded || !signIn) return;
    setSocialLoading(strategy);

    try {
      await signIn.authenticateWithRedirect({
        strategy,
        redirectUrl: "/dashboard",
        redirectUrlComplete: "/dashboard",
      });
      // User will be redirected to OAuth provider, then back to your app
    } catch (err: any) {
      const errorMessage = err.errors?.[0]?.message || "Social sign-in failed";
      setSocialLoading(null);
      // Handle error
    }
  };

  return <Button onClick={() => handleSocialSignIn("oauth_google")}>Continue with Google</Button>;
}
```

### 3. Current Implementation

Our sign-in and sign-up pages already include:

- ✅ Google login button
- ✅ Facebook login button
- ✅ GitHub login button
- ✅ Loading states
- ✅ Error handling
- ✅ Automatic account linking (if email matches)

## Account Linking

Clerk automatically links accounts when:

- User signs in with social provider (e.g., Google)
- The email matches an existing account created with email/password
- The accounts are automatically merged

## Customization

### Adding More Providers

To add more providers (e.g., Apple, Microsoft):

1. Enable in Clerk Dashboard (step 1 above)
2. Add button to `SocialLoginButtons.tsx` or directly to sign-in/sign-up pages
3. Use the provider's strategy name:
   - Apple: `"oauth_apple"`
   - Microsoft: `"oauth_microsoft"`
   - LinkedIn: `"oauth_linkedin"`
   - Discord: `"oauth_discord"`
   - etc.

### Custom Styling

Social buttons can be styled using Tailwind classes in the `className` prop:

```tsx
<Button onClick={() => handleSocialSignIn("oauth_google")} className="custom-google-button-classes">
  Continue with Google
</Button>
```

## Important Notes

1. **Development vs Production:**
   - Development uses Clerk's shared OAuth credentials (works immediately)
   - Production requires your own OAuth credentials from each provider

2. **Redirect URLs:**
   - Clerk automatically handles OAuth redirects
   - Users are redirected to the provider, then back to your app
   - Set `redirectUrl` and `redirectUrlComplete` to where users should land after auth

3. **Error Handling:**
   - Always wrap `authenticateWithRedirect` in try-catch
   - Handle cases where provider is not enabled in Clerk Dashboard

4. **Loading States:**
   - Since `authenticateWithRedirect` immediately redirects, loading states may not persist
   - The loading indicator is shown briefly before redirect

## Troubleshooting

**Social login not working?**

1. Check if provider is enabled in Clerk Dashboard
2. Verify OAuth credentials are configured (for production)
3. Check browser console for errors
4. Ensure redirect URLs are correct

**Provider not in list?**

- Use custom OAuth provider option in Clerk Dashboard
- Configure with OpenID Connect (OIDC) settings

## Documentation Links

- [Clerk Social Connections Overview](https://clerk.com/docs/authentication/social-connections/overview)
- [Google OAuth Setup](https://clerk.com/docs/authentication/social-connections/google)
- [Facebook OAuth Setup](https://clerk.com/docs/authentication/social-connections/facebook)
- [GitHub OAuth Setup](https://clerk.com/docs/authentication/social-connections/github)
- [All Social Providers](https://clerk.com/docs/authentication/social-connections/oauth)

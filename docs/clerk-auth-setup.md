# Clerk auth setup

DevFrame uses Clerk for authentication, sessions, and account security only. The
frontend auth experience stays custom in:

- `src/components/auth/custom-sign-in.tsx`
- `src/components/auth/custom-sign-up.tsx`
- `src/components/auth/auth-sso-callback.tsx`
- `src/components/auth/custom-account-settings.tsx`

Do not replace these with Clerk prebuilt UI components.

## CLI support

The Clerk CLI is useful for project setup, env management, diagnostics, and
instance config-as-code.

```bash
npx clerk auth login
npx clerk link
npx clerk env pull
npx clerk doctor
npx clerk config pull --output clerk.config.current.json
npx clerk config schema --keys auth_email session
npx clerk config patch --file clerk.config.patch.json --dry-run
```

Use `clerk config schema` before writing any patch file. Only patch keys that
the schema returns for your Clerk instance. Keep `--dry-run` in the first pass,
then apply with `--yes` only after reviewing the diff.

Do not use CLI patches for email templates unless the installed CLI schema for
your instance explicitly exposes template fields. Current Clerk documentation
directs email and SMS template editing to the Clerk Dashboard template editor.

## Clerk Dashboard setup

Configure these in the Clerk Dashboard for both development and production
instances.

### Application

- App name: `DevFrame`
- Logo: use a public absolute URL for the DevFrame icon, for example
  `https://your-domain.com/devframe-bg-icon.svg`
- Default redirect after sign-in: `/dashboard`
- Default redirect after sign-up: `/dashboard`
- Custom sign-in page: `/sign-in`
- Custom sign-up page: `/sign-up`

### Email/password auth

- Enable email/password authentication.
- Enable email verification codes for sign-up.
- Enable password reset by email code.
- Keep phone/SMS off unless the product intentionally adds phone auth.

### Google OAuth

- Enable Google as a social connection.
- Keep the app code's same-tab custom flow:
  - Sign in starts from `/sign-in`
  - Sign up starts from `/sign-up`
  - OAuth callbacks stay at `/sign-in/sso-callback` and
    `/sign-up/sso-callback`
- Add exact local and production origins/redirects required by your Clerk
  instance and Google OAuth setup:
  - `http://localhost:3000`
  - `http://localhost:3000/sign-in/sso-callback`
  - `http://localhost:3000/sign-up/sso-callback`
  - `https://your-domain.com`
  - `https://your-domain.com/sign-in/sso-callback`
  - `https://your-domain.com/sign-up/sso-callback`

For Vercel Preview deployments, prefer a stable preview/staging domain when
possible. If you rely on generated preview URLs, add the exact URLs you test
with in Clerk/Google where required.

## Email templates

Edit templates in Clerk Dashboard -> Emails. Keep the tone concise and
operational, matching DevFrame's dark-first developer-tool identity.

### Reset password email

- Subject: `Reset your DevFrame password`
- Preview text: `Use this code to choose a new password.`
- Body:
  `Use the code below to reset your DevFrame password. If you did not request this, you can ignore this email.`
- CTA/code label: `Password reset code`

### Sign-up verification email

- Subject: `Verify your DevFrame email`
- Preview text: `Use this code to finish creating your account.`
- Body:
  `Use the code below to verify your email and start building your DevFrame portfolio.`
- CTA/code label: `Verification code`

### Account creation email

- Subject: `Welcome to DevFrame`
- Preview text: `Your portfolio workspace is ready.`
- Body:
  `Your DevFrame account is ready. Open your dashboard to build, publish, and update your portfolio.`
- CTA label: `Open dashboard`
- CTA URL: `{{action_url}}` when Clerk provides it, otherwise use
  `https://your-domain.com/dashboard`

### Sender settings

- From local part: `noreply` or `devframe`
- Reply-To: your support/community email if one exists
- Delivered by Clerk: keep enabled unless you intentionally add an
  `emails.created` webhook and own email delivery

## Env checks

Local `.env.local` needs:

```bash
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
```

Optional:

```bash
CLERK_AUTHORIZED_PARTIES=https://your-domain.com,https://your-project.vercel.app
```

In Vercel, set Clerk keys for each environment. Set
`NEXT_PUBLIC_APP_URL=https://your-domain.com` in production. Preview
deployments can leave `NEXT_PUBLIC_APP_URL` unset so DevFrame falls back to the
active Vercel deployment URL.

## What not to do

- Do not commit `.env.local`, Clerk secrets, or local CLI config snapshots.
- Do not add Clerk prebuilt auth UI components.
- Do not customize Clerk-delivered emails from app code; use Dashboard templates
  unless the CLI schema explicitly supports template fields for your instance.
- Do not replace the custom OAuth redirect helpers; they keep Google OAuth in
  the same tab and constrain callback redirects back into DevFrame.

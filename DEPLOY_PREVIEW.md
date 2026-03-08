# Netlify Deploy Preview Guide

Deploy Previews are automatic preview URLs generated for every pull request and branch. This allows you to test changes before merging to production.

## What is Deploy Preview?

When you push code to a branch or create a pull request, Netlify automatically:
1. Builds your site from that branch
2. Deploys it to a unique preview URL
3. Comments the preview link on the PR (if using GitHub/GitLab)
4. Updates the preview when you push new commits

**Benefits:**
- Test changes before merging to main
- Share previews with team members
- Catch build errors early
- Review changes in a production-like environment

## Prerequisites

Your site must be connected to a Git provider. To verify:

1. Go to **Netlify Dashboard** → Your Site
2. Navigate to **Site settings** → **Build & deploy** → **Repository**
3. Confirm your Git repository is connected

If not connected:
- Click "Connect to Git"
- Authorize your Git provider
- Select your repository `DWD-Daniel/ohayonet-final`
- Configure build settings:
  - **Branch to deploy**: `main`
  - **Build command**: `npm run build`
  - **Publish directory**: `dist`

## Creating a Deploy Preview

### Option 1: Feature Branch (Recommended)

```bash
# Create a new branch from main
git checkout -b feature/my-changes

# Make your changes
# ... edit files ...

# Commit and push
git add .
git commit -m "Add awesome feature"
git push origin feature/my-changes
```

**What happens:**
- Netlify detects the push
- Automatically builds and deploys your branch
- Creates a unique preview URL: `https://feature-my-changes--your-site-name.netlify.app`
- Takes 2-5 minutes to complete

### Option 2: Pull Request (Recommended for Team)

```bash
# Create a branch and push changes (as above)
git push origin feature/my-changes

# Open GitHub and create a pull request
# Netlify will automatically:
# 1. Build the PR
# 2. Comment with preview URL
# 3. Show build status
```

**GitHub PR Comment Example:**
```
✓ Deploy successful!
Preview: https://deploy-preview-15--your-site.netlify.app
```

## Viewing Deploy Previews

### Method 1: Netlify Dashboard

1. Go to **Netlify Dashboard** → Your Site
2. Click **Deploys**
3. Find your branch/PR in the list
4. Click the preview URL or "Preview" button

### Method 2: GitHub PR

1. Open your pull request on GitHub
2. Look for Netlify bot comment with preview link
3. Click the URL to view live preview

### Method 3: Netlify CLI (Optional)

```bash
# Install Netlify CLI
npm install -g netlify-cli

# View recent deployments
netlify deploys

# See preview URLs for all branches
```

## Testing Your Preview

### Pre-Deployment Checklist

- [ ] Site builds successfully (check build logs)
- [ ] All pages load correctly
- [ ] Navigation works
- [ ] Forms submit properly (if applicable)
- [ ] Paystack payment flow works with test card
- [ ] Database queries execute
- [ ] Environment variables are loaded
- [ ] No console errors
- [ ] Mobile responsive design works

### Testing Paystack Payments

Use these test cards in preview URLs:

| Card Number | Status | CVV | Expiry |
|-----------|--------|-----|--------|
| 4084084084084081 | Success | 123 | Any future date |
| 5399810000000000 | Success | 123 | Any future date |
| 5060666666666666 | Declined | 123 | Any future date |

**How to test:**
1. Open your Deploy Preview URL
2. Browse to a product
3. Click "Buy"
4. Enter test card details
5. Verify transaction in Paystack dashboard

## Sharing Previews

### With Team Members

```bash
# Share the preview URL with your team
# Example: https://deploy-preview-42--ohayonet.netlify.app

# They can click to view and test without needing to:
# - Pull the code
# - Install dependencies
# - Run the dev server
```

### PR Review Process

1. **Create PR** with changes
2. **Wait 2-5 minutes** for preview to build
3. **Share preview URL** in PR description
4. **Team reviews** live preview
5. **Request changes** if needed or approve
6. **Merge to main** when ready

## Deployment Settings

Your current Netlify configuration in `netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = "dist"
  functions = "netlify/functions"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[functions]
  directory = "netlify/functions"
  node_bundler = "esbuild"
```

**What this does:**
- Runs `npm run build` to create optimized bundle
- Publishes the `dist` folder as your site
- Handles client-side routing (SPA support)
- Deploys serverless functions from `netlify/functions`

## Branch Naming for Better URLs

Netlify converts branch names to preview URLs. Use clear, descriptive names:

✅ Good:
- `feature/add-checkout`
- `fix/payment-bug`
- `chore/update-dependencies`

❌ Avoid:
- `test123`
- `my-branch`
- `wip` (work in progress)

**Preview URL examples:**
- `feature/add-checkout` → `feature-add-checkout--ohayonet.netlify.app`
- `fix/payment-bug` → `fix-payment-bug--ohayonet.netlify.app`

## Environment Variables in Previews

Deploy Previews use the same environment variables as production. Your preview will have access to:

- `VITE_PAYSTACK_PUBLIC_KEY`
- `PAYSTACK_SECRET_KEY`
- `DATABASE_URL`

**To verify:**
1. Go to Netlify Dashboard → Site settings → Environment variables
2. Check that all required variables are set
3. Previews will inherit these automatically

## Troubleshooting

### Preview Won't Load

1. Check build logs:
   - Netlify Dashboard → Deploys → Click failed deploy → "Deploy log"
2. Look for error messages
3. Common issues:
   - Missing environment variables
   - Build command fails
   - TypeScript errors
   - Missing dependencies

### Preview Shows Old Version

1. Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
2. Clear browser cache
3. Wait for new deploy notification

### Paystack Not Working in Preview

1. Verify `VITE_PAYSTACK_PUBLIC_KEY` is set in environment variables
2. Use test mode keys (`pk_test_xxxxx`)
3. Check browser console for errors
4. Ensure you're using correct test card

### Database Connection Failed

1. Check `DATABASE_URL` is set in Netlify environment
2. Verify Neon database is running
3. Test connection: `SELECT 1;` in Neon SQL editor
4. Check function logs in Netlify dashboard

## Cleanup

### Automatic

Deploy previews are kept for 30 days. After that, they're automatically deleted.

### Manual

To delete a preview before 30 days:

1. Netlify Dashboard → Deploys
2. Find the preview URL
3. Click menu icon → "Delete deploy"

## Next Steps

1. **Create a feature branch** with your next change
2. **Push to GitHub** to trigger Deploy Preview
3. **Share preview URL** with team
4. **Test thoroughly** in preview before merging
5. **Merge to main** when approved

## Resources

- [Netlify Deploy Previews Documentation](https://docs.netlify.com/site-deploys/deploy-previews/)
- [Netlify GitHub App](https://github.com/apps/netlify)
- [Build logs and debugging](https://docs.netlify.com/site-deploys/overview/#deploy-log-best-practices)

---

**Your Site Details:**
- **Repository**: DWD-Daniel/ohayonet-final
- **Build Command**: `npm run build`
- **Publish Directory**: `dist`
- **Functions**: `netlify/functions`

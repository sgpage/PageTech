# Netlify Functions Setup Guide

This guide explains how to set up Netlify to host **only the backend functions** while keeping your main site on GitHub Pages.

## Why This Setup?

- **GitHub Pages**: Hosts your static website (free, simple)
- **Netlify**: Hosts only the backend functions for fault reporting (free, secure)
- **Best of Both**: GitHub Pages for hosting + Netlify for server-side functionality

## Setup Steps

### 1. Create a Netlify Account
1. Go to https://www.netlify.com
2. Sign up with GitHub (recommended) or email
3. It's free - no credit card required

### 2. Deploy Your Functions to Netlify

**Option A: Deploy via GitHub (Recommended)**
1. In Netlify dashboard, click "Add new site" → "Import an existing project"
2. Choose "Deploy with GitHub"
3. Select your PageTech repository
4. Configure build settings:
   - Build command: `echo 'Functions only'`
   - Publish directory: `.`
   - Functions directory: `netlify/functions`
5. Click "Deploy site"

**Option B: Deploy via Netlify CLI**
```bash
# Install Netlify CLI globally
npm install -g netlify-cli

# Login to Netlify
netlify login

# Initialize and deploy
netlify init
netlify deploy --prod
```

### 3. Set Environment Variables in Netlify
1. In your Netlify site dashboard, go to "Site settings" → "Environment variables"
2. Add the following variables:

   **Required:**
   - `GITHUB_TOKEN`: Your GitHub Personal Access Token
     - Create at: https://github.com/settings/tokens
     - Scopes needed: `repo` (to create issues)
   - `GITHUB_OWNER`: Your GitHub username
   - `GITHUB_REPO`: `PageTech` (or your repo name)

   **Optional (for email notifications):**
   - `SENDGRID_API_KEY`: Your SendGrid API key
   - `NOTIFICATION_EMAIL`: Your email address (e.g., steve@pagetech.com)

### 4. Update Your GitHub Pages Site
1. Open `reportfault.html`
2. Find this line:
   ```javascript
   const functionUrl = window.location.hostname === 'localhost' 
       ? '/.netlify/functions/submit-fault-report'
       : 'https://YOUR-NETLIFY-SITE.netlify.app/.netlify/functions/submit-fault-report';
   ```
3. Replace `YOUR-NETLIFY-SITE` with your actual Netlify site name
   - Find it in Netlify dashboard: "Site settings" → "Site details" → "Site name"
   - Example: `https://pagetech-functions.netlify.app/.netlify/functions/submit-fault-report`

### 5. Deploy to GitHub Pages
```bash
git add .
git commit -m "Configure Netlify functions URL"
git push
```

## Testing

### Test Locally
```bash
# Install dependencies
npm install

# Create .env file with your credentials
cp .env.example .env
# Edit .env and add your tokens

# Run Netlify Dev
npm run dev

# Open in browser
open http://localhost:8888/reportfault.html
```

### Test Production
1. Go to your GitHub Pages site: `https://YOUR-USERNAME.github.io/PageTech/reportfault.html`
2. Fill out the form and submit
3. Check that:
   - A new issue appears in your GitHub repo
   - You receive an email notification (if configured)
   - No CORS errors in browser console

## Troubleshooting

### CORS Errors
- Make sure the Netlify function URL in `reportfault.html` is correct
- Check that `netlify.toml` has the CORS headers configured

### Function Not Found (404)
- Verify the Netlify site is deployed
- Check that environment variables are set in Netlify dashboard
- Look at function logs in Netlify: "Functions" tab in dashboard

### GitHub API Errors
- Verify `GITHUB_TOKEN` has the `repo` scope
- Check that `GITHUB_OWNER` and `GITHUB_REPO` are correct
- Make sure the token hasn't expired

### Email Not Sending
- This is optional - fault reports will still be logged to GitHub
- Verify `SENDGRID_API_KEY` is valid
- Check SendGrid dashboard for sending errors

## Costs

- **GitHub Pages**: Free
- **Netlify Functions**: Free tier includes:
  - 125,000 function requests/month
  - 100 hours of function runtime/month
  - More than enough for a support form!

## Security Notes

- Never commit `.env` file (it's in `.gitignore`)
- Tokens are stored securely in Netlify environment variables
- CORS is configured to allow requests from any origin (safe for this use case)
- GitHub token should have minimal permissions (only `repo` scope needed)

## Questions?

If you encounter issues, check:
1. Netlify function logs: Dashboard → Functions → View logs
2. Browser console for JavaScript errors
3. GitHub API rate limits: https://api.github.com/rate_limit

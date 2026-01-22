# 🚀 Quick Setup Guide for Automated Fault Reporting

## What You'll Get
- ✅ Automatic GitHub issue creation for each fault report
- ✅ Email notifications sent to steve@pagetech.com
- ✅ Fully automated system using free services
- ✅ No ongoing costs

## Prerequisites
You'll need accounts for:
1. **GitHub** (you probably already have this)
2. **Netlify** (free tier - https://netlify.com)
3. **SendGrid** (free tier - https://sendgrid.com)

---

## Step 1: Create GitHub Personal Access Token (5 minutes)

1. Go to GitHub: https://github.com/settings/tokens
2. Click "Generate new token" → "Generate new token (classic)"
3. Name it: `DetectPro Fault Reports`
4. Set expiration: `No expiration` (or 1 year)
5. Check these scopes:
   - ✅ **repo** (all repo permissions)
6. Click "Generate token"
7. **IMPORTANT:** Copy the token now (it looks like `ghp_xxxxxxxxxxxx`)
   - Save it somewhere safe - you won't see it again!

---

## Step 2: Set up SendGrid (10 minutes)

1. Sign up at https://sendgrid.com/free/
2. Complete the signup process
3. Go to Settings → API Keys: https://app.sendgrid.com/settings/api_keys
4. Click "Create API Key"
5. Name it: `DetectPro Support`
6. Choose "Restricted Access"
7. Enable only: **Mail Send** → Full Access
8. Click "Create & View"
9. **IMPORTANT:** Copy the API key (starts with `SG.`)
   - Save it somewhere safe!

### Verify Sender Email (Important!)
1. Go to Settings → Sender Authentication
2. Click "Verify a Single Sender"
3. Enter your details (use steve@pagetech.com)
4. Check your email and click the verification link
5. Wait for approval (usually instant)

---

## Step 3: Install Dependencies (2 minutes)

Open terminal in your PageTech folder and run:

```bash
cd /Users/stevepage/Developer/PageTech
npm install
```

This installs the required packages for the Netlify function.

---

## Step 4: Deploy to Netlify (10 minutes)

### A. Push Your Code to GitHub

If you haven't already:

```bash
cd /Users/stevepage/Developer/PageTech
git init
git add .
git commit -m "Add automated fault reporting system"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/PageTech.git
git push -u origin main
```

### B. Connect to Netlify

1. Go to https://app.netlify.com
2. Click "Add new site" → "Import an existing project"
3. Click "GitHub"
4. Authorize Netlify to access your GitHub
5. Select your **PageTech** repository
6. Leave all settings as default (Netlify will auto-detect)
7. Click "Deploy site"

### C. Configure Environment Variables

1. In Netlify dashboard, go to: **Site settings** → **Environment variables**
2. Click "Add a variable" and add these **5 variables**:

   | Key | Value | Example |
   |-----|-------|---------|
   | `GITHUB_TOKEN` | Your GitHub token | `ghp_xxxxxxxxxxxx` |
   | `GITHUB_OWNER` | Your GitHub username | `stevepage` |
   | `GITHUB_REPO` | Repository name | `PageTech` |
   | `SENDGRID_API_KEY` | Your SendGrid API key | `SG.xxxxxxxxxxxx` |
   | `NOTIFICATION_EMAIL` | Your email | `steve@pagetech.com` |

3. After adding all variables, click "Save"

### D. Trigger Redeploy

1. Go to **Deploys** tab
2. Click "Trigger deploy" → "Deploy site"
3. Wait for deployment to complete (1-2 minutes)

---

## Step 5: Test It! (5 minutes)

1. Go to your live Netlify site URL (shown in dashboard)
2. Navigate to the "Report a Fault" page
3. Fill out the form with test data
4. Click "Submit Fault Report"
5. Check:
   - ✅ Success message appears
   - ✅ New issue appears in GitHub: https://github.com/YOUR_USERNAME/PageTech/issues
   - ✅ Email arrives at steve@pagetech.com

---

## 🎉 You're Done!

Your fault reporting system is now fully automated!

## What Happens When Users Submit Reports:

1. User fills out form on your website
2. Data is sent to Netlify Function
3. GitHub Issue is automatically created
4. Email notification sent to you
5. User sees success message with issue number

---

## Troubleshooting

### "Failed to submit fault report" Error

**Check 1: GitHub Token**
- Verify token has `repo` scope
- Check token hasn't expired
- Make sure GITHUB_OWNER and GITHUB_REPO are correct

```bash
# Test GitHub API access:
curl -H "Authorization: token YOUR_GITHUB_TOKEN" \
  https://api.github.com/repos/YOUR_USERNAME/PageTech
```

**Check 2: SendGrid**
- Verify sender email is confirmed
- Check API key has Mail Send permission
- Look in SendGrid dashboard → Activity for delivery status

**Check 3: Netlify Function**
- Go to Netlify dashboard → Functions
- Click on `submit-fault-report`
- Check the logs for error messages

### Email Not Arriving

1. Check spam folder
2. Verify sender email in SendGrid
3. Check SendGrid Activity dashboard
4. Try a different notification email temporarily

### GitHub Issues Not Created

1. Verify repository name is exactly correct
2. Check token has `repo` permissions
3. Make sure repository exists and you have access

---

## Local Development (Optional)

Test the function locally before deploying:

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Create .env file with your credentials
cp .env.example .env
# Edit .env and add your real values

# Run local server
netlify dev
```

Then test at http://localhost:8888

---

## Cost Summary

| Service | Free Tier | Your Usage | Cost |
|---------|-----------|------------|------|
| Netlify | 100GB bandwidth/month | ~1GB | $0 |
| SendGrid | 100 emails/day | ~5/day | $0 |
| GitHub | Unlimited issues | Unlimited | $0 |
| **Total** | | | **$0/month** |

---

## Need Help?

If you get stuck:
1. Check Netlify function logs
2. Check SendGrid activity dashboard  
3. Look at GitHub Actions logs
4. Email me the error messages

The system is designed to be forgiving - if one part fails (like email), the GitHub issue will still be created!

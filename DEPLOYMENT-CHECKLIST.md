# ✅ Deployment Checklist

Use this checklist to ensure everything is set up correctly.

## Before You Start

- [ ] You have a GitHub account
- [ ] Git is installed on your computer
- [ ] You can access your email (for verifications)

---

## Step 1: GitHub Setup (10 min)

- [ ] Create GitHub Personal Access Token
  - [ ] Token has `repo` scope selected
  - [ ] Token copied and saved securely
  - [ ] Token expiration set to at least 1 year

- [ ] Repository ready
  - [ ] Code is committed to git
  - [ ] Repository exists on GitHub
  - [ ] Code is pushed to GitHub

---

## Step 2: SendGrid Setup (10 min)

- [ ] SendGrid account created (free tier)
- [ ] Email verified in SendGrid
- [ ] API key created with "Mail Send" permission
- [ ] API key copied and saved securely
- [ ] Sender email verified (steve@pagetech.com)

---

## Step 3: Netlify Deployment (10 min)

- [ ] Netlify account created
- [ ] GitHub repository connected to Netlify
- [ ] Site deployed successfully
- [ ] Site URL is accessible

---

## Step 4: Environment Variables (5 min)

In Netlify dashboard → Site settings → Environment variables:

- [ ] `GITHUB_TOKEN` added
- [ ] `GITHUB_OWNER` added (your username)
- [ ] `GITHUB_REPO` added (`PageTech`)
- [ ] `SENDGRID_API_KEY` added
- [ ] `NOTIFICATION_EMAIL` added (steve@pagetech.com)
- [ ] Site redeployed after adding variables

---

## Step 5: Testing (5 min)

- [ ] Visit your live site URL
- [ ] Navigate to "Support" page
- [ ] Click "Report a Fault"
- [ ] Fill out test fault report
- [ ] Submit the form
- [ ] Success message appears with GitHub issue link
- [ ] GitHub issue created successfully
- [ ] Email notification received at steve@pagetech.com

---

## Step 6: Verification

- [ ] All navigation links work
- [ ] Forms submit successfully
- [ ] Site is mobile responsive
- [ ] No console errors in browser
- [ ] GitHub issues are properly formatted
- [ ] Email notifications are formatted correctly

---

## Optional: Custom Domain

- [ ] Domain purchased/owned
- [ ] DNS configured in Netlify
- [ ] HTTPS/SSL certificate active
- [ ] Domain propagated (can take 24-48 hours)

---

## Troubleshooting Checklist

If something doesn't work:

**GitHub Issues Not Created:**
- [ ] Verify GITHUB_TOKEN is correct
- [ ] Check token has `repo` scope
- [ ] Verify GITHUB_OWNER and GITHUB_REPO match exactly
- [ ] Check Netlify function logs for errors

**Email Not Received:**
- [ ] Check spam folder
- [ ] Verify sender email in SendGrid
- [ ] Check SendGrid Activity dashboard
- [ ] Verify SENDGRID_API_KEY is correct
- [ ] Ensure NOTIFICATION_EMAIL is correct

**Form Submission Fails:**
- [ ] Check browser console for errors
- [ ] Verify Netlify function is deployed
- [ ] Check all environment variables are set
- [ ] Try redeploying the site

---

## Success Criteria ✨

You're done when:
- ✅ Users can submit fault reports
- ✅ GitHub issues are created automatically
- ✅ You receive email notifications
- ✅ Users see success confirmation
- ✅ No errors in console or logs

---

## Support

If you get stuck at any step:
1. Check the detailed guide in QUICK-SETUP.md
2. Review Netlify function logs
3. Check SendGrid activity dashboard
4. Verify all environment variables

---

## Notes

Space to write down important info:

**Netlify Site URL:**
_____________________________________

**GitHub Repository:**
_____________________________________

**First Test Issue Number:**
_____________________________________

**Deployment Date:**
_____________________________________

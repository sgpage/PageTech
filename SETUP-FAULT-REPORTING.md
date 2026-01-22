# Setting Up Automated Fault Reporting

This guide explains how to set up automated fault reporting with GitHub Issues and email notifications for your DetectPro support system.

## Overview

The fault reporting system will:
- ✅ Automatically create GitHub Issues for each fault report
- ✅ Send email notifications to your address
- ✅ Include all device information, screenshots, and user details
- ✅ Label and prioritize issues based on impact level

## Option 1: Netlify Functions (Recommended)

### Prerequisites
- GitHub account
- Netlify account (free tier available)
- SendGrid account for email (free tier: 100 emails/day)

### Step 1: Create GitHub Personal Access Token

1. Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Give it a name like "DetectPro Fault Reports"
4. Select scope: `repo` (full control of private repositories)
5. Click "Generate token" and copy it (you won't see it again!)

### Step 2: Set up SendGrid

1. Sign up at https://sendgrid.com (free tier available)
2. Go to Settings → API Keys
3. Create a new API key with "Mail Send" permissions
4. Copy the API key

### Step 3: Deploy to Netlify

1. Create a `netlify` folder in your project root:
   ```
   mkdir -p netlify/functions
   ```

2. Move the example function:
   ```bash
   mv netlify-function-example.js netlify/functions/submit-fault-report.js
   ```

3. Create `package.json` in project root:
   ```json
   {
     "name": "pagetech-support",
     "version": "1.0.0",
     "dependencies": {
       "node-fetch": "^2.6.1"
     }
   }
   ```

4. Create `netlify.toml` in project root:
   ```toml
   [build]
     functions = "netlify/functions"
   
   [functions]
     node_bundler = "esbuild"
   ```

5. Push your code to GitHub

6. Connect your repository to Netlify:
   - Go to https://app.netlify.com
   - Click "Add new site" → "Import an existing project"
   - Choose GitHub and select your repository
   - Deploy!

### Step 4: Configure Environment Variables in Netlify

1. In Netlify dashboard, go to Site settings → Environment variables
2. Add the following variables:
   - `GITHUB_TOKEN`: Your GitHub personal access token
   - `GITHUB_OWNER`: Your GitHub username (e.g., "stevepage")
   - `GITHUB_REPO`: Your repository name (e.g., "PageTech")
   - `SENDGRID_API_KEY`: Your SendGrid API key
   - `NOTIFICATION_EMAIL`: Your email address (steve@pagetech.com)

3. Redeploy your site for changes to take effect

### Step 5: Update the Form

Update `reportfault.html` to use your Netlify function. Replace the form submission handler with:

```javascript
document.getElementById('faultReportForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const deviceInfo = detectDeviceInfo();
    const formData = new FormData(e.target);

    const report = {
        timestamp: new Date().toISOString(),
        deviceInfo: deviceInfo,
        numFinds: formData.get('numFinds'),
        imageUrls: formData.get('imageUrls').split('\n').filter(url => url.trim()),
        faultDescription: formData.get('faultDescription'),
        stepsToReproduce: formData.get('stepsToReproduce'),
        impact: formData.get('impact'),
        email: formData.get('email'),
        additionalInfo: formData.get('additionalInfo')
    };

    try {
        const response = await fetch('/.netlify/functions/submit-fault-report', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(report)
        });

        const result = await response.json();

        if (response.ok) {
            document.getElementById('successMessage').innerHTML = 
                `<strong>Report Submitted Successfully!</strong><br>
                Your fault report has been logged as GitHub Issue 
                <a href="${result.issueUrl}" target="_blank">#${result.issueNumber}</a>. 
                We'll be in touch soon!`;
            document.getElementById('successMessage').style.display = 'block';
            document.getElementById('errorMessage').style.display = 'none';
            e.target.reset();
            document.getElementById('imagePreview').innerHTML = '';
            detectDeviceInfo();
        } else {
            throw new Error(result.message || 'Submission failed');
        }
    } catch (error) {
        document.getElementById('errorText').textContent = error.message;
        document.getElementById('errorMessage').style.display = 'block';
        document.getElementById('successMessage').style.display = 'none';
    }
});
```

## Option 2: GitHub Actions (Alternative)

This approach creates issues directly from GitHub Actions, but requires a different setup.

1. Create `.github/workflows/create-issue.yml`
2. Set up a webhook endpoint that triggers the workflow
3. Requires GitHub API access and workflow permissions

## Option 3: Simple Form Services (Easiest but Limited)

### Using Formspree

1. Sign up at https://formspree.io (free tier: 50 submissions/month)
2. Create a new form and get your form endpoint
3. Update the form in `reportfault.html`:

```html
<form action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
    <!-- Add hidden field for email -->
    <input type="hidden" name="_replyto" value="steve@pagetech.com">
    <!-- Rest of your form fields -->
</form>
```

This won't create GitHub issues, but will email you the reports.

## Testing

After setup, test your fault reporting:

1. Go to `reportfault.html`
2. Fill out the form with test data
3. Submit and check:
   - GitHub Issues for a new issue
   - Your email for notification
   - Browser console for any errors

## Monitoring

- Check GitHub Issues regularly: `https://github.com/YOUR_USERNAME/PageTech/issues`
- Set up GitHub notifications for new issues
- Monitor SendGrid dashboard for email delivery

## Troubleshooting

### GitHub Issue Creation Fails
- Verify your GitHub token has `repo` scope
- Check that GITHUB_OWNER and GITHUB_REPO are correct
- Ensure token hasn't expired

### Email Not Received
- Check SendGrid dashboard for delivery status
- Verify SENDGRID_API_KEY is correct
- Check spam folder
- Ensure sender domain is verified in SendGrid

### Function Returns 500 Error
- Check Netlify function logs in dashboard
- Verify all environment variables are set
- Check that `node-fetch` dependency is installed

## Cost Estimate

- Netlify: **Free** (100GB bandwidth/month)
- SendGrid: **Free** (100 emails/day)
- GitHub: **Free** (unlimited public repositories)

**Total monthly cost: $0** for typical usage

## Security Notes

- Never commit API keys or tokens to your repository
- Use environment variables for all sensitive data
- Consider adding rate limiting to prevent abuse
- Add CAPTCHA if you get spam submissions

## Support

Need help setting this up? Contact steve@pagetech.com

# PageTech - DetectLogPro Support System

Professional website for PageTech featuring DetectLogPro, the ultimate tech tool for metal detectorists. Includes a comprehensive automated support system with fault reporting.

## 🌟 Features

- **Modern, Responsive Design** - Works beautifully on all devices
- **DetectLogPro Product Page** - Showcase your metal detecting app
- **Comprehensive Support System**:
  - User Manual with detailed documentation
  - Interactive FAQ with expandable sections
  - Automated Fault Reporting System
- **Automated Backend**:
  - Automatic GitHub issue creation
  - Email notifications via SendGrid
  - Device information capture
  - Image upload support

## 🚀 Deployment Options

### Option 1: Netlify (Recommended - Required for Automated Reporting)

Follow the detailed guide in [QUICK-SETUP.md](QUICK-SETUP.md) to:
1. Create GitHub Personal Access Token
2. Set up SendGrid for email notifications  
3. Deploy to Netlify
4. Configure environment variables
5. Test the system

**Estimated time:** 30 minutes  
**Cost:** $0/month using free tiers

### Option 2: GitHub Pages (Simple - No Automated Reporting)

For static hosting without fault reporting backend:

1. **Create a GitHub repository:**
   - Go to [GitHub](https://github.com) and create a new repository
   - Name it `pagetech` (or your preferred name)
   - Keep it public for GitHub Pages

2. **Push this code to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: PageTech website"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/pagetech.git
   git push -u origin main
   ```

3. **Enable GitHub Pages:**
   - Go to your repository settings
   - Navigate to "Pages" in the left sidebar
   - Under "Source", select "main" branch
   - Click "Save"
   - Your site will be published at: `https://YOUR-USERNAME.github.io/pagetech/`

## 📁 Project Structure

```
PageTech/
├── index.html              # Homepage
├── detectpro.html          # DetectLogPro product page
├── support.html            # Support hub
├── manual.html             # User manual
├── faq.html                # FAQ page
├── reportfault.html        # Fault reporting form
├── styles.css              # Main stylesheet
├── netlify/
│   └── functions/
│       └── submit-fault-report.js  # Serverless function
├── netlify.toml            # Netlify configuration
├── package.json            # Node dependencies
├── QUICK-SETUP.md          # Setup instructions
└── README.md               # This file
```

## 🛠️ Local Development

```bash
# Install dependencies
npm install

# Create environment file (for local testing)
cp .env.example .env
# Edit .env with your credentials

# Run local development server
npx netlify dev
```

Visit http://localhost:8888

## 🔧 Environment Variables

Required for automated fault reporting (set in Netlify dashboard):

| Variable | Description | Example |
|----------|-------------|---------|
| `GITHUB_TOKEN` | GitHub Personal Access Token | `ghp_xxxxxxxxxxxx` |
| `GITHUB_OWNER` | Your GitHub username | `stevepage` |
| `GITHUB_REPO` | Repository name | `PageTech` |
| `SENDGRID_API_KEY` | SendGrid API key | `SG.xxxxxxxxxxxx` |
| `NOTIFICATION_EMAIL` | Your email for notifications | `steve@pagetech.com` |

## 📧 How Fault Reporting Works

1. User submits fault report via form
2. Netlify Function processes the submission
3. Creates a GitHub Issue with all details
4. Sends formatted email notification
5. User sees success message with issue link

## 🎨 Design Features

- Warm color scheme inspired by metal detecting (golds, bronzes, browns)
- Fully responsive design for all devices
- Interactive FAQ with expandable sections
- Automated fault reporting with GitHub integration
- Professional layout ready for expansion

## 💰 Cost

Running this system costs **$0/month** using free tiers:
- Netlify: 100GB bandwidth/month
- SendGrid: 100 emails/day  
- GitHub: Unlimited issues

## 🐛 Troubleshooting

See [QUICK-SETUP.md](QUICK-SETUP.md) for detailed troubleshooting steps.

Quick checks:
- Verify all environment variables are set correctly in Netlify
- Check Netlify function logs for errors
- Verify GitHub token has `repo` scope
- Check SendGrid sender verification status

## 📝 Next Steps

1. Follow [QUICK-SETUP.md](QUICK-SETUP.md) to deploy
2. Test the fault reporting system
3. Customize content and styling
4. Connect your custom domain

---

Built with ❤️ for detectorists everywhere

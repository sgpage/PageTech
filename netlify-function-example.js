// Example Netlify Function for Fault Reporting
// Place this file in: netlify/functions/submit-fault-report.js
// 
// To use this:
// 1. Sign up for Netlify (free tier available)
// 2. Connect your GitHub repository
// 3. Set environment variables in Netlify dashboard:
//    - GITHUB_TOKEN: Personal access token with repo scope
//    - GITHUB_OWNER: Your GitHub username
//    - GITHUB_REPO: Your repository name
//    - SENDGRID_API_KEY: SendGrid API key (or use another email service)
//    - NOTIFICATION_EMAIL: Your email address (steve@pagetech.com)

const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const data = JSON.parse(event.body);
    
    // Validate required fields
    if (!data.email || !data.faultDescription || !data.impact) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing required fields' })
      };
    }

    // Create GitHub Issue
    const issueTitle = `[Fault Report] ${data.impact.toUpperCase()}: ${data.faultDescription.substring(0, 50)}...`;
    const issueBody = `
## Fault Report
**Submitted:** ${new Date().toLocaleString()}
**Reporter:** ${data.email}
**Impact:** ${data.impact.toUpperCase()}

### Device Information
\`\`\`
${JSON.stringify(data.deviceInfo, null, 2)}
\`\`\`

### Database Status
- **Number of Finds:** ${data.numFinds}

### Fault Description
${data.faultDescription}

### Steps to Reproduce
${data.stepsToReproduce}

### Images
${data.imageUrls && data.imageUrls.length > 0 
  ? data.imageUrls.map(url => `![Screenshot](${url})`).join('\n') 
  : 'No images provided'}

### Additional Information
${data.additionalInfo || 'None provided'}

---
*This issue was automatically created from the fault reporting form*
    `.trim();

    // Create GitHub issue
    const githubResponse = await fetch(
      `https://api.github.com/repos/${process.env.GITHUB_OWNER}/${process.env.GITHUB_REPO}/issues`,
      {
        method: 'POST',
        headers: {
          'Authorization': `token ${process.env.GITHUB_TOKEN}`,
          'Content-Type': 'application/json',
          'Accept': 'application/vnd.github.v3+json'
        },
        body: JSON.stringify({
          title: issueTitle,
          body: issueBody,
          labels: ['bug', 'user-reported', `priority-${data.impact}`]
        })
      }
    );

    if (!githubResponse.ok) {
      throw new Error(`GitHub API error: ${githubResponse.statusText}`);
    }

    const issue = await githubResponse.json();

    // Send email notification using SendGrid
    const emailResponse = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        personalizations: [{
          to: [{ email: process.env.NOTIFICATION_EMAIL }],
          subject: `New Fault Report: ${data.impact.toUpperCase()}`
        }],
        from: { email: 'noreply@pagetech.com', name: 'DetectPro Support' },
        content: [{
          type: 'text/html',
          value: `
            <h2>New Fault Report Submitted</h2>
            <p><strong>GitHub Issue:</strong> <a href="${issue.html_url}">#${issue.number}</a></p>
            <p><strong>Reporter:</strong> ${data.email}</p>
            <p><strong>Impact:</strong> ${data.impact.toUpperCase()}</p>
            <p><strong>Description:</strong> ${data.faultDescription}</p>
            <p><strong>Finds in Database:</strong> ${data.numFinds}</p>
            <hr>
            <p><a href="${issue.html_url}">View full issue on GitHub</a></p>
          `
        }]
      })
    });

    if (!emailResponse.ok) {
      console.error('Email send failed:', await emailResponse.text());
      // Don't fail the whole request if email fails
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        issueNumber: issue.number,
        issueUrl: issue.html_url,
        message: 'Fault report submitted successfully'
      })
    };

  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Failed to submit fault report',
        message: error.message
      })
    };
  }
};

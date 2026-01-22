// Netlify Function for DetectPro Fault Reporting
// Automatically creates GitHub Issues and sends email notifications

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

    // Create GitHub Issue title and body
    const issueTitle = `[Fault Report] ${data.impact.toUpperCase()}: ${data.faultDescription.substring(0, 50)}${data.faultDescription.length > 50 ? '...' : ''}`;
    
    const issueBody = `
## Fault Report
**Submitted:** ${new Date(data.timestamp).toLocaleString()}
**Reporter:** ${data.email}
**Impact:** ${data.impact.toUpperCase()}

### Device Information
\`\`\`json
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
  : '_No image URLs provided_'}

### Additional Information
${data.additionalInfo || '_None provided_'}

---
_This issue was automatically created from the DetectPro fault reporting form_
    `.trim();

    // Create GitHub issue
    const githubResponse = await fetch(
      `https://api.github.com/repos/${process.env.GITHUB_OWNER}/${process.env.GITHUB_REPO}/issues`,
      {
        method: 'POST',
        headers: {
          'Authorization': `token ${process.env.GITHUB_TOKEN}`,
          'Content-Type': 'application/json',
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'DetectPro-Support'
        },
        body: JSON.stringify({
          title: issueTitle,
          body: issueBody,
          labels: ['bug', 'user-reported', `priority-${data.impact}`]
        })
      }
    );

    if (!githubResponse.ok) {
      const errorText = await githubResponse.text();
      console.error('GitHub API error:', errorText);
      throw new Error(`GitHub API error: ${githubResponse.statusText}`);
    }

    const issue = await githubResponse.json();
    console.log('GitHub issue created:', issue.number);

    // Send email notification using SendGrid
    try {
      const emailResponse = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          personalizations: [{
            to: [{ email: process.env.NOTIFICATION_EMAIL }],
            subject: `🔧 New DetectPro Fault Report: ${data.impact.toUpperCase()}`
          }],
          from: { 
            email: 'noreply@pagetech.com', 
            name: 'DetectPro Support' 
          },
          content: [{
            type: 'text/html',
            value: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #3D2817;">New Fault Report Submitted</h2>
                
                <div style="background: #FFF9F0; padding: 15px; border-radius: 8px; margin: 20px 0;">
                  <p><strong>GitHub Issue:</strong> 
                    <a href="${issue.html_url}" style="color: #B8935A;">#${issue.number}</a>
                  </p>
                  <p><strong>Reporter:</strong> ${data.email}</p>
                  <p><strong>Impact:</strong> 
                    <span style="color: ${
                      data.impact === 'critical' ? '#d32f2f' :
                      data.impact === 'high' ? '#f57c00' :
                      data.impact === 'medium' ? '#ffa726' : '#66bb6a'
                    }; font-weight: bold;">
                      ${data.impact.toUpperCase()}
                    </span>
                  </p>
                  <p><strong>Finds in Database:</strong> ${data.numFinds}</p>
                </div>

                <h3 style="color: #3D2817;">Fault Description</h3>
                <p style="background: white; padding: 15px; border-left: 4px solid #E8C590;">
                  ${data.faultDescription}
                </p>

                <h3 style="color: #3D2817;">Steps to Reproduce</h3>
                <p style="background: white; padding: 15px; border-left: 4px solid #E8C590;">
                  ${data.stepsToReproduce.replace(/\n/g, '<br>')}
                </p>

                ${data.imageUrls && data.imageUrls.length > 0 ? `
                  <h3 style="color: #3D2817;">Images</h3>
                  <div style="background: white; padding: 15px;">
                    ${data.imageUrls.map(url => `<a href="${url}" style="display: block; margin: 5px 0; color: #B8935A;">${url}</a>`).join('')}
                  </div>
                ` : ''}

                <div style="margin-top: 30px; padding: 20px; background: #E8C590; border-radius: 8px; text-align: center;">
                  <a href="${issue.html_url}" 
                     style="display: inline-block; padding: 12px 24px; background: #3D2817; color: white; text-decoration: none; border-radius: 4px; font-weight: bold;">
                    View Full Issue on GitHub
                  </a>
                </div>

                <p style="color: #6B4423; font-size: 12px; margin-top: 20px;">
                  Device: ${data.deviceInfo.platform} | Browser: ${data.deviceInfo.userAgent.split(' ').slice(0, 3).join(' ')}
                </p>
              </div>
            `
          }]
        })
      });

      if (!emailResponse.ok) {
        const emailError = await emailResponse.text();
        console.error('Email send failed:', emailError);
        // Don't fail the whole request if email fails
      } else {
        console.log('Email notification sent successfully');
      }
    } catch (emailError) {
      console.error('Email error:', emailError);
      // Continue even if email fails
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
    console.error('Error processing fault report:', error);
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

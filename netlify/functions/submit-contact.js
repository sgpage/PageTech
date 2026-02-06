// Netlify Function for PageTech Contact Form
// Automatically creates GitHub Issues

const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  // Set CORS headers to allow requests from GitHub Pages
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return { 
      statusCode: 200, 
      headers, 
      body: JSON.stringify({ message: 'CORS preflight' })
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const data = JSON.parse(event.body);
    
    // Validate required fields
    if (!data.name || !data.email || !data.subject || !data.message) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing required fields' })
      };
    }

    // Map subject to readable label
    const subjectLabels = {
      'general': 'General Inquiry',
      'support': 'Technical Support',
      'feature': 'Feature Request',
      'feedback': 'Feedback',
      'partnership': 'Partnership',
      'other': 'Other'
    };

    // Create GitHub Issue title and body
    const issueTitle = `[Contact] ${subjectLabels[data.subject] || data.subject}: ${data.message.substring(0, 50)}${data.message.length > 50 ? '...' : ''}`;
    
    const issueBody = `
## Contact Form Submission
**Submitted:** ${new Date(data.timestamp).toLocaleString()}
**From:** ${data.name} (${data.email})
**Subject:** ${subjectLabels[data.subject] || data.subject}

### Message
${data.message}

---
**User Agent:** ${data.userAgent || 'Not provided'}

---
_This issue was automatically created from the PageTech contact form_
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
          'User-Agent': 'PageTech-Contact'
        },
        body: JSON.stringify({
          title: issueTitle,
          body: issueBody,
          labels: ['contact', `subject-${data.subject}`]
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

    // Send email notification using SendGrid (optional)
    if (process.env.SENDGRID_API_KEY && process.env.NOTIFICATION_EMAIL) {
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
              subject: `📨 New Contact Form: ${subjectLabels[data.subject] || data.subject}`
            }],
            from: { 
              email: 'noreply@pagetech.com', 
              name: 'PageTech Contact Form' 
            },
            content: [{
              type: 'text/html',
              value: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                  <h2 style="color: #3D2817;">New Contact Form Submission</h2>
                  
                  <div style="background: #FFF9F0; padding: 15px; border-radius: 8px; margin: 20px 0;">
                    <p><strong>GitHub Issue:</strong> 
                      <a href="${issue.html_url}" style="color: #B8935A;">#${issue.number}</a>
                    </p>
                    <p><strong>From:</strong> ${data.name} (${data.email})</p>
                    <p><strong>Subject:</strong> ${subjectLabels[data.subject] || data.subject}</p>
                  </div>

                  <h3 style="color: #3D2817;">Message</h3>
                  <p style="background: white; padding: 15px; border-left: 4px solid #E8C590;">
                    ${data.message.replace(/\n/g, '<br>')}
                  </p>

                  <div style="margin-top: 30px; padding: 20px; background: #E8C590; border-radius: 8px; text-align: center;">
                    <a href="${issue.html_url}" 
                       style="display: inline-block; padding: 12px 24px; background: #3D2817; color: white; text-decoration: none; border-radius: 4px; font-weight: bold;">
                      View Issue on GitHub
                    </a>
                  </div>

                  <p style="color: #6B4423; font-size: 12px; margin-top: 20px;">
                    Reply to: ${data.email}
                  </p>
                </div>
              `
            }]
          })
        });

        if (!emailResponse.ok) {
          const emailError = await emailResponse.text();
          console.error('Email send failed:', emailError);
        } else {
          console.log('Email notification sent successfully');
        }
      } catch (emailError) {
        console.error('Email error:', emailError);
        // Continue even if email fails
      }
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        issueNumber: issue.number,
        issueUrl: issue.html_url,
        message: 'Contact form submitted successfully'
      })
    };

  } catch (error) {
    console.error('Error processing contact form:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Failed to submit contact form',
        message: error.message
      })
    };
  }
};

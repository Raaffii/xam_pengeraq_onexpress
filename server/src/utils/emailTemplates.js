exports.generateVerificationEmail = (
  url,
  name,
  header = "Verify Email",
  msg = "We've received your Request. Here's your verification link: ",
  isVerification = true,
  submitLabel = "Verify Email",
) => {
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333333;
          margin: 0;
          padding: 0;
          background-color: #f9f9f9;
        }
        .email-container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        .header {
          padding: 24px;
          text-align: center;
          border-bottom: 1px solid #e0e0e0;
        }
        .header h2 {
          margin: 0;
          color: #4559c9;
          font-size: 22px;
          font-weight: 600;
        }
        .content {
          padding: 24px;
        }
        .verify-button {
          background-color: #4559c9;
          color: #ffffff !important;
          padding: 12px 32px;
          border-radius: 4px;
          text-decoration: none;
          display: inline-block;
          font-weight: 600;
          margin: 20px 0;
          text-align: center;
          font-size: 16px;
          letter-spacing: 0.5px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .button-wrapper {
          text-align: center;
          margin: 24px 0;
        }
        .warning-box {
          background-color: #fff9e6;
          border-left: 4px solid #f0c674;
          padding: 12px 16px;
          margin-top: 24px;
          font-size: 14px;
          border-radius: 4px;
        }
        .footer {
          text-align: center;
          padding: 16px 24px;
          font-size: 12px;
          color: #757575;
          background-color: #fafafa;
          border-top: 1px solid #e0e0e0;
        }
        ul {
          padding-left: 20px;
          margin: 16px 0;
        }
        li {
          margin-bottom: 6px;
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <h2>${header}</h2>
        </div>
        
        <div class="content">
          <p>Hello, ${name || ""}</p>
          
          <p>${msg}</p>
          
          <div class="button-wrapper">
            <a href="${url}" class="verify-button" style="color: #ffffff; text-decoration: none;">
              <span style="color: #ffffff; font-weight: bold;">${submitLabel}</span>
            </a>
          </div>
          
          <p><strong>Important:</strong></p>
          <ul>
            ${
              isVerification
                ? `<li>This link will be expires in ${
                    process.env.RESET_TOKEN_EXP_TIME || 30
                  } minutes</li>`
                : ""
            }
            ${
              isVerification
                ? `<li>If you didn't request this reset, please ignore this email</li>`
                : ""
            }
            <li>For security reasons, please don't share this link with anyone</li>
          </ul>
          
          ${
            isVerification
              ? `
          <div class="warning-box">
            If you did not initiate this request, please secure your account and contact support immediately.
          </div>`
              : ""
          }
        </div>
        
        <div class="footer">
          <p>This is an automated message, please do not reply to this email.</p>
          <p>&copy; ${new Date().getFullYear()} ${
    process.env.APP_NAME || "PrimeApp"
  }. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
    ${header}
    
    Hello, ${name}
    
    ${msg}
    ${url}
    
    Important:
    ${
      isVerification
        ? `- This link will be expires in ${process.env.RESET_TOKEN_EXP_TIME} minutes`
        : ""
    }
    ${
      isVerification
        ? `- If you didn't request this reset, please ignore this email`
        : ""
    }
    - For security reasons, please don't share this link with anyone
    
    ${
      isVerification
        ? `If you did not initiate this request, please secure your account and contact support immediately.`
        : ""
    }
    
    This is an automated message, please do not reply to this email.
    © ${new Date().getFullYear()} ${process.env.APP_NAME}. All rights reserved.
  `;
  return { html, text };
};

exports.generatePasswordResetEmail = (resetToken) => {
  const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          .email-container {
            max-width: 600px;
            margin: 0 auto;
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333333;
          }
          .header {
            background-color: #f8f9fa;
            padding: 20px;
            text-align: center;
            border-bottom: 3px solid #5c6ac4;
          }
          .content {
            padding: 20px;
            background-color: #ffffff;
          }
          .token-container {
            background-color: #f8f9fa;
            border: 1px solid #e9ecef;
            border-radius: 5px;
            padding: 15px;
            margin: 20px 0;
            text-align: center;
          }
          .token {
            font-size: 24px;
            font-weight: bold;
            color: #5c6ac4;
            letter-spacing: 3px;
            font-family: monospace;
          }
          .warning {
            color: #856404;
            background-color: #fff3cd;
            border: 1px solid #ffeeba;
            padding: 10px;
            border-radius: 5px;
            margin-top: 20px;
            font-size: 14px;
          }
          .footer {
            text-align: center;
            padding: 20px;
            font-size: 12px;
            color: #6c757d;
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="header">
            <h2 style="margin: 0; color: #5c6ac4;">Password Reset Request</h2>
          </div>
          
          <div class="content">
            <p>Hello,</p>
            
            <p>We received a request to reset your password. Here's your password reset token:</p>
            
            <div class="token-container">
              <div class="token">${resetToken}</div>
            </div>
            
            <p><strong>Important:</strong></p>
            <ul>
              <li>This token will expire in ${
                process.env.RESET_TOKEN_EXP_TIME || 30
              } minutes</li>
              <li>If you didn't request this reset, please ignore this email</li>
              <li>For security reasons, please don't share this token with anyone</li>
            </ul>
            
            <div class="warning">
              If you did not initiate this password reset request, please secure your account and contact support immediately.
            </div>
          </div>
          
          <div class="footer">
            <p>This is an automated message, please do not reply to this email.</p>
            <p>&copy; ${new Date().getFullYear()} ${
    process.env.COMPANY_NAME || "Pergeraq"
  }. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

  const textContent = `
      Password Reset Request
  
      We received a request to reset your password. Here's your password reset token:
  
      ${resetToken}
  
      Important:
      - This token will expire in ${
        process.env.RESET_TOKEN_EXP_TIME || 30
      } minutes
      - If you didn't request this reset, please ignore this email
      - For security reasons, please don't share this token with anyone
  
      If you did not initiate this password reset request, please secure your account and contact support immediately.
  
      This is an automated message, please do not reply to this email.
    `;

  return { htmlContent, textContent };
};

import { NextResponse } from 'next/server'

export async function GET() {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Privacy Policy - SafeEat AI</title>
  <meta name="description" content="SafeEat AI Privacy Policy - How we collect, use, and protect your personal data" />
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.7;
      color: #1a1a2e;
      background: #fafbfc;
      padding: 0;
    }
    .header {
      background: linear-gradient(135deg, #0a1f0e 0%, #14532d 100%);
      color: white;
      padding: 48px 24px 40px;
      text-align: center;
    }
    .header h1 { font-size: 28px; font-weight: 800; margin-bottom: 8px; }
    .header p { font-size: 14px; opacity: 0.8; }
    .header .badge {
      display: inline-block;
      margin-top: 12px;
      padding: 4px 16px;
      background: rgba(255,255,255,0.15);
      border-radius: 20px;
      font-size: 12px;
    }
    .container {
      max-width: 800px;
      margin: 0 auto;
      padding: 32px 24px 64px;
    }
    .updated {
      text-align: center;
      color: #666;
      font-size: 13px;
      margin-bottom: 32px;
    }
    .section {
      background: white;
      border-radius: 16px;
      padding: 24px 28px;
      margin-bottom: 16px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.06);
    }
    .section h2 {
      font-size: 16px;
      font-weight: 700;
      color: #0a1f0e;
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .section h2 .num {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      border-radius: 8px;
      background: #ecfdf5;
      color: #059669;
      font-size: 13px;
      font-weight: 700;
      flex-shrink: 0;
    }
    .section p, .section ul { font-size: 14px; color: #4a5568; }
    .section ul { padding-left: 20px; margin-top: 8px; }
    .section li { margin-bottom: 4px; }
    .highlight {
      background: #ecfdf5;
      border-left: 4px solid #059669;
      padding: 16px 20px;
      border-radius: 0 12px 12px 0;
      margin: 16px 0;
    }
    .highlight p { color: #065f46; font-weight: 500; }
    .contact {
      text-align: center;
      padding: 32px 24px;
      background: white;
      border-radius: 16px;
      margin-top: 24px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.06);
    }
    .contact h2 { justify-content: center; font-size: 18px; }
    .contact a { color: #059669; font-weight: 600; text-decoration: none; }
    .contact a:hover { text-decoration: underline; }
    .footer {
      text-align: center;
      padding: 24px;
      color: #999;
      font-size: 12px;
    }
    @media (max-width: 640px) {
      .container { padding: 20px 16px 48px; }
      .section { padding: 18px 20px; }
      .header h1 { font-size: 22px; }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>🛡️ Privacy Policy</h1>
    <p>SafeEat AI — AI-Powered Food Safety Scanner</p>
    <div class="badge">GDPR · CCPA · DPDP Act 2023 Compliant</div>
  </div>

  <div class="container">
    <p class="updated">Last Updated: January 2025</p>

    <div class="section">
      <h2><span class="num">1</span> Information We Collect</h2>
      <p><strong>Information You Provide:</strong></p>
      <ul>
        <li>Name, email address, and phone number (during registration)</li>
        <li>Health preferences (allergies, dietary restrictions, health goals)</li>
        <li>Scanned product data and ingredients</li>
      </ul>
      <p style="margin-top:12px"><strong>Automatically Collected Information:</strong></p>
      <ul>
        <li>Device information (model, OS version)</li>
        <li>App usage data and crash reports</li>
        <li>Camera access (only when scanning, images are processed and not stored on our servers)</li>
      </ul>
    </div>

    <div class="section">
      <h2><span class="num">2</span> How We Use Your Information</h2>
      <ul>
        <li>To provide and improve our food safety analysis services</li>
        <li>To personalize your experience based on health preferences</li>
        <li>To send important notifications about product safety alerts</li>
        <li>To improve app performance and user experience</li>
        <li>To process subscription payments via Google Play Billing</li>
      </ul>
    </div>

    <div class="section">
      <h2><span class="num">3</span> Data Storage & Security</h2>
      <ul>
        <li>Your data is stored securely with industry-standard encryption</li>
        <li>We implement appropriate technical and organizational measures to protect your data</li>
        <li>Health preference data is encrypted both in transit and at rest</li>
        <li>Scanned images are processed in real-time and are not permanently stored on our servers</li>
      </ul>
    </div>

    <div class="section">
      <h2><span class="num">4</span> Data Sharing</h2>
      <div class="highlight">
        <p>We do NOT sell, trade, or rent your personal information to third parties.</p>
      </div>
      <ul>
        <li>We may share anonymized, aggregated data for research purposes</li>
        <li>We may disclose information if required by law or to protect our rights</li>
        <li>Payment processing is handled by Google Play Billing (subject to Google's Privacy Policy)</li>
      </ul>
    </div>

    <div class="section">
      <h2><span class="num">5</span> Your Rights</h2>
      <ul>
        <li>You can access, update, or delete your personal data at any time through the App settings</li>
        <li>You can opt out of non-essential notifications</li>
        <li>You can request complete data deletion by contacting us</li>
        <li>You can export your data in a portable format</li>
      </ul>
    </div>

    <div class="section">
      <h2><span class="num">6</span> Children's Privacy</h2>
      <p>SafeEat AI can be used by families, but we do not knowingly collect personal information from children under 13 without parental consent. Parents can review and delete their child's information by contacting us.</p>
    </div>

    <div class="section">
      <h2><span class="num">7</span> Cookies & Tracking</h2>
      <p>We use minimal analytics to improve app performance. We do not use third-party advertising cookies. Any analytics data collected is anonymized and aggregated.</p>
    </div>

    <div class="section">
      <h2><span class="num">8</span> Third-Party Services</h2>
      <ul>
        <li><strong>Google Play Billing:</strong> Payment processing is subject to Google's Privacy Policy</li>
        <li><strong>AI Analysis:</strong> Our AI models process ingredient data without storing personal identifiers</li>
      </ul>
    </div>

    <div class="section">
      <h2><span class="num">9</span> Special Protections for Health Data</h2>
      <ul>
        <li>Health-related data (allergies, dietary restrictions, medical conditions) is treated as sensitive personal data under applicable law</li>
        <li>We apply enhanced security measures including encryption at rest and in transit for all health data</li>
        <li>Health data is only used to provide personalized food safety analysis and alerts</li>
        <li>You may withdraw consent for health data processing at any time, though this may limit app functionality</li>
        <li>We conduct regular security assessments to ensure health data protection</li>
      </ul>
    </div>

    <div class="section">
      <h2><span class="num">10</span> GDPR Compliance (EU Users)</h2>
      <p>If you are a resident of the European Economic Area (EEA), you have the following rights:</p>
      <ul>
        <li><strong>Right to Access:</strong> Request a copy of your personal data</li>
        <li><strong>Right to Rectification:</strong> Request correction of inaccurate data</li>
        <li><strong>Right to Erasure:</strong> Request deletion of your personal data ("Right to be Forgotten")</li>
        <li><strong>Right to Data Portability:</strong> Receive your data in a structured, machine-readable format</li>
        <li><strong>Right to Object:</strong> Object to processing of your personal data</li>
        <li><strong>Right to Restrict Processing:</strong> Request limitation of data processing</li>
        <li><strong>Right to Withdraw Consent:</strong> Withdraw consent at any time</li>
      </ul>
      <p style="margin-top:8px">To exercise these rights, contact our Data Protection Officer at doctorpulseai24@gmail.com</p>
    </div>

    <div class="section">
      <h2><span class="num">11</span> Indian Data Protection (DPDP Act 2023)</h2>
      <p>In compliance with the Digital Personal Data Protection Act, 2023:</p>
      <ul>
        <li>We serve as the Data Fiduciary for your personal data</li>
        <li>You have the right to access, correct, and erase your personal data</li>
        <li>We obtain your consent before processing personal data, except as permitted by law</li>
        <li>You may nominate another individual to exercise your data rights in case of death or incapacity</li>
        <li>Grievance redressal: Contact our Grievance Officer at doctorpulseai24@gmail.com</li>
        <li>We do not transfer your personal data outside India without your explicit consent or as permitted by law</li>
      </ul>
    </div>

    <div class="section">
      <h2><span class="num">12</span> CCPA Compliance (California Users)</h2>
      <p>Under the California Consumer Privacy Act (CCPA), California residents have the right to:</p>
      <ul>
        <li>Know what personal information is collected about them</li>
        <li>Request deletion of their personal information</li>
        <li>Opt out of the sale of personal information (we do NOT sell personal information)</li>
        <li>Not be discriminated against for exercising their privacy rights</li>
        <li>Request access to specific pieces of personal information</li>
      </ul>
    </div>

    <div class="section">
      <h2><span class="num">13</span> Camera & Device Permissions</h2>
      <p>SafeEat AI requests the following device permissions:</p>
      <ul>
        <li><strong>Camera:</strong> Used exclusively for scanning food labels and products. Images are processed in real-time and are NOT stored on our servers after analysis</li>
        <li><strong>Storage:</strong> Used to cache scan results and preferences locally on your device</li>
        <li><strong>Internet:</strong> Required for AI analysis and cloud processing</li>
        <li><strong>Notifications:</strong> Used for safety alerts and product recalls (can be disabled)</li>
      </ul>
      <p style="margin-top:8px">You may revoke any permission at any time through your device Settings. Revoking permissions may limit certain app features.</p>
    </div>

    <div class="section">
      <h2><span class="num">14</span> Data Breach Notification</h2>
      <p>In the event of a data breach that may affect your personal information:</p>
      <ul>
        <li>We will notify affected users within 72 hours of becoming aware of the breach</li>
        <li>Notifications will be sent via email and/or in-app notification</li>
        <li>We will provide details of the breach, affected data types, and remedial actions</li>
        <li>We will report the breach to relevant data protection authorities as required by law</li>
        <li>We will take immediate steps to contain and remediate the breach</li>
      </ul>
    </div>

    <div class="section">
      <h2><span class="num">15</span> Data Retention</h2>
      <p>We retain your data for as long as your account is active or as needed to provide services. Upon account deletion, all personal data is permanently removed within 30 days.</p>
    </div>

    <div class="section">
      <h2><span class="num">16</span> International Data Transfers</h2>
      <p>Your data may be processed in countries other than your own. We ensure appropriate safeguards are in place for international transfers.</p>
    </div>

    <div class="section">
      <h2><span class="num">17</span> Changes to This Policy</h2>
      <p>We may update this Privacy Policy periodically. We will notify you of significant changes through the App or via email.</p>
    </div>

    <div class="contact">
      <h2>📬 Contact Us</h2>
      <p style="margin-top:12px">If you have questions about this Privacy Policy or your data, please contact:</p>
      <p style="margin-top:8px"><strong>Data Protection Officer:</strong> <a href="mailto:doctorpulseai24@gmail.com">doctorpulseai24@gmail.com</a></p>
      <p style="margin-top:4px"><strong>Grievance Officer:</strong> <a href="mailto:doctorpulseai24@gmail.com">doctorpulseai24@gmail.com</a></p>
    </div>

    <div class="footer">
      <p>&copy; 2025 DoctorPulse AI. All rights reserved.</p>
      <p style="margin-top:4px">SafeEat AI — Scan. Check. Eat Safe.</p>
    </div>
  </div>
</body>
</html>`

  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}

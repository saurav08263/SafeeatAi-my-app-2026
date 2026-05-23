import { NextResponse } from 'next/server'

export async function GET() {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Terms of Service - SafeEat AI</title>
  <meta name="description" content="SafeEat AI Terms of Service - Terms and conditions for using our AI food safety app" />
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
    .warning {
      background: #fef3c7;
      border-left: 4px solid #f59e0b;
      padding: 16px 20px;
      border-radius: 0 12px 12px 0;
      margin: 16px 0;
    }
    .warning p { color: #92400e; font-weight: 500; }
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
    <h1>📄 Terms of Service</h1>
    <p>SafeEat AI — AI-Powered Food Safety Scanner</p>
    <div class="badge">Effective: January 2025</div>
  </div>

  <div class="container">
    <p class="updated">Last Updated: January 2025</p>

    <div class="section">
      <h2><span class="num">1</span> Acceptance of Terms</h2>
      <p>By downloading, installing, or using SafeEat AI ("the App"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree with any part of these Terms, you must not use the App. These Terms constitute a legally binding agreement between you and DoctorPulse AI ("Company", "we", "our", "us").</p>
      <p style="margin-top:8px">You must be at least 13 years of age to use this App. If you are under 18, you must have parental or guardian consent to use the App and agree to these Terms.</p>
    </div>

    <div class="section">
      <h2><span class="num">2</span> Description of Service</h2>
      <p>SafeEat AI is an AI-powered food safety analysis application that provides the following services:</p>
      <ul>
        <li>Food product scanning and ingredient analysis</li>
        <li>Food combination safety checking</li>
        <li>Expiry date tracking and verification</li>
        <li>Medicine-food interaction analysis (Premium)</li>
        <li>Pregnancy-safe food checking (Premium)</li>
        <li>Kids-safe food verification (Premium)</li>
        <li>Gym and fitness nutrition analysis (Premium)</li>
        <li>AI-powered food safety chatbot</li>
        <li>Safety scoring and allergen detection</li>
      </ul>
      <p style="margin-top:8px">We reserve the right to modify, suspend, or discontinue any feature at any time without prior notice.</p>
    </div>

    <div class="section">
      <h2><span class="num">3</span> Medical Disclaimer</h2>
      <div class="warning">
        <p>⚠️ IMPORTANT: The information provided by SafeEat AI is for general informational purposes only and should NOT be considered as medical advice, diagnosis, or treatment.</p>
      </div>
      <ul>
        <li>Always consult a qualified healthcare professional before making any health-related decisions</li>
        <li>Do not ignore professional medical advice or delay seeking it because of information obtained from this App</li>
        <li>Safety scores and analysis are AI-generated suggestions and may not be 100% accurate</li>
        <li>The App is not a substitute for professional medical judgment</li>
        <li>Individual health conditions may require personalized advice beyond what the App provides</li>
      </ul>
    </div>

    <div class="section">
      <h2><span class="num">4</span> Subscription & Payments</h2>
      <p><strong>Plans:</strong></p>
      <ul>
        <li><strong>Monthly Plan:</strong> ₹299/month (includes minimal ads)</li>
        <li><strong>Yearly Plan:</strong> ₹1,999/year (ad-free, save 44%)</li>
        <li><strong>Free Trial:</strong> 2-day free trial available for new users</li>
      </ul>
      <p style="margin-top:12px"><strong>Payment Terms:</strong></p>
      <ul>
        <li>All payments are processed through Google Play Billing</li>
        <li>Subscriptions auto-renew unless cancelled at least 24 hours before the end of the current billing period</li>
        <li>Your Google Play account will be charged upon confirmation of purchase</li>
        <li>Cancellation can be done through Google Play Store → Subscriptions → SafeEat AI → Cancel</li>
        <li>No refunds are provided for partial billing periods</li>
        <li>Prices are in Indian Rupees (INR) and may be subject to change with 30 days' notice</li>
      </ul>
    </div>

    <div class="section">
      <h2><span class="num">5</span> User Accounts & Registration</h2>
      <ul>
        <li>You are responsible for maintaining the confidentiality of your account credentials</li>
        <li>You must provide accurate and complete information when creating your account</li>
        <li>You are responsible for all activities conducted under your account</li>
        <li>You must notify us immediately of any unauthorized access to your account</li>
        <li>We reserve the right to suspend or terminate accounts that violate these Terms</li>
      </ul>
    </div>

    <div class="section">
      <h2><span class="num">6</span> Acceptable Use</h2>
      <p>You agree NOT to:</p>
      <ul>
        <li>Misuse the App or help anyone else do so</li>
        <li>Reverse-engineer, decompile, or disassemble the App</li>
        <li>Use the App for any unlawful purpose</li>
        <li>Attempt to gain unauthorized access to any part of the App or its related systems</li>
        <li>Create multiple accounts for fraudulent purposes</li>
        <li>Share premium features with non-subscribers</li>
        <li>Use automated systems (bots, scrapers) to access the App</li>
        <li>Upload content that is harmful, threatening, or otherwise objectionable</li>
      </ul>
    </div>

    <div class="section">
      <h2><span class="num">7</span> User-Generated Content</h2>
      <ul>
        <li>You retain ownership of any data you input into the App (scanned items, health preferences)</li>
        <li>By using the App, you grant us a limited license to process your data for food safety analysis</li>
        <li>We do not claim ownership over your scanned data or personal health information</li>
        <li>You may request deletion of your data at any time</li>
        <li>Anonymized, aggregated data may be used to improve our AI models</li>
      </ul>
    </div>

    <div class="section">
      <h2><span class="num">8</span> AI Analysis Disclaimer</h2>
      <div class="warning">
        <p>⚠️ AI-generated analysis is advisory only and may not always be accurate. Use your own judgment and consult professionals.</p>
      </div>
      <ul>
        <li>AI results are based on available data and may not account for all variables</li>
        <li>Safety scores are algorithmic estimates and not guaranteed to be accurate</li>
        <li>The App may occasionally produce incorrect or incomplete analysis</li>
        <li>You should always verify critical food safety information through authoritative sources</li>
        <li>We continuously improve our AI models but cannot guarantee 100% accuracy</li>
      </ul>
    </div>

    <div class="section">
      <h2><span class="num">9</span> Intellectual Property</h2>
      <ul>
        <li>All content, features, and functionality of SafeEat AI are owned by DoctorPulse AI</li>
        <li>The App is protected by international copyright, trademark, and other intellectual property laws</li>
        <li>You may not copy, modify, distribute, sell, or lease any part of our App without prior written consent</li>
        <li>"SafeEat AI", the SafeEat logo, and related marks are trademarks of DoctorPulse AI</li>
      </ul>
    </div>

    <div class="section">
      <h2><span class="num">10</span> Limitation of Liability</h2>
      <p>TO THE MAXIMUM EXTENT PERMITTED BY LAW:</p>
      <ul>
        <li>The App is provided "as is" and "as available" without warranties of any kind</li>
        <li>DoctorPulse AI shall not be liable for any indirect, incidental, special, consequential, or punitive damages</li>
        <li>We are not liable for any harm resulting from reliance on AI-generated food safety analysis</li>
        <li>Our total liability shall not exceed the amount you paid us in the 12 months preceding the claim</li>
        <li>We are not responsible for any loss of data or service interruptions</li>
      </ul>
    </div>

    <div class="section">
      <h2><span class="num">11</span> Indemnification</h2>
      <p>You agree to indemnify, defend, and hold harmless DoctorPulse AI, its officers, directors, employees, and agents from and against any claims, liabilities, damages, losses, and expenses arising out of or in any way connected with your access to or use of the App, or your violation of these Terms.</p>
    </div>

    <div class="section">
      <h2><span class="num">12</span> Termination</h2>
      <ul>
        <li><strong>By Us:</strong> We may suspend or terminate your access to the App at any time for violation of these Terms</li>
        <li><strong>By You:</strong> You may stop using the App at any time and delete your account through the App settings</li>
        <li><strong>Effect:</strong> Upon termination, your right to use the App ceases immediately</li>
        <li><strong>Survival:</strong> Sections relating to Intellectual Property, Limitation of Liability, and Indemnification survive termination</li>
      </ul>
    </div>

    <div class="section">
      <h2><span class="num">13</span> Data Privacy</h2>
      <p>Your use of the App is also governed by our <a href="/privacy" style="color:#059669;font-weight:600">Privacy Policy</a>, which is incorporated into these Terms by reference. Please review our Privacy Policy to understand our data practices.</p>
    </div>

    <div class="section">
      <h2><span class="num">14</span> Children's Use</h2>
      <p>SafeEat AI is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If we learn that we have collected personal information from a child under 13, we will take steps to delete that information promptly. Parents who believe their child has provided personal information to us may contact us at doctorpulseai24@gmail.com.</p>
    </div>

    <div class="section">
      <h2><span class="num">15</span> Third-Party Services</h2>
      <ul>
        <li><strong>Google Play Billing:</strong> All in-app purchases are processed by Google and subject to Google's Terms of Service</li>
        <li><strong>AI Providers:</strong> Our AI analysis is powered by third-party AI models subject to their respective terms</li>
        <li>We are not responsible for the practices of third-party services</li>
      </ul>
    </div>

    <div class="section">
      <h2><span class="num">16</span> Dispute Resolution</h2>
      <div class="highlight">
        <p>These Terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in India.</p>
      </div>
      <ul>
        <li>You agree to resolve any disputes through binding arbitration in India</li>
        <li>Arbitration shall be conducted in accordance with the Arbitration and Conciliation Act, 1996</li>
        <li>The language of arbitration shall be English</li>
        <li>Before filing arbitration, you agree to attempt to resolve the dispute informally by contacting us</li>
        <li>You waive any right to participate in class action lawsuits or class-wide arbitration</li>
      </ul>
    </div>

    <div class="section">
      <h2><span class="num">17</span> Changes to Terms</h2>
      <p>We may update these Terms from time to time. We will notify you of significant changes through:</p>
      <ul>
        <li>In-app notification at least 15 days before the changes take effect</li>
        <li>Email notification to your registered email address</li>
        <li>Updated "Last Updated" date on this page</li>
      </ul>
      <p style="margin-top:8px">Continued use of the App after changes constitutes acceptance of the updated Terms.</p>
    </div>

    <div class="section">
      <h2><span class="num">18</span> Severability</h2>
      <p>If any provision of these Terms is found to be invalid or unenforceable, the remaining provisions shall remain in full force and effect. The invalid provision shall be modified to the minimum extent necessary to make it valid and enforceable.</p>
    </div>

    <div class="contact">
      <h2>📬 Contact Information</h2>
      <p style="margin-top:12px">For any questions regarding these Terms, please contact:</p>
      <p style="margin-top:8px"><strong>DoctorPulse AI</strong></p>
      <p style="margin-top:4px">Email: <a href="mailto:doctorpulseai24@gmail.com?subject=SafeEat%20AI%20Terms%20Inquiry">doctorpulseai24@gmail.com</a></p>
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

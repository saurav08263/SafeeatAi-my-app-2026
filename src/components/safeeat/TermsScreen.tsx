'use client'

import { motion } from 'framer-motion'
import { useAppStore } from '@/lib/store'
import {
  ChevronLeft, Shield, FileText, AlertTriangle, CreditCard,
  Users, Ban, Database, Brain, Crown, Scale, Heart, Lock,
  Smartphone, Globe, RefreshCw, Scissors, Mail, CheckCircle2, Clock,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'

// ━━━ Animation Variants ━━━
const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
}

// ━━━ Terms of Service Sections ━━━
const termsSections = [
  {
    icon: Shield,
    title: '1. Acceptance of Terms',
    content: `By downloading, installing, or using the SafeEat AI mobile application ("App"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, you must not use the App.

These Terms constitute a legally binding agreement between you ("User," "you," or "your") and DoctorPulse AI ("Company," "we," "us," or "our"), governing your use of the SafeEat AI application and all associated services.

By using the App, you represent and warrant that:
- You are at least 13 years of age (or have parental consent if under 13)
- You have the legal capacity to enter into these Terms
- You will comply with all applicable laws and regulations
- You will provide accurate and complete information when required

We reserve the right to refuse service to anyone for any reason at any time.`,
  },
  {
    icon: FileText,
    title: '2. Description of Service',
    content: `SafeEat AI is an artificial intelligence-powered food safety analysis application that provides the following services:

- AI Food Scanner: Scan food product labels, ingredient lists, and packaging using your device's camera to receive instant safety analysis
- Ingredient Analysis: Detailed breakdown of individual ingredients, including safety ratings, potential health effects, and regulatory status
- Allergen Detection: Identification of common and uncommon allergens present in scanned food products based on your personalized health profile
- Nutritional Assessment: Overview of nutritional information and dietary suitability based on your health goals and restrictions
- Combination Safety: Analysis of food combinations to identify potentially harmful interactions
- Expiry Verification: Guidance on food product expiration dates and storage safety
- Medicine Interaction: Preliminary analysis of potential food-medicine interactions (not a substitute for professional medical advice)
- Pregnancy & Kids Mode: Specialized analysis modes for sensitive dietary requirements during pregnancy and for children
- Fitness Nutrition: Analysis tailored for gym and fitness-oriented dietary goals
- AI Chat Assistant: Conversational AI interface for food safety queries and personalized dietary guidance

The App is designed for informational and educational purposes only. It is not intended to diagnose, treat, cure, or prevent any disease or health condition.`,
  },
  {
    icon: AlertTriangle,
    title: '3. Medical Disclaimer',
    content: `IMPORTANT — PLEASE READ CAREFULLY:

SafeEat AI DOES NOT provide medical advice, diagnosis, or treatment. The information provided by the App is for general informational and educational purposes only and is NOT a substitute for professional medical advice, diagnosis, or treatment.

- Always seek the advice of your physician, qualified healthcare provider, or other qualified health professional with any questions you may have regarding a medical condition, food allergy, or dietary restriction
- Never disregard professional medical advice or delay in seeking it because of information provided by SafeEat AI
- If you think you may have a medical emergency, call your doctor, go to the emergency department, or contact emergency services immediately
- The App's analysis of food products is based on AI models and may not identify all potential allergens, contaminants, or health risks
- Individual reactions to food products vary significantly. What is safe for one person may be dangerous for another
- The App does not account for all possible medical conditions, medication interactions, or individual health circumstances
- Food product formulations change frequently. The App's analysis may not reflect the most current ingredient information

DoctorPulse AI expressly disclaims all liability for any actions taken or not taken based on the information provided by SafeEat AI. Use of the App is entirely at your own risk.`,
  },
  {
    icon: CreditCard,
    title: '4. Subscription & Payments',
    content: `Subscription Plans:
SafeEat AI offers the following subscription plans:
- Monthly Plan: ₹299/month (Indian Rupees)
- Yearly Plan: ₹1,999/year (Indian Rupees)
- Prices are subject to change with prior notice

Payment Processing:
- All payments are processed through Google Play Billing subject to Google Play's Terms of Service
- Payment will be charged to your Google Play account at confirmation of purchase
- Applicable taxes may be added based on your jurisdiction in India (including GST as required)

Auto-Renewal:
- Subscriptions automatically renew unless auto-renewal is turned off at least 24 hours before the end of the current period
- Your account will be charged for renewal within 24 hours prior to the end of the current period
- The renewal cost will be the then-current subscription price

Cancellation:
- You may cancel your subscription at any time through your Google Play Store account settings
-Cancellation will take effect at the end of the current billing period — you will retain access until then
- No partial refund is provided for the unused portion of a billing period after cancellation

Free Trial:
- We may offer free trial periods for new subscribers from time to time
- Free trials are limited to one per user and per Google Play account
- At the end of the free trial period, your subscription will automatically convert to a paid subscription unless you cancel before the trial ends
- You will be charged the then-applicable subscription rate upon conversion

Refund Policy:
- Refunds are governed by Google Play's refund policy
- We do not provide refunds for partial billing periods
- No pro-rata refunds are available for unused subscription time
- For refund requests, please contact Google Play Support or email us at doctorpulseai24@gmail.com

Price Changes:
- We reserve the right to change subscription pricing
- We will provide reasonable notice of any price changes
- Price changes will take effect at the next renewal period
- Continued use after a price change constitutes acceptance of the new price`,
  },
  {
    icon: Users,
    title: '5. User Accounts & Registration',
    content: `Account Creation:
- To access certain features of the App, you must create a user account
- You may register using your email address, Google account, or other methods provided within the App
- You must be at least 13 years old to create an account (or have parental consent)

Account Responsibility:
- You are responsible for maintaining the confidentiality of your account credentials
- You are responsible for all activities that occur under your account
- You must notify us immediately of any unauthorized use of your account
- You must not share your account credentials with any third party

Accurate Information:
- You agree to provide accurate, current, and complete information during registration
- You agree to update your information to keep it accurate, current, and complete
- Providing false or misleading information may result in immediate account termination

Account Security:
- You are responsible for maintaining the security of your account
- Use a strong password and do not reuse passwords from other services
- Enable any available security features (such as two-factor authentication)
- We are not liable for any loss or damage arising from your failure to maintain account security

Account Verification:
- We may verify your account information at any time
- We reserve the right to suspend or terminate accounts that fail verification`,
  },
  {
    icon: Ban,
    title: '6. Acceptable Use',
    content: `You agree NOT to:

- Use the App for any unlawful purpose or in violation of any applicable Indian or international laws
- Reverse engineer, decompile, disassemble, or otherwise attempt to discover the source code, algorithms, or underlying technology of the App
- Modify, adapt, alter, translate, or create derivative works of the App
- Use the App to develop competing products or services
- Interfere with or disrupt the App's servers, networks, or services
- Use automated systems, bots, scrapers, or similar tools to access the App
- Attempt to gain unauthorized access to any portion of the App, other accounts, or computer systems
- Use the App to transmit any viruses, malware, or other harmful code
- Impersonate any person or entity or misrepresent your affiliation
- Use the App to harass, abuse, or harm others
- Upload content that is illegal, harmful, threatening, abusive, defamatory, or otherwise objectionable
- Use the App in any manner that could damage, disable, or impair its operation
- Circumvent any security measures or access controls of the App
- Use the App for any purpose that violates the Food Safety and Standards Authority of India (FSSAI) guidelines or regulations
- Resell, sublicense, or redistribute access to the App without our written permission

Violation of these acceptable use terms may result in immediate account suspension or termination and may subject you to legal liability.`,
  },
  {
    icon: Database,
    title: '7. User-Generated Content',
    content: `Content Ownership:
- You retain ownership of all content you submit to the App, including scanned product data, ingredient lists, and personal health preferences
- Scanned images are processed in real-time and are not permanently stored on our servers unless you explicitly choose to save them

License Grant:
- By submitting content to the App, you grant DoctorPulse AI a limited, non-exclusive, worldwide, royalty-free license to:
  - Process, analyze, and evaluate your content using our AI models for the purpose of providing the Service
  - Store your content temporarily as needed to deliver the Service
  - Use anonymized and aggregated data derived from your content to improve our AI models and services
- This license exists only for the duration necessary to provide the Service and ceases upon deletion of your content

Content Responsibilities:
- You are solely responsible for the content you submit
- You represent that you have the right to submit any content you provide
- You must not submit content that infringes on the intellectual property rights of others

Data Deletion:
- You may delete your scanned data and history at any time through the App's settings
- Upon account deletion, all associated content will be permanently removed within 30 days
- Anonymized, aggregated data derived from your content may be retained for service improvement`,
  },
  {
    icon: Brain,
    title: '8. AI Analysis Disclaimer',
    content: `Nature of AI Analysis:
- SafeEat AI uses artificial intelligence and machine learning models to analyze food products and ingredients
- AI analysis is inherently probabilistic and may produce results that are incomplete, inaccurate, or unreliable
- The App's analysis is advisory only and should not be the sole basis for any health or dietary decision

Limitations:
- AI models are trained on available data and may not cover all food products, ingredients, or regional variations available in India
- The App may not identify all potential allergens, especially rare or newly introduced ingredients
- Nutritional analysis is estimated and may not match exact product specifications
- Food-medicine interaction analysis is preliminary and not a substitute for pharmacist or doctor consultation
- The App cannot detect contamination, adulteration, or quality issues not reflected in the ingredient list
- AI results may vary between scans of the same product due to image quality, lighting, or other factors

No Guarantee:
- DoctorPulse AI does not guarantee the accuracy, completeness, reliability, or timeliness of any AI-generated analysis
- Results are provided "as is" without any warranty of any kind, express or implied
- You should always verify critical information independently, especially when dealing with severe allergies or health conditions
- The App is not a replacement for reading product labels carefully or consulting with healthcare professionals

Continuous Improvement:
- We continuously work to improve the accuracy and coverage of our AI models
- User feedback helps us identify and correct errors in our analysis
- You can report inaccurate results through the App's feedback feature`,
  },
  {
    icon: Crown,
    title: '9. Intellectual Property',
    content: `Ownership:
- The App, including all software, design, text, graphics, logos, icons, images, audio, video, data compilations, and the overall arrangement thereof, is the property of DoctorPulse AI and is protected by Indian and international intellectual property laws
- All trademarks, service marks, and trade names displayed in the App are the property of DoctorPulse AI or their respective owners
- The "SafeEat AI" name, logo, and all related names, logos, product and service names, designs, and slogans are trademarks of DoctorPulse AI

Restrictions:
- You may not use, reproduce, distribute, modify, create derivative works of, publicly display, publicly perform, republish, download, store, or transmit any materials from the App except as expressly permitted by these Terms
- You may not use any data mining, robots, or similar data gathering or extraction methods on the App
- You may not frame any portion of the App or use meta tags or any hidden text using DoctorPulse AI's trademarks or product names without our written consent

User License:
- Subject to your compliance with these Terms, we grant you a limited, non-exclusive, non-transferable, revocable license to access and use the App for your personal, non-commercial purposes
- This license does not include the right to modify, distribute, or create derivative works

Feedback:
- If you provide feedback, suggestions, or ideas regarding the App, you agree that DoctorPulse AI may use such feedback without any obligation to compensate you`,
  },
  {
    icon: Scale,
    title: '10. Limitation of Liability',
    content: `To the fullest extent permitted by applicable Indian law:

Disclaimer of Warranties:
- The App is provided on an "AS IS" and "AS AVAILABLE" basis without warranties of any kind, whether express, implied, or statutory
- DoctorPulse AI expressly disclaims all warranties, including but not limited to implied warranties of merchantability, fitness for a particular purpose, and non-infringement
- We do not warrant that the App will be uninterrupted, timely, secure, or error-free
- We do not warrant that the results obtained from the use of the App will be accurate or reliable

Limitation of Damages:
- IN NO EVENT SHALL DOCTORPULSE AI, ITS DIRECTORS, EMPLOYEES, PARTNERS, AGENTS, SUPPLIERS, OR AFFILIATES BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING WITHOUT LIMITATION:
  - Loss of profits, data, use, goodwill, or other intangible losses
  - Damages arising from your access to or use of (or inability to access or use) the App
  - Damages arising from any conduct or content of any third party on the App
  - Damages arising from unauthorized access, use, or alteration of your transmissions or content
  - Personal injury or health complications resulting from reliance on App-provided information
  - Allergic reactions or adverse health events related to food products analyzed by the App

Maximum Liability:
- DoctorPulse AI's total cumulative liability to you for any and all claims arising out of or relating to the use of the App shall not exceed the total amount paid by you to DoctorPulse AI during the twelve (12) months preceding the event giving rise to the claim

This limitation of liability applies whether the alleged liability is based on contract, tort, negligence, strict liability, or any other basis, even if DoctorPulse AI has been advised of the possibility of such damage.`,
  },
  {
    icon: Heart,
    title: '11. Indemnification',
    content: `You agree to defend, indemnify, and hold harmless DoctorPulse AI and its officers, directors, employees, agents, licensors, suppliers, and any third-party information providers from and against all losses, expenses, damages, costs, claims, and demands, including reasonable legal fees and related costs and expenses, arising out of or related to:

- Your use of the App or any activity conducted through the App
- Your violation of these Terms of Service
- Your violation of any applicable law, rule, or regulation
- Your violation of any rights of a third party, including intellectual property rights
- Any content you submit, post, or transmit through the App
- Any health decisions made based on information provided by the App
- Any claim that your use of the App causes damage to a third party
- Your failure to comply with applicable food safety regulations

DoctorPulse AI reserves the right, at its own expense, to assume the exclusive defense and control of any matter otherwise subject to indemnification by you, and in such case, you agree to cooperate with DoctorPulse AI's defense of such claim.

This indemnification obligation will survive the termination of these Terms and your use of the App.`,
  },
  {
    icon: Lock,
    title: '12. Termination',
    content: `Termination by Us:
- DoctorPulse AI reserves the right to terminate or suspend your account and access to the App, without prior notice or liability, for any reason, including but not limited to:
  - Violation of these Terms of Service
  - Fraudulent, abusive, or unlawful activity
  - Conduct that is harmful to other users, DoctorPulse AI, or third parties
  - Prolonged inactivity
  - Failure to pay applicable subscription fees
  - As required by law or legal process

Termination by You:
- You may terminate your account at any time by:
  - Deleting your account through the App's settings
  - Contacting us at doctorpulseai24@gmail.com
- Upon termination, your right to use the App will immediately cease

Effects of Termination:
- Upon termination, all provisions of these Terms which by their nature should survive shall survive, including but not limited to Sections 3, 8, 9, 10, 11, and 16
- DoctorPulse AI shall not be liable to you or any third party for any termination of your access to the App
- Subscriptions will be cancelled in accordance with Google Play Billing policies
- We may delete all data associated with your account after a reasonable period

Account Suspension:
- We may suspend (rather than terminate) your account in certain circumstances, providing you with notice and an opportunity to rectify the issue where appropriate`,
  },
  {
    icon: Smartphone,
    title: '13. Data Privacy',
    content: `Your privacy is important to us. Our collection and use of personal information in connection with the App is as described in our Privacy Policy, which is incorporated into these Terms by reference.

Key Points:
- Our Privacy Policy is available within the App and describes how we collect, use, store, and share your data
- By using the App, you consent to the collection and use of your information as described in the Privacy Policy
- We comply with applicable Indian data protection laws and regulations, including the Information Technology Act, 2000, and the Digital Personal Data Protection Act, 2023
- You retain the right to access, correct, delete, and port your personal data as outlined in the Privacy Policy
- Health-related data is treated with enhanced protection measures

The Privacy Policy is an integral part of these Terms. In the event of any conflict between these Terms and the Privacy Policy regarding data handling, the Privacy Policy shall prevail.`,
  },
  {
    icon: Globe,
    title: "14. Children's Use",
    content: `Age Restrictions:
- SafeEat AI is not intended for use by children under the age of 13 without parental or guardian consent and supervision
- If a child under 13 uses the App, it must be with the involvement and consent of a parent or legal guardian

Parental Consent:
- We require verifiable parental consent before collecting personal information from children under 13, in compliance with applicable Indian laws and the Children's Online Privacy Protection Act (COPPA) where applicable
- Parents may review, modify, or delete their child's personal information at any time by contacting us

Children's Data:
- We do not knowingly collect personal information from children under 13 without parental consent
- If we learn that we have collected personal information from a child under 13 without verification of parental consent, we will delete that information promptly
- Parents can contact us at doctorpulseai24@gmail.com to review or delete their child's data

Supervision:
- Parents and guardians are encouraged to monitor their children's use of the App
- The App's analysis results should be reviewed by an adult before making dietary decisions for children
- Children should not make health or dietary decisions solely based on the App's output`,
  },
  {
    icon: RefreshCw,
    title: '15. Third-Party Services',
    content: `The App integrates with and relies on certain third-party services:

Google Play Billing:
- All in-app purchases and subscription payments are processed through Google Play Billing
- Your use of Google Play Billing is subject to Google Play's Terms of Service and Privacy Policy
- Google is responsible for payment processing, billing, and refund administration
- Any disputes regarding payment processing should be directed to Google Play Support

AI Service Providers:
- Our AI analysis capabilities may utilize services from third-party AI providers
- These providers process data on our behalf under strict data processing agreements
- Third-party AI providers do not have independent access to your personal data
- We remain responsible for how your data is handled, even when processed by third parties

Third-Party Content:
- The App may contain links to or integrate content from third-party websites or services
- We do not endorse, guarantee, or assume responsibility for any third-party content or services
- Your interaction with third-party services is governed by their respective terms and policies

Disclaimer:
- We are not responsible for any damage or loss caused or alleged to be caused by or in connection with the use of or reliance on any third-party content, goods, or services
- Third-party services may be modified, suspended, or discontinued without notice`,
  },
  {
    icon: Scale,
    title: '16. Dispute Resolution',
    content: `Governing Law:
- These Terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions
- The Information Technology Act, 2000, the Consumer Protection Act, 2019, and the Digital Personal Data Protection Act, 2023 shall apply where relevant

Jurisdiction:
- Any disputes arising out of or in connection with these Terms shall be subject to the exclusive jurisdiction of the courts in India
- You agree that any legal action or proceeding shall be brought exclusively in the competent courts located in India

Arbitration:
- Before filing any claim in court, you agree to attempt to resolve the dispute through good-faith negotiation by contacting us at doctorpulseai24@gmail.com
- If the dispute is not resolved within thirty (30) days through negotiation, either party may submit the dispute to binding arbitration in India
- Arbitration shall be conducted in accordance with the Arbitration and Conciliation Act, 1996
- The arbitration shall be conducted in English
- The seat of arbitration shall be in India
- The arbitrator's decision shall be final and binding on both parties

Class Action Waiver:
- You agree to resolve disputes with us on an individual basis only
- You may not bring a claim as a plaintiff or class member in a class action, consolidated action, or representative action
- The arbitrator may not consolidate more than one person's claims and may not preside over any representative or class proceeding

Consumer Protection:
- Nothing in these Terms limits any statutory consumer rights you may have under Indian law, including rights under the Consumer Protection Act, 2019`,
  },
  {
    icon: Scissors,
    title: '17. Changes to Terms',
    content: `Right to Modify:
- DoctorPulse AI reserves the right to modify, amend, or update these Terms at any time at its sole discretion
- Changes may include modifications to subscription pricing, features, or any other aspect of the Service

Notification:
- We will notify you of material changes to these Terms through:
  - In-app notification before the changes take effect
  - Email notification to the address associated with your account
  - Updated "Last Updated" date displayed in the App
- We will provide reasonable advance notice of material changes (typically at least 15 days)

Acceptance of Changes:
- Your continued use of the App after the effective date of any changes constitutes your acceptance of the revised Terms
- If you do not agree with the revised Terms, you must stop using the App and may cancel your subscription in accordance with Section 4

Version History:
- We maintain previous versions of these Terms for your reference
- You may request a copy of any previous version by contacting us at doctorpulseai24@gmail.com`,
  },
  {
    icon: Shield,
    title: '18. Severability',
    content: `If any provision of these Terms is held to be invalid, illegal, void, or unenforceable by a court of competent jurisdiction in India:

- Such provision shall be modified to the minimum extent necessary to make it valid, legal, and enforceable
- If such modification is not possible, the provision shall be severed from these Terms
- The invalidity or unenforceability of any provision shall not affect the validity or enforceability of the remaining provisions
- The remaining provisions of these Terms shall continue in full force and effect
- The parties shall negotiate in good faith to replace the invalid provision with a valid provision that achieves the original intent

This severability clause ensures that the Terms remain enforceable even if individual provisions are found to be invalid.`,
  },
  {
    icon: Mail,
    title: '19. Contact Information',
    content: `If you have any questions, concerns, or requests regarding these Terms of Service, please contact us:

Email: doctorpulseai24@gmail.com

Company: DoctorPulse AI
Subject Line: Terms of Service Inquiry

For specific matters:
- Subscription & Billing: Include "Billing" in the subject line
- Account Issues: Include "Account" in the subject line
- Privacy Concerns: Include "Privacy" in the subject line
- Legal Matters: Include "Legal" in the subject line

We endeavor to respond to all inquiries within 5 business days.

For urgent matters related to food safety or health emergencies, please contact your local health authority or emergency services immediately. Do not rely on the App for emergency situations.`,
  },
]

// ━━━ Icon color mapping for visual variety ━━━
const iconColors: string[] = [
  'text-primary',          // 1. Acceptance of Terms
  'text-safe',             // 2. Description of Service
  'text-warn',             // 3. Medical Disclaimer
  'text-primary',          // 4. Subscription & Payments
  'text-safe',             // 5. User Accounts
  'text-danger',           // 6. Acceptable Use
  'text-primary',          // 7. User-Generated Content
  'text-safe',             // 8. AI Analysis Disclaimer
  'text-warn',             // 9. Intellectual Property
  'text-primary',          // 10. Limitation of Liability
  'text-pink-400',         // 11. Indemnification
  'text-safe',             // 12. Termination
  'text-primary',          // 13. Data Privacy
  'text-primary',          // 14. Children's Use
  'text-primary',          // 15. Third-Party Services
  'text-primary',          // 16. Dispute Resolution
  'text-warn',             // 17. Changes to Terms
  'text-safe',             // 18. Severability
  'text-primary',          // 19. Contact Information
]

const iconBgs: string[] = [
  'bg-primary/10',         // 1. Acceptance of Terms
  'bg-safe/10',            // 2. Description of Service
  'bg-warn/10',            // 3. Medical Disclaimer
  'bg-primary/10',         // 4. Subscription & Payments
  'bg-safe/10',            // 5. User Accounts
  'bg-danger/10',          // 6. Acceptable Use
  'bg-primary/10',         // 7. User-Generated Content
  'bg-safe/10',            // 8. AI Analysis Disclaimer
  'bg-warn/10',            // 9. Intellectual Property
  'bg-primary/10',         // 10. Limitation of Liability
  'bg-pink-400/10',        // 11. Indemnification
  'bg-safe/10',            // 12. Termination
  'bg-primary/10',         // 13. Data Privacy
  'bg-primary/10',         // 14. Children's Use
  'bg-primary/10',         // 15. Third-Party Services
  'bg-primary/10',         // 16. Dispute Resolution
  'bg-warn/10',            // 17. Changes to Terms
  'bg-safe/10',            // 18. Severability
  'bg-primary/10',         // 19. Contact Information
]

export function TermsScreen() {
  const { navigateBack } = useAppStore()

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-4 px-4 pt-4 pb-6"
    >
      {/* ━━━ Header ━━━ */}
      <motion.div variants={item} className="flex items-center gap-3">
        <button
          onClick={navigateBack}
          className="h-9 w-9 rounded-xl bg-muted/50 flex items-center justify-center hover:bg-muted transition-colors tap-feedback"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-bold tracking-tight">Terms of Service</h1>
          <p className="text-xs text-muted-foreground">Your agreement with SafeEat AI</p>
        </div>
        <div className="p-2 rounded-xl gradient-primary">
          <FileText className="h-4 w-4 text-primary-foreground" />
        </div>
      </motion.div>

      {/* ━━━ Introduction Hero Card ━━━ */}
      <motion.div variants={item}>
        <div className="glass-card-elevated p-5 glow-primary">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 rounded-xl gradient-primary">
              <FileText className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-sm font-bold premium-gradient-text">Your Rights & Responsibilities</h2>
              <p className="text-[11px] text-muted-foreground">Understanding the terms that govern SafeEat AI.</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            These Terms of Service define the legal agreement between you and DoctorPulse AI for the use of the SafeEat AI application. Please read them carefully before using our services. By using SafeEat AI, you acknowledge that you have read, understood, and agree to be bound by these Terms.
          </p>
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border/20">
            <Clock className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-[11px] text-muted-foreground">Last Updated: January 2025</span>
          </div>
        </div>
      </motion.div>

      {/* ━━━ Quick Summary ━━━ */}
      <motion.div variants={item}>
        <div className="glass-card p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1.5 rounded-lg bg-safe/10">
              <CheckCircle2 className="h-3.5 w-3.5 text-safe" />
            </div>
            <span className="text-xs font-bold">Key Points</span>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            {[
              { label: 'Not Medical Advice', icon: AlertTriangle, color: 'text-warn' },
              { label: '₹299/mo or ₹1,999/yr', icon: CreditCard, color: 'text-primary' },
              { label: 'Indian Law Applies', icon: Scale, color: 'text-safe' },
              { label: 'Cancel Anytime', icon: Scissors, color: 'text-warn' },
            ].map((point) => {
              const Icon = point.icon
              return (
                <div
                  key={point.label}
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-muted/20 border border-border/20"
                >
                  <Icon className={`h-3.5 w-3.5 ${point.color} shrink-0`} />
                  <span className="text-[11px] font-medium leading-tight">{point.label}</span>
                </div>
              )
            })}
          </div>
        </div>
      </motion.div>

      {/* ━━━ Terms Sections ━━━ */}
      {termsSections.map((section, index) => {
        const Icon = section.icon
        return (
          <motion.div key={section.title} variants={item}>
            <div className="glass-card p-4">
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-xl ${iconBgs[index]} shrink-0`}>
                  <Icon className={`h-4 w-4 ${iconColors[index]}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold mb-2">{section.title}</h3>
                  <div className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line">
                    {section.content}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )
      })}

      {/* ━━━ Contact Card ━━━ */}
      <motion.div variants={item}>
        <a
          href="mailto:doctorpulseai24@gmail.com?subject=SafeEat%20AI%20Terms%20of%20Service%20Inquiry"
          className="glass-card p-4 flex items-center gap-3 tap-feedback block"
        >
          <div className="p-2 rounded-xl bg-primary/10 shrink-0">
            <Mail className="h-4 w-4 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold">Terms & Legal Inquiries</p>
            <p className="text-[11px] text-primary truncate">doctorpulseai24@gmail.com</p>
          </div>
          <Badge variant="outline" className="text-[10px] border-primary/30 text-primary shrink-0">
            Email Us
          </Badge>
        </a>
      </motion.div>

      {/* ━━━ Trust Badge ━━━ */}
      <motion.div variants={item}>
        <div className="glass-card-elevated p-5 text-center glow-safe">
          <div className="flex justify-center mb-3">
            <div className="p-3 rounded-2xl gradient-safe animate-pulse-glow">
              <Shield className="h-7 w-7 text-primary-foreground" />
            </div>
          </div>
          <h3 className="text-sm font-bold premium-gradient-text">By using SafeEat AI, you agree to these terms</h3>
          <p className="text-[11px] text-muted-foreground mt-1.5 leading-relaxed">
            We are committed to transparency and fairness. These terms protect both you and DoctorPulse AI, ensuring a safe and reliable experience for all users.
          </p>
          <div className="flex items-center justify-center gap-3 mt-3 pt-3 border-t border-border/20">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-safe" />
              <span className="text-[10px] font-semibold text-safe">Transparent</span>
            </div>
            <div className="w-px h-3 bg-border/30" />
            <div className="flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5 text-primary" />
              <span className="text-[10px] font-semibold text-primary">Fair</span>
            </div>
            <div className="w-px h-3 bg-border/30" />
            <div className="flex items-center gap-1.5">
              <Heart className="h-3.5 w-3.5 text-danger" />
              <span className="text-[10px] font-semibold text-danger">Trusted</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ━━━ Footer ━━━ */}
      <motion.div variants={item} className="text-center pt-2">
        <p className="text-[11px] text-muted-foreground/50">
          &copy; 2025 DoctorPulse AI. All rights reserved.
        </p>
      </motion.div>
    </motion.div>
  )
}

'use client'

import { motion } from 'framer-motion'
import { useAppStore } from '@/lib/store'
import {
  ChevronLeft, Shield, Lock, Eye, Database, Users, Globe,
  Mail, Heart, CheckCircle2, Clock, FileText, Baby, Scale, Smartphone
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

// ━━━ Privacy Policy Sections ━━━
const privacySections = [
  {
    icon: Eye,
    title: '1. Information We Collect',
    content: `Information You Provide:
- Name, email address, and phone number (during registration)
- Health preferences (allergies, dietary restrictions, health goals)
- Scanned product data and ingredients

Automatically Collected Information:
- Device information (model, OS version)
- App usage data and crash reports
- Camera access (only when scanning, images are processed and not stored on our servers)`,
  },
  {
    icon: Database,
    title: '2. How We Use Your Information',
    content: `- To provide and improve our food safety analysis services
- To personalize your experience based on health preferences
- To send important notifications about product safety alerts
- To improve app performance and user experience
- To process subscription payments via Google Play Billing`,
  },
  {
    icon: Lock,
    title: '3. Data Storage & Security',
    content: `- Your data is stored securely with industry-standard encryption
- We implement appropriate technical and organizational measures to protect your data
- Health preference data is encrypted both in transit and at rest
- Scanned images are processed in real-time and are not permanently stored on our servers`,
  },
  {
    icon: Users,
    title: '4. Data Sharing',
    content: `- We do NOT sell, trade, or rent your personal information to third parties
- We may share anonymized, aggregated data for research purposes
- We may disclose information if required by law or to protect our rights
- Payment processing is handled by Google Play Billing (subject to Google's Privacy Policy)`,
  },
  {
    icon: Shield,
    title: '5. Your Rights',
    content: `- You can access, update, or delete your personal data at any time through the App settings
- You can opt out of non-essential notifications
- You can request complete data deletion by contacting us
- You can export your data in a portable format`,
  },
  {
    icon: Heart,
    title: "6. Children's Privacy",
    content: `SafeEat AI can be used by families, but we do not knowingly collect personal information from children under 13 without parental consent. Parents can review and delete their child's information by contacting us.`,
  },
  {
    icon: FileText,
    title: '7. Cookies & Tracking',
    content: `We use minimal analytics to improve app performance. We do not use third-party advertising cookies. Any analytics data collected is anonymized and aggregated.`,
  },
  {
    icon: Globe,
    title: '8. Third-Party Services',
    content: `- Google Play Billing: Payment processing is subject to Google's Privacy Policy
- AI Analysis: Our AI models process ingredient data without storing personal identifiers`,
  },
  {
    icon: Baby,
    title: '9. Special Protections for Health Data',
    content: `- Health-related data (allergies, dietary restrictions, medical conditions) is treated as sensitive personal data under applicable law
- We apply enhanced security measures including encryption at rest and in transit for all health data
- Health data is only used to provide personalized food safety analysis and alerts
- You may withdraw consent for health data processing at any time, though this may limit app functionality
- We conduct regular security assessments to ensure health data protection`,
  },
  {
    icon: Scale,
    title: '10. GDPR Compliance (EU Users)',
    content: `If you are a resident of the European Economic Area (EEA), you have the following rights:
- Right to Access: Request a copy of your personal data
- Right to Rectification: Request correction of inaccurate data
- Right to Erasure: Request deletion of your personal data ("Right to be Forgotten")
- Right to Data Portability: Receive your data in a structured, machine-readable format
- Right to Object: Object to processing of your personal data
- Right to Restrict Processing: Request limitation of data processing
- Right to Withdraw Consent: Withdraw consent at any time

To exercise these rights, contact our Data Protection Officer at doctorpulseai24@gmail.com`,
  },
  {
    icon: Globe,
    title: '11. Indian Data Protection (DPDP Act 2023)',
    content: `In compliance with the Digital Personal Data Protection Act, 2023:
- We serve as the Data Fiduciary for your personal data
- You have the right to access, correct, and erase your personal data
- We obtain your consent before processing personal data, except as permitted by law
- You may nominate another individual to exercise your data rights in case of death or incapacity
- Grievance redressal: Contact our Grievance Officer at doctorpulseai24@gmail.com
- We do not transfer your personal data outside India without your explicit consent or as permitted by law`,
  },
  {
    icon: Shield,
    title: '12. CCPA Compliance (California Users)',
    content: `Under the California Consumer Privacy Act (CCPA), California residents have the right to:
- Know what personal information is collected about them
- Request deletion of their personal information
- Opt out of the sale of personal information (we do NOT sell personal information)
- Not be discriminated against for exercising their privacy rights
- Request access to specific pieces of personal information

We do not sell, rent, or trade your personal information to third parties.`,
  },
  {
    icon: Smartphone,
    title: '13. Camera & Device Permissions',
    content: `SafeEat AI requests the following device permissions:
- Camera: Used exclusively for scanning food labels and products. Images are processed in real-time and are NOT stored on our servers after analysis
- Storage: Used to cache scan results and preferences locally on your device
- Internet: Required for AI analysis and cloud processing
- Notifications: Used for safety alerts and product recalls (can be disabled)

You may revoke any permission at any time through your device Settings. Revoking permissions may limit certain app features.`,
  },
  {
    icon: Lock,
    title: '14. Data Breach Notification',
    content: `In the event of a data breach that may affect your personal information:
- We will notify affected users within 72 hours of becoming aware of the breach
- Notifications will be sent via email and/or in-app notification
- We will provide details of the breach, affected data types, and remedial actions
- We will report the breach to relevant data protection authorities as required by law
- We will take immediate steps to contain and remediate the breach`,
  },
  {
    icon: Database,
    title: '15. Data Retention',
    content: `We retain your data for as long as your account is active or as needed to provide services. Upon account deletion, all personal data is permanently removed within 30 days.`,
  },
  {
    icon: Globe,
    title: '16. International Data Transfers',
    content: `Your data may be processed in countries other than your own. We ensure appropriate safeguards are in place for international transfers.`,
  },
  {
    icon: Shield,
    title: '17. Changes to This Policy',
    content: `We may update this Privacy Policy periodically. We will notify you of significant changes through the App or via email.`,
  },
  {
    icon: Mail,
    title: '18. Contact Us',
    content: `If you have questions about this Privacy Policy or your data, please contact:
Email: doctorpulseai24@gmail.com

Data Protection Officer: doctorpulseai24@gmail.com`,
  },
]

// ━━━ Icon color mapping for visual variety ━━━
const iconColors: string[] = [
  'text-primary',      // 1. Info We Collect
  'text-safe',         // 2. How We Use
  'text-primary',      // 3. Data Storage
  'text-warn',         // 4. Data Sharing
  'text-safe',         // 5. Your Rights
  'text-pink-400',     // 6. Children's Privacy
  'text-muted-foreground', // 7. Cookies
  'text-primary',      // 8. Third-Party
  'text-pink-400',     // 9. Health Data
  'text-primary',      // 10. GDPR
  'text-primary',      // 11. DPDP Act
  'text-safe',         // 12. CCPA
  'text-primary',      // 13. Camera & Device
  'text-warn',         // 14. Data Breach
  'text-warn',         // 15. Data Retention
  'text-primary',      // 16. Int'l Transfers
  'text-safe',         // 17. Changes
  'text-primary',      // 18. Contact
]

const iconBgs: string[] = [
  'bg-primary/10',
  'bg-safe/10',
  'bg-primary/10',
  'bg-warn/10',
  'bg-safe/10',
  'bg-pink-400/10',
  'bg-muted/50',
  'bg-primary/10',
  'bg-pink-400/10',    // 9. Health Data
  'bg-primary/10',    // 10. GDPR
  'bg-primary/10',    // 11. DPDP Act
  'bg-safe/10',       // 12. CCPA
  'bg-primary/10',    // 13. Camera & Device
  'bg-warn/10',       // 14. Data Breach
  'bg-warn/10',       // 15. Data Retention
  'bg-primary/10',    // 16. Int'l Transfers
  'bg-safe/10',       // 17. Changes
  'bg-primary/10',    // 18. Contact
]

export function PrivacyPolicyScreen() {
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
          <h1 className="text-xl font-bold tracking-tight">Privacy Policy</h1>
          <p className="text-xs text-muted-foreground">How we protect your data</p>
        </div>
        <div className="p-2 rounded-xl gradient-safe">
          <Shield className="h-4 w-4 text-primary-foreground" />
        </div>
      </motion.div>

      {/* ━━━ Introduction Hero Card ━━━ */}
      <motion.div variants={item}>
        <div className="glass-card-elevated p-5 glow-primary">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 rounded-xl gradient-primary">
              <Lock className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-sm font-bold premium-gradient-text">Your Privacy Matters</h2>
              <p className="text-[11px] text-muted-foreground">SafeEat AI is committed to protecting your privacy.</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            This Privacy Policy explains how we collect, use, and safeguard your personal information when you use our mobile application. We believe in transparency and give you full control over your data.
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
            <span className="text-xs font-bold">At a Glance</span>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            {[
              { label: 'Data Encrypted', icon: Lock, color: 'text-safe' },
              { label: 'No Data Selling', icon: Shield, color: 'text-primary' },
              { label: 'You Own Your Data', icon: Users, color: 'text-warn' },
              { label: 'GDPR Compliant', icon: Globe, color: 'text-primary' },
              { label: 'DPDP Act 2023', icon: Scale, color: 'text-warn' },
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

      {/* ━━━ Privacy Sections ━━━ */}
      {privacySections.map((section, index) => {
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
          href="mailto:doctorpulseai24@gmail.com?subject=SafeEat%20AI%20Privacy%20Inquiry"
          className="glass-card p-4 flex items-center gap-3 tap-feedback block"
        >
          <div className="p-2 rounded-xl bg-primary/10 shrink-0">
            <Mail className="h-4 w-4 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold">Data Protection Officer</p>
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
          <h3 className="text-sm font-bold premium-gradient-text">Your Data Is Safe With Us</h3>
          <p className="text-[11px] text-muted-foreground mt-1.5 leading-relaxed">
            We never sell, trade, or share your personal information with third parties. Your trust is our top priority.
          </p>
          <div className="flex items-center justify-center gap-3 mt-3 pt-3 border-t border-border/20">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-safe" />
              <span className="text-[10px] font-semibold text-safe">Encrypted</span>
            </div>
            <div className="w-px h-3 bg-border/30" />
            <div className="flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5 text-primary" />
              <span className="text-[10px] font-semibold text-primary">Secure</span>
            </div>
            <div className="w-px h-3 bg-border/30" />
            <div className="flex items-center gap-1.5">
              <Heart className="h-3.5 w-3.5 text-danger" />
              <span className="text-[10px] font-semibold text-danger">Protected</span>
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

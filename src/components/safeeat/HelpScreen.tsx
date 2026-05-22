'use client'

import { motion } from 'framer-motion'
import { useAppStore } from '@/lib/store'
import {
  ArrowLeft, Mail, MessageCircle, ChevronDown, ChevronRight,
  Shield, FileText, Lock, HelpCircle, ExternalLink,
  Heart, Clock, CheckCircle2, AlertCircle
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useState } from 'react'
import { cn } from '@/lib/utils'

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
}

type HelpTab = 'faq' | 'contact' | 'terms' | 'privacy'

const faqItems = [
  {
    question: 'How does SafeEat AI scan food products?',
    answer: 'Simply point your camera at any food product barcode or ingredient list, and our AI will instantly analyze it for harmful ingredients, allergens, and safety ratings. You can also type or paste ingredients manually.',
  },
  {
    question: 'What does the safety score mean?',
    answer: 'Our safety score ranges from 0-100 and is calculated based on the presence of harmful additives, allergens, artificial preservatives, and nutritional value. A score above 70 is considered safe, 40-70 is moderate, and below 40 indicates potential health risks.',
  },
  {
    question: 'Is my personal health data secure?',
    answer: 'Absolutely. All your health data, allergies, and dietary preferences are encrypted and stored securely on your device. We never share your personal information with third parties. Our privacy practices comply with applicable data protection laws.',
  },
  {
    question: 'How do I set up my allergy preferences?',
    answer: 'Go to Profile → Edit → My Allergies and select the allergens that apply to you. SafeEat AI will then flag any products containing those allergens during every scan.',
  },
  {
    question: 'What subscription plans are available?',
    answer: 'We offer two plans through Google Play Billing: Monthly Plan at ₹299/month (with ads) and Yearly Plan at ₹1,999/year (ad-free). Premium unlocks unlimited scans, combination analysis, medicine interaction checks, and more.',
  },
  {
    question: 'Can I scan medicine for safety?',
    answer: 'Yes! Our Medicine Scanner checks for expired medicines, harmful drug interactions, and provides safety information. This feature is available for Premium subscribers.',
  },
  {
    question: 'How does the food combination checker work?',
    answer: 'The combination checker analyzes whether two or more food items are safe to eat together based on Ayurvedic principles, modern nutrition science, and known food interactions that may cause digestive issues or reduce nutrient absorption.',
  },
  {
    question: 'Is SafeEat AI suitable for pregnant women?',
    answer: 'Yes! We have a dedicated Pregnancy Mode that specifically checks foods for ingredients that may be harmful during pregnancy, such as raw fish, unpasteurized dairy, excessive caffeine, and certain artificial additives.',
  },
  {
    question: 'How do I cancel my subscription?',
    answer: 'You can manage and cancel your subscription directly through Google Play Store: Go to Play Store → Profile → Payments & subscriptions → Subscriptions → SafeEat AI → Cancel. Your premium access continues until the end of the billing period.',
  },
  {
    question: 'Does the app work offline?',
    answer: 'Basic scanning requires an internet connection for AI analysis. However, your scan history and saved reports are available offline. We recommend staying connected for the best experience.',
  },
]

const termsContent = `TERMS & CONDITIONS

Last Updated: January 2025

1. ACCEPTANCE OF TERMS
By downloading and using SafeEat AI ("the App"), you agree to be bound by these Terms & Conditions. If you do not agree with any part of these terms, you must not use the App.

2. DESCRIPTION OF SERVICE
SafeEat AI is an AI-powered food safety analysis application that helps users identify harmful ingredients, allergens, and potential health risks in food products and medicines. The App provides safety scores, ingredient analysis, and health recommendations.

3. MEDICAL DISCLAIMER
The information provided by SafeEat AI is for general informational purposes only and should NOT be considered as medical advice, diagnosis, or treatment. Always consult a qualified healthcare professional before making any health-related decisions. Do not ignore professional medical advice or delay seeking it because of information obtained from this App.

4. SUBSCRIPTION & PAYMENTS
4.1 All payments are processed through Google Play Billing.
4.2 Subscription plans: Monthly (₹299/month) and Yearly (₹1,999/year).
4.3 Subscriptions auto-renew unless cancelled at least 24 hours before the end of the current period.
4.4 Cancellation can be done through Google Play Store settings.
4.5 No refunds are provided for partial billing periods.

5. USER ACCOUNTS
5.1 You are responsible for maintaining the confidentiality of your account.
5.2 You must provide accurate and complete information when creating your account.
5.3 You are responsible for all activities under your account.

6. ACCEPTABLE USE
6.1 You agree not to misuse the App or help anyone else do so.
6.2 You will not reverse-engineer, decompile, or disassemble the App.
6.3 You will not use the App for any unlawful purpose.
6.4 You will not attempt to gain unauthorized access to any part of the App.

7. INTELLECTUAL PROPERTY
All content, features, and functionality of SafeEat AI are owned by SafeEat AI and are protected by international copyright, trademark, and other intellectual property laws.

8. LIMITATION OF LIABILITY
SafeEat AI shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the App. The App is provided "as is" without warranties of any kind.

9. DATA PRIVACY
Your use of the App is also governed by our Privacy Policy, which is incorporated into these Terms by reference.

10. CHANGES TO TERMS
We may update these Terms from time to time. Continued use of the App after changes constitutes acceptance of the updated Terms.

11. CONTACT
For any questions regarding these Terms, please contact us at:
Email: doctorpulseai24@gmail.com`

const privacyContent = `PRIVACY POLICY

Last Updated: January 2025

1. INTRODUCTION
SafeEat AI ("we", "our", "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your personal information when you use our mobile application.

2. INFORMATION WE COLLECT
2.1 Information You Provide:
- Name, email address, and phone number (during registration)
- Health preferences (allergies, dietary restrictions, health goals)
- Scanned product data and ingredients

2.2 Automatically Collected Information:
- Device information (model, OS version)
- App usage data and crash reports
- Camera access (only when scanning, images are processed and not stored on our servers)

3. HOW WE USE YOUR INFORMATION
3.1 To provide and improve our food safety analysis services
3.2 To personalize your experience based on health preferences
3.3 To send important notifications about product safety alerts
3.4 To improve app performance and user experience
3.5 To process subscription payments via Google Play Billing

4. DATA STORAGE & SECURITY
4.1 Your data is stored securely with industry-standard encryption
4.2 We implement appropriate technical and organizational measures to protect your data
4.3 Health preference data is encrypted both in transit and at rest
4.4 Scanned images are processed in real-time and are not permanently stored on our servers

5. DATA SHARING
5.1 We do NOT sell, trade, or rent your personal information to third parties
5.2 We may share anonymized, aggregated data for research purposes
5.3 We may disclose information if required by law or to protect our rights
5.4 Payment processing is handled by Google Play Billing (subject to Google's Privacy Policy)

6. YOUR RIGHTS
6.1 You can access, update, or delete your personal data at any time through the App settings
6.2 You can opt out of non-essential notifications
6.3 You can request complete data deletion by contacting us
6.4 You can export your data in a portable format

7. CHILDREN'S PRIVACY
SafeEat AI can be used by families, but we do not knowingly collect personal information from children under 13 without parental consent. Parents can review and delete their child's information by contacting us.

8. COOKIES & TRACKING
We use minimal analytics to improve app performance. We do not use third-party advertising cookies. Any analytics data collected is anonymized and aggregated.

9. THIRD-PARTY SERVICES
9.1 Google Play Billing: Payment processing is subject to Google's Privacy Policy
9.2 AI Analysis: Our AI models process ingredient data without storing personal identifiers

10. DATA RETENTION
We retain your data for as long as your account is active or as needed to provide services. Upon account deletion, all personal data is permanently removed within 30 days.

11. INTERNATIONAL DATA TRANSFERS
Your data may be processed in countries other than your own. We ensure appropriate safeguards are in place for international transfers.

12. CHANGES TO THIS POLICY
We may update this Privacy Policy periodically. We will notify you of significant changes through the App or via email.

13. CONTACT US
If you have questions about this Privacy Policy or your data, please contact:
Email: doctorpulseai24@gmail.com

Data Protection Officer: doctorpulseai24@gmail.com`

export function HelpScreen() {
  const { setCurrentScreen } = useAppStore()
  const [activeTab, setActiveTab] = useState<HelpTab>('faq')
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)

  const tabs: { key: HelpTab; label: string; icon: React.ElementType }[] = [
    { key: 'faq', label: 'FAQ', icon: HelpCircle },
    { key: 'contact', label: 'Contact', icon: MessageCircle },
    { key: 'terms', label: 'Terms', icon: FileText },
    { key: 'privacy', label: 'Privacy', icon: Lock },
  ]

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-4 px-4 pt-4 pb-6"
    >
      {/* Header */}
      <motion.div variants={item} className="flex items-center gap-3">
        <button
          onClick={() => setCurrentScreen('profile')}
          className="h-9 w-9 rounded-xl bg-muted/50 flex items-center justify-center hover:bg-muted transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <h1 className="text-xl font-bold tracking-tight">Help & Support</h1>
          <p className="text-xs text-muted-foreground">We&apos;re here to help you</p>
        </div>
      </motion.div>

      {/* Tab Selector */}
      <motion.div variants={item}>
        <div className="flex gap-1.5 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
          {tabs.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={cn(
                'shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all',
                activeTab === key
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'bg-muted/50 text-muted-foreground hover:bg-muted'
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* FAQ Tab */}
      {activeTab === 'faq' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-2.5"
        >
          <Card className="p-4 border-primary/20 bg-primary/5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-primary/10">
                <HelpCircle className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold">Frequently Asked Questions</p>
                <p className="text-xs text-muted-foreground">Find quick answers to common questions</p>
              </div>
            </div>
          </Card>

          {faqItems.map((faq, index) => (
            <Card key={index} className="border-border/50 overflow-hidden">
              <button
                className="w-full flex items-center gap-3 p-3.5 text-left hover:bg-muted/30 transition-colors"
                onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
              >
                <div className={cn(
                  'shrink-0 h-6 w-6 rounded-lg flex items-center justify-center text-[10px] font-bold transition-colors',
                  expandedFaq === index ? 'bg-primary text-primary-foreground' : 'bg-muted/50 text-muted-foreground'
                )}>
                  {index + 1}
                </div>
                <span className="text-sm font-medium flex-1">{faq.question}</span>
                <ChevronDown className={cn(
                  'h-4 w-4 text-muted-foreground transition-transform shrink-0',
                  expandedFaq === index && 'rotate-180'
                )} />
              </button>
              {expandedFaq === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  className="px-3.5 pb-3.5"
                >
                  <div className="pl-9 text-sm text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </div>
                </motion.div>
              )}
            </Card>
          ))}
        </motion.div>
      )}

      {/* Contact Tab */}
      {activeTab === 'contact' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-3"
        >
          {/* Contact Email */}
          <Card className="p-4 border-primary/20 bg-primary/5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-primary/10">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold">Email Support</p>
                <p className="text-xs text-muted-foreground">We typically respond within 24 hours</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 border-border/50">
            <div className="flex items-center gap-3 mb-3">
              <Mail className="h-4 w-4 text-primary" />
              <p className="text-sm font-semibold">Send us an email</p>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              For any questions, feedback, or issues, reach out to our support team:
            </p>
            <a
              href="mailto:doctorpulseai24@gmail.com?subject=SafeEat%20AI%20Support%20Request"
              className="flex items-center gap-2 p-3 rounded-xl bg-primary/10 border border-primary/20 hover:bg-primary/15 transition-colors"
            >
              <Mail className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">doctorpulseai24@gmail.com</span>
              <ExternalLink className="h-3.5 w-3.5 text-primary ml-auto" />
            </a>
          </Card>

          {/* Quick Help Topics */}
          <Card className="p-4 border-border/50">
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="h-4 w-4 text-amber-500" />
              <p className="text-sm font-semibold">Common Issues</p>
            </div>
            <div className="flex flex-col gap-2">
              {[
                { title: 'Camera not working', desc: 'Ensure camera permissions are enabled in Settings' },
                { title: 'Subscription not activating', desc: 'Restart the app and check Google Play purchases' },
                { title: 'Scan results inaccurate', desc: 'Ensure good lighting and clear image of ingredients' },
                { title: 'App crashing', desc: 'Update to latest version from Google Play Store' },
              ].map((issue, i) => (
                <div key={i} className="flex items-start gap-2.5 p-2.5 rounded-lg bg-muted/30">
                  <CheckCircle2 className="h-4 w-4 text-safe mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-semibold">{issue.title}</p>
                    <p className="text-[11px] text-muted-foreground">{issue.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Response Time */}
          <Card className="p-4 border-border/50">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-safe/10">
                <Clock className="h-4 w-4 text-safe" />
              </div>
              <div>
                <p className="text-sm font-semibold">Average Response Time</p>
                <p className="text-xs text-muted-foreground">We aim to respond within 24 hours on business days</p>
              </div>
            </div>
          </Card>

          {/* App Info */}
          <Card className="p-4 border-border/50">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-muted/50">
                <Shield className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold">App Version</p>
                <p className="text-xs text-muted-foreground">SafeEat AI v1.0.0</p>
              </div>
              <Badge variant="outline" className="text-[10px]">Stable</Badge>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Terms Tab */}
      {activeTab === 'terms' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-3"
        >
          <Card className="p-4 border-primary/20 bg-primary/5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-primary/10">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold">Terms & Conditions</p>
                <p className="text-xs text-muted-foreground">Last updated: January 2025</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 border-border/50">
            <div className="max-h-[60vh] overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin' }}>
              <div className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line">
                {termsContent}
              </div>
            </div>
          </Card>

          <Card className="p-4 border-border/50">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-primary" />
              <div className="flex-1">
                <p className="text-xs font-medium">Questions about our terms?</p>
                <p className="text-[11px] text-muted-foreground">Contact us at doctorpulseai24@gmail.com</p>
              </div>
              <a
                href="mailto:doctorpulseai24@gmail.com?subject=Terms%20%26%20Conditions%20Inquiry"
                className="text-primary"
              >
                <ChevronRight className="h-4 w-4" />
              </a>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Privacy Tab */}
      {activeTab === 'privacy' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-3"
        >
          <Card className="p-4 border-primary/20 bg-primary/5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-primary/10">
                <Lock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold">Privacy Policy</p>
                <p className="text-xs text-muted-foreground">Last updated: January 2025</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 border-border/50">
            <div className="max-h-[60vh] overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin' }}>
              <div className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line">
                {privacyContent}
              </div>
            </div>
          </Card>

          <Card className="p-4 border-border/50">
            <div className="flex items-center gap-3">
              <Shield className="h-4 w-4 text-safe" />
              <div className="flex-1">
                <p className="text-xs font-medium">Your data is safe with us</p>
                <p className="text-[11px] text-muted-foreground">We never sell or share your personal information</p>
              </div>
              <Heart className="h-4 w-4 text-danger" />
            </div>
          </Card>

          <Card className="p-4 border-border/50">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-primary" />
              <div className="flex-1">
                <p className="text-xs font-medium">Privacy concerns?</p>
                <p className="text-[11px] text-muted-foreground">Contact our Data Protection Officer</p>
              </div>
              <a
                href="mailto:doctorpulseai24@gmail.com?subject=Privacy%20Policy%20Inquiry"
                className="text-primary"
              >
                <ChevronRight className="h-4 w-4" />
              </a>
            </div>
          </Card>
        </motion.div>
      )}
    </motion.div>
  )
}

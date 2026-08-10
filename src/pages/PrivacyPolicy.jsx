import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

const PolicyPage = ({ pageSlug, defaultTitle, defaultContent }) => {
  const [content, setContent] = useState(null);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/users/public/pages/${pageSlug}/`)
      .then(res => setContent(res.data))
      .catch(() => setContent({
        title: defaultTitle,
        content: defaultContent,
      }));
  }, [pageSlug, defaultTitle, defaultContent]);

  if (!content) {
    return (
      <div className="min-h-screen pt-16 sm:pt-18 md:pt-20 px-4 sm:px-6 md:px-8 text-white">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-yellow-400 mb-6">Loading...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 sm:pt-18 md:pt-20 px-4 sm:px-6 md:px-8 text-white">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-yellow-400 mb-6">{content.title}</h1>
        <div className="bg-gray-900/80 backdrop-blur-sm p-6 sm:p-8 md:p-10 rounded-3xl border border-gray-800">
          <div className="prose prose-invert prose-gray max-w-none" dangerouslySetInnerHTML={{ __html: content.content.replace(/\n/g, '<br/>') }} />
        </div>
      </div>
    </div>
  );
};

export const PrivacyPolicy = () => PolicyPage({ pageSlug: 'privacy-policy', defaultTitle: 'Privacy Policy', defaultContent: `
## Privacy Policy

**Last Updated: July 2026**

### 1. Introduction
Welcome to United Kingdom of Great Igbo Nation (UKGIN). This Privacy Policy explains how we collect, use, and protect your personal information when you use our website, services, and community platforms.

### 2. Information We Collect
- **Personal Information**: Name, email address, phone number, address, date of birth, and any information you provide during registration.
- **Usage Information**: IP address, browser type, pages visited, and interaction data.
- **Communication Data**: Messages, feedback, and responses you provide through our contact forms, support tickets, and other channels.

### 3. How We Use Your Information
- To create and manage your membership account.
- To communicate with you about updates, events, and news.
- To process donations, payments, and membership fees.
- To provide and improve our services.
- To comply with legal obligations.

### 4. Data Sharing and Disclosure
We do not sell your personal data. We may share information with:
- Service providers (payment processors, email services, analytics).
- Legal authorities when required by law.
- Other members only as necessary for community functions.

### 5. Your Rights
- Access and update your personal data.
- Request deletion of your account.
- Opt out of marketing communications.
- File a complaint with relevant data protection authorities.

### 6. Data Security
We implement industry-standard security measures to protect your data, including encryption, secure servers, and regular security audits.

### 7. Cookies
We use cookies to enhance your experience. See our Cookie Policy for details.

### 8. Changes to This Policy
We may update this policy. Any changes will be posted on this page.

### 9. Contact Us
For privacy-related questions, contact us at privacy@ukgin.org.
`.trim() });

export const TermsConditions = () => PolicyPage({ pageSlug: 'terms-conditions', defaultTitle: 'Terms & Conditions', defaultContent: `
## Terms & Conditions

**Last Updated: July 2026**

### 1. Acceptance of Terms
By accessing or using the United Kingdom of Great Igbo Nation (UKGIN) website, services, or community platforms, you agree to be bound by these Terms & Conditions.

### 2. Membership
- Membership is open to individuals of Igbo descent who support our mission.
- You must provide accurate information during registration.
- You are responsible for maintaining the confidentiality of your account credentials.

### 3. Community Guidelines
- Treat all members with respect and dignity.
- No hate speech, discrimination, or harassment.
- No spam, self-promotion, or solicitation without permission.
- Respect intellectual property rights.

### 4. Content
- You retain ownership of content you submit.
- By posting, you grant us a license to display your content within the community.
- We may remove content that violates our guidelines.

### 5. Donations and Payments
- All donations are voluntary and non-refundable unless otherwise stated.
- Payment processing is handled by third-party providers.

### 6. Events and Activities
- Event registration may require fees unless stated otherwise.
- We reserve the right to modify, cancel, or reschedule events.

### 7. Intellectual Property
All trademarks, logos, and branding are the property of UKGIN.

### 8. Disclaimer
Our services are provided "as is" without warranties of any kind.

### 9. Governing Law
These terms are governed by the laws of the United Kingdom and Nigeria.

### 10. Contact
For questions regarding these terms, contact us at legal@ukgin.org.
`.trim() });

export const CookiePolicy = () => PolicyPage({ pageSlug: 'cookie-policy', defaultTitle: 'Cookie Policy', defaultContent: `
## Cookie Policy

**Last Updated: July 2026**

### 1. What Are Cookies?
Cookies are small text files stored on your device when you visit websites. They help websites function and provide information to site owners.

### 2. How We Use Cookies
We use cookies to:
- Remember your preferences and settings.
- Authenticate your account and prevent fraud.
- Analyze site traffic and performance.
- Enable social media features.
- Serve personalized content and ads.

### 3. Types of Cookies We Use
- **Essential**: Required for core functionality.
- **Analytics**: Help us understand how visitors interact with our site.
- **Functional**: Enable enhanced features and personalization.
- **Advertising**: Used to deliver relevant ads.

### 4. Third-Party Cookies
We may allow trusted third parties to place cookies on our site, including Google Analytics and social media platforms.

### 5. Your Cookie Choices
You can control and manage cookies in your browser settings. You may refuse cookies at any time, though this may affect site functionality.

### 6. Changes to This Policy
We may update this Cookie Policy. Changes are effective when posted on this page.

### 7. Contact
For cookie-related questions, contact privacy@ukgin.org.
`.trim() });

export const RefundPolicy = () => PolicyPage({ pageSlug: 'refund-policy', defaultTitle: 'Refund Policy', defaultContent: `
## Refund Policy

**Last Updated: July 2026**

### 1. Membership Fees
Membership fees are non-refundable. If you choose not to renew your membership, no refund will be issued for the current membership period.

### 2. Event Registrations
- Full refunds are available for event registrations cancelled **30 days or more** before the event date.
- 50% refunds are available for cancellations made **between 15 and 29 days** before the event.
- No refunds are available for cancellations made **less than 15 days** before the event.

### 3. Donations
All donations are voluntary and final. We do not issue refunds on donations unless required by law or in cases of duplicate/erroneous payments.

### 4. Merchandise and Products
- Returns must be initiated within **30 days** of receipt.
- Items must be unused and in original packaging.
- Refunds will be processed within **7-14 business days**.

### 5. Digital Products and Services
Digital downloads, online courses, and virtual event recordings are non-refundable unless the content is defective.

### 6. How to Request a Refund
Submit a refund request via email to refunds@ukgin.org or via your account dashboard.

### 7. Refund Timeline
Approved refunds will be processed within **7-14 business days** using the original payment method.

### 8. Questions
For refund inquiries, contact refunds@ukgin.org.
`.trim() });

export default PrivacyPolicy;

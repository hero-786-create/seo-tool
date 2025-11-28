
import React from 'react';
import { ViewState } from '../types';
import { ShieldCheck, FileText, Lock, Cookie, AlertCircle, RefreshCcw } from 'lucide-react';

interface Props {
  view: ViewState;
}

const LegalView: React.FC<Props> = ({ view }) => {
  const getContent = () => {
    switch (view) {
      case ViewState.LEGAL_PRIVACY:
        return {
          title: "Privacy Policy",
          icon: Lock,
          content: `(AdSense Friendly)

We value your privacy. This website collects standard analytics data such as IP address, browser type, and usage patterns to improve performance. We also use cookies to personalize content and analyze traffic.

We never sell your personal information.

If you create an account, your email is stored securely and used only for authentication and updates you choose to receive.

Third-party vendors, including Google, use cookies to serve ads. Users may opt out of personalized ads through Google’s Ads Settings.

For questions, contact us at: geniematrics786@gmail.com`
        };
      case ViewState.LEGAL_TERMS:
        return {
          title: "Terms and Conditions",
          icon: FileText,
          content: `By using this website, you agree to follow all applicable laws and our usage rules. Our tools are provided “as is” without guarantees. You may not misuse, copy, or resell any part of this service. Paid plans renew automatically unless canceled.

We reserve the right to update these terms anytime.`
        };
      case ViewState.LEGAL_DISCLAIMER:
        return {
          title: "Disclaimer",
          icon: AlertCircle,
          content: `All SEO data, metrics, and suggestions are estimates meant to guide you. Results may vary depending on your website, competition, and market trends.

We are not responsible for any losses arising from the use of our platform.`
        };
      case ViewState.LEGAL_COOKIE:
        return {
          title: "Cookie Policy",
          icon: Cookie,
          content: `We use cookies to improve your browsing experience. These include essential cookies, analytics cookies, and advertising cookies from third-party partners like Google.

You may disable cookies in your browser settings.`
        };
      case ViewState.LEGAL_DMCA:
        return {
          title: "DMCA Policy",
          icon: ShieldCheck,
          content: `If you believe your copyrighted content has been used on our site without permission, send a takedown request with evidence to: geniematrics786@gmail.com.

We will respond within a reasonable timeframe.`
        };
      case ViewState.LEGAL_REFUND:
        return {
          title: "Refund Policy",
          icon: RefreshCcw,
          content: `All paid plans include a 7-day refund window. Provide your email, payment details, and reason for requesting a refund.

No refunds are issued after 7 days.`
        };
      default:
        return { title: "", icon: FileText, content: "" };
    }
  };

  const { title, icon: Icon, content } = getContent();

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-4 mb-8 border-b border-slate-100 pb-6">
          <div className="p-3 bg-slate-100 rounded-xl">
            <Icon className="w-8 h-8 text-slate-700" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">{title}</h1>
        </div>
        <div className="prose prose-slate max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-p:text-slate-600 prose-p:leading-relaxed whitespace-pre-line">
           {content}
        </div>
      </div>
    </div>
  );
};

export default LegalView;

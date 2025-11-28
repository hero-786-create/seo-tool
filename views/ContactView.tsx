
import React from 'react';
import { Mail, MessageSquare, Clock } from 'lucide-react';

const ContactView: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-slate-100">
        <div className="text-center mb-10">
            <h1 className="text-3xl font-black text-slate-900 mb-2">Contact Us</h1>
            <p className="text-slate-500">Have questions? We'd love to hear from you.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-slate-50 p-8 rounded-xl flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mb-4">
                    <Mail className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="font-bold text-slate-900 mb-2">Email Us</h3>
                <p className="text-slate-600 font-medium mb-1">geniematrics786@gmail.com</p>
                <p className="text-xs text-slate-400">For support, partnerships, and general inquiries.</p>
            </div>

            <div className="bg-slate-50 p-8 rounded-xl flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mb-4">
                    <Clock className="w-6 h-6 text-teal-600" />
                </div>
                <h3 className="font-bold text-slate-900 mb-2">Response Time</h3>
                <p className="text-slate-600 font-medium mb-1">Within 48 Hours</p>
                <p className="text-xs text-slate-400">Our team is available Mon-Fri, 9am - 5pm EST.</p>
            </div>
        </div>
        
        <div className="mt-10 p-6 border border-slate-100 rounded-xl bg-orange-50/50 text-center">
            <p className="text-sm text-slate-600">
                <strong>Need help with your account?</strong> Please include your account email in your message for faster service.
            </p>
        </div>
      </div>
    </div>
  );
};

export default ContactView;

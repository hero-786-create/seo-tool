
import React, { useState } from 'react';
import { CreditCard, Lock, CheckCircle, ShieldCheck, Loader2, ArrowLeft } from 'lucide-react';
import { ViewState } from '../types';

interface Props {
  onSuccess: () => void;
  onCancel: () => void;
}

const CheckoutView: React.FC<Props> = ({ onSuccess, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    cardNumber: '',
    expiry: '',
    cvc: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate payment processing
    setTimeout(() => {
      setLoading(false);
      onSuccess();
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Order Summary */}
        <div className="bg-slate-900 text-white p-8 rounded-2xl shadow-xl flex flex-col justify-between relative overflow-hidden">
           <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-orange-500 rounded-full blur-3xl opacity-20 pointer-events-none"></div>
           
           <div>
             <button onClick={onCancel} className="text-slate-400 hover:text-white flex items-center text-sm mb-8 transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back
             </button>
             <h2 className="text-2xl font-bold mb-2">Pro Plan Subscription</h2>
             <p className="text-slate-400 mb-8">Unlock unlimited power for your SEO.</p>
             
             <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center py-3 border-b border-slate-700">
                   <span>Genie Metrics Pro (Monthly)</span>
                   <span className="font-bold">$29.00</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-slate-700 text-orange-400">
                   <span>New User Discount</span>
                   <span>-$0.00</span>
                </div>
                <div className="flex justify-between items-center py-3 text-xl font-bold">
                   <span>Total due today</span>
                   <span>$29.00</span>
                </div>
             </div>
           </div>

           <div className="space-y-3">
              <div className="flex items-center text-sm text-slate-300">
                 <CheckCircle className="w-4 h-4 text-green-500 mr-2" /> Unlimited Daily Credits
              </div>
              <div className="flex items-center text-sm text-slate-300">
                 <CheckCircle className="w-4 h-4 text-green-500 mr-2" /> Advanced AI Analysis
              </div>
              <div className="flex items-center text-sm text-slate-300">
                 <CheckCircle className="w-4 h-4 text-green-500 mr-2" /> Priority Support
              </div>
           </div>
        </div>

        {/* Payment Form */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
           <div className="flex items-center justify-between mb-8">
              <h1 className="text-xl font-bold text-slate-900">Payment Details</h1>
              <div className="flex gap-2">
                 <div className="bg-slate-100 p-1.5 rounded"><CreditCard className="w-5 h-5 text-slate-600"/></div>
              </div>
           </div>

           <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                 <label className="block text-sm font-medium text-slate-700 mb-1">Cardholder Name</label>
                 <input 
                    type="text" 
                    name="name"
                    required
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded-lg border border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
                 />
              </div>

              <div>
                 <label className="block text-sm font-medium text-slate-700 mb-1">Card Number</label>
                 <div className="relative">
                    <input 
                        type="text" 
                        name="cardNumber"
                        required
                        placeholder="0000 0000 0000 0000"
                        maxLength={19}
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                        className="w-full p-3 pl-10 rounded-lg border border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
                    />
                    <Lock className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Expiration</label>
                    <input 
                        type="text" 
                        name="expiry"
                        required
                        placeholder="MM/YY"
                        maxLength={5}
                        value={formData.expiry}
                        onChange={handleInputChange}
                        className="w-full p-3 rounded-lg border border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
                    />
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">CVC</label>
                    <input 
                        type="text" 
                        name="cvc"
                        required
                        placeholder="123"
                        maxLength={3}
                        value={formData.cvc}
                        onChange={handleInputChange}
                        className="w-full p-3 rounded-lg border border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
                    />
                 </div>
              </div>

              <div className="pt-4">
                  <button 
                     type="submit"
                     disabled={loading}
                     className="w-full bg-orange-600 hover:bg-orange-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-orange-600/20 transition-all flex items-center justify-center disabled:opacity-70"
                  >
                     {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Pay $29.00'}
                  </button>
                  
                  <div className="flex items-center justify-center gap-2 mt-4 text-xs text-slate-400">
                     <ShieldCheck className="w-3 h-3" />
                     Payments are secure and encrypted
                  </div>
              </div>
           </form>
        </div>

      </div>
    </div>
  );
};

export default CheckoutView;

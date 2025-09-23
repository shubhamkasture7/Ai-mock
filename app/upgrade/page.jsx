'use client';

import React from 'react';
import DashboardBox from '../dashboard/_components/DashboardBox';

export default function UpgradePage() {
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async (amountInRupees, planName) => {
    const res = await loadRazorpayScript();
    if (!res) {
      alert('Razorpay SDK failed to load.');
      return;
    }

    const options = {
      key: 'rzp_test_IYDnqorPRMnVxZ', // Replace with your public key
      amount: amountInRupees * 100,
      currency: 'INR',
      name: 'Mock Interview',
      description: `${planName} Plan Purchase`,
      image: '/logo.png',
      handler: function (response) {
        alert(`✅ Payment successful!\nPayment ID: ${response.razorpay_payment_id}`);
      },
      prefill: {
        name: 'Shubham Kasture',
        email: 'shubhamshubhamkasture289@gmail.com',
        contact: '9657188968',
      },
      notes: {
        plan: planName,
      },
      theme: {
        color: '#6366f1',
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const plans = [
    { 
      name: 'Basic', 
      price: 49, 
      color: 'from-green-400 to-green-600', 
      features: ['Access to 5 mock interviews', 'Basic feedback'] 
    },
    { 
      name: 'Standard', 
      price: 99, 
      color: 'from-indigo-400 to-indigo-600', 
      features: ['Access to 15 mock interviews', 'Detailed feedback', 'Resume tips'] 
    },
    { 
      name: 'Premium', 
      price: 199, 
      color: 'from-purple-400 to-purple-600', 
      features: ['Unlimited interviews', '1-on-1 mentoring', 'Resume & LinkedIn Review'] 
    },
  ];

  return (
    <div className="flex">
      <div>
        <DashboardBox />
      </div>

      {/* Main Upgrade Section */}
      <div className="min-h-screen flex-1 bg-gradient-to-br from-gray-50 to-gray-200 p-10">
        <h1 className="text-4xl font-extrabold text-center mb-12 text-gray-800 tracking-tight">
          Upgrade Your <span className="text-indigo-600">Plan</span>
        </h1>

        <div className="grid gap-6 ml-[225px] grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
          {plans.map((plan) => (
            <div 
              key={plan.name} 
              className={`relative bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition duration-300 border border-gray-100 group 
              ${plan.name === 'Premium' ? 'scale-105 border-purple-300 shadow-xl' : ''}`}
            >
              {/* Ribbon */}
              {plan.name === 'Premium' && (
                <span className="absolute -top-3 right-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-xs font-semibold text-white px-3 py-1 rounded-full shadow-md">
                  Popular
                </span>
              )}

              {/* Plan Header */}
              <h2 className={`text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r ${plan.color}`}>
                {plan.name} Plan
              </h2>
              <p className="text-4xl font-extrabold text-gray-900 mb-6">₹{plan.price}</p>

              {/* Features */}
              <ul className="space-y-3 text-gray-700 mb-8">
                {plan.features.map((f, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="text-green-500">✔</span> {f}
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <button
                onClick={() => handlePayment(plan.price, plan.name)}
                className={`w-full py-3 rounded-xl text-white font-semibold text-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all bg-gradient-to-r ${plan.color}`}
              >
                Buy {plan.name}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

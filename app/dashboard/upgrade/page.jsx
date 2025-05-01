'use client';

import React from 'react';

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
      amount: amountInRupees * 100, // Razorpay accepts amount in paise
      currency: 'INR',
      name: 'Mock Interview',
      description: `${planName} Plan Purchase`,
      image: '/logo.png', // Optional: add a logo image in public folder
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
        color: '#00b386',
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const plans = [
    { name: 'Basic', price: 49, features: ['Access to 5 mock interviews', 'Basic feedback'] },
    { name: 'Standard', price: 99, features: ['Access to 15 mock interviews', 'Detailed feedback', 'Resume tips'] },
    { name: 'Premium', price: 199, features: ['Unlimited interviews', '1-on-1 mentoring', 'Resume & LinkedIn Review'] },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <h1 className="text-4xl font-bold text-center mb-10 text-gray-800">Upgrade Your Plan</h1>
      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
        {plans.map((plan) => (
          <div key={plan.name} className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition duration-300">
            <h2 className="text-2xl font-semibold mb-4 text-green-700">{plan.name} Plan</h2>
            <p className="text-3xl font-bold text-gray-800 mb-4">₹{plan.price}</p>
            <ul className="text-gray-600 mb-6 list-disc list-inside">
              {plan.features.map((f, idx) => (
                <li key={idx}>{f}</li>
              ))}
            </ul>
            <button
              onClick={() => handlePayment(plan.price, plan.name)}
              className="bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-lg w-full"
            >
              Buy {plan.name}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

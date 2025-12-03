"use client";

import React from "react";

export default function UpgradePage() {
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async (amountInRupees, planName) => {
    const res = await loadRazorpayScript();
    if (!res) {
      alert("Razorpay SDK failed to load.");
      return;
    }

    const options = {
      key: "rzp_test_IYDnqorPRMnVxZ", // TODO: replace with live key in production
      amount: amountInRupees * 100,
      currency: "INR",
      name: "Mock Interview",
      description: `${planName} Plan Purchase`,
      image: "/logo.png",
      handler: function (response) {
        alert(
          `✅ Payment successful!\nPayment ID: ${response.razorpay_payment_id}`
        );
      },
      prefill: {
        name: "Shubham Kasture",
        email: "shubhamshubhamkasture289@gmail.com",
        contact: "9657188968",
      },
      notes: {
        plan: planName,
      },
      theme: {
        color: "#6366f1",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  // More professional plans
  const plans = [
    {
      name: "Starter",
      price: 79,
      color: "from-sky-400 to-sky-600",
      tag: "For beginners",
      bestFor: "Students & freshers doing their first interviews.",
      features: [
        "10 AI mock interviews / month",
        "Basic question bank (DSA + Core CS)",
        "Instant AI feedback after each round",
        "Email summary of your performance",
      ],
    },
    {
      name: "Pro",
      price: 199,
      color: "from-indigo-500 to-indigo-700",
      tag: "Most Popular",
      bestFor: "Serious job seekers preparing for product & service companies.",
      features: [
        "Unlimited AI mock interviews",
        "Company-specific interview sets (FAANG, Service-based, Startups)",
        "Detailed feedback with scoring per skill",
        "Resume tips & improvement suggestions",
        "Priority support for interview doubts",
      ],
    },
    {
      name: "Elite",
      price: 399,
      color: "from-purple-500 to-purple-700",
      tag: "For top performers",
      bestFor: "Final-year students & professionals targeting top roles.",
      features: [
        "Everything in Pro plan",
        "1-on-1 mentoring sessions (scheduled)",
        "Resume & LinkedIn profile review",
        "Custom interview sets as per JD",
        "Career roadmap & preparation plan",
      ],
    },
  ];

  const benefits = [
    {
      title: "Real Interview Simulation",
      desc: "Practice with realistic questions, structured rounds, and time limits to match the actual interview pressure.",
    },
    {
      title: "AI-Powered Feedback",
      desc: "Get instant, actionable feedback on your answers, communication, confidence, and problem-solving approach.",
    },
    {
      title: "Track Your Progress",
      desc: "Monitor your scores, improvement per skill, and performance trend over multiple mock interviews.",
    },
  ];

  const faqs = [
    {
      q: "Will I be charged automatically every month?",
      a: "No. Currently, these plans work on a one-time payment basis. You can upgrade again whenever you need.",
    },
    {
      q: "Can I change my plan later?",
      a: "Yes. You can upgrade to a higher plan anytime by purchasing the new plan. Your features will be unlocked instantly.",
    },
    {
      q: "Is my payment secure?",
      a: "Yes. All payments are processed securely via Razorpay using industry-standard encryption.",
    },
    {
      q: "Do I get refunds?",
      a: "As this is a digital service with instant access, refunds are generally not provided. However, you can contact support for special cases.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section (kept as close as possible to your original) */}
        <h1 className="text-4xl font-extrabold text-center mb-4 text-gray-800 tracking-tight">
          Upgrade Your <span className="text-indigo-600">Plan</span>
        </h1>
        <p className="text-center text-gray-600 max-w-2xl mx-auto mb-10">
          Unlock advanced mock interviews, detailed feedback, and personalized
          guidance to boost your chances of cracking your dream job.
        </p>

        {/* Pricing Cards */}
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition duration-300 border border-gray-100 group ${
                plan.name === "Pro" ? "scale-[1.03] border-indigo-300" : ""
              }`}
            >
              {/* Tag / Ribbon */}
              {plan.tag && (
                <span
                  className={`absolute -top-3 right-3 text-xs font-semibold text-white px-3 py-1 rounded-full shadow-md bg-gradient-to-r ${
                    plan.name === "Pro"
                      ? "from-yellow-400 to-yellow-500"
                      : "from-slate-500 to-slate-600"
                  }`}
                >
                  {plan.tag}
                </span>
              )}

              {/* Plan Header */}
              <h2
                className={`text-2xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r ${plan.color}`}
              >
                {plan.name} Plan
              </h2>
              <p className="text-sm text-gray-500 mb-4">{plan.bestFor}</p>

              <p className="text-4xl font-extrabold text-gray-900 mb-1">
                ₹{plan.price}
              </p>
              <p className="text-xs text-gray-500 mb-6">one-time payment</p>

              {/* Features */}
              <ul className="space-y-3 text-gray-700 mb-8 text-sm">
                {plan.features.map((f, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="mt-1 text-green-500">✔</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <button
                onClick={() => handlePayment(plan.price, plan.name)}
                className={`w-full py-3 rounded-xl text-white font-semibold text-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all bg-gradient-to-r ${plan.color}`}
              >
                Choose {plan.name}
              </button>
            </div>
          ))}
        </div>

        {/* Benefits Section */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
            Why Upgrade Your Mock Interview Experience?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {benefits.map((b) => (
              <div
                key={b.title}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6"
              >
                <h3 className="font-semibold text-lg text-gray-900 mb-2">
                  {b.title}
                </h3>
                <p className="text-sm text-gray-600">{b.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mt-16 mb-4">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
            Frequently Asked Questions
          </h2>
          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((f, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm"
              >
                <h3 className="font-semibold text-sm text-gray-900 mb-1">
                  {f.q}
                </h3>
                <p className="text-sm text-gray-600">{f.a}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="border-b border-gray-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-14">
          <span className="text-lg font-bold text-gray-800">WorkBridge</span>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm text-gray-600 hover:text-gray-900">Login</Link>
            <Link to="/register" className="text-sm bg-blue-600 text-white px-4 py-1.5 rounded hover:bg-blue-700">Sign Up</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-blue-600 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold mb-4">Bridge the Gap Between Talent and Opportunity</h1>
          <p className="text-blue-100 mb-6 max-w-xl mx-auto">
            The smart enterprise platform connecting exceptional professionals with innovative companies.
          </p>
          <Link to="/register" className="inline-block bg-white text-blue-600 font-semibold px-6 py-2.5 rounded hover:bg-gray-100">
            Get Started
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div><div className="text-2xl font-bold text-gray-900">10k+</div><div className="text-sm text-gray-500">Active Jobs</div></div>
          <div><div className="text-2xl font-bold text-gray-900">50k+</div><div className="text-sm text-gray-500">Candidates</div></div>
          <div><div className="text-2xl font-bold text-gray-900">5k+</div><div className="text-sm text-gray-500">Companies</div></div>
          <div><div className="text-2xl font-bold text-gray-900">95%</div><div className="text-sm text-gray-500">Success Rate</div></div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Why Choose WorkBridge</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: 'AI-Powered Matching', desc: 'Our intelligent algorithm connects you with the most relevant candidates and opportunities.' },
              { title: 'Verified Talent', desc: 'Every profile is thoroughly vetted to ensure quality and authenticity.' },
              { title: 'Analytics Dashboard', desc: 'Track your hiring metrics and make data-driven decisions.' },
            ].map((f, i) => (
              <div key={i} className="border border-gray-200 rounded p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-600">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-blue-600 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-white mb-3">Ready to Transform Your Hiring Process?</h2>
          <p className="text-blue-100 mb-6">Join thousands of companies using WorkBridge to build exceptional teams</p>
          <Link to="/register" className="inline-block bg-white text-blue-600 font-semibold px-6 py-2.5 rounded hover:bg-gray-100">
            Start Your Free Trial
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
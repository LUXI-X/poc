"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { AuthProvider } from "@/lib/auth-context";

export default function HomePage() {
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      title: "Interactive Graph Visualization",
      description:
        "Explore complex organizational relationships through beautiful, interactive network graphs.",
      icon: "🕸️",
    },
    {
      title: "Real-time Data Management",
      description:
        "Add, edit, and manage your organizational data with real-time updates across the platform.",
      icon: "⚡",
    },
    {
      title: "Advanced Search & Analytics",
      description:
        "Find exactly what you need with powerful search capabilities and detailed analytics.",
      icon: "🔍",
    },
    {
      title: "Secure & Scalable",
      description:
        "Built with enterprise-grade security and designed to scale with your organization.",
      icon: "🔒",
    },
  ];

  return (
    <AuthProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50">
        <Navbar />

        {/* Hero Section */}
        <section className="container mx-auto px-4 py-16 md:py-24">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold text-slate-800 mb-6">
              Welcome to{" "}
              <span className="bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                Blackcoffer
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 mb-8 leading-relaxed">
              Transform your organizational data into actionable insights with
              our powerful knowledge graph platform. Visualize relationships,
              manage projects, and unlock the potential of your data.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/login">
                <button className="bg-teal-600 text-white px-8 py-4 rounded-xl hover:bg-teal-700 transition-colors font-semibold text-lg shadow-lg hover:shadow-xl">
                  Get Started
                </button>
              </Link>
              <Link href="/about">
                <button className="border-2 border-teal-600 text-teal-600 px-8 py-4 rounded-xl hover:bg-teal-50 transition-colors font-semibold text-lg">
                  Learn More
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="container  px-14 py-16">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
              Powerful Features
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Everything you need to manage and visualize your organizational
              data
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer ${
                  activeFeature === index
                    ? "ring-2 ring-teal-500 transform scale-105"
                    : ""
                }`}
                onClick={() => setActiveFeature(index)}
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Stats Section */}
        <section className="bg-gradient-to-l from-sky-700  via-50% via-cyan-500 to-teal-700 py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8 text-center text-white">
              <div>
                <div className="text-4xl md:text-5xl font-bold mb-2">500+</div>
                <div className="text-xl opacity-90">Organizations Trust Us</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold mb-2">1M+</div>
                <div className="text-xl opacity-90">Data Points Managed</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold mb-2">99.9%</div>
                <div className="text-xl opacity-90">Uptime Guarantee</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container   px-14 py-16">
          <div className="bg-white rounded-3xl shadow p-12 text-center">
            <h2 className="text-4xl font-bold text-slate-800 mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
              Join thousands of organizations already using Blackcoffer to
              transform their data into insights.
            </p>
            {/* <Link href="/signup">
              <button className="bg-teal-600 text-white px-8 py-4 rounded-xl hover:bg-teal-700 transition-colors font-semibold text-lg shadow-lg hover:shadow-xl">
                Start Your Free Trial
              </button>
            </Link> */}
          </div>
        </section>

        <Footer />
      </div>
    </AuthProvider>
  );
}

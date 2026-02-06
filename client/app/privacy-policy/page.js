"use client";
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-white text-gray-900 font-sans">
            <nav className="w-full border-b border-gray-100 bg-white sticky top-0 z-50">
                <div className="max-w-4xl mx-auto px-6 h-20 flex items-center justify-between">
                    <Link href="/" className="text-2xl font-extrabold tracking-tight text-[#0a3a30] hover:opacity-90 transition-opacity">
                        Evalio
                    </Link>
                    <Link href="/" className="text-sm font-medium text-gray-600 hover:text-[#0a3a30] flex items-center gap-2">
                        <ArrowLeft size={16} /> Back to Home
                    </Link>
                </div>
            </nav>

            <main className="max-w-4xl mx-auto px-6 py-12 md:py-20">
                <h1 className="text-4xl font-bold text-[#0a3a30] mb-8">Privacy Policy</h1>
                <p className="text-gray-500 mb-8">Last updated: February 6, 2026</p>

                <div className="prose prose-emerald max-w-none text-gray-600">
                    <p className="mb-6">
                        At Evalio, accessible from our website, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by Evalio and how we use it.
                    </p>

                    <h2 className="text-2xl font-bold text-[#0a3a30] mt-10 mb-4">Log Files</h2>
                    <p className="mb-6">
                        Evalio follows a standard procedure of using log files. These files log visitors when they visit websites. All hosting companies do this and a part of hosting services' analytics. The information collected by log files include internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable. The purpose of the information is for analyzing trends, administering the site, tracking users' movement on the website, and gathering demographic information.
                    </p>

                    <h2 className="text-2xl font-bold text-[#0a3a30] mt-10 mb-4">Cookies and Web Beacons</h2>
                    <p className="mb-6">
                        Like any other website, Evalio uses "cookies". These cookies are used to store information including visitors' preferences, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users' experience by customizing our web page content based on visitors' browser type and/or other information.
                    </p>

                    <h2 className="text-2xl font-bold text-[#0a3a30] mt-10 mb-4">Google DoubleClick DART Cookie</h2>
                    <p className="mb-6">
                        Google is one of a third-party vendor on our site. It also uses cookies, known as DART cookies, to serve ads to our site visitors based upon their visit to www.website.com and other sites on the internet. However, visitors may choose to decline the use of DART cookies by visiting the Google ad and content network Privacy Policy at the following URL – <a href="https://policies.google.com/technologies/ads" className="text-emerald-600 hover:underline">https://policies.google.com/technologies/ads</a>
                    </p>

                    <h2 className="text-2xl font-bold text-[#0a3a30] mt-10 mb-4">Privacy Policies</h2>
                    <p className="mb-6">
                        You may consult this list to find the Privacy Policy for each of the advertising partners of Evalio.
                    </p>
                    <p className="mb-6">
                        Third-party ad servers or ad networks uses technologies like cookies, JavaScript, or Web Beacons that are used in their respective advertisements and links that appear on Evalio, which are sent directly to users' browser. They automatically receive your IP address when this occurs. These technologies are used to measure the effectiveness of their advertising campaigns and/or to personalize the advertising content that you see on websites that you visit.
                    </p>
                    <p className="mb-6">
                        Note that Evalio has no access to or control over these cookies that are used by third-party advertisers.
                    </p>

                    <h2 className="text-2xl font-bold text-[#0a3a30] mt-10 mb-4">Third Party Privacy Policies</h2>
                    <p className="mb-6">
                        Evalio's Privacy Policy does not apply to other advertisers or websites. Thus, we are advising you to consult the respective Privacy Policies of these third-party ad servers for more detailed information. It may include their practices and instructions about how to opt-out of certain options.
                    </p>

                    <h2 className="text-2xl font-bold text-[#0a3a30] mt-10 mb-4">Consent</h2>
                    <p className="mb-6">
                        By using our website, you hereby consent to our Privacy Policy and agree to its Terms and Conditions.
                    </p>
                </div>
            </main>

            <footer className="bg-[#022c22] text-white py-8 border-t border-white/10 mt-12">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <p className="text-sm text-emerald-200/50">© 2026 Evalio Inc. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}

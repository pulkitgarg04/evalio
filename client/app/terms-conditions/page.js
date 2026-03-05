"use client";
import LandingNavbar from '@/components/layout/LandingNavbar';
import Footer from '@/components/layout/Footer';

export default function TermsConditions() {
    return (
        <div className="min-h-screen bg-white text-gray-900 font-sans">
            <LandingNavbar />

            <main className="max-w-4xl mx-auto px-6 py-12 pt-[140px] md:pt-[180px] md:py-20">
                <h1 className="text-4xl font-bold text-slate-900 mb-8">Terms and Conditions</h1>
                <p className="text-gray-500 mb-8">Last updated: February 6, 2026</p>

                <div className="prose prose-emerald max-w-none text-gray-600">
                    <p className="mb-6">
                        Welcome to Evalio! These terms and conditions outline the rules and regulations for the use of Evalio&apos;s Website.
                    </p>
                    <p className="mb-6">
                        By accessing this website we assume you accept these terms and conditions. Do not continue to use Evalio if you do not agree to take all of the terms and conditions stated on this page.
                    </p>

                    <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">Cookies</h2>
                    <p className="mb-6">
                        We employ the use of cookies. By accessing Evalio, you agreed to use cookies in agreement with the Evalio&apos;s Privacy Policy. Most interactive websites use cookies to let us retrieve the user&apos;s details for each visit. Cookies are used by our website to enable the functionality of certain areas to make it easier for people visiting our website. Some of our affiliate/advertising partners may also use cookies.
                    </p>

                    <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">License</h2>
                    <p className="mb-6">
                        Unless otherwise stated, Evalio and/or its licensors own the intellectual property rights for all material on Evalio. All intellectual property rights are reserved. You may access this from Evalio for your own personal use subjected to restrictions set in these terms and conditions.
                    </p>
                    <p className="mb-2">You must not:</p>
                    <ul className="list-disc pl-6 mb-6 space-y-2">
                        <li>Republish material from Evalio</li>
                        <li>Sell, rent or sub-license material from Evalio</li>
                        <li>Reproduce, duplicate or copy material from Evalio</li>
                        <li>Redistribute content from Evalio</li>
                    </ul>

                    <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">User Comments</h2>
                    <p className="mb-6">
                        Parts of this website offer an opportunity for users to post and exchange opinions and information in certain areas of the website. Evalio does not filter, edit, publish or review Comments prior to their presence on the website. Comments do not reflect the views and opinions of Evalio,its agents and/or affiliates. Comments reflect the views and opinions of the person who post their views and opinions.
                    </p>

                    <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">Content Liability</h2>
                    <p className="mb-6">
                        We shall not be hold responsible for any content that appears on your Website. You agree to protect and defend us against all claims that is rising on your Website. No link(s) should appear on any Website that may be interpreted as libelous, obscene or criminal, or which infringes, otherwise violates, or advocates the infringement or other violation of, any third party rights.
                    </p>

                    <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">Reservation of Rights</h2>
                    <p className="mb-6">
                        We reserve the right to request that you remove all links or any particular link to our Website. You approve to immediately remove all links to our Website upon request. We also reserve the right to amen these terms and conditions and it&apos;s linking policy at any time. By continuously linking to our Website, you agree to be bound to and follow these linking terms and conditions.
                    </p>
                </div>
            </main>

            <Footer />
        </div>
    );
}

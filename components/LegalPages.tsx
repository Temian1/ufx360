import React, { useState } from 'react';

type LegalPageType = 'terms' | 'privacy' | 'responsible-gaming' | 'rules';

interface LegalPagesProps {
    initialPage?: LegalPageType;
    onClose: () => void;
}

const LegalPages: React.FC<LegalPagesProps> = ({ initialPage = 'terms', onClose }) => {
    const [activePage, setActivePage] = useState<LegalPageType>(initialPage);

    const renderContent = () => {
        const contentClass = "space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500";
        const sectionHeaderClass = "text-lg font-black text-gray-900 dark:text-white mt-8 mb-3 flex items-center gap-2";
        const paragraphClass = "text-base text-gray-600 dark:text-gray-300 leading-relaxed";

        switch (activePage) {
            case 'terms':
                return (
                    <div className={contentClass}>
                        <div className="border-b border-gray-100 dark:border-white/10 pb-6 mb-6">
                            <h2 className="text-3xl font-black italic tracking-tighter mb-2">Terms of Service</h2>
                            <p className="text-sm text-gray-500 font-medium">Last updated: {new Date().toLocaleDateString()}</p>
                        </div>
                        
                        <h3 className={sectionHeaderClass}>
                            <span className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-white/10 flex items-center justify-center text-sm font-bold text-gray-500">1</span>
                            Acceptance of Terms
                        </h3>
                        <p className={paragraphClass}>
                            By accessing and using this platform, you accept and agree to be bound by the terms and provision of this agreement. In addition, when using these particular services, you shall be subject to any posted guidelines or rules applicable to such services.
                        </p>

                        <h3 className={sectionHeaderClass}>
                            <span className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-white/10 flex items-center justify-center text-sm font-bold text-gray-500">2</span>
                            Eligibility
                        </h3>
                        <p className={paragraphClass}>
                            You must be at least 18 years of age (or the legal age of majority in your jurisdiction) to use our services. By using this website, you warrant that you have the right, authority, and capacity to enter into this Agreement and to abide by all of the terms and conditions set forth herein.
                        </p>

                        <h3 className={sectionHeaderClass}>
                            <span className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-white/10 flex items-center justify-center text-sm font-bold text-gray-500">3</span>
                            Account Security
                        </h3>
                        <p className={paragraphClass}>
                            You are responsible for maintaining the confidentiality of your account and password and for restricting access to your computer, and you agree to accept responsibility for all activities that occur under your account or password.
                        </p>
                    </div>
                );
            case 'privacy':
                return (
                    <div className={contentClass}>
                         <div className="border-b border-gray-100 dark:border-white/10 pb-6 mb-6">
                            <h2 className="text-3xl font-black italic tracking-tighter mb-2">Privacy Policy</h2>
                            <p className="text-sm text-gray-500 font-medium">Your privacy is our priority.</p>
                        </div>

                        <p className={paragraphClass}>
                            We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about our policy, or our practices with regards to your personal information, please contact us.
                        </p>

                         <h3 className={sectionHeaderClass}>
                            <span className="material-symbols-outlined text-primary">info</span>
                            Information We Collect
                        </h3>
                        <p className={paragraphClass}>
                            We collect personal information that you voluntarily provide to us when you register on the website, express an interest in obtaining information about us or our products and services, when you participate in activities on the website or otherwise contacting us.
                        </p>

                         <h3 className={sectionHeaderClass}>
                            <span className="material-symbols-outlined text-primary">visibility</span>
                            How We Use Your Information
                        </h3>
                        <p className={paragraphClass}>
                            We use personal information collected via our website for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.
                        </p>
                    </div>
                );
            case 'responsible-gaming':
                return (
                    <div className={contentClass}>
                         <div className="border-b border-gray-100 dark:border-white/10 pb-6 mb-6">
                            <h2 className="text-3xl font-black italic tracking-tighter mb-2">Responsible Gaming</h2>
                            <p className="text-sm text-gray-500 font-medium">Play safe, play smart.</p>
                        </div>

                        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-2xl border border-blue-100 dark:border-blue-800 mb-8 flex items-start gap-4">
                            <div className="p-3 bg-blue-100 dark:bg-blue-800/30 rounded-xl text-blue-600 dark:text-blue-300">
                                <span className="material-symbols-outlined text-2xl">health_and_safety</span>
                            </div>
                            <div>
                                <h4 className="font-bold text-blue-900 dark:text-blue-100 text-lg mb-1">Our Commitment</h4>
                                <p className="text-sm text-blue-800 dark:text-blue-200 leading-relaxed">
                                    Gambling should be entertaining and not seen as a way of making money. Bet with your head, not over it. We are committed to endorsing responsible wagering among our customers as well as promoting the awareness of problem gambling and improving prevention, intervention and treatment.
                                </p>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-5 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 hover:border-primary/50 transition-colors group">
                                <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                    <span className="material-symbols-outlined">block</span>
                                </div>
                                <h3 className="font-bold text-lg mb-2">Self-Exclusion</h3>
                                <p className="text-sm text-gray-500 leading-relaxed">
                                    If you feel you are losing control of your gambling, we offer self-exclusion options ranging from 24 hours to permanent exclusion.
                                </p>
                            </div>
                            <div className="p-5 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 hover:border-primary/50 transition-colors group">
                                <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                    <span className="material-symbols-outlined">savings</span>
                                </div>
                                <h3 className="font-bold text-lg mb-2">Deposit Limits</h3>
                                <p className="text-sm text-gray-500 leading-relaxed">
                                     You can set daily, weekly, or monthly deposit limits to manage your spending and ensure you stay within your budget.
                                </p>
                            </div>
                        </div>

                         <h3 className={sectionHeaderClass}>
                            Help & Support
                        </h3>
                        <p className={paragraphClass}>
                           If you need help, please contact gambling support organizations such as GamCare or Gambling Therapy. Our support team is also available 24/7 to assist you with any concerns.
                        </p>
                    </div>
                );
             case 'rules':
                return (
                    <div className={contentClass}>
                         <div className="border-b border-gray-100 dark:border-white/10 pb-6 mb-6">
                            <h2 className="text-3xl font-black italic tracking-tighter mb-2">Betting Rules</h2>
                            <p className="text-sm text-gray-500 font-medium">Understand the game.</p>
                        </div>

                        <p className={paragraphClass}>
                            General sports betting rules and regulations apply to all bets placed on this platform. Specific rules for individual sports may also apply.
                        </p>
                        
                         <h3 className={sectionHeaderClass}>
                            <span className="material-symbols-outlined text-primary">gavel</span>
                            1. Settlement
                        </h3>
                        <p className={paragraphClass}>
                           All bets are settled based on the official result at the end of the event. Overtime and penalty shootouts are excluded unless otherwise stated.
                        </p>

                         <h3 className={sectionHeaderClass}>
                            <span className="material-symbols-outlined text-primary">event_busy</span>
                            2. Postponed Matches
                        </h3>
                        <p className={paragraphClass}>
                           If a match is postponed and not played within 48 hours of the original scheduled start time, all bets will be void and stakes returned.
                        </p>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-[#1e1e1e] w-full max-w-4xl h-[80vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row animate-in zoom-in-95 duration-200">
                {/* Sidebar */}
                <div className="w-full md:w-64 bg-gray-50 dark:bg-black/20 border-b md:border-b-0 md:border-r border-gray-100 dark:border-gray-800 p-4 overflow-y-auto">
                    <h2 className="text-lg font-black italic tracking-tighter mb-6 px-2 hidden md:block">
                        <span className="text-gray-900 dark:text-white">upx</span><span className="text-bet-yellow">365</span>
                        <span className="text-xs font-normal text-gray-400 ml-2 not-italic tracking-normal">Legal</span>
                    </h2>
                    
                    <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-2 md:pb-0 no-scrollbar">
                        {[
                            { id: 'terms', label: 'Terms of Service', icon: 'description' },
                            { id: 'privacy', label: 'Privacy Policy', icon: 'security' },
                            { id: 'responsible-gaming', label: 'Responsible Gaming', icon: 'health_and_safety' },
                            { id: 'rules', label: 'Betting Rules', icon: 'gavel' },
                        ].map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setActivePage(item.id as LegalPageType)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                                    activePage === item.id 
                                    ? 'bg-primary text-white shadow-lg shadow-primary/25' 
                                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'
                                }`}
                            >
                                <span className="material-symbols-outlined text-lg">{item.icon}</span>
                                {item.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col h-full overflow-hidden">
                    <div className="flex justify-end p-4 border-b border-gray-100 dark:border-gray-800">
                        <button 
                            onClick={onClose}
                            className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-white/20 transition"
                        >
                            <span className="material-symbols-outlined text-sm">close</span>
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
                        <div className="max-w-3xl mx-auto">
                            {renderContent()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LegalPages;

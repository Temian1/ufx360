import React from 'react';
import { useTranslation, Language, Currency, OddsFormat } from '../contexts/TranslationContext';

interface FooterProps {
    onLegalClick: (page: 'terms' | 'privacy' | 'responsible-gaming' | 'rules') => void;
}

const Footer: React.FC<FooterProps> = ({ onLegalClick }) => {
    const { t, language, setLanguage, currency, setCurrency, oddsFormat, setOddsFormat } = useTranslation();

    return (
        <footer className="bg-gray-900 text-gray-400 py-12 px-4 border-t border-gray-800 mt-auto">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                <div>
                    <div className="font-black text-2xl tracking-tighter italic text-white mb-4">
                        <span className="text-white">upx</span><span className="text-bet-yellow">365</span>
                    </div>
                    <p className="text-xs leading-relaxed opacity-70">
                        {t('footer.about_text') || "The world's leading sports betting platform. Bet on thousands of markets with the best odds and live streaming."}
                    </p>
                </div>
                
                <div>
                    <h4 className="text-white font-bold mb-4 uppercase text-xs tracking-wider">{t('footer.support')}</h4>
                    <ul className="space-y-2 text-sm">
                        <li><button onClick={() => onLegalClick('terms')} className="hover:text-bet-yellow transition">{t('footer.terms')}</button></li>
                        <li><button onClick={() => onLegalClick('privacy')} className="hover:text-bet-yellow transition">{t('footer.privacy')}</button></li>
                        <li><button onClick={() => onLegalClick('rules')} className="hover:text-bet-yellow transition">{t('footer.rules')}</button></li>
                        <li><a href="#" className="hover:text-bet-yellow transition">{t('footer.contact')}</a></li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-white font-bold mb-4 uppercase text-xs tracking-wider">{t('footer.responsibility')}</h4>
                    <ul className="space-y-2 text-sm">
                        <li><button onClick={() => onLegalClick('responsible-gaming')} className="hover:text-bet-yellow transition">{t('footer.responsible_gaming')}</button></li>
                        <li><a href="#" className="hover:text-bet-yellow transition">{t('footer.self_exclusion')}</a></li>
                        <li><a href="#" className="hover:text-bet-yellow transition">{t('footer.fairness')}</a></li>
                        <li><a href="#" className="hover:text-bet-yellow transition">{t('footer.dispute')}</a></li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-white font-bold mb-4 uppercase text-xs tracking-wider">{t('footer.settings')}</h4>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between bg-white/5 p-2 rounded-lg border border-white/10">
                            <span className="text-xs font-bold">{t('footer.language')}</span>
                            <select 
                                value={language}
                                onChange={(e) => setLanguage(e.target.value as Language)}
                                className="bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer"
                            >
                                <option className="bg-gray-900" value="en">English (US)</option>
                                <option className="bg-gray-900" value="es">Español</option>
                                <option className="bg-gray-900" value="fr">Français</option>
                                <option className="bg-gray-900" value="de">Deutsch</option>
                                <option className="bg-gray-900" value="pt">Português</option>
                                <option className="bg-gray-900" value="zh">中文 (Chinese)</option>
                            </select>
                        </div>
                        <div className="flex items-center justify-between bg-white/5 p-2 rounded-lg border border-white/10">
                            <span className="text-xs font-bold">{t('footer.currency')}</span>
                            <select 
                                value={currency}
                                onChange={(e) => setCurrency(e.target.value as Currency)}
                                className="bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer"
                            >
                                <option className="bg-gray-900" value="USD">USD ($)</option>
                                <option className="bg-gray-900" value="EUR">EUR (€)</option>
                                <option className="bg-gray-900" value="GBP">GBP (£)</option>
                                <option className="bg-gray-900" value="BRL">BRL (R$)</option>
                                <option className="bg-gray-900" value="CNY">CNY (¥)</option>
                                <option className="bg-gray-900" value="INR">INR (₹)</option>
                            </select>
                        </div>
                        <div className="flex items-center justify-between bg-white/5 p-2 rounded-lg border border-white/10">
                            <span className="text-xs font-bold">{t('footer.odds_format')}</span>
                            <select 
                                value={oddsFormat}
                                onChange={(e) => setOddsFormat(e.target.value as OddsFormat)}
                                className="bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer"
                            >
                                <option className="bg-gray-900" value="decimal">Decimal (2.50)</option>
                                <option className="bg-gray-900" value="fractional">Fractional (3/2)</option>
                                <option className="bg-gray-900" value="american">American (+150)</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-[10px] text-center md:text-left opacity-50">
                    &copy; 2024 upx365. All rights reserved. Gambling involves risk. Please gamble responsibly.
                </p>
                <div className="flex gap-4 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                    <span className="material-symbols-outlined text-2xl">18_up_rating</span>
                    <span className="material-symbols-outlined text-2xl">verified_user</span>
                    <span className="material-symbols-outlined text-2xl">lock</span>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

import React, { useState } from 'react';
import { LiveMatch, BetSelection } from '../types';
import { useTranslation } from '../contexts/TranslationContext';

interface MatchDetailsProps {
  match: LiveMatch;
  onBack: () => void;
  onAddBet: (selection: BetSelection) => void;
}

const StatBar: React.FC<{ label: string; home: number; away: number; isPercentage?: boolean }> = ({ label, home, away, isPercentage = false }) => {
  const total = home + away;
  const homeWidth = total === 0 ? 50 : (home / total) * 100;
  
  return (
    <div className="flex flex-col gap-1 mb-3">
      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 font-medium px-1">
        <span>{home}{isPercentage ? '%' : ''}</span>
        <span>{label}</span>
        <span>{away}{isPercentage ? '%' : ''}</span>
      </div>
      <div className="flex h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div className="bg-primary dark:bg-green-500 h-full transition-all duration-500" style={{ width: `${homeWidth}%` }}></div>
      </div>
    </div>
  );
};

const FormBadge: React.FC<{ result: string }> = ({ result }) => {
  let colorClass = 'bg-gray-400';
  if (result === 'W') colorClass = 'bg-green-500';
  if (result === 'L') colorClass = 'bg-red-500';
  
  return (
    <div className={`w-6 h-6 ${colorClass} rounded flex items-center justify-center text-xs font-bold text-white`}>
      {result}
    </div>
  );
};

const MarketGroup: React.FC<{ title: string; children: React.ReactNode; isOpen?: boolean }> = ({ title, children, isOpen = true }) => {
    const [open, setOpen] = useState(isOpen);
    return (
        <div className="bg-white dark:bg-surface-dark rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-white/5 transition-all duration-300 mb-3">
            <button 
                onClick={() => setOpen(!open)}
                className="w-full bg-gray-50/50 dark:bg-white/5 p-3 px-4 border-b border-gray-100 dark:border-white/5 flex justify-between items-center hover:bg-gray-100 dark:hover:bg-white/10 transition"
            >
                <div className="flex items-center gap-2">
                    <div className="w-1 h-4 bg-primary dark:bg-bet-yellow rounded-full"></div>
                    <h3 className="text-sm font-bold text-gray-800 dark:text-white uppercase tracking-wide">{title}</h3>
                </div>
                <span className={`material-symbols-outlined text-gray-400 text-sm transition-transform duration-300 ${open ? 'rotate-180' : ''}`}>expand_more</span>
            </button>
            <div className={`transition-all duration-300 ease-in-out overflow-hidden ${open ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="p-2 bg-gray-50/30 dark:bg-black/20">
                    {children}
                </div>
            </div>
        </div>
    );
};

const OddsButton: React.FC<{ label: string; odds: string; onClick: () => void }> = ({ label, odds, onClick }) => (
    <button 
        onClick={onClick}
        className="flex justify-between items-center p-3 m-1 bg-white dark:bg-white/5 hover:bg-primary/5 hover:border-primary/30 dark:hover:bg-white/10 rounded-lg cursor-pointer group transition-all active:scale-[0.98] border border-gray-200 dark:border-white/5 shadow-sm hover:shadow-md"
    >
        <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 font-bold group-hover:text-primary dark:group-hover:text-white transition-colors">{label}</span>
        <span className="font-black text-gray-900 dark:text-bet-yellow text-sm bg-gray-100 dark:bg-black/40 px-2 py-1 rounded shadow-inner min-w-[3rem] text-center">{odds}</span>
    </button>
);

const MatchDetails: React.FC<MatchDetailsProps> = ({ match, onBack, onAddBet }) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('Main');

  const handleBetClick = (marketName: string, selectionName: string, odds: string) => {
    onAddBet({
      id: `${match.id}-${marketName}-${selectionName}`,
      matchTitle: `${match.team1} v ${match.team2}`,
      marketName,
      selectionName,
      odds
    });
  };

  const renderBetBuilder = () => (
    <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white p-5 rounded-xl shadow-lg flex items-start gap-4 mb-6">
            <div className="p-3 bg-white/20 rounded-full">
                <span className="material-symbols-outlined text-2xl">construction</span>
            </div>
            <div>
                <h4 className="font-bold text-lg mb-1">{t('match_details.build_bet')}</h4>
                <p className="text-sm text-blue-100 opacity-90">{t('match_details.build_bet_desc')}</p>
            </div>
        </div>

        {[
            { name: t('match_details.market_player_to_score'), options: ['Rashford (2.50)', 'Salah (2.10)', 'Fernandes (3.20)', 'Nunez (2.80)'] },
            { name: t('match_details.market_total_corners'), options: [`${t('match_details.selection_over')} 8 (1.80)`, `${t('match_details.selection_over')} 9 (2.10)`, `${t('match_details.selection_over')} 10 (2.60)`] },
            { name: t('match_details.market_btts'), options: [`${t('match_details.selection_yes')} (1.60)`, `${t('match_details.selection_no')} (2.20)`] },
            { name: t('match_details.market_result'), options: [`${match.team1} (2.10)`, `${t('match_details.selection_draw')} (3.40)`, `${match.team2} (3.10)`] }
        ].map((market, idx) => (
            <MarketGroup key={idx} title={market.name}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                    {market.options.map((opt, i) => {
                        const [label, oddsVal] = opt.split(' (');
                        const odds = oddsVal.replace(')', '');
                        return (
                            <OddsButton 
                                key={i}
                                label={label}
                                odds={odds}
                                onClick={() => handleBetClick(`Bet Builder - ${market.name}`, label, odds)}
                            />
                        )
                    })}
                </div>
            </MarketGroup>
        ))}
    </div>
  );

  const renderAsianLines = () => (
    <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
        <MarketGroup title={t('match_details.market_asian_handicap')}>
            <div className="grid grid-cols-2 gap-1">
                <OddsButton label={`${match.team1} -0.5`} odds="1.95" onClick={() => handleBetClick(t('match_details.market_asian_handicap'), `${match.team1} -0.5`, '1.95')} />
                <OddsButton label={`${match.team2} +0.5`} odds="1.90" onClick={() => handleBetClick(t('match_details.market_asian_handicap'), `${match.team2} +0.5`, '1.90')} />
                <OddsButton label={`${match.team1} -1.0`} odds="2.60" onClick={() => handleBetClick(t('match_details.market_asian_handicap'), `${match.team1} -1.0`, '2.60')} />
                <OddsButton label={`${match.team2} +1.0`} odds="1.50" onClick={() => handleBetClick(t('match_details.market_asian_handicap'), `${match.team2} +1.0`, '1.50')} />
            </div>
        </MarketGroup>
        <MarketGroup title={t('match_details.market_goal_line')}>
            <div className="grid grid-cols-2 gap-1">
                <OddsButton label={`${t('match_details.selection_over')} 2.5`} odds="1.85" onClick={() => handleBetClick(t('match_details.market_goal_line'), `${t('match_details.selection_over')} 2.5`, '1.85')} />
                <OddsButton label={`${t('match_details.selection_under')} 2.5`} odds="2.00" onClick={() => handleBetClick(t('match_details.market_goal_line'), `${t('match_details.selection_under')} 2.5`, '2.00')} />
                <OddsButton label={`${t('match_details.selection_over')} 3.0`} odds="2.40" onClick={() => handleBetClick(t('match_details.market_goal_line'), `${t('match_details.selection_over')} 3.0`, '2.40')} />
                <OddsButton label={`${t('match_details.selection_under')} 3.0`} odds="1.55" onClick={() => handleBetClick(t('match_details.market_goal_line'), `${t('match_details.selection_under')} 3.0`, '1.55')} />
            </div>
        </MarketGroup>
    </div>
  );

  const renderGoals = () => (
    <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
         <MarketGroup title={t('match_details.market_total_goals')}>
            <div className="grid grid-cols-2 gap-1">
                <OddsButton label={`${t('match_details.selection_over')} 0.5`} odds="1.05" onClick={() => handleBetClick(t('match_details.market_total_goals'), `${t('match_details.selection_over')} 0.5`, '1.05')} />
                <OddsButton label={`${t('match_details.selection_under')} 0.5`} odds="10.00" onClick={() => handleBetClick(t('match_details.market_total_goals'), `${t('match_details.selection_under')} 0.5`, '10.00')} />
                <OddsButton label={`${t('match_details.selection_over')} 1.5`} odds="1.30" onClick={() => handleBetClick(t('match_details.market_total_goals'), `${t('match_details.selection_over')} 1.5`, '1.30')} />
                <OddsButton label={`${t('match_details.selection_under')} 1.5`} odds="3.40" onClick={() => handleBetClick(t('match_details.market_total_goals'), `${t('match_details.selection_under')} 1.5`, '3.40')} />
                <OddsButton label={`${t('match_details.selection_over')} 2.5`} odds="1.90" onClick={() => handleBetClick(t('match_details.market_total_goals'), `${t('match_details.selection_over')} 2.5`, '1.90')} />
                <OddsButton label={`${t('match_details.selection_under')} 2.5`} odds="1.90" onClick={() => handleBetClick(t('match_details.market_total_goals'), `${t('match_details.selection_under')} 2.5`, '1.90')} />
            </div>
        </MarketGroup>
        <MarketGroup title={t('match_details.market_btts')}>
            <div className="grid grid-cols-2 gap-1">
                <OddsButton label={t('match_details.selection_yes')} odds="1.75" onClick={() => handleBetClick(t('match_details.market_btts'), t('match_details.selection_yes'), '1.75')} />
                <OddsButton label={t('match_details.selection_no')} odds="2.05" onClick={() => handleBetClick(t('match_details.market_btts'), t('match_details.selection_no'), '2.05')} />
            </div>
        </MarketGroup>
         <MarketGroup title={t('match_details.market_correct_score')}>
            <div className="grid grid-cols-3 gap-1">
                <OddsButton label="1-0" odds="6.50" onClick={() => handleBetClick(t('match_details.market_correct_score'), '1-0', '6.50')} />
                <OddsButton label="2-0" odds="10.00" onClick={() => handleBetClick(t('match_details.market_correct_score'), '2-0', '10.00')} />
                <OddsButton label="2-1" odds="8.50" onClick={() => handleBetClick(t('match_details.market_correct_score'), '2-1', '8.50')} />
                <OddsButton label="0-1" odds="7.50" onClick={() => handleBetClick(t('match_details.market_correct_score'), '0-1', '7.50')} />
                <OddsButton label="0-2" odds="12.00" onClick={() => handleBetClick(t('match_details.market_correct_score'), '0-2', '12.00')} />
                <OddsButton label="1-2" odds="9.50" onClick={() => handleBetClick(t('match_details.market_correct_score'), '1-2', '9.50')} />
                <OddsButton label="1-1" odds="6.00" onClick={() => handleBetClick(t('match_details.market_correct_score'), '1-1', '6.00')} />
                <OddsButton label="2-2" odds="14.00" onClick={() => handleBetClick(t('match_details.market_correct_score'), '2-2', '14.00')} />
                <OddsButton label={t('match_details.selection_other')} odds="5.00" onClick={() => handleBetClick(t('match_details.market_correct_score'), t('match_details.selection_other'), '5.00')} />
            </div>
        </MarketGroup>
    </div>
  );

  const renderCards = () => (
    <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
        <MarketGroup title={t('match_details.market_total_cards')}>
            <div className="grid grid-cols-2 gap-1">
                <OddsButton label={`${t('match_details.selection_over')} 3.5`} odds="1.85" onClick={() => handleBetClick(t('match_details.market_total_cards'), `${t('match_details.selection_over')} 3.5`, '1.85')} />
                <OddsButton label={`${t('match_details.selection_under')} 3.5`} odds="1.95" onClick={() => handleBetClick(t('match_details.market_total_cards'), `${t('match_details.selection_under')} 3.5`, '1.95')} />
                <OddsButton label={`${t('match_details.selection_over')} 4.5`} odds="2.40" onClick={() => handleBetClick(t('match_details.market_total_cards'), `${t('match_details.selection_over')} 4.5`, '2.40')} />
                <OddsButton label={`${t('match_details.selection_under')} 4.5`} odds="1.50" onClick={() => handleBetClick(t('match_details.market_total_cards'), `${t('match_details.selection_under')} 4.5`, '1.50')} />
            </div>
        </MarketGroup>
        <MarketGroup title={t('match_details.market_red_card')}>
            <div className="grid grid-cols-2 gap-1">
                <OddsButton label={t('match_details.selection_yes')} odds="4.50" onClick={() => handleBetClick(t('match_details.market_red_card'), t('match_details.selection_yes'), '4.50')} />
                <OddsButton label={t('match_details.selection_no')} odds="1.18" onClick={() => handleBetClick(t('match_details.market_red_card'), t('match_details.selection_no'), '1.18')} />
            </div>
        </MarketGroup>
        <MarketGroup title={t('match_details.market_player_card')}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                <OddsButton label="Casemiro" odds="2.50" onClick={() => handleBetClick(t('match_details.market_player_card'), 'Casemiro', '2.50')} />
                <OddsButton label="Fernandes" odds="3.20" onClick={() => handleBetClick(t('match_details.market_player_card'), 'Fernandes', '3.20')} />
                <OddsButton label="Martinez" odds="2.80" onClick={() => handleBetClick(t('match_details.market_player_card'), 'Martinez', '2.80')} />
                <OddsButton label="Xhaka" odds="2.60" onClick={() => handleBetClick(t('match_details.market_player_card'), 'Xhaka', '2.60')} />
            </div>
        </MarketGroup>
    </div>
  );

  const renderCorners = () => (
    <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
        <MarketGroup title={t('match_details.market_total_corners')}>
            <div className="grid grid-cols-2 gap-1">
                <OddsButton label={`${t('match_details.selection_over')} 9.5`} odds="1.90" onClick={() => handleBetClick(t('match_details.market_total_corners'), `${t('match_details.selection_over')} 9.5`, '1.90')} />
                <OddsButton label={`${t('match_details.selection_under')} 9.5`} odds="1.90" onClick={() => handleBetClick(t('match_details.market_total_corners'), `${t('match_details.selection_under')} 9.5`, '1.90')} />
                <OddsButton label={`${t('match_details.selection_over')} 10.5`} odds="2.35" onClick={() => handleBetClick(t('match_details.market_total_corners'), `${t('match_details.selection_over')} 10.5`, '2.35')} />
                <OddsButton label={`${t('match_details.selection_under')} 10.5`} odds="1.55" onClick={() => handleBetClick(t('match_details.market_total_corners'), `${t('match_details.selection_under')} 10.5`, '1.55')} />
            </div>
        </MarketGroup>
        <MarketGroup title={t('match_details.market_corners_handicap')}>
             <div className="grid grid-cols-2 gap-1">
                <OddsButton label={`${match.team1} -1.5`} odds="2.05" onClick={() => handleBetClick(t('match_details.market_corners_handicap'), `${match.team1} -1.5`, '2.05')} />
                <OddsButton label={`${match.team2} +1.5`} odds="1.75" onClick={() => handleBetClick(t('match_details.market_corners_handicap'), `${match.team2} +1.5`, '1.75')} />
            </div>
        </MarketGroup>
    </div>
  );

  const renderHalf = () => (
    <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
        <MarketGroup title={t('match_details.market_half_time_result')}>
            <div className="grid grid-cols-3 gap-1">
                <OddsButton label={match.team1} odds="2.80" onClick={() => handleBetClick(t('match_details.market_half_time_result'), match.team1, '2.80')} />
                <OddsButton label={t('match_details.selection_draw')} odds="2.10" onClick={() => handleBetClick(t('match_details.market_half_time_result'), t('match_details.selection_draw'), '2.10')} />
                <OddsButton label={match.team2} odds="3.50" onClick={() => handleBetClick(t('match_details.market_half_time_result'), match.team2, '3.50')} />
            </div>
        </MarketGroup>
        <MarketGroup title={t('match_details.market_ht_correct_score')}>
            <div className="grid grid-cols-3 gap-1">
                <OddsButton label="1-0" odds="4.50" onClick={() => handleBetClick(t('match_details.market_ht_correct_score'), '1-0', '4.50')} />
                <OddsButton label="0-0" odds="3.00" onClick={() => handleBetClick(t('match_details.market_ht_correct_score'), '0-0', '3.00')} />
                <OddsButton label="0-1" odds="5.00" onClick={() => handleBetClick(t('match_details.market_ht_correct_score'), '0-1', '5.00')} />
                <OddsButton label="2-0" odds="12.00" onClick={() => handleBetClick(t('match_details.market_ht_correct_score'), '2-0', '12.00')} />
                <OddsButton label="1-1" odds="7.50" onClick={() => handleBetClick(t('match_details.market_ht_correct_score'), '1-1', '7.50')} />
                <OddsButton label="0-2" odds="15.00" onClick={() => handleBetClick(t('match_details.market_ht_correct_score'), '0-2', '15.00')} />
            </div>
        </MarketGroup>
    </div>
  );

  return (
    <div className="bg-gray-100 dark:bg-dark-bg min-h-screen pb-20 animate-in fade-in slide-in-from-right duration-300">
      {/* Sticky Sub-Header */}
      <div className="bg-primary dark:bg-dark-header text-white p-3 flex items-center gap-4 sticky top-[56px] z-40 shadow-md backdrop-blur-md bg-opacity-95">
         <button onClick={onBack} className="hover:bg-white/20 p-2 rounded-full transition -ml-2">
            <span className="material-symbols-outlined">arrow_back</span>
         </button>
         <div className="flex flex-col">
            <span className="text-xs text-green-200 uppercase tracking-wider font-semibold opacity-80">{match.sport || 'Soccer'}</span>
            <span className="text-sm font-bold truncate">{match.team1} v {match.team2}</span>
         </div>
      </div>

      {/* Match Visualization */}
      <div className="bg-gray-800 dark:bg-[#1a1a1a] text-white p-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900 to-transparent pointer-events-none"></div>
        <div className="flex items-center justify-between max-w-lg mx-auto relative z-10">
            <div className="flex flex-col items-center w-1/3 text-center gap-3">
                 <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center text-gray-900 dark:text-white font-bold shadow-2xl text-2xl border-4 border-gray-100 dark:border-gray-700 relative">
                    {match.team1.substring(0,1)}
                    {/* Team Color Indicator */}
                    <div className="absolute bottom-0 right-0 w-4 h-4 bg-red-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                 </div>
                 <span className="font-bold text-sm leading-tight drop-shadow-md">{match.team1}</span>
            </div>
            
            <div className="flex flex-col items-center">
               <div className="bg-black/40 backdrop-blur-sm px-4 py-1.5 rounded-full mb-3 border border-white/10">
                 <span className="text-green-400 text-sm font-bold animate-pulse flex items-center gap-1.5">
                   <span className="material-symbols-outlined text-sm">timer</span> {match.time}
                 </span>
               </div>
               <div className="flex items-center gap-3">
                    <span className="text-4xl font-black tracking-tighter font-mono bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400">1</span>
                    <span className="text-2xl text-gray-500 font-light">-</span>
                    <span className="text-4xl font-black tracking-tighter font-mono bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400">2</span>
               </div>
               <span className="text-[10px] text-gray-400 mt-2 uppercase tracking-widest font-semibold">{t('live.title')}</span>
            </div>

            <div className="flex flex-col items-center w-1/3 text-center gap-3">
                 <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center text-gray-900 dark:text-white font-bold shadow-2xl text-2xl border-4 border-gray-100 dark:border-gray-700 relative">
                    {match.team2.substring(0,1)}
                    {/* Team Color Indicator */}
                    <div className="absolute bottom-0 right-0 w-4 h-4 bg-blue-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                 </div>
                 <span className="font-bold text-sm leading-tight drop-shadow-md">{match.team2}</span>
            </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white dark:bg-surface-dark shadow-sm mb-4 sticky top-[112px] z-30">
        <div className="flex text-sm font-bold text-gray-500 dark:text-gray-400 overflow-x-auto no-scrollbar px-2">
          {[
            { id: 'Main', label: t('match_details.tab_main') },
            { id: 'Bet Builder', label: t('match_details.tab_bet_builder') },
            { id: 'Asian Lines', label: t('match_details.tab_asian_lines') },
            { id: 'Cards', label: t('match_details.tab_cards') },
            { id: 'Corners', label: t('match_details.tab_corners') },
            { id: 'Goals', label: t('match_details.tab_goals') },
            { id: 'Half', label: t('match_details.tab_half') }
          ].map((tab) => (
             <button 
                key={tab.id} 
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3.5 whitespace-nowrap border-b-[3px] transition-all ${
                    activeTab === tab.id 
                    ? 'border-primary text-primary dark:border-bet-yellow dark:text-bet-yellow bg-primary/5 dark:bg-white/5' 
                    : 'border-transparent hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5'
                }`}
             >
               {tab.label}
             </button>
          ))}
        </div>
      </div>

      <div className="p-3 space-y-4 max-w-3xl mx-auto">
        {activeTab === 'Bet Builder' ? renderBetBuilder() : 
         activeTab === 'Asian Lines' ? renderAsianLines() :
         activeTab === 'Goals' ? renderGoals() : 
         activeTab === 'Cards' ? renderCards() :
         activeTab === 'Corners' ? renderCorners() :
         activeTab === 'Half' ? renderHalf() : (
            <>
                {/* Match Stats */}
                {match.stats && (
                    <div className="bg-white dark:bg-surface-dark rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-800">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">{t('match_details.stats')}</h3>
                        </div>
                        <StatBar label={t('match_details.possession')} home={match.stats.possessionHome} away={match.stats.possessionAway} isPercentage />
                        <StatBar label={t('match_details.shots_on_target')} home={match.stats.shotsHome} away={match.stats.shotsAway} />
                        <StatBar label="Corners" home={match.stats.cornersHome} away={match.stats.cornersAway} />
                    </div>
                )}

                {/* Form Guide */}
                <div className="bg-white dark:bg-surface-dark rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-800">
                    <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-4">Form Guide</h3>
                    <div className="flex justify-between items-center">
                        <div className="flex flex-col gap-2">
                            <span className="text-sm font-bold text-gray-800 dark:text-white">{match.team1}</span>
                            <div className="flex gap-1.5">
                            {match.formHome?.map((r, i) => <FormBadge key={i} result={r} />)}
                            </div>
                        </div>
                        <div className="h-10 w-px bg-gray-200 dark:bg-gray-700 mx-4"></div>
                        <div className="flex flex-col gap-2 items-end">
                            <span className="text-sm font-bold text-gray-800 dark:text-white">{match.team2}</span>
                            <div className="flex gap-1.5">
                            {match.formAway?.map((r, i) => <FormBadge key={i} result={r} />)}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 1X2 Market */}
                <MarketGroup title="Full Time Result">
                    <div className="grid grid-cols-3 gap-2">
                        <button 
                            onClick={() => handleBetClick('Full Time Result', match.team1, match.odds1)}
                            className="bg-gray-50 dark:bg-white/5 p-3 rounded-lg flex flex-col items-center justify-center hover:bg-gray-100 dark:hover:bg-white/10 active:scale-95 transition border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
                        >
                            <span className="text-xs text-gray-500 dark:text-gray-400 mb-1 font-medium">{match.team1}</span>
                            <span className="text-lg font-bold text-gray-900 dark:text-bet-yellow">{match.odds1}</span>
                        </button>
                        <button 
                            onClick={() => handleBetClick('Full Time Result', 'Draw', match.oddsX)}
                            className="bg-gray-50 dark:bg-white/5 p-3 rounded-lg flex flex-col items-center justify-center hover:bg-gray-100 dark:hover:bg-white/10 active:scale-95 transition border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
                        >
                            <span className="text-xs text-gray-500 dark:text-gray-400 mb-1 font-medium">Draw</span>
                            <span className="text-lg font-bold text-gray-900 dark:text-bet-yellow">{match.oddsX}</span>
                        </button>
                        <button 
                            onClick={() => handleBetClick('Full Time Result', match.team2, match.odds2)}
                            className="bg-gray-50 dark:bg-white/5 p-3 rounded-lg flex flex-col items-center justify-center hover:bg-gray-100 dark:hover:bg-white/10 active:scale-95 transition border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
                        >
                            <span className="text-xs text-gray-500 dark:text-gray-400 mb-1 font-medium">{match.team2}</span>
                            <span className="text-lg font-bold text-gray-900 dark:text-bet-yellow">{match.odds2}</span>
                        </button>
                    </div>
                </MarketGroup>

                {/* Extra Markets */}
                {match.extraMarkets?.map((market, idx) => (
                    <MarketGroup key={idx} title={market.name}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                            {market.odds.map((opt, i) => (
                                <OddsButton 
                                    key={i}
                                    label={opt.label}
                                    odds={opt.value}
                                    onClick={() => handleBetClick(market.name, opt.label, opt.value)}
                                />
                            ))}
                        </div>
                    </MarketGroup>
                ))}
            </>
        )}
      </div>
    </div>
  );
}

export default MatchDetails;

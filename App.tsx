import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import SubHeader from './components/SubHeader';
import Hero from './components/Hero';
import SportsTabs from './components/SportsTabs';
import FeaturedMatches from './components/FeaturedMatches';
import LiveMatches from './components/LiveMatches';
import BottomNav from './components/BottomNav';
import ThemeToggle from './components/ThemeToggle';
import MatchDetails from './components/MatchDetails';
import BetSlip from './components/BetSlip';
import AuthModal from './components/AuthModal';
import BetHistory from './components/BetHistory';
import AgentDashboard from './components/AgentDashboard';
import AdminDashboard from './components/AdminDashboard';
import AllSportsView from './components/AllSportsView';
import InPlayView from './components/InPlayView';
import WalletView from './components/WalletView';
import PromotionsView from './components/PromotionsView';
import AccountView from './components/AccountView';
import QuickActionsBar from './components/QuickActionsBar';
import FeaturedView from './components/FeaturedView';
import HomeExtraLists from './components/HomeExtraLists';
import SearchModal from './components/SearchResultsPanel';
import NotificationsPanel from './components/NotificationsPanel';
import Footer from './components/Footer';
import LegalPages from './components/LegalPages';
import { LiveMatch, BetSelection, User, PlacedBet, WalletTransaction, PromoOffer, ResponsibleGamingSettings, Notification } from './types';
import { demoMatches, demoUsers, demoPromos, demoTransactions, demoRgSettings } from './demoData';

type ViewState =
  | 'home'
  | 'match'
  | 'history'
  | 'all-sports'
  | 'in-play'
  | 'featured'
  | 'wallet'
  | 'promos'
  | 'account'
  | 'agent-dashboard';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const [currentView, setCurrentView] = useState<ViewState>('home');
  const [activeMatch, setActiveMatch] = useState<LiveMatch | null>(null);
  const [matches, setMatches] = useState<LiveMatch[]>(demoMatches);
  const [betSelections, setBetSelections] = useState<BetSelection[]>([]);
  const [placedBets, setPlacedBets] = useState<PlacedBet[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<LiveMatch[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [selectedSport, setSelectedSport] = useState<string>('All');

  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [walletTransactions, setWalletTransactions] = useState<WalletTransaction[]>(demoTransactions);
  const [promos, setPromos] = useState<PromoOffer[]>(demoPromos);
  const [rgSettings, setRgSettings] = useState<ResponsibleGamingSettings>(demoRgSettings);

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  
  const [showLegal, setShowLegal] = useState(false);
  const [legalPage, setLegalPage] = useState<'terms' | 'privacy' | 'responsible-gaming' | 'rules'>('terms');
  const [showSearchModal, setShowSearchModal] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    const savedAllUsers = localStorage.getItem('allUsers');
    const savedBets = localStorage.getItem('allBets');
    const savedTx = localStorage.getItem('walletTransactions');
    const savedPromos = localStorage.getItem('promos');
    const savedRg = localStorage.getItem('rgSettings');
    const savedNotifications = localStorage.getItem('notifications');

    if (savedBets) setPlacedBets(JSON.parse(savedBets));
    if (savedTx) setWalletTransactions(JSON.parse(savedTx));
    if (savedPromos) setPromos(JSON.parse(savedPromos));
    if (savedRg) setRgSettings(JSON.parse(savedRg));
    
    if (savedNotifications) {
      setNotifications(JSON.parse(savedNotifications));
    } else {
       setNotifications([
        { id: '1', type: 'info', title: 'Welcome!', message: 'Welcome to upx365. Enjoy your betting experience.', timestamp: new Date().toISOString(), read: false },
        { id: '2', type: 'success', title: 'Deposit Successful', message: 'Your deposit of $500 has been processed.', timestamp: new Date(Date.now() - 3600000).toISOString(), read: true },
        { id: '3', type: 'warning', title: 'Maintenance', message: 'Scheduled maintenance on Sunday 2 AM.', timestamp: new Date(Date.now() - 7200000).toISOString(), read: false },
      ]);
    }

    if (savedAllUsers) {
      setAllUsers(JSON.parse(savedAllUsers));
    } else {
      setAllUsers(demoUsers);
      localStorage.setItem('allUsers', JSON.stringify(demoUsers));
    }

    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      const freshUser = JSON.parse(savedAllUsers || JSON.stringify(demoUsers)).find((u: User) => u.id === parsedUser.id);
      setCurrentUser(freshUser || parsedUser);
      if (freshUser && freshUser.role !== 'Player') {
        setCurrentView('agent-dashboard');
      }
    }
  }, []);

  useEffect(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) {
      setSearchResults([]);
      setSearchLoading(false);
      return;
    }

    setSearchLoading(true);
    const timer = setTimeout(() => {
      const results = matches
        .filter((m) =>
          m.team1.toLowerCase().includes(term) ||
          m.team2.toLowerCase().includes(term) ||
          m.sport.toLowerCase().includes(term),
        )
        .slice(0, 20);
      setSearchResults(results);
      setSearchLoading(false);
    }, 250);

    return () => clearTimeout(timer);
  }, [searchTerm, matches]);

  const saveUsers = (users: User[]) => {
    setAllUsers(users);
    localStorage.setItem('allUsers', JSON.stringify(users));
    if (currentUser) {
      const freshUser = users.find((u) => u.id === currentUser.id);
      if (freshUser) {
        setCurrentUser(freshUser);
        localStorage.setItem('currentUser', JSON.stringify(freshUser));
      }
    }
  };

  const saveWalletTransactions = (items: WalletTransaction[]) => {
    setWalletTransactions(items);
    localStorage.setItem('walletTransactions', JSON.stringify(items));
  };

  const addNotification = (type: Notification['type'], title: string, message: string) => {
    const newNotif: Notification = {
      id: `notif-${Date.now()}`,
      type,
      title,
      message,
      timestamp: new Date().toISOString(),
      read: false,
    };
    setNotifications(prev => {
        const updated = [newNotif, ...prev];
        localStorage.setItem('notifications', JSON.stringify(updated));
        return updated;
    });
  };

  const handleLogin = (username: string): boolean => {
    const user = allUsers.find((u) => u.username.toLowerCase() === username.toLowerCase());

    if (user) {
      setCurrentUser(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
      if (user.role !== 'Player') {
        setCurrentView('agent-dashboard');
      } else {
        setCurrentView('home');
      }
      return true;
    } else {
      return false;
    }
  };

  const handleRegister = (newUser: Partial<User>) => {
    const user: User = {
      id: `user-${Date.now()}`,
      username: newUser.username || '',
      email: newUser.email,
      phone: newUser.phone,
      password: newUser.password, // In a real app, hash this!
      fullName: newUser.username, // Default to username
      role: 'Player',
      parentId: null, // Self-registered
      balance: 0,
      exposure: 0,
      creditLimit: 0,
      commission: 0,
      maxBetLimit: 100,
      isBlocked: false,
      twoFactorEnabled: false,
      country: 'Unknown',
      dateOfBirth: '2000-01-01',
      ...newUser,
    };

    const updatedUsers = [...allUsers, user];
    saveUsers(updatedUsers);
    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
    setCurrentView('home');
    setShowAuthModal(false);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    setCurrentView('home');
  };

  const handleProfileOpen = () => {
    if (!currentUser) {
      setShowAuthModal(true);
      return;
    }
    setCurrentView('account');
  };

  const addToBetSlip = (selection: BetSelection) => {
    if (!betSelections.find((s) => s.id === selection.id)) {
      setBetSelections([...betSelections, selection]);
    }
  };

  const removeFromBetSlip = (id: string) => {
    setBetSelections(betSelections.filter((s) => s.id !== id));
  };

  const handlePlaceBet = (bet: PlacedBet) => {
    if (!currentUser) return;

    const stake = parseFloat(bet.stake);
    const available = currentUser.balance - currentUser.exposure;

    if (stake > available) {
      alert('Insufficient Credit Limit!');
      return;
    }

    if (stake > currentUser.maxBetLimit) {
      alert(`Max bet limit exceeded! Limit: ${currentUser.maxBetLimit}`);
      return;
    }

    const newBets = [bet, ...placedBets];
    setPlacedBets(newBets);
    localStorage.setItem('allBets', JSON.stringify(newBets));

    const updatedUsers = allUsers.map((u) => {
      if (u.id === currentUser.id) {
        return { ...u, exposure: u.exposure + stake };
      }
      return u;
    });
    saveUsers(updatedUsers);

    const tx: WalletTransaction = {
      id: `tx-${Date.now()}`,
      type: 'Bet Placed',
      amount: -stake,
      date: new Date().toISOString(),
      note: `${bet.selections.length}-selection bet`,
    };
    saveWalletTransactions([tx, ...walletTransactions]);

    addNotification('success', 'Bet Placed', `Successfully placed $${stake} on ${bet.selections.length} selections.`);

    setBetSelections([]);
    setCurrentView('history');
  };

  const handleCashOut = (betId: string, amount: number) => {
    const bet = placedBets.find((b) => b.id === betId);
    if (!bet || !currentUser) return;
    const originalStake = parseFloat(bet.stake);

    const updatedBets = placedBets.map((b) => (b.id === betId ? { ...b, status: 'Cashed Out' as const } : b));
    setPlacedBets(updatedBets);
    localStorage.setItem('allBets', JSON.stringify(updatedBets));

    const updatedUsers = allUsers.map((u) => {
      if (u.id === currentUser.id) {
        const profitLoss = amount - originalStake;
        return {
          ...u,
          exposure: u.exposure - originalStake,
          balance: u.balance + profitLoss,
        };
      }
      return u;
    });
    saveUsers(updatedUsers);

    const tx: WalletTransaction = {
      id: `tx-${Date.now()}`,
      type: 'Cash Out',
      amount: amount - originalStake,
      date: new Date().toISOString(),
      note: `Bet ${betId} cashed out`,
    };
    saveWalletTransactions([tx, ...walletTransactions]);
    addNotification('success', 'Cash Out Successful', `Cashed out bet for $${amount}.`);
  };

  const handleCreateUser = (userData: Omit<User, 'id'>) => {
    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
    };
    saveUsers([...allUsers, newUser]);
  };

  const handleUpdateBalance = (userId: string, amount: number) => {
    const updatedUsers = allUsers.map((u) => (u.id === userId ? { ...u, balance: Math.max(0, u.balance + amount) } : u));
    saveUsers(updatedUsers);
  };

  const handleToggleBlock = (userId: string) => {
    const updatedUsers = allUsers.map((u) => (u.id === userId ? { ...u, isBlocked: !u.isBlocked } : u));
    saveUsers(updatedUsers);
  };

  const handleSettleBet = (betId: string, result: 'Won' | 'Lost') => {
    const bet = placedBets.find((b) => b.id === betId);
    if (!bet) return;

    const stake = parseFloat(bet.stake);
    const returnAmount = parseFloat(bet.potentialReturn);

    const updatedBets = placedBets.map((b) => (b.id === betId ? { ...b, status: result } : b));
    setPlacedBets(updatedBets);
    localStorage.setItem('allBets', JSON.stringify(updatedBets));

    const updatedUsers = allUsers.map((u) => {
      if (u.id === bet.userId) {
        const newExposure = u.exposure - stake;
        const newBalance = result === 'Won' ? u.balance + (returnAmount - stake) : u.balance - stake;
        return { ...u, balance: newBalance, exposure: newExposure };
      }
      return u;
    });
    saveUsers(updatedUsers);

    const tx: WalletTransaction = {
      id: `tx-${Date.now()}`,
      type: 'Settlement',
      amount: result === 'Won' ? returnAmount - stake : -stake,
      date: new Date().toISOString(),
      note: `Bet ${result}`,
    };
    saveWalletTransactions([tx, ...walletTransactions]);
  };

  const navigateToMatch = (match: LiveMatch) => {
    setActiveMatch(match);
    setCurrentView('match');
  };

  const handleNavChange = (view: 'home' | 'history' | 'all-sports' | 'in-play' | 'account') => {
    if ((view === 'history' || view === 'account') && !currentUser) {
      setShowAuthModal(true);
      return;
    }
    setCurrentView(view);
    if (view === 'home') setActiveMatch(null);
  };

  const handleSportSelect = (sport: string) => {
    setSelectedSport(sport);
    setCurrentView('all-sports');
  };

  const handleHeroNavigate = (target: 'featured' | 'promos' | 'all-sports') => {
    if (target === 'all-sports') {
      setSelectedSport('All');
    }
    setCurrentView(target);
  };

  const handleClaimPromo = (promoId: string) => {
    const updated = promos.map((p) => (p.id === promoId ? { ...p, claimed: true } : p));
    setPromos(updated);
    localStorage.setItem('promos', JSON.stringify(updated));
    addNotification('success', 'Promo Claimed', 'Promotion claimed successfully!');
  };

  const handleWalletChange = (amount: number, type: 'Deposit' | 'Withdraw', method: 'Stripe' | 'PayPal' | 'Crypto') => {
    if (!currentUser || !Number.isFinite(amount) || amount <= 0) return;

    const signed = type === 'Deposit' ? amount : -amount;
    const updatedUsers = allUsers.map((u) => {
      if (u.id === currentUser.id) {
        const nextBalance = Math.max(0, u.balance + signed);
        return { ...u, balance: nextBalance };
      }
      return u;
    });

    saveUsers(updatedUsers);

    const tx: WalletTransaction = {
      id: `tx-${Date.now()}`,
      type,
      amount: signed,
      date: new Date().toISOString(),
      note: `${method} ${type.toLowerCase()}`,
    };
    saveWalletTransactions([tx, ...walletTransactions]);
    addNotification(type === 'Deposit' ? 'success' : 'info', `${type} Successful`, `Your ${type.toLowerCase()} of $${amount} via ${method} was successful.`);
  };

  const handleUpdateRg = (settings: ResponsibleGamingSettings) => {
    setRgSettings(settings);
    localStorage.setItem('rgSettings', JSON.stringify(settings));
  };

  const handleUpdateProfile = (updates: Partial<User>) => {
    if (!currentUser) return;
    const updatedUsers = allUsers.map((u) => (u.id === currentUser.id ? { ...u, ...updates } : u));
    saveUsers(updatedUsers);
  };

  const handleAdminUpdateUser = (userId: string, updates: Partial<User>) => {
    const updatedUsers = allUsers.map((u) => (u.id === userId ? { ...u, ...updates } : u));
    saveUsers(updatedUsers);
  };

  if (currentUser && (currentUser.role === 'Super Admin' || currentUser.role === 'Admin')) {
    return (
      <AdminDashboard
        currentUser={currentUser}
        allUsers={allUsers}
        allBets={placedBets}
        onUpdateUser={handleAdminUpdateUser}
        onSettleBet={handleSettleBet}
        onLogout={handleLogout}
      />
    );
  }

  if (currentUser && currentUser.role !== 'Player') {
    return (
      <AgentDashboard
        currentUser={currentUser}
        allUsers={allUsers}
        allBets={placedBets}
        onCreateUser={handleCreateUser}
        onUpdateBalance={handleUpdateBalance}
        onToggleBlock={handleToggleBlock}
        onSettleBet={handleSettleBet}
        onLogout={handleLogout}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col font-sans relative">
      <Header
        user={currentUser}
        onLoginClick={() => setShowAuthModal(true)}
        onProfileClick={handleProfileOpen}
        onLogoutClick={handleLogout}
        notificationCount={notifications.filter(n => !n.read).length}
        onNotificationsClick={() => setShowNotifications(!showNotifications)}
      />

      {showNotifications && (
        <NotificationsPanel 
            notifications={notifications}
            onMarkAsRead={(id) => setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n))}
            onClearAll={() => setNotifications([])}
            onClose={() => setShowNotifications(false)}
        />
      )}

      <main className="flex-1 w-full mx-auto max-w-6xl">
        {currentView === 'match' && activeMatch ? (
          <MatchDetails match={activeMatch} onBack={() => { setCurrentView('home'); setActiveMatch(null); }} onAddBet={addToBetSlip} />
        ) : currentView === 'history' && currentUser ? (
          <BetHistory bets={placedBets.filter((b) => b.userId === currentUser.id)} onCashOut={handleCashOut} onBrowse={() => setCurrentView('home')} />
        ) : currentView === 'all-sports' ? (
          <AllSportsView
            matches={matches}
            selectedSport={selectedSport}
            onSportChange={setSelectedSport}
            onMatchSelect={navigateToMatch}
            onAddBet={addToBetSlip}
          />
        ) : currentView === 'in-play' ? (
          <InPlayView matches={matches} onMatchSelect={navigateToMatch} onAddBet={addToBetSlip} />
        ) : currentView === 'featured' ? (
          <FeaturedView matches={matches} onMatchSelect={navigateToMatch} onAddBet={addToBetSlip} />
        ) : currentView === 'wallet' ? (
          <WalletView
            user={currentUser}
            transactions={walletTransactions}
            onDeposit={(amt, method) => handleWalletChange(amt, 'Deposit', method)}
            onWithdraw={(amt, method) => handleWalletChange(amt, 'Withdraw', method)}
          />
        ) : currentView === 'promos' ? (
          <PromotionsView promos={promos} onClaim={handleClaimPromo} />
        ) : currentView === 'account' ? (
          <AccountView
            user={currentUser}
            rgSettings={rgSettings}
            onUpdateRg={handleUpdateRg}
            onUpdateProfile={handleUpdateProfile}
            onDeposit={(amt, method) => handleWalletChange(amt, 'Deposit', method)}
            onWithdraw={(amt, method) => handleWalletChange(amt, 'Withdraw', method)}
          />
        ) : (
          <>
            <SubHeader onSearchOpen={() => setShowSearchModal(true)} onSportSelect={handleSportSelect} activeSport={selectedSport} />
            <div className="p-3 space-y-4">
              <Hero onNavigate={handleHeroNavigate} />

              <p className="text-xs text-gray-500 dark:text-gray-500 text-center px-2">
                Returns exclude Bet Credits stake. T&Cs, time limits and exclusions apply.
              </p>

              <QuickActionsBar onGoPromos={() => setCurrentView('promos')} onGoWallet={() => setCurrentView('wallet')} onGoAccount={() => setCurrentView('account')} />

              <SportsTabs activeTab={selectedSport} onTabChange={handleSportSelect} />

              <FeaturedMatches onViewAll={() => setCurrentView('featured')} onOpenMoreLegs={() => setCurrentView('featured')} />


              <HomeExtraLists matches={matches} onMatchSelect={navigateToMatch} />

              <LiveMatches
                matches={matches}
                onMatchesUpdate={setMatches}
                searchTerm={searchTerm}
                sportFilter={selectedSport}
                onMatchSelect={navigateToMatch}
                onAddBet={addToBetSlip}
              />
            </div>
          </>
        )}
      </main>

      <div className="mt-auto pb-0">
        <Footer onLegalClick={(page) => { setLegalPage(page); setShowLegal(true); }} />
      </div>

      <BetSlip
        selections={betSelections}
        onRemove={removeFromBetSlip}
        onClose={() => setBetSelections([])}
        onPlaceBet={(bet) => handlePlaceBet({ ...bet, userId: currentUser?.id || '', username: currentUser?.username || '' })}
        isLoggedIn={!!currentUser}
        onLoginRequired={() => setShowAuthModal(true)}
      />

      <BottomNav currentView={currentView} onChangeView={handleNavChange} />
      <ThemeToggle />

      {showAuthModal && <AuthModal onLogin={handleLogin} onRegister={handleRegister} onClose={() => setShowAuthModal(false)} />}
      {showLegal && <LegalPages initialPage={legalPage} onClose={() => setShowLegal(false)} />}
      <SearchModal
        isOpen={showSearchModal}
        term={searchTerm}
        loading={searchLoading}
        results={searchResults}
        onSearch={setSearchTerm}
        onMatchSelect={(match) => { navigateToMatch(match); setShowSearchModal(false); setSearchTerm(''); }}
        onClose={() => { setShowSearchModal(false); setSearchTerm(''); }}
      />
    </div>
  );
};

export default App;

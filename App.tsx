import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import SubHeader from './components/SubHeader';
import Hero from './components/Hero';
import GamesGrid from './components/GamesGrid';
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
import FeaturedView from './components/FeaturedView';
import NotificationsPanel from './components/NotificationsPanel';
import CasinoComingSoon from './components/CasinoComingSoon';
import Footer from './components/Footer';
import LegalPages from './components/LegalPages';
import { LiveMatch, BetSelection, User, PlacedBet, WalletTransaction, PromoOffer, ResponsibleGamingSettings, Notification, WithdrawalRequest, PaymentGateway, ApiKeyConfig } from './types';
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
  | 'casino'
  | 'agent-dashboard';

const App: React.FC = () => {
  const ALLOWED_SPORTS = new Set(['Soccer', 'Cricket', 'Tennis']);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const [currentView, setCurrentView] = useState<ViewState>('home');
  const [activeMatch, setActiveMatch] = useState<LiveMatch | null>(null);
  const [matches, setMatches] = useState<LiveMatch[]>(demoMatches.filter((m) => ALLOWED_SPORTS.has(m.sport)));
  const [betSelections, setBetSelections] = useState<BetSelection[]>([]);
  const [placedBets, setPlacedBets] = useState<PlacedBet[]>([]);
  const [selectedSport, setSelectedSport] = useState<string>('All');
  const [casinoCategory, setCasinoCategory] = useState<string>('casino');

  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [walletTransactions, setWalletTransactions] = useState<WalletTransaction[]>(demoTransactions);
  const [withdrawalRequests, setWithdrawalRequests] = useState<WithdrawalRequest[]>([]);
  const [paymentGateways, setPaymentGateways] = useState<PaymentGateway[]>([]);
  const [apiKeys, setApiKeys] = useState<ApiKeyConfig[]>([]);
  const [promos, setPromos] = useState<PromoOffer[]>(demoPromos);
  const [rgSettings, setRgSettings] = useState<ResponsibleGamingSettings>(demoRgSettings);

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  
  const [showLegal, setShowLegal] = useState(false);
  const [legalPage, setLegalPage] = useState<'terms' | 'privacy' | 'responsible-gaming' | 'rules'>('terms');

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    const savedAllUsers = localStorage.getItem('allUsers');
    const savedBets = localStorage.getItem('allBets');
    const savedTx = localStorage.getItem('walletTransactions');
    const savedWithdrawals = localStorage.getItem('withdrawalRequests');
    const savedGateways = localStorage.getItem('paymentGateways');
    const savedApiKeys = localStorage.getItem('apiKeys');
    const savedPromos = localStorage.getItem('promos');
    const savedRg = localStorage.getItem('rgSettings');
    const savedNotifications = localStorage.getItem('notifications');

    if (savedBets) setPlacedBets(JSON.parse(savedBets));
    if (savedTx) setWalletTransactions(JSON.parse(savedTx));
    if (savedWithdrawals) setWithdrawalRequests(JSON.parse(savedWithdrawals));
    if (savedGateways) {
      setPaymentGateways(JSON.parse(savedGateways));
    } else {
      const defaultGateways: PaymentGateway[] = [
        { id: 'gw-1', name: 'USDT TRC20', type: 'Crypto', enabled: true, feePercent: 0.5, minAmount: 5, maxAmount: 100000 },
        { id: 'gw-2', name: 'Local Bank Transfer', type: 'Local', enabled: true, feePercent: 1.2, minAmount: 2, maxAmount: 50000 },
        { id: 'gw-3', name: 'Stripe Cards', type: 'Card', enabled: false, feePercent: 2.5, minAmount: 10, maxAmount: 10000 },
      ];
      setPaymentGateways(defaultGateways);
      localStorage.setItem('paymentGateways', JSON.stringify(defaultGateways));
    }
    if (savedApiKeys) {
      setApiKeys(JSON.parse(savedApiKeys));
    } else {
      const defaultApiKeys: ApiKeyConfig[] = [
        { id: 'api-1', provider: 'Sportsbook Feed', key: '', secret: '', enabled: false, updatedAt: new Date().toISOString() },
        { id: 'api-2', provider: 'Live Casino', key: '', secret: '', enabled: false, updatedAt: new Date().toISOString() },
        { id: 'api-3', provider: 'Virtual Games', key: '', secret: '', enabled: false, updatedAt: new Date().toISOString() },
      ];
      setApiKeys(defaultApiKeys);
      localStorage.setItem('apiKeys', JSON.stringify(defaultApiKeys));
    }
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

  const saveWithdrawalRequests = (items: WithdrawalRequest[]) => {
    setWithdrawalRequests(items);
    localStorage.setItem('withdrawalRequests', JSON.stringify(items));
  };

  const savePaymentGateways = (items: PaymentGateway[]) => {
    setPaymentGateways(items);
    localStorage.setItem('paymentGateways', JSON.stringify(items));
  };

  const saveApiKeys = (items: ApiKeyConfig[]) => {
    setApiKeys(items);
    localStorage.setItem('apiKeys', JSON.stringify(items));
  };

  const generateWithdrawClaimCode = () => {
    const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    do {
      code = Array.from({ length: 8 }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join('');
    } while (withdrawalRequests.some((r) => r.claimCode === code));
    return code;
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

    if (currentUser.exposureLimit && currentUser.exposure + stake > currentUser.exposureLimit) {
      alert(`Exposure limit exceeded! Limit: ${currentUser.exposureLimit}`);
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
      userId: currentUser.id,
      actorId: currentUser.id,
      type: 'Bet Placed',
      method: 'Agent',
      amount: -stake,
      date: new Date().toISOString(),
      note: `${bet.selections.length}-selection bet`,
      status: 'Completed',
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
      userId: currentUser.id,
      actorId: currentUser.id,
      type: 'Cash Out',
      method: 'Agent',
      amount: amount - originalStake,
      date: new Date().toISOString(),
      note: `Bet ${betId} cashed out`,
      status: 'Completed',
    };
    saveWalletTransactions([tx, ...walletTransactions]);
    addNotification('success', 'Cash Out Successful', `Cashed out bet for $${amount}.`);
  };

  const handleCreateUser = (userData: Omit<User, 'id'>) => {
    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      exposureLimit: userData.exposureLimit ?? userData.creditLimit,
    };
    saveUsers([...allUsers, newUser]);
  };

  const handleUpdateBalance = (userId: string, amount: number) => {
    const updatedUsers = allUsers.map((u) => (u.id === userId ? { ...u, balance: Math.max(0, u.balance + amount) } : u));
    saveUsers(updatedUsers);

    const target = allUsers.find((u) => u.id === userId);
    if (target && amount !== 0) {
      const tx: WalletTransaction = {
        id: `tx-${Date.now()}`,
        userId: target.id,
        actorId: currentUser?.id || 'system',
        type: amount > 0 ? 'Deposit' : 'Withdraw',
        method: 'Agent',
        amount,
        date: new Date().toISOString(),
        note: `Manual ${amount > 0 ? 'credit' : 'debit'} by ${currentUser?.username || 'system'}`,
        status: 'Completed',
      };
      saveWalletTransactions([tx, ...walletTransactions]);
    }
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
      userId: bet.userId,
      actorId: currentUser?.id || 'system',
      type: 'Settlement',
      method: 'Agent',
      amount: result === 'Won' ? returnAmount - stake : -stake,
      date: new Date().toISOString(),
      note: `Bet ${result}`,
      status: 'Completed',
    };
    saveWalletTransactions([tx, ...walletTransactions]);
  };

  const handleVoidBet = (betId: string) => {
    const bet = placedBets.find((b) => b.id === betId);
    if (!bet || bet.status !== 'Open') return;

    const stake = parseFloat(bet.stake);

    const updatedBets = placedBets.map((b) => (b.id === betId ? { ...b, status: 'Voided' as const } : b));
    setPlacedBets(updatedBets);
    localStorage.setItem('allBets', JSON.stringify(updatedBets));

    // Refund: release exposure, no balance change (stake was only locked as exposure)
    const updatedUsers = allUsers.map((u) => {
      if (u.id === bet.userId) {
        return { ...u, exposure: Math.max(0, u.exposure - stake) };
      }
      return u;
    });
    saveUsers(updatedUsers);

    const tx: WalletTransaction = {
      id: `tx-${Date.now()}`,
      userId: bet.userId,
      actorId: currentUser?.id || 'system',
      type: 'Settlement',
      method: 'Agent',
      amount: 0,
      date: new Date().toISOString(),
      note: `Bet voided — stake refunded`,
      status: 'Completed',
    };
    saveWalletTransactions([tx, ...walletTransactions]);
    addNotification('info', 'Bet Voided', `Bet ${betId} has been voided and stake refunded.`);
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

  const handleHeroNavigate = (target: 'featured' | 'promos' | 'all-sports' | 'in-play') => {
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
    if (type === 'Deposit' && currentUser.role === 'Player') {
      addNotification('warning', 'Agent Deposit Required', 'Deposits are agent-based only. Please contact your assigned agent.');
      return;
    }
    if (type === 'Withdraw' && method !== 'Crypto') {
      addNotification('warning', 'Crypto Only Withdrawal', 'Withdrawals are only available via Crypto (USDT TRC20).');
      return;
    }

    if (type === 'Withdraw' && currentUser.role === 'Player') {
      const available = Math.max(currentUser.balance - currentUser.exposure, 0);
      if (amount > available) {
        addNotification('error', 'Withdrawal Failed', 'Insufficient available balance for withdrawal.');
        return;
      }

      const claimCode = generateWithdrawClaimCode();
      const request: WithdrawalRequest = {
        id: `wd-${Date.now()}`,
        userId: currentUser.id,
        username: currentUser.username,
        claimCode,
        amount,
        method: 'Crypto',
        network: 'USDT-TRC20',
        walletAddress: 'To be provided in backend flow',
        status: 'Pending',
        requestedAt: new Date().toISOString(),
      };
      saveWithdrawalRequests([request, ...withdrawalRequests]);

      const pendingTx: WalletTransaction = {
        id: `tx-${Date.now()}`,
        userId: currentUser.id,
        actorId: currentUser.id,
        withdrawalRequestId: request.id,
        type: 'Withdraw',
        method: 'Crypto',
        amount: -amount,
        date: new Date().toISOString(),
        note: `Agent withdrawal code generated: ${claimCode}`,
        status: 'Pending',
      };
      saveWalletTransactions([pendingTx, ...walletTransactions]);
      addNotification('info', 'Withdrawal Code Generated', `Use code ${claimCode} with your agent to complete $${amount} withdrawal.`);
      return;
    }

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
      userId: currentUser.id,
      actorId: currentUser.id,
      type,
      method: type === 'Deposit' ? 'Agent' : method,
      amount: signed,
      date: new Date().toISOString(),
      note: `${method} ${type.toLowerCase()}`,
      status: 'Completed',
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

  const handleApproveWithdrawal = (requestId: string, adminNote?: string) => {
    const request = withdrawalRequests.find((r) => r.id === requestId);
    if (!request || request.status !== 'Pending') return;

    const user = allUsers.find((u) => u.id === request.userId);
    if (!user || user.balance < request.amount) {
      addNotification('error', 'Approval Failed', 'Insufficient balance for withdrawal approval.');
      return;
    }

    const updatedUsers = allUsers.map((u) =>
      u.id === request.userId ? { ...u, balance: Math.max(0, u.balance - request.amount) } : u,
    );
    saveUsers(updatedUsers);

    const reviewed = withdrawalRequests.map((r) =>
      r.id === requestId
        ? {
            ...r,
            status: 'Approved' as const,
            reviewedAt: new Date().toISOString(),
            reviewedBy: currentUser?.username || 'admin',
            adminNote,
          }
        : r,
    );
    saveWithdrawalRequests(reviewed);

    const tx: WalletTransaction = {
      id: `tx-${Date.now()}`,
      userId: request.userId,
      actorId: currentUser?.id || 'admin',
      type: 'Withdraw',
      method: 'Crypto',
      amount: -request.amount,
      date: new Date().toISOString(),
      note: `Withdrawal approved (${request.network})`,
      status: 'Completed',
    };
    saveWalletTransactions([tx, ...walletTransactions]);
  };

  const handleRejectWithdrawal = (requestId: string, adminNote?: string) => {
    const request = withdrawalRequests.find((r) => r.id === requestId);
    if (!request || request.status !== 'Pending') return;

    const reviewed = withdrawalRequests.map((r) =>
      r.id === requestId
        ? {
            ...r,
            status: 'Rejected' as const,
            reviewedAt: new Date().toISOString(),
            reviewedBy: currentUser?.username || 'admin',
            adminNote,
          }
        : r,
    );
    saveWithdrawalRequests(reviewed);

    const tx: WalletTransaction = {
      id: `tx-${Date.now()}`,
      userId: request.userId,
      actorId: currentUser?.id || 'admin',
      type: 'Withdraw',
      method: 'Crypto',
      amount: -request.amount,
      date: new Date().toISOString(),
      note: `Withdrawal rejected${adminNote ? `: ${adminNote}` : ''}`,
      status: 'Rejected',
    };
    saveWalletTransactions([tx, ...walletTransactions]);
  };

  const handleAgentProcessWithdrawalByCode = (code: string): { ok: boolean; message: string } => {
    if (!currentUser || currentUser.role === 'Player') {
      return { ok: false, message: 'Only agent-level users can process withdrawal codes.' };
    }

    const normalized = code.trim().toUpperCase();
    if (!normalized) {
      return { ok: false, message: 'Enter a valid withdrawal code.' };
    }

    const request = withdrawalRequests.find((r) => r.status === 'Pending' && r.claimCode === normalized);
    if (!request) {
      return { ok: false, message: 'Code not found or already used.' };
    }

    const requester = allUsers.find((u) => u.id === request.userId);
    if (!requester) {
      return { ok: false, message: 'Player account not found for this code.' };
    }

    if (requester.parentId !== currentUser.id) {
      return { ok: false, message: 'This code belongs to another agent downline.' };
    }

    const available = Math.max(requester.balance - requester.exposure, 0);
    if (available < request.amount) {
      return { ok: false, message: 'Player balance is too low for this withdrawal.' };
    }

    const updatedUsers = allUsers.map((u) =>
      u.id === requester.id ? { ...u, balance: Math.max(0, u.balance - request.amount) } : u,
    );
    saveUsers(updatedUsers);

    const reviewedAt = new Date().toISOString();
    const reviewed = withdrawalRequests.map((r) =>
      r.id === request.id
        ? {
            ...r,
            status: 'Approved' as const,
            reviewedAt,
            reviewedBy: currentUser.username,
            processedByAgentId: currentUser.id,
            processedAt: reviewedAt,
            adminNote: r.adminNote || 'Processed by agent with withdrawal code',
          }
        : r,
    );
    saveWithdrawalRequests(reviewed);

    const updatedTx = walletTransactions.map((tx) =>
      tx.withdrawalRequestId === request.id && tx.status === 'Pending'
        ? {
            ...tx,
            actorId: currentUser.id,
            status: 'Completed' as const,
            note: `Withdrawal paid by agent ${currentUser.username} (code ${normalized})`,
          }
        : tx,
    );
    saveWalletTransactions(updatedTx);

    addNotification(
      'success',
      'Withdrawal Processed',
      `${request.username} withdrawal of $${request.amount.toFixed(2)} was processed by ${currentUser.username}.`,
    );

    return { ok: true, message: `Withdrawal code ${normalized} processed for $${request.amount.toFixed(2)}.` };
  };

  const handleGatewayUpdate = (gatewayId: string, updates: Partial<PaymentGateway>) => {
    const updated = paymentGateways.map((g) => (g.id === gatewayId ? { ...g, ...updates } : g));
    savePaymentGateways(updated);
  };

  const handleApiKeyUpdate = (id: string, updates: Partial<ApiKeyConfig>) => {
    const updated = apiKeys.map((k) => (k.id === id ? { ...k, ...updates, updatedAt: new Date().toISOString() } : k));
    saveApiKeys(updated);
  };

  const handleAdminFundUser = (userId: string, amount: number) => {
    if (!currentUser || !Number.isFinite(amount) || amount === 0) return;
    const updatedUsers = allUsers.map((u) => (u.id === userId ? { ...u, balance: Math.max(0, u.balance + amount) } : u));
    saveUsers(updatedUsers);

    const target = allUsers.find((u) => u.id === userId);
    if (!target) return;
    const tx: WalletTransaction = {
      id: `tx-${Date.now()}`,
      userId: target.id,
      actorId: currentUser.id,
      type: amount > 0 ? 'Deposit' : 'Withdraw',
      method: 'Agent',
      amount,
      date: new Date().toISOString(),
      note: `Admin ${amount > 0 ? 'fund' : 'debit'} by ${currentUser.username}`,
      status: 'Completed',
    };
    saveWalletTransactions([tx, ...walletTransactions]);
  };

  const liveCounts = useMemo(() =>
    matches.filter((m) => m.isLive).reduce<Record<string, number>>((acc, m) => {
      acc[m.sport] = (acc[m.sport] || 0) + 1;
      return acc;
    }, {}),
  [matches]);

  const assignedAgent = currentUser?.parentId
    ? allUsers.find((u) => u.id === currentUser.parentId) || null
    : null;

  const latestPendingWithdrawal = useMemo(() => {
    if (!currentUser) return null;
    return (
      [...withdrawalRequests]
        .filter((r) => r.userId === currentUser.id && r.status === 'Pending')
        .sort((a, b) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime())[0] || null
    );
  }, [currentUser, withdrawalRequests]);

  if (currentUser && (currentUser.role === 'Super Admin' || currentUser.role === 'Admin')) {
    return (
      <AdminDashboard
        currentUser={currentUser}
        allUsers={allUsers}
        allBets={placedBets}
        walletTransactions={walletTransactions}
        withdrawalRequests={withdrawalRequests}
        paymentGateways={paymentGateways}
        apiKeys={apiKeys}
        onCreateUser={handleCreateUser}
        onUpdateUser={handleAdminUpdateUser}
        onFundUser={handleAdminFundUser}
        onApproveWithdrawal={handleApproveWithdrawal}
        onRejectWithdrawal={handleRejectWithdrawal}
        onUpdateGateway={handleGatewayUpdate}
        onUpdateApiKey={handleApiKeyUpdate}
        onSettleBet={handleSettleBet}
        onVoidBet={handleVoidBet}
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
        withdrawalRequests={withdrawalRequests}
        onCreateUser={handleCreateUser}
        onUpdateBalance={handleUpdateBalance}
        onUpdateUser={handleAdminUpdateUser}
        walletTransactions={walletTransactions}
        onProcessWithdrawalCode={handleAgentProcessWithdrawalByCode}
        onToggleBlock={handleToggleBlock}
        onSettleBet={handleSettleBet}
        onUpdateProfile={handleUpdateProfile}
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
            agentProfile={assignedAgent}
            transactions={walletTransactions}
            pendingWithdrawal={latestPendingWithdrawal}
            onDeposit={(amt, method) => handleWalletChange(amt, 'Deposit', method)}
            onWithdraw={(amt, method) => handleWalletChange(amt, 'Withdraw', method)}
            onGoAccount={() => setCurrentView('account')}
            onGoPromos={() => setCurrentView('promos')}
          />
        ) : currentView === 'promos' ? (
          <PromotionsView promos={promos} onClaim={handleClaimPromo} onGoWallet={() => setCurrentView('wallet')} />
        ) : currentView === 'casino' ? (
          <CasinoComingSoon category={casinoCategory} onBack={() => setCurrentView('home')} />
        ) : currentView === 'account' ? (
          <AccountView
            user={currentUser}
            agentProfile={assignedAgent}
            rgSettings={rgSettings}
            pendingWithdrawal={latestPendingWithdrawal}
            onUpdateRg={handleUpdateRg}
            onUpdateProfile={handleUpdateProfile}
            onDeposit={(amt, method) => handleWalletChange(amt, 'Deposit', method)}
            onWithdraw={(amt, method) => handleWalletChange(amt, 'Withdraw', method)}
          />
        ) : (
          <>
            <SubHeader
              activeCategory="home"
              onCategorySelect={(cat) => {
                if (cat === 'sports' || cat === 'football' || cat === 'cricket' || cat === 'tennis') {
                  if (cat === 'sports') handleSportSelect('All');
                  else if (cat === 'football') handleSportSelect('Soccer');
                  else handleSportSelect(cat.charAt(0).toUpperCase() + cat.slice(1));
                }
                else if (cat === 'in-play') setCurrentView('in-play');
                else if (cat === 'multi') setCurrentView('featured');
                else if (['casino', 'slot', 'table', 'fishing', 'lottery', 'arcade'].includes(cat)) {
                  setCasinoCategory(cat);
                  setCurrentView('casino');
                }
              }}
              liveCounts={liveCounts}
            />
            <div className="p-3 space-y-5">
              <Hero onNavigate={handleHeroNavigate} matches={matches} />

              <GamesGrid />

              <p className="text-xs text-gray-500 dark:text-gray-500 text-center px-2 pb-4">
                Returns exclude Bet Credits stake. T&Cs, time limits and exclusions apply.
              </p>
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

      {showAuthModal && <AuthModal onLogin={handleLogin} onRegister={handleRegister} allowRegistration={false} onClose={() => setShowAuthModal(false)} />}
      {showLegal && <LegalPages initialPage={legalPage} onClose={() => setShowLegal(false)} />}
    </div>
  );
};

export default App;

export interface LiveMatch {
  id: string;
  time: string;
  team1: string;
  team2: string;
  score1?: number;
  score2?: number;
  odds1: string;
  oddsX: string;
  odds2: string;
  isLive: boolean;
  sport: 'Soccer' | 'Cricket' | 'Tennis' | 'Basketball' | 'American Football' | 'Baseball' | 'Hockey' | 'Esports';
  league?: string;
  stats?: MatchStats;
  formHome?: string[];
  formAway?: string[];
  extraMarkets?: {
    name: string;
    odds: { label: string; value: string }[];
  }[];
}

export interface MatchStats {
  possessionHome: number;
  possessionAway: number;
  shotsHome: number;
  shotsAway: number;
  cornersHome: number;
  cornersAway: number;
}

export interface FeaturedBet {
  id: string;
  type: 'acca' | 'boost';
  title: string;
  matchTitle?: string;
  legs?: string[];
  matches?: { name: string; icon: string; iconColor: string }[];
  oldOdds?: string;
  newOdds: string;
  boostAmount?: string;
  fireCount?: string;
  stakeReturns?: string;
}

export interface BetSelection {
  id: string;
  selectionName: string;
  marketName: string;
  matchTitle: string;
  odds: string;
}

export type UserRole = 'Super Admin' | 'Admin' | 'Senior Super' | 'Super Master' | 'Master' | 'Agent' | 'Player';

export interface User {
  id: string;
  username: string;
  password?: string; // For mock auth
  fullName?: string;
  email?: string;
  phone?: string;
  country?: string;
  dateOfBirth?: string;
  avatarUrl?: string;
  twoFactorEnabled?: boolean;
  role: UserRole;
  parentId: string | null; // ID of the agent who created this user
  balance: number; // Current funds allocated
  exposure: number; // Funds currently locked in open bets
  creditLimit: number; // Max credit allowed
  exposureLimit?: number; // Max exposure allowed
  commission: number; // Percentage
  maxBetLimit: number;
  isBlocked: boolean;
}

export interface PlacedBet {
  id: string;
  userId: string;
  username: string;
  selections: BetSelection[];
  stake: string;
  totalOdds: string;
  potentialReturn: string;
  status: 'Open' | 'Won' | 'Lost' | 'Cashed Out' | 'Voided';
  date: string;
}

export interface WalletTransaction {
  id: string;
  userId?: string;
  actorId?: string;
  withdrawalRequestId?: string;
  type: 'Deposit' | 'Withdraw' | 'Bet Placed' | 'Settlement' | 'Cash Out';
  method?: 'Stripe' | 'PayPal' | 'Crypto' | 'Agent';
  amount: number;
  date: string;
  note: string;
  status?: 'Completed' | 'Pending' | 'Rejected';
}

export interface WithdrawalRequest {
  id: string;
  userId: string;
  username: string;
  claimCode: string;
  amount: number;
  method: 'Crypto';
  network: string;
  walletAddress: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  requestedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  adminNote?: string;
  processedByAgentId?: string;
  processedAt?: string;
}

export interface PaymentGateway {
  id: string;
  name: string;
  type: 'Local' | 'Crypto' | 'Card' | 'Wallet';
  enabled: boolean;
  feePercent: number;
  minAmount: number;
  maxAmount: number;
}

export interface ApiKeyConfig {
  id: string;
  provider: string;
  key: string;
  secret?: string;
  enabled: boolean;
  updatedAt: string;
}

export interface PromoOffer {
  id: string;
  title: string;
  description: string;
  tag: string;
  claimed: boolean;
}

export interface ResponsibleGamingSettings {
  dailyStakeLimit: number;
  dailyLossLimit: number;
  sessionReminderMinutes: number;
}

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

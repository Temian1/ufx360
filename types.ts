export interface LiveMatch {
  id: string;
  time: string;
  team1: string;
  team2: string;
  odds1: string;
  oddsX: string;
  odds2: string;
  isLive: boolean;
  sport: 'Soccer' | 'Cricket' | 'Tennis' | 'Basketball' | 'American Football' | 'Baseball' | 'Hockey' | 'Esports';
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
  status: 'Open' | 'Won' | 'Lost' | 'Cashed Out';
  date: string;
}

export interface WalletTransaction {
  id: string;
  type: 'Deposit' | 'Withdraw' | 'Bet Placed' | 'Settlement' | 'Cash Out';
  amount: number;
  date: string;
  note: string;
}

export interface PromoOffer {
  id: string;
  title: string;
  description: string;
  tag: string;
  claimed: boolean;
}

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

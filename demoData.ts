import { LiveMatch, PromoOffer, ResponsibleGamingSettings, User, WalletTransaction } from './types';

export const demoMatches: LiveMatch[] = [
  { id: '1', time: '67:14', team1: 'Arsenal', team2: 'Chelsea', score1: 2, score2: 1, odds1: '2.04', oddsX: '3.35', odds2: '3.50', isLive: true, sport: 'Soccer', league: 'Premier League', stats: { possessionHome: 56, possessionAway: 44, shotsHome: 9, shotsAway: 6, cornersHome: 5, cornersAway: 3 }, formHome: ['W', 'W', 'D', 'W', 'L'], formAway: ['W', 'D', 'L', 'W', 'W'] },
  { id: '2', time: '59:22', team1: 'Liverpool', team2: 'Tottenham', score1: 3, score2: 0, odds1: '1.92', oddsX: '3.60', odds2: '4.10', isLive: true, sport: 'Soccer', league: 'Premier League', stats: { possessionHome: 61, possessionAway: 39, shotsHome: 11, shotsAway: 4, cornersHome: 6, cornersAway: 2 }, formHome: ['W', 'W', 'W', 'D', 'W'], formAway: ['W', 'L', 'W', 'D', 'W'] },
  { id: '3', time: '72:03', team1: 'Man City', team2: 'Newcastle', score1: 2, score2: 0, odds1: '1.75', oddsX: '4.10', odds2: '4.90', isLive: true, sport: 'Soccer', league: 'Premier League', stats: { possessionHome: 64, possessionAway: 36, shotsHome: 13, shotsAway: 5, cornersHome: 7, cornersAway: 2 }, formHome: ['W', 'W', 'W', 'W', 'W'], formAway: ['D', 'W', 'L', 'W', 'D'] },
  { id: '4', time: '48:55', team1: 'Man Utd', team2: 'West Ham', score1: 1, score2: 1, odds1: '2.30', oddsX: '3.25', odds2: '3.05', isLive: true, sport: 'Soccer', league: 'Premier League', stats: { possessionHome: 49, possessionAway: 51, shotsHome: 6, shotsAway: 7, cornersHome: 3, cornersAway: 4 }, formHome: ['D', 'W', 'L', 'W', 'W'], formAway: ['L', 'W', 'W', 'D', 'L'] },
  { id: '5', time: '39:18', team1: 'Barcelona', team2: 'Atletico Madrid', score1: 1, score2: 0, odds1: '2.11', oddsX: '3.10', odds2: '3.70', isLive: true, sport: 'Soccer', league: 'La Liga', stats: { possessionHome: 58, possessionAway: 42, shotsHome: 8, shotsAway: 4, cornersHome: 4, cornersAway: 2 }, formHome: ['W', 'W', 'W', 'D', 'W'], formAway: ['W', 'D', 'W', 'W', 'L'] },
  { id: '6', time: '65:47', team1: 'Real Madrid', team2: 'Sevilla', score1: 3, score2: 1, odds1: '1.84', oddsX: '3.55', odds2: '4.40', isLive: true, sport: 'Soccer', league: 'La Liga', stats: { possessionHome: 54, possessionAway: 46, shotsHome: 10, shotsAway: 7, cornersHome: 5, cornersAway: 4 }, formHome: ['W', 'W', 'D', 'W', 'W'], formAway: ['L', 'D', 'W', 'L', 'W'] },
  { id: '7', time: '53:28', team1: 'Inter Milan', team2: 'AC Milan', score1: 1, score2: 2, odds1: '2.42', oddsX: '3.05', odds2: '2.95', isLive: true, sport: 'Soccer', league: 'Serie A', stats: { possessionHome: 47, possessionAway: 53, shotsHome: 7, shotsAway: 8, cornersHome: 3, cornersAway: 5 }, formHome: ['W', 'W', 'L', 'W', 'D'], formAway: ['W', 'L', 'W', 'W', 'D'] },
  { id: '8', time: '44:50', team1: 'Juventus', team2: 'Roma', score1: 0, score2: 0, odds1: '2.27', oddsX: '3.00', odds2: '3.40', isLive: true, sport: 'Soccer', league: 'Serie A', stats: { possessionHome: 52, possessionAway: 48, shotsHome: 6, shotsAway: 5, cornersHome: 4, cornersAway: 3 }, formHome: ['W', 'D', 'W', 'L', 'W'], formAway: ['D', 'W', 'L', 'W', 'W'] },
  { id: '9', time: '70:31', team1: 'Bayern', team2: 'Leverkusen', score1: 2, score2: 2, odds1: '2.20', oddsX: '3.45', odds2: '2.95', isLive: true, sport: 'Soccer', league: 'Bundesliga', stats: { possessionHome: 55, possessionAway: 45, shotsHome: 12, shotsAway: 9, cornersHome: 6, cornersAway: 4 }, formHome: ['W', 'W', 'W', 'W', 'L'], formAway: ['W', 'W', 'D', 'W', 'W'] },
  { id: '10', time: '61:16', team1: 'PSG', team2: 'Marseille', score1: 2, score2: 0, odds1: '1.98', oddsX: '3.30', odds2: '3.95', isLive: true, sport: 'Soccer', league: 'Ligue 1', stats: { possessionHome: 62, possessionAway: 38, shotsHome: 10, shotsAway: 5, cornersHome: 5, cornersAway: 3 }, formHome: ['W', 'W', 'D', 'W', 'W'], formAway: ['W', 'D', 'L', 'W', 'L'] },
  { id: '11', time: '57:43', team1: 'Ajax', team2: 'PSV', score1: 1, score2: 1, odds1: '2.60', oddsX: '3.50', odds2: '2.40', isLive: true, sport: 'Soccer', league: 'Eredivisie', stats: { possessionHome: 51, possessionAway: 49, shotsHome: 7, shotsAway: 8, cornersHome: 4, cornersAway: 4 }, formHome: ['W', 'L', 'W', 'D', 'W'], formAway: ['W', 'W', 'W', 'D', 'W'] },
  { id: '12', time: '34:11', team1: 'Benfica', team2: 'Porto', score1: 0, score2: 1, odds1: '2.32', oddsX: '3.15', odds2: '2.98', isLive: true, sport: 'Soccer', league: 'Primeira Liga', stats: { possessionHome: 48, possessionAway: 52, shotsHome: 5, shotsAway: 6, cornersHome: 2, cornersAway: 3 }, formHome: ['W', 'W', 'L', 'W', 'D'], formAway: ['W', 'D', 'W', 'W', 'L'] },
  { id: '13', time: '26:09', team1: 'Santos', team2: 'Flamengo', score1: 0, score2: 2, odds1: '2.88', oddsX: '3.00', odds2: '2.45', isLive: true, sport: 'Soccer', league: 'Brasileirão', stats: { possessionHome: 43, possessionAway: 57, shotsHome: 3, shotsAway: 7, cornersHome: 1, cornersAway: 4 }, formHome: ['L', 'W', 'D', 'L', 'W'], formAway: ['W', 'W', 'D', 'W', 'W'] },
  { id: '14', time: '76:48', team1: 'Boca Juniors', team2: 'River Plate', score1: 1, score2: 1, odds1: '2.70', oddsX: '2.85', odds2: '2.75', isLive: true, sport: 'Soccer', league: 'Liga Profesional', stats: { possessionHome: 50, possessionAway: 50, shotsHome: 6, shotsAway: 6, cornersHome: 3, cornersAway: 3 }, formHome: ['W', 'D', 'W', 'W', 'L'], formAway: ['W', 'W', 'D', 'L', 'W'] },
  { id: '15', time: '63:07', team1: 'LA Galaxy', team2: 'Inter Miami', score1: 0, score2: 1, odds1: '2.44', oddsX: '3.52', odds2: '2.65', isLive: true, sport: 'Soccer', league: 'MLS', stats: { possessionHome: 46, possessionAway: 54, shotsHome: 5, shotsAway: 8, cornersHome: 2, cornersAway: 5 }, formHome: ['D', 'W', 'L', 'W', 'D'], formAway: ['W', 'W', 'D', 'W', 'L'] },
  { id: '16', time: '68:30', team1: 'Al Ahly', team2: 'Zamalek', score1: 2, score2: 0, odds1: '2.26', oddsX: '2.95', odds2: '3.20', isLive: true, sport: 'Soccer', league: 'Egyptian Premier League', stats: { possessionHome: 53, possessionAway: 47, shotsHome: 7, shotsAway: 5, cornersHome: 4, cornersAway: 2 }, formHome: ['W', 'W', 'W', 'D', 'W'], formAway: ['W', 'D', 'W', 'L', 'D'] },

  { id: '17', time: 'Set 2', team1: 'Novak Djokovic', team2: 'Carlos Alcaraz', score1: 1, score2: 0, odds1: '1.72', oddsX: '-', odds2: '2.08', isLive: true, sport: 'Tennis', league: 'ATP Tour' },
  { id: '18', time: 'Set 3', team1: 'Jannik Sinner', team2: 'Daniil Medvedev', score1: 2, score2: 1, odds1: '1.94', oddsX: '-', odds2: '1.92', isLive: true, sport: 'Tennis', league: 'ATP Tour' },
  { id: '19', time: 'Set 1', team1: 'Alexander Zverev', team2: 'Stefanos Tsitsipas', score1: 0, score2: 0, odds1: '1.88', oddsX: '-', odds2: '2.02', isLive: true, sport: 'Tennis', league: 'ATP Tour' },
  { id: '20', time: 'Set 2', team1: 'Iga Swiatek', team2: 'Aryna Sabalenka', score1: 1, score2: 1, odds1: '1.65', oddsX: '-', odds2: '2.22', isLive: true, sport: 'Tennis', league: 'WTA Tour' },
  { id: '21', time: 'Set 3', team1: 'Coco Gauff', team2: 'Elena Rybakina', score1: 1, score2: 2, odds1: '2.05', oddsX: '-', odds2: '1.81', isLive: true, sport: 'Tennis', league: 'WTA Tour' },
  { id: '22', time: 'Set 1', team1: 'Naomi Osaka', team2: 'Ons Jabeur', score1: 0, score2: 0, odds1: '2.14', oddsX: '-', odds2: '1.77', isLive: true, sport: 'Tennis', league: 'WTA Tour' },

  { id: '23', time: '14.3 Ov', team1: 'India', team2: 'Australia', score1: 142, score2: 0, odds1: '1.82', oddsX: '-', odds2: '2.02', isLive: true, sport: 'Cricket', league: 'ICC World Cup' },
  { id: '24', time: '11.2 Ov', team1: 'England', team2: 'Pakistan', score1: 98, score2: 0, odds1: '1.95', oddsX: '-', odds2: '1.90', isLive: true, sport: 'Cricket', league: 'ICC World Cup' },
  { id: '25', time: '9.6 Ov', team1: 'South Africa', team2: 'New Zealand', score1: 76, score2: 0, odds1: '2.08', oddsX: '-', odds2: '1.78', isLive: true, sport: 'Cricket', league: 'T20 International' },
  { id: '26', time: '16.1 Ov', team1: 'Sri Lanka', team2: 'Bangladesh', score1: 158, score2: 0, odds1: '1.84', oddsX: '-', odds2: '2.05', isLive: true, sport: 'Cricket', league: 'T20 International' },

  { id: '27', time: 'Q3 08:12', team1: 'Lakers', team2: 'Celtics', score1: 78, score2: 82, odds1: '2.05', oddsX: '-', odds2: '1.80', isLive: true, sport: 'Basketball', league: 'NBA' },
  { id: '28', time: 'Q2 01:42', team1: 'Warriors', team2: 'Nuggets', score1: 45, score2: 48, odds1: '1.92', oddsX: '-', odds2: '1.94', isLive: true, sport: 'Basketball', league: 'NBA' },

  { id: '29', time: 'Q4 06:30', team1: 'Chiefs', team2: 'Bills', score1: 24, score2: 21, odds1: '1.88', oddsX: '-', odds2: '2.00', isLive: true, sport: 'American Football', league: 'NFL' },
  { id: '30', time: 'Q3 03:57', team1: '49ers', team2: 'Eagles', score1: 17, score2: 14, odds1: '2.02', oddsX: '-', odds2: '1.86', isLive: true, sport: 'American Football', league: 'NFL' },

  { id: '31', time: 'Top 6th', team1: 'Yankees', team2: 'Red Sox', score1: 3, score2: 2, odds1: '1.93', oddsX: '-', odds2: '1.95', isLive: true, sport: 'Baseball', league: 'MLB' },
  { id: '32', time: '2nd 11:08', team1: 'Rangers', team2: 'Maple Leafs', score1: 2, score2: 1, odds1: '2.04', oddsX: '-', odds2: '1.83', isLive: true, sport: 'Hockey', league: 'NHL' },
];

export const demoUsers: User[] = [
  {
    id: '1',
    username: 'admin',
    fullName: 'System Admin',
    email: 'admin@demo.bet',
    phone: '+1 555 0100',
    country: 'United States',
    dateOfBirth: '1985-04-09',
    role: 'Super Admin',
    parentId: null,
    balance: 1000000,
    exposure: 0,
    creditLimit: 1000000,
    commission: 0,
    maxBetLimit: 50000,
    isBlocked: false,
    twoFactorEnabled: true,
  },
  {
    id: '2',
    username: 'agent',
    fullName: 'Demo Agent',
    email: 'agent@demo.bet',
    phone: '+1 555 0101',
    country: 'United States',
    dateOfBirth: '1990-07-11',
    role: 'Agent',
    parentId: '1',
    balance: 50000,
    exposure: 0,
    creditLimit: 50000,
    commission: 2,
    maxBetLimit: 10000,
    isBlocked: false,
    twoFactorEnabled: true,
  },
  {
    id: '3',
    username: 'player',
    fullName: 'Demo Player',
    email: 'player@demo.bet',
    phone: '+1 555 0102',
    country: 'United States',
    dateOfBirth: '1998-10-14',
    role: 'Player',
    parentId: '2',
    balance: 1000,
    exposure: 0,
    creditLimit: 1000,
    commission: 0,
    maxBetLimit: 500,
    isBlocked: false,
    twoFactorEnabled: false,
  },
];

export const demoPromos: PromoOffer[] = [
  {
    id: 'promo-1',
    title: 'Welcome Boost',
    description: 'Get a 25% odds boost on your first accumulator (up to $20 bonus value).',
    tag: 'New',
    claimed: false,
  },
  {
    id: 'promo-2',
    title: 'Live Bet Insurance',
    description: 'One in-play single bet refunded as free bet credit if it loses by one goal.',
    tag: 'In-Play',
    claimed: false,
  },
  {
    id: 'promo-3',
    title: 'Weekend Multi',
    description: 'Stake $10 on a 4+ fold this weekend and get a $5 free bet token.',
    tag: 'Soccer',
    claimed: false,
  },
];

export const demoTransactions: WalletTransaction[] = [
  { id: 'tx-1', type: 'Deposit', amount: 250, date: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(), note: 'Card deposit' },
  { id: 'tx-2', type: 'Bet Placed', amount: -20, date: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(), note: 'Accumulator placed' },
  { id: 'tx-3', type: 'Settlement', amount: 35, date: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), note: 'Bet won' },
];

export const demoRgSettings: ResponsibleGamingSettings = {
  dailyStakeLimit: 300,
  dailyLossLimit: 150,
  sessionReminderMinutes: 60,
};

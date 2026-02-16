# upx365 - Modern Sports Betting Platform

A production-ready React/TypeScript sports betting platform featuring live match betting, multi-role user hierarchy, wallet management, admin/agent dashboards, and responsive design.

## Tech Stack

| Technology | Purpose |
|-----------|---------|
| React 19 | UI component library |
| TypeScript 5.8 | Type-safe JavaScript |
| Vite 6 | Build tool & dev server |
| Tailwind CSS 4 | Utility-first CSS framework |
| Material Symbols | Icon system |

## Getting Started

### Prerequisites

- Node.js 16+
- npm

### Installation

```bash
cd frontend
npm install
```

### Development

```bash
npm run dev
```

### Production Build

```bash
npm run build
```

Output is generated in `dist/` and can be deployed to any static hosting provider (Netlify, Vercel, GitHub Pages, etc.).

## Project Structure

```
frontend/
├── index.html                      # HTML entry point with SEO meta tags
├── index.tsx                       # React root with TranslationProvider
├── index.css                       # Global styles
├── App.tsx                         # Main app component & state management
├── types.ts                        # TypeScript type definitions
├── demoData.ts                     # Mock data for development
├── tailwind.config.js              # Tailwind theme configuration
├── vite.config.ts                  # Vite build configuration
├── tsconfig.json                   # TypeScript configuration
│
├── components/                     # React components
│   ├── Header.tsx                  # Desktop/mobile top navigation
│   ├── SubHeader.tsx               # Sport category tabs
│   ├── BottomNav.tsx               # Mobile bottom navigation
│   ├── Footer.tsx                  # Footer with branding & legal links
│   ├── ThemeToggle.tsx             # Dark/light mode toggle
│   │
│   ├── Hero.tsx                    # Homepage banner & promotions
│   ├── GamesGrid.tsx               # Casino game tiles
│   ├── FeaturedView.tsx            # Featured/boosted bets
│   ├── AllSportsView.tsx           # All sports with filtering
│   ├── InPlayView.tsx              # Live in-play matches
│   ├── LiveMatches.tsx             # Live match listings
│   ├── FeaturedMatches.tsx         # Highlighted matches
│   │
│   ├── BetSlip.tsx                 # Bet slip (expandable/minimizable)
│   ├── MatchDetails.tsx            # Match detail page with markets
│   ├── BetHistory.tsx              # Bet history & settlement
│   │
│   ├── AccountView.tsx             # User profile, security & settings
│   ├── WalletView.tsx              # Wallet, deposits & withdrawals
│   ├── PromotionsView.tsx          # Promotional offers
│   │
│   ├── AuthModal.tsx               # Login/registration modal
│   │
│   ├── AdminDashboard.tsx          # Admin panel (users, bets, payments, reports)
│   ├── AgentDashboard.tsx          # Agent panel (downline, settlement, commissions)
│   │
│   ├── NotificationsPanel.tsx      # Notification center
│   ├── SearchResultsPanel.tsx      # Search results overlay
│   ├── QuickActionsBar.tsx         # Quick action shortcuts
│   ├── HomeExtraLists.tsx          # Homepage extra sections
│   ├── SkeletonLoader.tsx          # Loading placeholders
│   ├── CasinoComingSoon.tsx        # Casino placeholder
│   └── LegalPages.tsx              # Terms, Privacy, Rules pages
│
└── contexts/
    └── TranslationContext.tsx       # i18n, currency & odds format
```

## Features

### Betting System

- **Live Match Betting** - Real-time odds for Soccer, Cricket, Tennis, Basketball, American Football, Baseball, Hockey
- **Bet Slip** - Expandable panel with single/accumulator bets, stake input, and potential return calculation
- **Multiple Markets** - 1X2, Over/Under, Corners, Cards, Handicaps, and sport-specific markets
- **Bet Settlement** - Admin/Agent can settle bets as Won/Lost, void bets, or process cash-outs
- **Cash-Out** - Players can cash out open bets early

### User Role Hierarchy

```
Super Admin
  └── Admin
        └── Senior Super
              └── Super Master
                    └── Master
                          └── Agent
                                └── Player
```

Each role can create and manage users one level below. Agents manage players, Masters manage agents, etc.

### Wallet & Payments

- **Agent-Based Deposits** - Players deposit through their assigned agent
- **Crypto Withdrawals** - USDT TRC20 with claim code system
- **Withdrawal Flow:**
  1. Player requests withdrawal, receives a claim code
  2. Player shares code with agent
  3. Agent processes the code to complete the withdrawal
- **Transaction History** - Full audit trail of deposits, withdrawals, bets, and settlements

### Admin Dashboard

| Tab | Features |
|-----|----------|
| Users | User management, balance adjustments, block/unblock |
| Bets | All bets with settlement controls |
| Withdrawals | Approve/reject withdrawal requests |
| Payment Gateways | Configure fees, limits, enable/disable |
| API Keys | Third-party provider credentials |
| Reports | Financial summaries, player activity, agent performance |
| Settings | Risk management, responsible gaming policies |
| Logs | Admin action audit trail |

### Agent Dashboard

| Tab | Features |
|-----|----------|
| Downline | View/manage direct subordinates |
| Create User | Create next-level-down users |
| Bets | Downline bet management & settlement |
| Withdraw | Process withdrawal codes |
| Commission | Track earnings on downline turnover |
| Profile | Edit agent profile |
| Logs | Agent action history |

### Internationalization

- **Languages:** English, Spanish, French, German, Portuguese, Chinese
- **Currencies:** USD, EUR, GBP, BRL, CNY, INR
- **Odds Formats:** Decimal, Fractional, American

### Responsible Gaming

- Daily stake and loss limits
- Session timeout reminders
- User blocking/unblocking
- Self-exclusion information

### UI/UX

- **Dark/Light Mode** - Theme toggle with localStorage persistence
- **Responsive Design** - Mobile-first with desktop optimizations
- **Bottom Navigation** - Mobile navigation bar
- **Notification System** - Real-time alerts for bets, deposits, withdrawals

## Theme Configuration

```javascript
colors: {
  primary: '#126e51',        // Green
  'bet-yellow': '#ffdf1b',   // Accent yellow
  'dark-bg': '#121212',      // Dark background
  'surface-dark': '#1e1e1e', // Dark surface
  'accent-teal': '#00bfa5',  // Teal accent
  'dark-header': '#0f0f0f',  // Darkest header
}
```

## Demo Accounts

| Username | Role | Balance |
|----------|------|---------|
| `admin` | Super Admin | $1,000,000 |
| `agent` | Agent | $50,000 |
| `player` | Player | $1,000 |

## State Management

All application state is managed in `App.tsx` using React hooks and persisted to `localStorage`. Key state includes:

- User authentication and profiles
- Bet selections and placed bets
- Wallet transactions and withdrawal requests
- Payment gateway and API key configuration
- Promotions, notifications, and responsible gaming settings

## Data Flow

```
App.tsx (state & handlers)
  ├── Header ← user, auth handlers
  ├── SubHeader ← category navigation
  ├── View Components ← match data, bet handlers
  │     ├── MatchDetails ← individual match, markets
  │     ├── BetSlip ← selections, place bet
  │     └── BetHistory ← placed bets, cash-out
  ├── AdminDashboard ← all users, bets, config
  ├── AgentDashboard ← downline, settlement
  ├── Footer ← legal page links
  └── BottomNav ← view navigation
```

## Deployment

The build output is static HTML/CSS/JS. Deploy to any static hosting:

- **Vercel:** `vercel --prod`
- **Netlify:** Drag `dist/` folder to Netlify
- **GitHub Pages:** Push `dist/` to `gh-pages` branch

No backend server required in demo mode. For production, integrate with a backend API for authentication, real-time data, and payment processing.

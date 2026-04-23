# Manhattan CRE Prediction Engine

A machine-learning-powered intelligence platform that identifies high-probability off-market commercial real estate sale targets in Manhattan. The engine analyzes 1,500 predictive attributes derived from NYC Open Data (PLUTO, ACRIS, DOB, HPD, DOF) to surface 34 properties with 80%+ predicted sale probability and estimated values exceeding $10M.

---

## Features

- **Dashboard** — Hero overview with animated KPI stats, top 8 property preview, and model performance metrics (AUC 0.887, 91.1% accuracy)
- **Properties** — 34 off-market targets with search, sort, filter, expandable valuation breakdowns, integrated UBO profiles, and DISC personality analysis
- **Attributes** — All 1,500 empirically weighted predictive attributes with category/tier/recommendation filters and pagination
- **UBO Directory** — 31 beneficial owner dossiers with contact info, entity structures, and DISC personality profiles for optimized outreach
- **Passcode Lock** — Site gated behind a 4-digit passcode (digits masked during entry)
- **Google Maps Links** — Every property address links directly to Google Maps
- **Daily Refresh** — GitHub Actions workflow pulls fresh NYC Open Data, re-trains the XGBoost model, and redeploys automatically

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 + TypeScript |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Routing | Wouter |
| Build | Vite 7 |
| Package Manager | pnpm |
| ML Model | XGBoost (Python) |
| Data Sources | NYC Open Data Socrata APIs |
| Hosting | GitHub Pages |
| CI/CD | GitHub Actions |

## Design

**Obsidian Atlas** — A dark cartographic intelligence theme featuring deep charcoal backgrounds (`#0a0a0f`), electric teal accents (`#00e5a0`), and DM Sans + DM Mono typography. Inspired by high-end data intelligence platforms.

---

## Quick Start

### Prerequisites

- [Node.js 22+](https://nodejs.org/)
- [pnpm 10+](https://pnpm.io/) (`npm install -g pnpm`)

### Local Development

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/manhattan-cre-predictions.git
cd manhattan-cre-predictions

# Install dependencies
cd app
pnpm install

# Start dev server
pnpm run dev
```

The app will be available at `http://localhost:3000`. Enter passcode **2289** to access the dashboard.

### Production Build

```bash
cd app
pnpm run build
pnpm run preview
```

The built files will be in `app/dist/`.

---

## Deploying to GitHub Pages

### Step 1: Create a GitHub Repository

1. Go to [github.com/new](https://github.com/new)
2. Name it `manhattan-cre-predictions` (or any name you prefer)
3. Set visibility to **Private** (recommended — this contains proprietary intelligence)
4. Do **not** initialize with a README (you already have one)

### Step 2: Push the Code

```bash
cd manhattan-cre-predictions  # the root of this package
git init
git add .
git commit -m "Initial commit: Manhattan CRE Prediction Engine"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/manhattan-cre-predictions.git
git push -u origin main
```

### Step 3: Enable GitHub Pages

1. Go to your repo's **Settings** > **Pages**
2. Under **Source**, select **GitHub Actions**
3. The `deploy.yml` workflow will automatically build and deploy on every push to `main`

### Step 4: Access Your Site

After the first workflow run completes (1-2 minutes), your site will be live at:

```
https://YOUR_USERNAME.github.io/manhattan-cre-predictions/
```

> **Note:** If you're using a GitHub organization or custom domain, the URL will differ accordingly.

---

## Daily Data Refresh

The `daily-refresh.yml` workflow runs automatically every day at **6:00 AM EST** (11:00 UTC). It:

1. Pulls fresh data from 8 NYC Open Data Socrata API endpoints (PLUTO, ACRIS, DOB, HPD, ECB, Sales)
2. Engineers 50+ features per property (building age, FAR utilization, violation counts, mortgage activity, etc.)
3. Trains an XGBoost classifier on recent sale labels
4. Scores all Manhattan commercial properties
5. Filters to 80%+ probability, $10M+ estimated value, off-market
6. Estimates prices using assessment multipliers, comp PSF, and last-sale appreciation
7. Merges UBO data and outputs updated JSON files
8. Commits the updated `data/` files and triggers a rebuild/deploy

### Manual Trigger

You can also trigger a refresh manually:

1. Go to **Actions** > **Daily Data Refresh & Deploy**
2. Click **Run workflow** > **Run workflow**

### NYC Open Data API

The refresh script uses the free [NYC Open Data Socrata API](https://data.cityofnewyork.us/). No API key is required for the default rate limit (1,000 requests/hour). For higher throughput, you can optionally add a Socrata App Token:

1. Register at [dev.socrata.com](https://dev.socrata.com/)
2. Create an app token
3. Add it as a GitHub Secret named `SOCRATA_APP_TOKEN`
4. Update `scripts/refresh_data.py` to include the token in API requests

---

## Project Structure

```
manhattan-cre-predictions/
├── .github/
│   └── workflows/
│       ├── deploy.yml              # Build & deploy on push to main
│       └── daily-refresh.yml       # Daily data refresh + deploy
├── app/                            # React application
│   ├── client/
│   │   ├── index.html
│   │   ├── public/
│   │   │   ├── data/               # JSON data files (copied from /data/)
│   │   │   ├── 404.html            # SPA routing fallback for GitHub Pages
│   │   │   └── .nojekyll           # Prevents Jekyll processing
│   │   └── src/
│   │       ├── pages/              # Page components (Home, Properties, Attributes, UBOProfiles)
│   │       ├── components/         # Navbar, PasscodeLock, ErrorBoundary, shadcn/ui
│   │       ├── lib/                # Utilities and data URL configuration
│   │       ├── hooks/              # Custom React hooks
│   │       ├── contexts/           # Theme context
│   │       ├── App.tsx             # Router and layout
│   │       ├── main.tsx            # Entry point
│   │       └── index.css           # Global styles and design tokens
│   ├── shared/                     # Shared constants
│   ├── package.json
│   ├── pnpm-lock.yaml
│   ├── tsconfig.json
│   └── vite.config.ts
├── data/                           # Source JSON data (updated by daily refresh)
│   ├── properties.json             # 34 target properties with UBO data
│   ├── ubos.json                   # 31 UBO records with DISC profiles
│   ├── attributes.json             # 1,500 predictive attributes
│   ├── stats.json                  # Dashboard KPI stats
│   ├── features.json               # Top 30 model features
│   └── categories.json             # Attribute category metadata
├── scripts/
│   └── refresh_data.py             # Daily data refresh pipeline
├── .gitignore
└── README.md
```

---

## Data Files

| File | Records | Description |
|------|---------|-------------|
| `properties.json` | 34 | Target properties with pricing, UBO data, and DISC profiles merged in |
| `ubos.json` | 31 | Beneficial owner records with contact info and DISC personality analysis |
| `attributes.json` | 1,500 | Predictive attributes with empirical weights, tiers, and recommendations |
| `stats.json` | — | Dashboard KPIs (total properties, portfolio value, model AUC, etc.) |
| `features.json` | 30 | Top model features ranked by importance |
| `categories.json` | — | Attribute category metadata for filtering |

---

## Model Details

The prediction engine uses an **XGBoost gradient-boosted classifier** trained on NYC Open Data:

| Metric | Value |
|--------|-------|
| Algorithm | XGBoost (300 estimators, max_depth=6) |
| Training Data | 3 years of Manhattan commercial sales |
| Features | 50+ engineered from PLUTO, ACRIS, DOB, HPD, DOF |
| AUC-ROC | 0.887 |
| Accuracy | 91.1% |
| Positive Label | Property sold within last 6 months |
| Price Estimation | Blended: assessment multiplier, comp PSF, last-sale appreciation |

---

## Passcode

The application is protected by a 4-digit passcode lock. The default passcode is:

```
2289
```

To change the passcode, edit the `PASSCODE` constant in `app/client/src/components/PasscodeLock.tsx`.

---

## License

MIT

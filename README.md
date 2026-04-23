# Manhattan CRE Prediction Engine

Pre-built, ready-to-deploy intelligence platform — 34 high-probability off-market Manhattan commercial property targets with UBO profiles and DISC personality analysis.

## How to Deploy on GitHub Pages (3 steps)

### 1. Create a GitHub Repository
- Go to [github.com/new](https://github.com/new)
- Name it anything (e.g. `manhattan-cre`)
- Set to **Private**
- Do NOT initialize with README

### 2. Upload All Files
```bash
# Option A: Command line
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/manhattan-cre.git
git push -u origin main
```

**Option B: Drag & drop** — On your new repo page, click "uploading an existing file" and drag the contents of this folder in.

### 3. Enable GitHub Pages
- Go to repo **Settings** → **Pages**
- Under Source, select **Deploy from a branch**
- Select **main** branch, **/ (root)** folder
- Click **Save**
- Your site will be live in ~1 minute at: `https://YOUR_USERNAME.github.io/manhattan-cre/`

## Passcode
Enter **2289** to access the dashboard.

## What's Inside

| File/Folder | What It Is |
|-------------|-----------|
| `index.html` | The main page (compiled React app) |
| `404.html` | Routing fallback for GitHub Pages |
| `assets/` | Compiled CSS and JavaScript |
| `data/` | All JSON data (34 properties, 31 UBOs, 1,500 attributes) |
| `.nojekyll` | Tells GitHub Pages not to process with Jekyll |
| `scripts/refresh_data.py` | Daily data refresh script (runs via GitHub Actions) |
| `.github/workflows/` | Automated daily refresh at 6 AM EST |

## Daily Auto-Refresh
The included GitHub Actions workflow automatically refreshes data from NYC Open Data every day at 6:00 AM EST. It runs the Python script, updates the JSON files, and redeploys. You can also trigger it manually from the **Actions** tab.

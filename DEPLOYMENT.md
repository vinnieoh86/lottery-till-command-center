# Lottery Till Command Center Deployment

This is the go-live checklist for publishing the static app on GitHub Pages and using Supabase as the team data layer.

## 1. Before Publishing

- Install Git on this computer if `git` is not available in PowerShell.
- Keep `index.html`, `styles.css`, `app.js`, `README.md`, `supabase-schema.sql`, and this file in the project folder.
- Do not place Supabase service role keys in this browser app. The anon or publishable key is safe only when Row Level Security is enabled.

## 2. Create The GitHub Repo

1. Create a new GitHub repository, for example `lottery-till-command-center`.
2. In PowerShell from this folder, run:

```powershell
git init
git branch -M main
git add .
git commit -m "Initial lottery till command center"
git remote add origin https://github.com/YOUR_USERNAME/lottery-till-command-center.git
git push -u origin main
```

3. In GitHub, open the repo.
4. Go to `Settings` -> `Pages`.
5. Under `Build and deployment`, choose `Deploy from a branch`.
6. Choose branch `main` and folder `/root`.
7. Save.

The app will publish at:

```text
https://YOUR_USERNAME.github.io/lottery-till-command-center/
```

## 3. Prepare Supabase

1. Create or open your Supabase project.
2. Open the SQL editor.
3. Run `supabase-schema.sql`.
4. Confirm the tables were created:

- `games`
- `daily_game_counts`
- `daily_till_entries`
- `daily_cash_counts`
- `weekly_order_sheets`
- `weekly_order_rows`
- `weekly_order_extra_rows`

5. Confirm Row Level Security is enabled before using real team data.
6. Create team users through Supabase Auth.

## 4. Frontend Sync Step

The app now has a Supabase team login and shared snapshot sync.

1. Run the newest `supabase-schema.sql` in Supabase SQL Editor.
2. In Supabase, create team users under Authentication.
3. Upload the newest `index.html`, `styles.css`, `app.js`, and `supabase-schema.sql` to GitHub.
4. Open the GitHub Pages URL.
5. Sign in from the left sidebar.
6. The app saves locally first and syncs the shared snapshot to Supabase when signed in.

## 5. Recommended Go-Live Order

1. Publish the static app to GitHub Pages.
2. Run the Supabase schema.
3. Create Supabase Auth users.
4. Test with one admin account and one employee account.
5. Enter one full fake day and verify it appears on both computers after sign-in.
6. Only then switch the store away from Google Sheets.

## 6. Safety Rules

- Never expose the Supabase `service_role` key in `app.js`, `index.html`, GitHub, or GitHub Pages.
- Keep Row Level Security on for every table.
- Use admin-only controls later for editing game names, book numbers, reorder settings, and clearing records.
- Treat GitHub Pages as the app shell only. Treat Supabase as the source of truth for team data.

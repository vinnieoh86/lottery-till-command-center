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

The current app still saves locally first. Before team mode is truly live, wire the frontend to Supabase:

1. Add a Supabase browser client.
2. Add login/logout.
3. Replace local-only persistence with reads/writes to the Supabase tables.
4. Keep localStorage as a backup draft cache only.
5. Add a visible sync state: `Online synced`, `Offline draft`, or `Sync error`.

## 5. Recommended Go-Live Order

1. Publish the static app to GitHub Pages.
2. Run the Supabase schema.
3. Add Supabase Auth and database sync.
4. Test with one admin account and one employee account.
5. Enter one full fake day and verify it appears on both computers.
6. Only then switch the store away from Google Sheets.

## 6. Safety Rules

- Never expose the Supabase `service_role` key in `app.js`, `index.html`, GitHub, or GitHub Pages.
- Keep Row Level Security on for every table.
- Use admin-only controls later for editing game names, book numbers, reorder settings, and clearing records.
- Treat GitHub Pages as the app shell only. Treat Supabase as the source of truth for team data.

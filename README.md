# Lottery Till Command Center

A lightweight HTML/CSS/JS prototype for daily lottery closeout work:

- Track scratch-off inventory by box, book number, game name, and ticket value.
- Enter yesterday and today ending ticket numbers.
- Enter manual instant-sold dollars by game as an audit/check column.
- Warn when manual instant sold does not match calculated instant sales.
- Automatically calculate rollover sales for common ticket books.
- Press `Enter` in any entry column to jump down to the next value in that same column.
- Continue `Enter` flow from Step 1 into lottery totals, then into the cash drawer.
- Build the selected month with Sundays marked as closed.
- Disable daily entry on closed Sundays to prevent accidental counts.
- Default to today's date, with previous/next month controls.
- Show the selected close date next to the daily ticket count header.
- Use the previous open day's saved count for the `Yesterday` column, skipping closed Sundays.
- Keep locked inventory rows for boxes `1-46` plus `A`.
- Autosave daily logs as values are entered.
- Show weekly and monthly ticket/sales/book totals by game for ordering decisions.
- Filter history by book value and sort with clickable table headers.
- Review a month-view matrix grouped by ticket value, showing ending counts and daily sales for ordering analysis.
- Use a compact Month View from the left navigation for Excel-style monthly review.
- Track reorder QTY and generate a starter order report from daily average sales.
- Estimate reorder need from forecasted sales velocity, month timing, seasonal boosts, current QTY, and high-ticket safeguards.
- Use conservative safety stock so slow games do not automatically receive a full extra book.
- Mark DC games with a compact checkbox and carry that visual flag through daily, history, month, and reorder views.
- Save weekly reorder snapshots locally for later review.
- Keep extra ordering presets and notes for paper rolls, Pick games, Mega, Powerball, and Classic.
- Use inventory edit mode to update book numbers, game names, ticket values, and drag rows into a new order.
- Save a weekly order and automatically reset QTY back to zero for the next order cycle.
- Seed April 1-14, 2026 historical sheet values, using March 31 as the previous-ending anchor for April 1 calculations.
- Enter online lottery/cash figures and drawer counts.
- Split cashless sales into cashless online and cashless instant fields, with a combined read-only total.
- Balance total lottery sales against cash in drawer.
- Calculate total lottery sales as `gross - cancels - online cashes - instant cashes - cashless online - cashless instant - adjustments + office payout + instant sales`.
- Collapse and expand Step 1, Step 2, and Step 3 sections.
- Save locally in the browser and export a daily JSON audit payload.

## Run

Open `index.html` in a browser.

If you want a tiny local server, run:

```powershell
python -m http.server 5173
```

Then open `http://localhost:5173`.

## Current Ticket Rules

The app starts with these book sizes:

- `$1`: 200 tickets, numbers `0-199`
- `$2`: 100 tickets, numbers `0-99`
- `$5`: 50 tickets, numbers `0-49`
- `$10`: 50 tickets, numbers `0-49`
- `$20`: 25 tickets, numbers `0-24`
- `$30`: 25 tickets, numbers `0-24`
- `$50`: 30 tickets, numbers `0-29`
- Box `A` is a `$10` game with 30 tickets, numbers `0-29`

These are defined in `app.js` under `ticketRules` so they can be adjusted as your lottery rules evolve.

## Supabase Next Step

The app currently saves to browser `localStorage`. The clean next database step is to add Supabase tables for:

- `games`: current box/book/game/value inventory.
- `daily_game_counts`: one row per game per business date.
- `daily_till_entries`: gross sales, cancels, cashes, payouts, adjustments.
- `daily_cash_counts`: drawer denomination counts.

The exported JSON already mirrors that shape, which makes the Supabase wiring straightforward.

Start with `supabase-schema.sql`, then add policies that match your team login setup before exposing writes from the browser.

create table if not exists public.games (
  id uuid primary key default gen_random_uuid(),
  box_label text not null,
  book_number text not null,
  name text not null,
  ticket_value numeric(10, 2) not null,
  ticket_count integer not null,
  sort_order integer,
  active boolean not null default true,
  is_dc boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.daily_game_counts (
  id uuid primary key default gen_random_uuid(),
  business_date date not null,
  game_id uuid references public.games(id) on delete set null,
  box_label text not null,
  book_number text not null,
  game_name text not null,
  ticket_value numeric(10, 2) not null,
  previous_ending integer not null,
  today_ending integer not null,
  tickets_sold integer not null,
  sales_amount numeric(10, 2) not null,
  manual_instant_sold numeric(10, 2) not null default 0,
  created_at timestamptz not null default now(),
  unique (business_date, box_label, book_number)
);

create table if not exists public.daily_till_entries (
  id uuid primary key default gen_random_uuid(),
  business_date date not null unique,
  gross_sales numeric(10, 2) not null default 0,
  online_cancels numeric(10, 2) not null default 0,
  online_cashes numeric(10, 2) not null default 0,
  instant_cashes numeric(10, 2) not null default 0,
  cashless_online_sales numeric(10, 2) not null default 0,
  cashless_instant_sales numeric(10, 2) not null default 0,
  office_payout numeric(10, 2) not null default 0,
  adjustments numeric(10, 2) not null default 0,
  total_lottery_sales numeric(10, 2) not null default 0,
  cash_in_drawer numeric(10, 2) not null default 0,
  difference numeric(10, 2) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.daily_cash_counts (
  id uuid primary key default gen_random_uuid(),
  business_date date not null references public.daily_till_entries(business_date) on delete cascade,
  denomination_label text not null,
  denomination_value numeric(10, 2) not null,
  quantity integer not null default 0,
  amount numeric(10, 2) not null default 0,
  unique (business_date, denomination_label)
);

alter table public.games add column if not exists is_dc boolean not null default false;
alter table public.games add column if not exists sort_order integer;
alter table public.daily_game_counts add column if not exists manual_instant_sold numeric(10, 2) not null default 0;
alter table public.daily_till_entries add column if not exists cashless_instant_sales numeric(10, 2) not null default 0;

create table if not exists public.weekly_order_sheets (
  id uuid primary key default gen_random_uuid(),
  order_date date not null,
  saved_at timestamptz not null default now(),
  backstock_weeks numeric(10, 2) not null default 2.5,
  high_ticket_threshold integer not null default 40,
  total_books integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.weekly_order_rows (
  id uuid primary key default gen_random_uuid(),
  order_sheet_id uuid not null references public.weekly_order_sheets(id) on delete cascade,
  box_label text not null,
  ticket_value numeric(10, 2) not null,
  book_number text not null,
  game_name text not null,
  is_dc boolean not null default false,
  qty_on_hand integer not null default 0,
  order_needed integer not null default 0,
  average_tickets_per_day numeric(10, 2) not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.weekly_order_extra_rows (
  id uuid primary key default gen_random_uuid(),
  order_sheet_id uuid not null references public.weekly_order_sheets(id) on delete cascade,
  item_name text not null,
  order_qty integer not null default 0,
  note text not null default '',
  created_at timestamptz not null default now()
);

alter table public.games enable row level security;
alter table public.daily_game_counts enable row level security;
alter table public.daily_till_entries enable row level security;
alter table public.daily_cash_counts enable row level security;
alter table public.weekly_order_sheets enable row level security;
alter table public.weekly_order_rows enable row level security;
alter table public.weekly_order_extra_rows enable row level security;

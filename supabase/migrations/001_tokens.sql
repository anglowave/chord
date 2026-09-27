create table if not exists public.tokens (
	mint text primary key,
	name text not null,
	symbol text not null,
	description text,
	image_url text not null,
	metadata_uri text not null,
	creator text not null,
	stocks text[] not null check (
		cardinality(stocks) between 1 and 3
	),
	signature text not null unique,
	created_at timestamptz not null default now()
);

create index if not exists tokens_stocks_gin on public.tokens using gin (stocks);
create index if not exists tokens_created_at_idx on public.tokens (created_at desc);

alter table public.tokens enable row level security;

create policy "Public read tokens"
	on public.tokens
	for select
	using (true);

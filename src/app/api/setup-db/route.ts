import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// This route applies pending DB migrations safely
// Visit /api/setup-db to run it (one-time setup)
export async function GET() {
    try {
        const supabase = await createClient()

        const migrations: { name: string; sql: string }[] = [
            {
                name: 'store_settings',
                sql: `
                    create table if not exists public.store_settings (
                        id uuid primary key default gen_random_uuid(),
                        store_name text default 'Fenix Fit',
                        contact_email text default 'cbs@bcnnorth.com',
                        contact_phone text,
                        address text,
                        instagram_url text,
                        whatsapp_number text,
                        currency text default 'USD',
                        shipping_fee numeric(10,2) default 0.00,
                        updated_at timestamptz default now() not null
                    );
                `
            },
            {
                name: 'store_settings_rls',
                sql: `alter table public.store_settings enable row level security;`
            },
            {
                name: 'store_settings_read_policy',
                sql: `
                    do $$ begin
                        if not exists (
                            select 1 from pg_policies 
                            where tablename = 'store_settings' 
                            and policyname = 'store_settings_public_read'
                        ) then
                            execute 'create policy "store_settings_public_read" on public.store_settings for select using (true)';
                        end if;
                    end $$;
                `
            },
            {
                name: 'store_settings_write_policy',
                sql: `
                    do $$ begin
                        if not exists (
                            select 1 from pg_policies 
                            where tablename = 'store_settings' 
                            and policyname = 'store_settings_auth_all'
                        ) then
                            execute 'create policy "store_settings_auth_all" on public.store_settings for all using (auth.role() = ''authenticated'') with check (auth.role() = ''authenticated'')';
                        end if;
                    end $$;
                `
            },
            {
                name: 'store_settings_default_row',
                sql: `
                    insert into public.store_settings (id, store_name, contact_email, currency, shipping_fee)
                    values ('00000000-0000-0000-0000-000000000001', 'Fenix Fit', 'cbs@bcnnorth.com', 'USD', 0.00)
                    on conflict (id) do nothing;
                `
            }
        ]

        const results: { name: string; status: string; error?: string }[] = []

        for (const migration of migrations) {
            try {
                const { error } = await supabase.rpc('exec_sql', { sql: migration.sql })
                if (error) {
                    results.push({ name: migration.name, status: 'error', error: error.message })
                } else {
                    results.push({ name: migration.name, status: 'ok' })
                }
            } catch (err: any) {
                results.push({ name: migration.name, status: 'error', error: err.message })
            }
        }

        return NextResponse.json({
            message: 'Migration complete. Check results below.',
            results,
            sql_to_run_manually: `
-- PASTE THIS IN: https://supabase.com/dashboard/project/nflojloxwutopunsqerg/sql/new

create table if not exists public.store_settings (
    id uuid primary key default gen_random_uuid(),
    store_name text default 'Fenix Fit',
    contact_email text default 'cbs@bcnnorth.com',
    contact_phone text,
    address text,
    instagram_url text,
    whatsapp_number text,
    currency text default 'USD',
    shipping_fee numeric(10,2) default 0.00,
    updated_at timestamptz default now() not null
);

alter table public.store_settings enable row level security;

create policy "store_settings_public_read" on public.store_settings for select using (true);
create policy "store_settings_auth_all" on public.store_settings for all 
    using (auth.role() = 'authenticated') 
    with check (auth.role() = 'authenticated');

insert into public.store_settings (id, store_name, contact_email, currency, shipping_fee)
values ('00000000-0000-0000-0000-000000000001', 'Fenix Fit', 'cbs@bcnnorth.com', 'USD', 0.00)
on conflict (id) do nothing;
            `
        })
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// This route applies pending DB migrations safely
// Visit /api/setup-db to run it (one-time setup)
export async function GET() {
    try {
        const supabase = await createClient()

        const migrations: { name: string; sql: string }[] = [
            {
                name: 'notifications_system_v1',
                sql: `
                    -- 1. Create notifications table
                    create table if not exists public.notifications (
                        id uuid primary key default gen_random_uuid(),
                        type text not null, -- 'new_order', 'low_stock', 'contact'
                        title text,
                        message text,
                        data jsonb default '{}'::jsonb,
                        is_read boolean default false,
                        created_at timestamptz default now() not null
                    );

                    -- 2. Enable Realtime
                    do $$ 
                    begin
                        if exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
                            alter publication supabase_realtime add table public.notifications;
                        end if;
                    exception when others then null;
                    end $$;

                    -- 3. Trigger to auto-create notification on new order
                    create or replace function public.handle_new_order_notification()
                    returns trigger as $$
                    begin
                        insert into public.notifications (type, title, message, data)
                        values (
                            'new_order',
                            '¡Nuevo Pedido Recibido!',
                            'Has recibido un nuevo pedido de ' || coalesce(new.customer_name, 'un cliente') || ' por ' || new.total_amount || '€',
                            jsonb_build_object('order_id', new.id, 'total', new.total_amount)
                        );
                        return new;
                    end;
                    $$ language plpgsql;

                    drop trigger if exists on_order_created_notification on public.orders;
                    create trigger on_order_created_notification
                        after insert on public.orders
                        for each row execute procedure public.handle_new_order_notification();

                    -- 4. RLS
                    alter table public.notifications enable row level security;
                    do $$ begin
                        if not exists (select 1 from pg_policies where tablename = 'notifications' and policyname = 'Admins can manage notifications') then
                            create policy "Admins can manage notifications" on public.notifications for all to authenticated using (true);
                        end if;
                    end $$;
                `
            },
            {
                name: 'store_settings_v2',
                sql: `
                    ALTER TABLE public.store_settings 
                    ADD COLUMN IF NOT EXISTS checkout_type text DEFAULT 'stripe',
                    ADD COLUMN IF NOT EXISTS announcement_text text,
                    ADD COLUMN IF NOT EXISTS instagram_url text,
                    ADD COLUMN IF NOT EXISTS whatsapp_number text;
                `
            },
            {
                name: 'orders_v3',
                sql: `
                    ALTER TABLE public.orders 
                    ADD COLUMN IF NOT EXISTS checkout_method text DEFAULT 'stripe',
                    ADD COLUMN IF NOT EXISTS customer_phone text,
                    ADD COLUMN IF NOT EXISTS accepts_marketing boolean DEFAULT false,
                    ADD COLUMN IF NOT EXISTS shipping_address jsonb DEFAULT '{}'::jsonb,
                    ADD COLUMN IF NOT EXISTS is_read boolean DEFAULT false;
                `
            },
            {
                name: 'staff_v1',
                sql: `
                    create table if not exists public.staff (
                        id uuid primary key default gen_random_uuid(),
                        email text unique not null,
                        role text not null default 'moderator' check (role in ('owner', 'moderator')),
                        full_name text,
                        created_at timestamptz default now() not null
                    );
                    alter table public.staff enable row level security;
                    do $$ begin
                        if not exists (select 1 from pg_policies where tablename = 'staff' and policyname = 'Staff members are viewable by authenticated users') then
                            create policy "Staff members are viewable by authenticated users" on public.staff for select to authenticated using (true);
                        end if;
                        if not exists (select 1 from pg_policies where tablename = 'staff' and policyname = 'Admins can manage staff') then
                             create policy "Admins can manage staff" on public.staff for all to authenticated using (true);
                        end if;
                    end $$;
                `
            },
            {
                name: 'store_settings_default_row',
                sql: `
                    insert into public.store_settings (id, store_name, contact_email, currency, shipping_fee, checkout_type)
                    values ('00000000-0000-0000-0000-000000000001', 'Fenix Fit', 'cbs@bcnnorth.com', 'USD', 0.00, 'stripe')
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

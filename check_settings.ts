import { createClient } from '@supabase/supabase-js'

async function checkSettings() {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data: allRows, error } = await supabase
        .from('store_settings')
        .select('*')

    if (error) {
        console.error('Error:', error.message)
    } else {
        console.log('Total Rows in store_settings:', allRows?.length)
        console.log('All Rows:', JSON.stringify(allRows, null, 2))
    }
}

checkSettings()

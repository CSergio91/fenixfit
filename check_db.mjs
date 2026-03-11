import { createClient } from '@supabase/supabase-js'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { readFileSync } from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Manual env parsing
const envPath = join(__dirname, '.env.local')
try {
    const envContent = readFileSync(envPath, 'utf8')
    envContent.split('\n').forEach(line => {
        const [key, ...value] = line.split('=')
        if (key && value && value.length > 0) {
            process.env[key.trim()] = value.join('=').trim().replace(/^"(.*)"$/, '$1')
        }
    })
} catch (e) {
    console.error('Cant read .env.local', e.message)
}

async function checkSettings() {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
        console.error('Missing env vars')
        return
    }

    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY
    )

    const { data: allRows, error } = await supabase
        .from('store_settings')
        .select('*')

    if (error) {
        console.error('Error:', error.message)
    } else {
        console.log('--- DB CHECK ---')
        console.log('Total Rows:', allRows?.length)
        console.log('Rows:', JSON.stringify(allRows, null, 2))
    }
}

checkSettings()

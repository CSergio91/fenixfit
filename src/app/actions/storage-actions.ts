'use server'
import { createClient, createAdminClient } from '@/lib/supabase/server'

const BUCKET_NAME = 'prendas'

// Ensure bucket exists - Use Admin Client for DDL operations
async function ensureBucket() {
    const admin = await createAdminClient()
    const { data: buckets, error: listError } = await admin.storage.listBuckets()

    if (listError) {
        console.error('Error listing buckets:', listError)
        return
    }

    const exists = buckets?.some((b: any) => b.name === BUCKET_NAME)
    if (!exists) {
        console.log(`Creating bucket: ${BUCKET_NAME}`)
        const { error: createError } = await admin.storage.createBucket(BUCKET_NAME, {
            public: true,
            allowedMimeTypes: ['image/png', 'image/jpg', 'image/jpeg', 'image/webp', 'image/gif'],
            fileSizeLimit: 10485760 // 10MB
        })
        if (createError) console.error('Error creating bucket:', createError)
    }
}

// List all images in bucket (optionally by folder/color)
export async function listBucketImages(folder?: string): Promise<{ name: string; url: string; path: string }[]> {
    const supabase = await createClient()
    await ensureBucket()

    const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .list(folder || '', { sortBy: { column: 'created_at', order: 'desc' } })

    if (error || !data) {
        console.error('Storage list error:', error)
        return []
    }

    return data
        .filter((f: any) => f.metadata) // exclude folders
        .map((file: any) => {
            const filePath = folder ? `${folder}/${file.name}` : file.name
            const { data: urlData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath)
            return {
                name: file.name,
                path: filePath,
                url: urlData.publicUrl
            }
        })
}

// Upload a file and return its public URL
export async function uploadProductImage(
    fileName: string,
    fileBase64: string,
    mimeType: string,
    folder?: string
): Promise<string> {
    const admin = await createAdminClient()
    await ensureBucket()

    // Convert base64 to buffer
    const base64Data = fileBase64.replace(/^data:[^;]+;base64,/, '')
    const buffer = Buffer.from(base64Data, 'base64')

    const sanitizedName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_')
    const filePath = folder ? `${folder}/${sanitizedName}` : sanitizedName

    console.log(`Uploading to ${BUCKET_NAME}/${filePath}...`)

    const { error } = await admin.storage
        .from(BUCKET_NAME)
        .upload(filePath, buffer, {
            contentType: mimeType,
            upsert: true
        })

    if (error) {
        console.error('Upload Error Details:', error)
        throw new Error(`Error de Supabase: ${error.message} (Bucket: ${BUCKET_NAME})`)
    }

    const { data: urlData } = admin.storage.from(BUCKET_NAME).getPublicUrl(filePath)
    return urlData.publicUrl
}

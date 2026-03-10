'use server'

import { createClient } from '@/lib/supabase/server'

const BUCKET_NAME = 'product-images'

// Ensure bucket exists
async function ensureBucket(supabase: any) {
    const { data: buckets } = await supabase.storage.listBuckets()
    const exists = buckets?.some((b: any) => b.name === BUCKET_NAME)
    if (!exists) {
        await supabase.storage.createBucket(BUCKET_NAME, {
            public: true,
            allowedMimeTypes: ['image/png', 'image/jpg', 'image/jpeg', 'image/webp', 'image/gif'],
            fileSizeLimit: 10485760 // 10MB
        })
    }
}

// List all images in bucket (optionally by folder/color)
export async function listBucketImages(folder?: string): Promise<{ name: string; url: string; path: string }[]> {
    const supabase = await createClient()
    await ensureBucket(supabase)

    const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .list(folder || '', { sortBy: { column: 'created_at', order: 'desc' } })

    if (error || !data) return []

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
    const supabase = await createClient()
    await ensureBucket(supabase)

    // Convert base64 to buffer
    const base64Data = fileBase64.replace(/^data:[^;]+;base64,/, '')
    const buffer = Buffer.from(base64Data, 'base64')

    const sanitizedName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_')
    const filePath = folder ? `${folder}/${sanitizedName}` : sanitizedName

    const { error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(filePath, buffer, {
            contentType: mimeType,
            upsert: true
        })

    if (error) {
        throw new Error(error.message)
    }

    const { data: urlData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath)
    return urlData.publicUrl
}

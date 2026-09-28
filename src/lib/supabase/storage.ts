import { randomUUID } from 'node:crypto'

import { createServiceClient } from '@/lib/supabase/server'

export const METADATA_BUCKET = 'metadata'

const IMAGE_EXTENSIONS: Record<string, string> = {
	'image/jpeg': 'jpg',
	'image/jpg': 'jpg',
	'image/png': 'png',
	'image/webp': 'webp',
	'image/gif': 'gif',
}

export function imageExtension(mimeType: string) {
	return IMAGE_EXTENSIONS[mimeType] ?? null
}

export function createMetadataId() {
	return randomUUID()
}

export async function uploadMetadataFile(
	path: string,
	body: Buffer,
	contentType: string,
) {
	const supabase = createServiceClient()
	const { error } = await supabase.storage
		.from(METADATA_BUCKET)
		.upload(path, body, {
			contentType,
			cacheControl: '31536000',
			upsert: false,
		})

	if (error) {
		throw new Error(error.message)
	}

	const { data } = supabase.storage
		.from(METADATA_BUCKET)
		.getPublicUrl(path)

	return data.publicUrl
}

export async function removeMetadataFiles(paths: string[]) {
	const supabase = createServiceClient()
	await supabase.storage.from(METADATA_BUCKET).remove(paths)
}

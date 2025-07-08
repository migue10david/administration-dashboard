import { unlink } from 'fs/promises'
import { join } from 'path'
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

const UPLOADS_DIR = join(process.cwd(), 'public', 'uploads')

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function deleteUploadedFile(fileUrl: string) {
  try {
    const filename = fileUrl.split('/uploads/')[1]
    if (filename) {
      await unlink(join(UPLOADS_DIR, filename))
    }
  } catch (error) {
    console.error('Error deleting file:', error)
  }
}

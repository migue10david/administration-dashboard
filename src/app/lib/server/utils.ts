'use server';

import { promises as fs } from 'fs'
import { join } from 'path'
import { writeFile, unlink } from 'fs/promises'

const UPLOADS_DIR = join(process.cwd(), 'public', 'uploads')

// Función para asegurar que el directorio de uploads existe
export async function ensureUploadsDirExists() {
  const uploadsDir = join(process.cwd(), 'public', 'uploads')
  try {
    await fs.access(uploadsDir)
  } catch (error) {
    console.log(error);
    await fs.mkdir(uploadsDir, { recursive: true })
  }
}

// Función para guardar el archivo en el sistema
export async function saveFile(blob: Blob, fileName: string): Promise<string> {
  const buffer = Buffer.from(await blob.arrayBuffer())
  const filePath = join(process.cwd(), 'public', 'uploads', fileName)
  await writeFile(filePath, buffer)
  return `/uploads/${fileName}`
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



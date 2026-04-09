import path from "node:path"
import { promises as fs } from "node:fs"

import { NextResponse } from "next/server"

const PUBLIC_ROOT = path.join(process.cwd(), "public")

const PHOTO_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"])
const VIDEO_EXTENSIONS = new Set([".mp4", ".webm", ".ogg", ".mov"])
const MUSIC_EXTENSIONS = new Set([".mp3", ".wav", ".ogg", ".m4a", ".aac"])

const toPublicPath = (folder: string, fileName: string) =>
  `/${folder}/${encodeURIComponent(fileName)}`

async function listMediaFiles(
  folder: string,
  allowedExtensions: Set<string>
): Promise<string[]> {
  const folderPath = path.join(PUBLIC_ROOT, folder)

  try {
    const entries = await fs.readdir(folderPath, { withFileTypes: true })

    return entries
      .filter((entry) => {
        if (!entry.isFile()) {
          return false
        }

        const ext = path.extname(entry.name).toLowerCase()
        return allowedExtensions.has(ext)
      })
      .map((entry) => toPublicPath(folder, entry.name))
      .sort((a, b) => a.localeCompare(b))
  } catch {
    return []
  }
}

export async function GET() {
  const [photos, videos, music] = await Promise.all([
    listMediaFiles("photo", PHOTO_EXTENSIONS),
    listMediaFiles("video", VIDEO_EXTENSIONS),
    listMediaFiles("music", MUSIC_EXTENSIONS),
  ])

  return NextResponse.json({ photos, videos, music })
}

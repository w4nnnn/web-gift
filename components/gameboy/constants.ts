import { Film, Gift, ImageIcon, ScrollText } from "lucide-react"
import type { LucideIcon } from "lucide-react"

import type {
  Control,
  MenuItem,
  MomentsMediaTab,
} from "@/components/gameboy/types"

export const KEY_TO_CONTROL: Record<string, Control> = {
  ArrowUp: "up",
  ArrowDown: "down",
  ArrowLeft: "left",
  ArrowRight: "right",
  z: "a",
  Z: "a",
  x: "b",
  X: "b",
  Enter: "start",
  Shift: "select",
}

export const MENU_ITEMS: MenuItem[] = [
  {
    id: "wish",
    title: "Birthday Wish",
    subtitle: "surat kecil untukmu",
    icon: ScrollText,
    notes: [
      "selamat ulang tahun, semoga harimu hangat dan tenang.",
      "terima kasih sudah jadi orang yang berarti di hidupku.",
      "semoga tahun ini lebih ringan, lebih berani, dan lebih bahagia.",
    ],
  },
  {
    id: "moments",
    title: "Best Moments",
    subtitle: "album foto dan video",
    icon: ImageIcon,
    notes: [
      "kumpulan momen terbaik kita ada di sini.",
      "geser menu lain kalau mau lihat bagian hadiah berikutnya.",
    ],
  },
  {
    id: "gift",
    title: "Final Gift",
    subtitle: "mini game heart collector",
    icon: Gift,
    notes: [
      "kumpulkan hati untuk membuka hadiah utama.",
      "gerak dengan kiri kanan, hindari tanda silang.",
      "press A untuk mulai atau ulangi permainan.",
    ],
  },
]

export const MOMENTS_SECTIONS: {
  id: MomentsMediaTab
  title: string
  subtitle: string
  icon: LucideIcon
}[] = [
  {
    id: "photo",
    title: "Photo Album",
    subtitle: "lihat foto penuh",
    icon: ImageIcon,
  },
  {
    id: "video",
    title: "Video Album",
    subtitle: "lihat video penuh",
    icon: Film,
  },
]

export const BOOT_LINES = [
  "mounting birthday cartridge...",
  "loading memories archive...",
  "syncing heart protocol...",
  "calibrating menu screen...",
  "ready: birthday edition",
]

export const BACKSOUND_FALLBACKS = [
  "/music/lofium-lofi-song-kertajina-by-lofium-236750 (1).mp3",
  "/music/lofium-lofi-song-kertajina-by-lofium-236750.mp3"
]

export const GIFT_GAME_LANES = 5
export const GIFT_GAME_ROWS = 6
export const GIFT_GAME_TARGET_SCORE = 14
export const GIFT_GAME_MAX_MISSES = 4
export const GIFT_GAME_TIME_LIMIT = 38
export const GIFT_GAME_TICK_MS = 360

export const FINAL_GIFT_REWARD_LINES = [
  "hadiah terbaikku: doa baik, waktu, dan perhatian yang terus ada.",
  "semoga kamu merasa dicintai, bukan cuma hari ini tapi selalu.",
  "terima kasih sudah jadi orang yang berarti buatku.",
]

export const BIRTHDAY_WISH_TEXT = [
  "happy birthday.",
  "terima kasih karena selalu hadir dengan cara yang sederhana tapi berarti.",
  "semoga langkahmu tahun ini lebih ringan, lebih berani, dan lebih bahagia.",
  "semoga semua doa baik menemukan jalannya ke kamu, satu per satu.",
].join("\n\n")

export const formatMediaLabel = (src: string) =>
  decodeURIComponent(src.split("/").pop() ?? src)
    .replace(/\.[^/.]+$/, "")
    .replace(/[-_]+/g, " ")

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
    subtitle: "a little letter for you",
    icon: ScrollText,
    notes: [
      "happy birthday, may your day feel warm and peaceful.",
      "thank you for being someone meaningful in my life.",
      "may this year feel lighter, braver, and happier for you.",
    ],
  },
  {
    id: "moments",
    title: "Best Moments",
    subtitle: "photo and video album",
    icon: ImageIcon,
    notes: [
      "our best moments are all collected here.",
      "move to other menus if you want to explore the next gift section.",
    ],
  },
  {
    id: "gift",
    title: "Final Gift",
    subtitle: "heart collector mini game",
    icon: Gift,
    notes: [
      "collect hearts to unlock the final gift.",
      "move left and right, avoid the X marks.",
      "press A to start or restart the game.",
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
    subtitle: "view full photos",
    icon: ImageIcon,
  },
  {
    id: "video",
    title: "Video Album",
    subtitle: "view full videos",
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

export const PHOTO_BGM_BY_PHOTO: Record<string, string> = {
  "1.JPG": "/music/Forever Young - Alphaville.mp3",
  "2.JPG": "/music/Thru These Tears - LANY.mp3",
}

// Used when a photo does not have a specific mapping.
export const PHOTO_BGM_DEFAULT_TRACK: string | null =
  BACKSOUND_FALLBACKS[0] ?? null

export const PHOTO_BGM_ENABLE_AUTO_MATCH = false

export const GIFT_GAME_LANES = 5
export const GIFT_GAME_ROWS = 6
export const GIFT_GAME_TARGET_SCORE = 14
export const GIFT_GAME_MAX_MISSES = 4
export const GIFT_GAME_TIME_LIMIT = 38
export const GIFT_GAME_TICK_MS = 360

export const FINAL_GIFT_REWARD_LINES = [
  "my best gift: kind prayers, time, and lasting care.",
  "may you always feel loved, not only today.",
  "thank you for being someone truly meaningful to me.",
]

export const BIRTHDAY_WISH_TEXT = [
  "happy birthday.",
  "thank you for always being present in simple but meaningful ways.",
  "may your steps this year feel lighter, braver, and happier.",
  "may every good prayer find its way to you, one by one.",
].join("\n\n")

export const formatMediaLabel = (src: string) =>
  decodeURIComponent(src.split("/").pop() ?? src)
    .replace(/\.[^/.]+$/, "")
    .replace(/[-_]+/g, " ")

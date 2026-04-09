import type { LucideIcon } from "lucide-react"

export type Direction = "up" | "down" | "left" | "right"
export type ActionControl = "a" | "b" | "start" | "select"
export type Control = Direction | ActionControl
export type ScreenState = "off" | "booting" | "menu" | "detail"
export type MomentsMediaTab = "photo" | "video"
export type MomentsViewMode = "submenu" | "viewer"
export type GiftGameMode = "idle" | "playing" | "won" | "lost"
export type GiftDropKind = "heart" | "thorn"

export type MenuItem = {
  id: string
  title: string
  subtitle: string
  icon: LucideIcon
  notes: string[]
}

export type PhotoAsset = {
  src: string
  alt: string
}

export type VideoAsset = {
  src: string
  title: string
}

export type GiftFallingItem = {
  id: number
  lane: number
  row: number
  kind: GiftDropKind
}

export type MediaResponse = {
  photos: string[]
  videos: string[]
  music: string[]
}

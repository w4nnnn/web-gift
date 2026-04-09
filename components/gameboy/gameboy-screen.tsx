"use client"

import * as React from "react"
import { ChevronRight, Heart, Power, Trophy, X } from "lucide-react"
import Image from "next/image"

import {
  BIRTHDAY_WISH_TEXT,
  FINAL_GIFT_REWARD_LINES,
  GIFT_GAME_LANES,
  GIFT_GAME_MAX_MISSES,
  GIFT_GAME_ROWS,
  GIFT_GAME_TARGET_SCORE,
  MENU_ITEMS,
  MOMENTS_SECTIONS,
} from "@/components/gameboy/constants"
import type {
  GiftFallingItem,
  GiftGameMode,
  MenuItem,
  MomentsViewMode,
  PhotoAsset,
  ScreenState,
  VideoAsset,
} from "@/components/gameboy/types"
import { cn } from "@/lib/utils"

type GameboyScreenProps = {
  showOffScreen: boolean
  isBooting: boolean
  bootProgress: number
  visibleBootLines: string[]
  screenState: ScreenState
  selectedIndex: number
  openedItem: MenuItem | null
  typedWish: string
  photoAlbum: PhotoAsset[]
  videoAlbum: VideoAsset[]
  momentsTabIndex: number
  momentsViewMode: MomentsViewMode
  activeMomentsTab: "photo" | "video"
  activePhotoIndex: number
  activeVideoIndex: number
  giftGameMode: GiftGameMode
  giftPlayerLane: number
  giftScore: number
  giftMisses: number
  giftTimeLeft: number
  giftItems: GiftFallingItem[]
  status: string
  isBgmEnabled: boolean
  currentTrack: string | null
}

export function GameboyScreen({
  showOffScreen,
  isBooting,
  bootProgress,
  visibleBootLines,
  screenState,
  selectedIndex,
  openedItem,
  typedWish,
  photoAlbum,
  videoAlbum,
  momentsTabIndex,
  momentsViewMode,
  activeMomentsTab,
  activePhotoIndex,
  activeVideoIndex,
  giftGameMode,
  giftPlayerLane,
  giftScore,
  giftMisses,
  giftTimeLeft,
  giftItems,
  status,
  isBgmEnabled,
  currentTrack,
}: GameboyScreenProps) {
  const DetailIcon = openedItem?.icon
  const activePhoto = photoAlbum[activePhotoIndex] ?? null
  const activeVideo = videoAlbum[activeVideoIndex] ?? null
  const activeTotal =
    activeMomentsTab === "photo" ? photoAlbum.length : videoAlbum.length
  const activePosition =
    activeMomentsTab === "photo" ? activePhotoIndex + 1 : activeVideoIndex + 1
  const giftCells = React.useMemo(() => {
    const map = new Map<string, GiftFallingItem["kind"]>()
    giftItems.forEach((item) => {
      map.set(`${item.row}-${item.lane}`, item.kind)
    })
    return map
  }, [giftItems])

  return (
    <section className="rounded-[1.6rem] border-4 border-gb-bezel bg-gb-bezel-inner p-4 shadow-[inset_0_2px_14px_color-mix(in_oklab,var(--color-gb-shell-edge)_35%,black)] md:p-5">
      <div
        className={cn(
          "relative aspect-[10/7] overflow-hidden rounded-md border-2 border-gb-screen-frame p-2 shadow-[inset_0_0_0_2px_color-mix(in_oklab,var(--color-gb-screen)_80%,black)]",
          showOffScreen ? "bg-gb-screen-dim" : "bg-gb-screen"
        )}
        aria-label="gameboy-screen"
      >
        {!showOffScreen ? (
          <div className="pointer-events-none absolute inset-0 gb-scanline opacity-45" />
        ) : null}

        {showOffScreen ? (
          <div className="flex h-full flex-col items-center justify-center rounded-[4px] border border-gb-grid/45 bg-[linear-gradient(180deg,color-mix(in_oklab,var(--color-gb-screen-dim)_90%,black),color-mix(in_oklab,var(--color-gb-screen-dim)_68%,black))]">
            <Power className="size-7 text-gb-grid/80" />
            <p className="mt-2 font-heading text-[0.62rem] uppercase tracking-[0.22em] text-gb-grid/80">
              Press Start
            </p>
            <p className="mt-1 text-[0.48rem] uppercase tracking-[0.15em] text-gb-grid/75">
              Power On
            </p>
          </div>
        ) : isBooting ? (
          <div className="relative flex h-full flex-col justify-between gap-3 rounded-[4px] border border-gb-grid/70 bg-[linear-gradient(180deg,color-mix(in_oklab,var(--color-gb-screen)_90%,white),color-mix(in_oklab,var(--color-gb-pixel-off)_70%,black))] p-3">
            <div className="flex flex-col gap-1">
              <p className="font-heading text-[0.64rem] uppercase tracking-[0.24em] text-gb-screen-frame">
                Web Boy Firmware
              </p>
              <p className="text-[0.52rem] uppercase tracking-[0.16em] text-gb-screen-frame/80">
                Loading birthday edition
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <div className="h-2 rounded-full border border-gb-grid/75 bg-gb-pixel-off/65 p-0.5">
                <div
                  className="h-full rounded-full bg-gb-pixel-on transition-[width] duration-150"
                  style={{ width: `${bootProgress}%` }}
                />
              </div>
              <p className="text-[0.5rem] uppercase tracking-[0.16em] text-gb-screen-frame/80">
                boot {bootProgress.toString().padStart(3, "0")}%
              </p>
            </div>

            <div className="flex flex-col gap-1 overflow-hidden text-[0.5rem] uppercase tracking-[0.15em] text-gb-screen-frame/85">
              {visibleBootLines.map((line, index) => (
                <p
                  key={line}
                  className="gb-boot-line"
                  style={{ animationDelay: `${index * 65}ms` }}
                >
                  {line}
                </p>
              ))}
            </div>
          </div>
        ) : screenState === "menu" ? (
          <div className="relative flex h-full flex-col gap-2 rounded-[4px] border border-gb-grid/70 bg-[linear-gradient(180deg,color-mix(in_oklab,var(--color-gb-screen)_88%,white),color-mix(in_oklab,var(--color-gb-pixel-off)_78%,black))] p-3">
            <div className="flex items-center justify-between">
              <p className="font-heading text-[0.64rem] uppercase tracking-[0.24em] text-gb-screen-frame/90">
                Main Menu
              </p>
              <p className="text-[0.5rem] uppercase tracking-[0.16em] text-gb-screen-frame/80">
                {selectedIndex + 1}/{MENU_ITEMS.length}
              </p>
            </div>

            <ul className="flex flex-1 flex-col justify-center gap-1.5">
              {MENU_ITEMS.map((item, index) => {
                const Icon = item.icon
                const isActive = index === selectedIndex

                return (
                  <li
                    key={item.id}
                    className={cn(
                      "flex items-center gap-2 rounded-sm border px-2 py-1 transition-colors",
                      isActive
                        ? "border-gb-screen-frame bg-gb-pixel-on text-gb-action-foreground"
                        : "border-gb-grid/45 bg-gb-pixel-off/80 text-gb-screen-frame/90"
                    )}
                  >
                    <Icon className="size-3.5" />
                    <div className="flex flex-col leading-none">
                      <span className="font-heading text-[0.56rem] uppercase tracking-[0.16em]">
                        {item.title}
                      </span>
                      <span
                        className={cn(
                          "text-[0.44rem] uppercase tracking-[0.13em]",
                          isActive
                            ? "text-gb-action-foreground/90"
                            : "text-gb-screen-frame/80"
                        )}
                      >
                        {item.subtitle}
                      </span>
                    </div>
                    {isActive ? <ChevronRight className="ml-auto size-3" /> : null}
                  </li>
                )
              })}
            </ul>

            <p className="text-[0.5rem] uppercase tracking-[0.15em] text-gb-screen-frame/80">
              A open | B back | Select music
            </p>
          </div>
        ) : openedItem ? (
          <div className="relative flex h-full flex-col gap-2 rounded-[4px] border border-gb-grid/70 bg-[linear-gradient(180deg,color-mix(in_oklab,var(--color-gb-screen)_88%,white),color-mix(in_oklab,var(--color-gb-pixel-off)_74%,black))] p-3">
            <header className="flex items-center gap-2 rounded-sm border border-gb-grid/50 bg-gb-pixel-off/80 px-2 py-1">
              {DetailIcon ? <DetailIcon className="size-4 text-gb-screen-frame/90" /> : null}
              <div className="flex flex-col leading-none">
                <p className="font-heading text-[0.58rem] uppercase tracking-[0.17em] text-gb-screen-frame/95">
                  {openedItem.title}
                </p>
                <p className="text-[0.45rem] uppercase tracking-[0.13em] text-gb-screen-frame/80">
                  {openedItem.subtitle}
                </p>
              </div>
            </header>

            {openedItem.id === "wish" ? (
              <div className="flex flex-1 overflow-hidden rounded-sm border border-gb-grid/35 bg-gb-pixel-off/70 px-2 py-2">
                <p className="w-full overflow-y-auto whitespace-pre-wrap text-[0.54rem] uppercase tracking-[0.12em] text-gb-screen-frame/90">
                  {typedWish}
                  {typedWish.length < BIRTHDAY_WISH_TEXT.length ? (
                    <span className="gb-type-caret">|</span>
                  ) : null}
                </p>
              </div>
            ) : null}

            {openedItem.id === "moments" ? (
              <div className="flex min-h-0 flex-1 flex-col gap-2">
                {momentsViewMode === "submenu" ? (
                  <div className="relative flex h-full flex-col gap-2 rounded-[4px] border border-gb-grid/70 bg-[linear-gradient(180deg,color-mix(in_oklab,var(--color-gb-screen)_88%,white),color-mix(in_oklab,var(--color-gb-pixel-off)_78%,black))] p-3">
                    <div className="flex items-center justify-between">
                      <p className="font-heading text-[0.64rem] uppercase tracking-[0.24em] text-gb-screen-frame/90">
                        Moments Menu
                      </p>
                      <p className="text-[0.5rem] uppercase tracking-[0.16em] text-gb-screen-frame/80">
                        {momentsTabIndex + 1}/{MOMENTS_SECTIONS.length}
                      </p>
                    </div>

                    <ul className="flex flex-1 flex-col justify-center gap-1.5">
                      {MOMENTS_SECTIONS.map((section, index) => {
                        const Icon = section.icon
                        const isActive = index === momentsTabIndex

                        return (
                          <li
                            key={section.id}
                            className={cn(
                              "flex items-center gap-2 rounded-sm border px-2 py-1 transition-colors",
                              isActive
                                ? "border-gb-screen-frame bg-gb-pixel-on text-gb-action-foreground"
                                : "border-gb-grid/45 bg-gb-pixel-off/80 text-gb-screen-frame/90"
                            )}
                          >
                            <Icon className="size-3.5" />
                            <div className="flex min-w-0 flex-col leading-none">
                              <span className="font-heading text-[0.56rem] uppercase tracking-[0.16em]">
                                {section.title}
                              </span>
                              <span
                                className={cn(
                                  "truncate text-[0.44rem] uppercase tracking-[0.13em]",
                                  isActive
                                    ? "text-gb-action-foreground/90"
                                    : "text-gb-screen-frame/80"
                                )}
                              >
                                {section.subtitle}
                              </span>
                            </div>
                            {isActive ? <ChevronRight className="ml-auto size-3" /> : null}
                          </li>
                        )
                      })}
                    </ul>

                    <p className="text-[0.5rem] uppercase tracking-[0.15em] text-gb-screen-frame/80">
                      A open | B menu | left/right choose
                    </p>
                  </div>
                ) : (
                  <div className="flex min-h-0 flex-1 flex-col gap-2">
                    <div className="flex items-center justify-between rounded-sm border border-gb-grid/45 bg-gb-pixel-off/75 px-2 py-1">
                      <p className="font-heading text-[0.5rem] uppercase tracking-[0.16em] text-gb-screen-frame/95">
                        {activeMomentsTab === "photo" ? "Photo Viewer" : "Video Viewer"}
                      </p>
                      <p className="text-[0.47rem] uppercase tracking-[0.12em] text-gb-screen-frame/85">
                        {activeTotal > 0 ? `${activePosition}/${activeTotal}` : "0/0"}
                      </p>
                    </div>

                    <div className="relative min-h-0 flex-1 overflow-hidden rounded-sm border border-gb-grid/45 bg-black/40 p-1.5">
                      {activeMomentsTab === "photo" ? (
                        activePhoto ? (
                          <div className="relative h-full w-full">
                            <Image
                              src={activePhoto.src}
                              alt={activePhoto.alt}
                              fill
                              sizes="(max-width: 768px) 100vw, 640px"
                              className="rounded-[2px] object-contain"
                              unoptimized
                            />
                          </div>
                        ) : (
                          <div className="flex h-full items-center justify-center">
                            <p className="text-[0.5rem] uppercase tracking-[0.12em] text-gb-screen-frame/80">
                              tambahkan foto ke folder public/photo
                            </p>
                          </div>
                        )
                      ) : activeVideo ? (
                        <video
                          key={activeVideo.src}
                          src={activeVideo.src}
                          controls
                          preload="metadata"
                          className="h-full w-full rounded-[2px] object-contain bg-black/55"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <p className="text-[0.5rem] uppercase tracking-[0.12em] text-gb-screen-frame/80">
                            tambahkan video ke folder public/video
                          </p>
                        </div>
                      )}
                    </div>

                    <p className="truncate rounded-sm border border-gb-grid/35 bg-gb-pixel-off/70 px-2 py-1 text-[0.45rem] uppercase tracking-[0.11em] text-gb-screen-frame/85">
                      {activeMomentsTab === "photo"
                        ? activePhoto?.alt ?? "no photo"
                        : activeVideo?.title ?? "no video"}
                    </p>
                  </div>
                )}
              </div>
            ) : null}

            {openedItem.id === "gift" ? (
              <div className="flex min-h-0 flex-1 flex-col gap-2">
                <div className="grid grid-cols-3 gap-1 text-[0.46rem] uppercase tracking-[0.12em]">
                  <div className="rounded-sm border border-gb-grid/45 bg-gb-pixel-off/70 px-2 py-1 text-gb-screen-frame/90">
                    score {giftScore}/{GIFT_GAME_TARGET_SCORE}
                  </div>
                  <div className="rounded-sm border border-gb-grid/45 bg-gb-pixel-off/70 px-2 py-1 text-center text-gb-screen-frame/90">
                    miss {giftMisses}/{GIFT_GAME_MAX_MISSES}
                  </div>
                  <div className="rounded-sm border border-gb-grid/45 bg-gb-pixel-off/70 px-2 py-1 text-right text-gb-screen-frame/90">
                    time {giftTimeLeft}
                  </div>
                </div>

                <div
                  className="grid min-h-0 flex-1 gap-1 rounded-sm border border-gb-grid/45 bg-gb-pixel-off/70 p-1"
                  style={{ gridTemplateColumns: `repeat(${GIFT_GAME_LANES}, minmax(0, 1fr))` }}
                >
                  {Array.from({ length: GIFT_GAME_ROWS * GIFT_GAME_LANES }, (_, index) => {
                    const row = Math.floor(index / GIFT_GAME_LANES)
                    const lane = index % GIFT_GAME_LANES
                    const kind = giftCells.get(`${row}-${lane}`)
                    const isPlayer = row === GIFT_GAME_ROWS - 1 && lane === giftPlayerLane

                    return (
                      <div
                        key={`${row}-${lane}`}
                        className={cn(
                          "relative flex items-center justify-center rounded-[2px] border border-gb-grid/40",
                          isPlayer
                            ? "bg-gb-pixel-on/90 text-gb-action-foreground"
                            : "bg-gb-pixel-off/65 text-gb-screen-frame/90"
                        )}
                      >
                        {kind === "heart" ? <Heart className="size-3" /> : null}
                        {kind === "thorn" ? <X className="size-3" /> : null}
                        {isPlayer ? (
                          <div className="absolute inset-x-0 bottom-0 mx-auto h-1.5 w-5 rounded-full bg-gb-action" />
                        ) : null}
                      </div>
                    )
                  })}
                </div>

                {giftGameMode === "won" ? (
                  <div className="flex max-h-24 flex-col gap-1 overflow-y-auto rounded-sm border border-gb-grid/35 bg-gb-pixel-off/70 px-2 py-2">
                    <p className="flex items-center gap-1 text-[0.48rem] uppercase tracking-[0.14em] text-gb-screen-frame/95">
                      <Trophy className="size-3" /> Final Gift Unlocked
                    </p>
                    {FINAL_GIFT_REWARD_LINES.map((line) => (
                      <p
                        key={line}
                        className="text-[0.46rem] uppercase tracking-[0.12em] text-gb-screen-frame/88"
                      >
                        {line}
                      </p>
                    ))}
                  </div>
                ) : (
                  <p className="rounded-sm border border-gb-grid/35 bg-gb-pixel-off/70 px-2 py-1 text-[0.47rem] uppercase tracking-[0.12em] text-gb-screen-frame/88">
                    {giftGameMode === "idle"
                      ? "press A to start heart collector"
                      : giftGameMode === "playing"
                        ? "left/right move | catch heart | avoid X"
                        : "game over, press A to retry"}
                  </p>
                )}
              </div>
            ) : null}

            {openedItem.id !== "wish" && openedItem.id !== "moments" && openedItem.id !== "gift" ? (
              <div className="flex flex-1 flex-col justify-center gap-2 overflow-y-auto">
                {openedItem.notes.map((note) => (
                  <p
                    key={note}
                    className="rounded-sm border border-gb-grid/35 bg-gb-pixel-off/70 px-2 py-1 text-[0.53rem] uppercase tracking-[0.12em] text-gb-screen-frame/90"
                  >
                    {note}
                  </p>
                ))}
              </div>
            ) : null}

            <p className="text-[0.5rem] uppercase tracking-[0.15em] text-gb-screen-frame/80">
              {openedItem.id === "moments" && momentsViewMode === "submenu"
                ? "A open | left/right choose | B menu"
                : openedItem.id === "moments"
                  ? "Left/right browse | B category"
                  : openedItem.id === "gift" && giftGameMode === "playing"
                    ? "Left/right move | A hint | B menu"
                    : openedItem.id === "gift"
                      ? "A start/retry | B menu"
                  : "B menu | Left/Right next card"}
            </p>
          </div>
        ) : null}
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-md bg-gb-shell-inner px-3 py-2 text-[0.62rem] uppercase tracking-[0.18em] text-gb-label/90 md:text-[0.7rem]">
        <span>Mode {screenState}</span>
        <span>{status}</span>
        <span>{currentTrack ? (isBgmEnabled ? "BGM ON" : "BGM OFF") : "BGM NONE"}</span>
      </div>
    </section>
  )
}

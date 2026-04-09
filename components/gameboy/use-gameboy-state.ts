"use client"

import * as React from "react"

import {
  BACKSOUND_FALLBACKS,
  BIRTHDAY_WISH_TEXT,
  BOOT_LINES,
  formatMediaLabel,
  GIFT_GAME_LANES,
  GIFT_GAME_MAX_MISSES,
  GIFT_GAME_ROWS,
  GIFT_GAME_TARGET_SCORE,
  GIFT_GAME_TICK_MS,
  GIFT_GAME_TIME_LIMIT,
  KEY_TO_CONTROL,
  MENU_ITEMS,
  MOMENTS_SECTIONS,
  PHOTO_BGM_BY_PHOTO,
  PHOTO_BGM_DEFAULT_TRACK,
  PHOTO_BGM_ENABLE_AUTO_MATCH,
} from "@/components/gameboy/constants"
import type {
  Control,
  GiftFallingItem,
  GiftGameMode,
  MediaResponse,
  MomentsMediaTab,
  MomentsViewMode,
  PhotoAsset,
  ScreenState,
  VideoAsset,
} from "@/components/gameboy/types"

export type GameboyState = {
  audioRef: React.RefObject<HTMLAudioElement | null>
  screenState: ScreenState
  bootProgress: number
  selectedIndex: number
  openedItem: (typeof MENU_ITEMS)[number] | null
  status: string
  isBgmEnabled: boolean
  typedWish: string
  photoAlbum: PhotoAsset[]
  videoAlbum: VideoAsset[]
  momentsTabIndex: number
  momentsViewMode: MomentsViewMode
  activeMomentsTab: MomentsMediaTab
  activePhotoIndex: number
  activeVideoIndex: number
  giftGameMode: GiftGameMode
  giftPlayerLane: number
  giftScore: number
  giftMisses: number
  giftTimeLeft: number
  giftItems: GiftFallingItem[]
  visibleBootLines: string[]
  isBooting: boolean
  showOffScreen: boolean
  currentTrack: string | null
  isPressed: (control: Control) => boolean
  handleControlDown: (control: Control) => () => void
  handleControlUp: (control: Control) => () => void
  handleAudioError: () => void
}

type GiftGameState = {
  mode: GiftGameMode
  playerLane: number
  score: number
  misses: number
  timeLeft: number
  items: GiftFallingItem[]
}

const toMediaKey = (src: string) =>
  decodeURIComponent(src.split("/").pop() ?? src)
    .replace(/\.[^/.]+$/, "")
    .replace(/[\s_-]+/g, "")
    .toLowerCase()

const createGiftGameState = (mode: GiftGameMode = "idle"): GiftGameState => ({
  mode,
  playerLane: Math.floor(GIFT_GAME_LANES / 2),
  score: 0,
  misses: 0,
  timeLeft: GIFT_GAME_TIME_LIMIT,
  items: [],
})

export function useGameboyState(): GameboyState {
  const [isPoweredOn, setIsPoweredOn] = React.useState(true)
  const [screenState, setScreenState] = React.useState<ScreenState>("booting")
  const [bootProgress, setBootProgress] = React.useState(0)
  const [selectedIndex, setSelectedIndex] = React.useState(0)
  const [openedIndex, setOpenedIndex] = React.useState<number | null>(null)
  const [pressedControls, setPressedControls] = React.useState<Set<Control>>(
    () => new Set()
  )
  const [status, setStatus] = React.useState("INITIALIZING SYSTEM")
  const [isBgmEnabled, setIsBgmEnabled] = React.useState(true)
  const [trackIndex, setTrackIndex] = React.useState(0)
  const [typedWish, setTypedWish] = React.useState("")
  const [photoAlbum, setPhotoAlbum] = React.useState<PhotoAsset[]>([])
  const [videoAlbum, setVideoAlbum] = React.useState<VideoAsset[]>([])
  const [momentsTabIndex, setMomentsTabIndex] = React.useState(0)
  const [momentsViewMode, setMomentsViewMode] =
    React.useState<MomentsViewMode>("submenu")
  const [activePhotoIndex, setActivePhotoIndex] = React.useState(0)
  const [activeVideoIndex, setActiveVideoIndex] = React.useState(0)
  const [giftGame, setGiftGame] = React.useState<GiftGameState>(() =>
    createGiftGameState()
  )
  const [bgmTracks, setBgmTracks] = React.useState<string[]>(
    BACKSOUND_FALLBACKS
  )

  const audioRef = React.useRef<HTMLAudioElement | null>(null)
  const giftDropIdRef = React.useRef(1)
  const giftGameRef = React.useRef(giftGame)

  const openedItem = openedIndex === null ? null : MENU_ITEMS[openedIndex]

  const visibleBootLines = React.useMemo(() => {
    const count = Math.min(
      BOOT_LINES.length,
      Math.ceil((bootProgress / 100) * BOOT_LINES.length)
    )
    return BOOT_LINES.slice(0, count)
  }, [bootProgress])

  const isBooting = isPoweredOn && screenState === "booting"
  const showOffScreen = !isPoweredOn || screenState === "off"
  const currentTrack = bgmTracks[trackIndex] ?? null
  const activeMomentsTab: MomentsMediaTab =
    MOMENTS_SECTIONS[momentsTabIndex]?.id ?? "photo"
  const musicTrackByKey = React.useMemo(() => {
    const map = new Map<string, number>()

    bgmTracks.forEach((track, index) => {
      const key = toMediaKey(track)
      if (!map.has(key)) {
        map.set(key, index)
      }
    })

    return map
  }, [bgmTracks])
  const configuredPhotoTrackByKey = React.useMemo(() => {
    const map = new Map<string, number>()

    Object.entries(PHOTO_BGM_BY_PHOTO).forEach(([photoKey, musicSrc]) => {
      const trackIndex = musicTrackByKey.get(toMediaKey(musicSrc))
      if (trackIndex !== undefined) {
        map.set(toMediaKey(photoKey), trackIndex)
      }
    })

    return map
  }, [musicTrackByKey])
  const defaultBgmTrackIndex = React.useMemo(() => {
    if (bgmTracks.length <= 0) {
      return null
    }

    if (PHOTO_BGM_DEFAULT_TRACK) {
      const configuredIndex = musicTrackByKey.get(toMediaKey(PHOTO_BGM_DEFAULT_TRACK))
      if (configuredIndex !== undefined) {
        return configuredIndex
      }
    }

    for (const fallbackTrack of BACKSOUND_FALLBACKS) {
      const fallbackIndex = musicTrackByKey.get(toMediaKey(fallbackTrack))
      if (fallbackIndex !== undefined) {
        return fallbackIndex
      }
    }

    return 0
  }, [bgmTracks.length, musicTrackByKey])

  const resolvePhotoTrackIndex = React.useCallback(
    (photoIndex: number) => {
      if (defaultBgmTrackIndex === null) {
        return null
      }

      const photo = photoAlbum[photoIndex]
      if (!photo) {
        return defaultBgmTrackIndex
      }

      const photoKey = toMediaKey(photo.src)
      const configuredTrackIndex = configuredPhotoTrackByKey.get(photoKey)
      if (configuredTrackIndex !== undefined) {
        return configuredTrackIndex
      }

      if (PHOTO_BGM_ENABLE_AUTO_MATCH) {
        const matchedIndex = musicTrackByKey.get(photoKey)
        if (matchedIndex !== undefined) {
          return matchedIndex
        }
      }

      return defaultBgmTrackIndex
    },
    [configuredPhotoTrackByKey, defaultBgmTrackIndex, musicTrackByKey, photoAlbum]
  )

  React.useEffect(() => {
    giftGameRef.current = giftGame
  }, [giftGame])

  const setMomentsViewerStatus = React.useCallback(
    (tab: MomentsMediaTab, index: number, total: number) => {
      const prefix = tab === "photo" ? "PHOTO" : "VIDEO"
      if (total <= 0) {
        setStatus(`${prefix} ALBUM EMPTY`)
        return
      }

      setStatus(`${prefix} ${index + 1}/${total}`)
    },
    []
  )

  const setPressed = React.useCallback((control: Control, pressed: boolean) => {
    setPressedControls((current) => {
      const next = new Set(current)
      if (pressed) {
        next.add(control)
      } else {
        next.delete(control)
      }
      return next
    })
  }, [])

  const cycleMenu = React.useCallback((step: number) => {
    setSelectedIndex((current) =>
      (current + step + MENU_ITEMS.length) % MENU_ITEMS.length
    )
  }, [])

  const playBgm = React.useCallback(() => {
    const audio = audioRef.current
    if (!audio || !currentTrack || !isBgmEnabled || !isPoweredOn) {
      return
    }

    audio.volume = 0.34
    const playback = audio.play()
    if (playback) {
      playback.catch(() => {})
    }
  }, [currentTrack, isBgmEnabled, isPoweredOn])

  const stopBgm = React.useCallback(() => {
    const audio = audioRef.current
    if (!audio) {
      return
    }

    audio.pause()
    audio.currentTime = 0
  }, [])

  const resetGiftGame = React.useCallback((mode: GiftGameMode = "idle") => {
    const nextState = createGiftGameState(mode)
    giftDropIdRef.current = 1
    giftGameRef.current = nextState
    setGiftGame(nextState)
  }, [])

  const startGiftGame = React.useCallback(() => {
    resetGiftGame("playing")
    setStatus("CATCH THE HEARTS")
  }, [resetGiftGame])

  const togglePower = React.useCallback(() => {
    if (isPoweredOn) {
      setIsPoweredOn(false)
      setScreenState("off")
      setStatus("POWER OFF")
      setPressedControls(new Set())
      resetGiftGame("idle")
      stopBgm()
      return
    }

    setIsPoweredOn(true)
    setScreenState("booting")
    setBootProgress(0)
    setOpenedIndex(null)
    resetGiftGame("idle")
    setStatus("POWER ON")
  }, [isPoweredOn, resetGiftGame, stopBgm])

  const toggleMusic = React.useCallback(() => {
    if (!currentTrack) {
      setStatus("BGM FILE NOT FOUND")
      return
    }

    setIsBgmEnabled((current) => {
      const next = !current
      setStatus(next ? "BGM ON" : "BGM OFF")
      return next
    })
  }, [currentTrack])

  const runControl = React.useCallback(
    (control: Control, isRepeat = false) => {
      if (control === "start") {
        if (isRepeat) {
          return
        }
        togglePower()
        return
      }

      if (!isPoweredOn) {
        return
      }

      if (screenState === "booting") {
        if (control === "select" && !isRepeat) {
          setBootProgress(100)
          setScreenState("menu")
          setStatus("BOOT SKIPPED")
        }
        return
      }

      if (control === "select") {
        if (!isRepeat) {
          toggleMusic()
        }
        return
      }

      if (screenState === "menu") {
        if (control === "up" || control === "left") {
          cycleMenu(-1)
          setStatus("MENU UP")
          return
        }

        if (control === "down" || control === "right") {
          cycleMenu(1)
          setStatus("MENU DOWN")
          return
        }

        if (control === "a") {
          const item = MENU_ITEMS[selectedIndex]
          setOpenedIndex(selectedIndex)
          setScreenState("detail")

          if (item.id === "moments") {
            setMomentsTabIndex(0)
            setMomentsViewMode("submenu")
            setStatus("CHOOSE PHOTO OR VIDEO")
            return
          }

          if (item.id === "gift") {
            resetGiftGame("idle")
            setStatus("HEART COLLECTOR READY")
            return
          }

          setStatus(`OPEN ${item.title.toUpperCase()}`)
          return
        }

        if (control === "b") {
          setStatus("YOU ARE ALREADY ON MAIN MENU")
        }
        return
      }

      if (openedItem?.id === "moments") {
        if (control === "b") {
          if (momentsViewMode === "viewer") {
            setMomentsViewMode("submenu")
            setStatus("BACK TO MOMENTS MENU")
            return
          }

          setScreenState("menu")
          setStatus("BACK TO MAIN MENU")
          return
        }

        if (momentsViewMode === "submenu") {
          if (
            control === "left" ||
            control === "up" ||
            control === "right" ||
            control === "down"
          ) {
            const step = control === "left" || control === "up" ? -1 : 1
            const nextIndex =
              (momentsTabIndex + step + MOMENTS_SECTIONS.length) %
              MOMENTS_SECTIONS.length
            const nextTab = MOMENTS_SECTIONS[nextIndex]?.id ?? "photo"

            setMomentsTabIndex(nextIndex)
            setStatus(nextTab === "photo" ? "PHOTO MENU" : "VIDEO MENU")
            return
          }

          if (control === "a") {
            const total =
              activeMomentsTab === "photo" ? photoAlbum.length : videoAlbum.length

            if (total <= 0) {
              setStatus(
                activeMomentsTab === "photo"
                  ? "PHOTO ALBUM EMPTY"
                  : "VIDEO ALBUM EMPTY"
              )
              return
            }

            setMomentsViewMode("viewer")

            if (activeMomentsTab === "photo") {
              const nextPhotoIndex = Math.min(activePhotoIndex, total - 1)
              setActivePhotoIndex(nextPhotoIndex)
              setMomentsViewerStatus("photo", nextPhotoIndex, total)
            } else {
              const nextVideoIndex = Math.min(activeVideoIndex, total - 1)
              setActiveVideoIndex(nextVideoIndex)
              setMomentsViewerStatus("video", nextVideoIndex, total)
            }

            return
          }

          return
        }

        if (
          control === "left" ||
          control === "up" ||
          control === "right" ||
          control === "down"
        ) {
          const step = control === "left" || control === "up" ? -1 : 1

          if (activeMomentsTab === "photo") {
            const total = photoAlbum.length
            if (total <= 0) {
              setStatus("PHOTO ALBUM EMPTY")
              return
            }

            const nextPhotoIndex =
              (activePhotoIndex + step + total) % total

            setActivePhotoIndex(nextPhotoIndex)
            setMomentsViewerStatus("photo", nextPhotoIndex, total)
            return
          }

          const total = videoAlbum.length
          if (total <= 0) {
            setStatus("VIDEO ALBUM EMPTY")
            return
          }

          const nextVideoIndex =
            (activeVideoIndex + step + total) % total

          setActiveVideoIndex(nextVideoIndex)
          setMomentsViewerStatus("video", nextVideoIndex, total)
          return
        }

        if (control === "a") {
          setStatus("LEFT RIGHT TO BROWSE")
        }

        return
      }

      if (openedItem?.id === "gift") {
        if (control === "b") {
          resetGiftGame("idle")
          setScreenState("menu")
          setStatus("BACK TO MAIN MENU")
          return
        }

        if (control === "a" && !isRepeat) {
          if (giftGame.mode === "playing") {
            setStatus("LEFT RIGHT TO MOVE")
            return
          }

          startGiftGame()
          return
        }

        if (control === "left" || control === "right") {
          if (giftGame.mode !== "playing") {
            setStatus("PRESS A TO START")
            return
          }

          setGiftGame((current) => {
            const step = control === "left" ? -1 : 1
            const nextLane = Math.min(
              GIFT_GAME_LANES - 1,
              Math.max(0, current.playerLane + step)
            )

            if (nextLane === current.playerLane) {
              return current
            }

            const nextState = {
              ...current,
              playerLane: nextLane,
            }

            giftGameRef.current = nextState
            return nextState
          })

          setStatus(control === "left" ? "MOVE LEFT" : "MOVE RIGHT")
          return
        }

        if (control === "up" || control === "down") {
          setStatus(giftGame.mode === "playing" ? "LEFT RIGHT TO MOVE" : "PRESS A TO START")
        }

        return
      }

      if (control === "b") {
        setScreenState("menu")
        setStatus("BACK TO MAIN MENU")
        return
      }

      if (
        control === "up" ||
        control === "left" ||
        control === "down" ||
        control === "right"
      ) {
        const step = control === "up" || control === "left" ? -1 : 1
        const baseIndex = openedIndex ?? selectedIndex
        const nextIndex =
          (baseIndex + step + MENU_ITEMS.length) % MENU_ITEMS.length
        const item = MENU_ITEMS[nextIndex]

        if (item.id === "gift") {
          resetGiftGame("idle")
        }

        setOpenedIndex(nextIndex)
        setSelectedIndex(nextIndex)
        setStatus(`OPEN ${item.title.toUpperCase()}`)
        return
      }

      if (control === "a") {
        setStatus("HAPPY BIRTHDAY")
      }
    },
    [
      cycleMenu,
      activeMomentsTab,
      activePhotoIndex,
      activeVideoIndex,
      giftGame.mode,
      isPoweredOn,
      momentsTabIndex,
      momentsViewMode,
      openedIndex,
      openedItem?.id,
      photoAlbum.length,
      resetGiftGame,
      screenState,
      selectedIndex,
      setMomentsViewerStatus,
      startGiftGame,
      toggleMusic,
      togglePower,
      videoAlbum.length,
    ]
  )

  React.useEffect(() => {
    let cancelled = false

    const loadMedia = async () => {
      try {
        const response = await fetch("/api/media", { cache: "no-store" })
        if (!response.ok) {
          return
        }

        const data = (await response.json()) as Partial<MediaResponse>
        if (cancelled) {
          return
        }

        const photos = Array.isArray(data.photos) ? data.photos : []
        const videos = Array.isArray(data.videos) ? data.videos : []
        const music = Array.isArray(data.music) ? data.music : []

        setPhotoAlbum(
          photos.map((src) => ({
            src,
            alt: formatMediaLabel(src),
          }))
        )

        setVideoAlbum(
          videos.map((src) => ({
            src,
            title: formatMediaLabel(src),
          }))
        )

        if (music.length > 0) {
          setBgmTracks(music)
        }
      } catch {
        // Ignore media loading errors and keep local fallbacks.
      }
    }

    loadMedia()

    return () => {
      cancelled = true
    }
  }, [])

  React.useEffect(() => {
    setActivePhotoIndex((current) =>
      Math.min(current, Math.max(photoAlbum.length - 1, 0))
    )
  }, [photoAlbum.length])

  React.useEffect(() => {
    setActiveVideoIndex((current) =>
      Math.min(current, Math.max(videoAlbum.length - 1, 0))
    )
  }, [videoAlbum.length])

  React.useEffect(() => {
    if (!isPoweredOn || screenState !== "booting") {
      return
    }

    setBootProgress(0)
    setPressedControls(new Set())

    let timeoutId: number | undefined
    const intervalId = window.setInterval(() => {
      setBootProgress((current) => {
        const increment = current < 66 ? 7 : current < 92 ? 4 : 2
        const next = Math.min(100, current + increment)

        if (next === 100) {
          window.clearInterval(intervalId)
          timeoutId = window.setTimeout(() => {
            setScreenState("menu")
            setStatus("SYSTEM READY")
          }, 380)
        }

        return next
      })
    }, 90)

    return () => {
      window.clearInterval(intervalId)
      if (timeoutId) {
        window.clearTimeout(timeoutId)
      }
    }
  }, [isPoweredOn, screenState])

  React.useEffect(() => {
    if (!currentTrack || !isBgmEnabled || !isPoweredOn) {
      if (!isBgmEnabled || !isPoweredOn) {
        stopBgm()
      }
      return
    }

    playBgm()
  }, [currentTrack, isBgmEnabled, isPoweredOn, playBgm, stopBgm])

  React.useEffect(() => {
    if (!isPoweredOn || defaultBgmTrackIndex === null) {
      return
    }

    const isPhotoViewerMode =
      screenState === "detail" &&
      openedItem?.id === "moments" &&
      momentsViewMode === "viewer" &&
      activeMomentsTab === "photo"

    const targetTrackIndex = isPhotoViewerMode
      ? resolvePhotoTrackIndex(activePhotoIndex)
      : defaultBgmTrackIndex

    if (targetTrackIndex === null) {
      return
    }

    setTrackIndex((current) =>
      current === targetTrackIndex ? current : targetTrackIndex
    )
  }, [
    activeMomentsTab,
    activePhotoIndex,
    defaultBgmTrackIndex,
    isPoweredOn,
    momentsViewMode,
    openedItem?.id,
    resolvePhotoTrackIndex,
    screenState,
  ])

  React.useEffect(() => {
    if (!isPoweredOn || screenState !== "detail" || openedItem?.id !== "wish") {
      setTypedWish("")
      return
    }

    setTypedWish("")
    let pointer = 0
    const timer = window.setInterval(() => {
      pointer += 1
      setTypedWish(BIRTHDAY_WISH_TEXT.slice(0, pointer))

      if (pointer >= BIRTHDAY_WISH_TEXT.length) {
        window.clearInterval(timer)
      }
    }, 22)

    return () => {
      window.clearInterval(timer)
    }
  }, [isPoweredOn, openedItem?.id, screenState])

  React.useEffect(() => {
    if (
      !isPoweredOn ||
      screenState !== "detail" ||
      openedItem?.id !== "gift" ||
      giftGame.mode !== "playing"
    ) {
      return
    }

    const intervalId = window.setInterval(() => {
      const current = giftGameRef.current
      if (current.mode !== "playing") {
        return
      }

      const nextItems: GiftFallingItem[] = []
      let caughtHearts = 0
      let missedHearts = 0
      let hitThorns = 0
      const catchRow = GIFT_GAME_ROWS - 1

      for (const item of current.items) {
        const movedRow = item.row + 1
        if (movedRow >= catchRow) {
          const isCatch = item.lane === current.playerLane

          if (item.kind === "heart") {
            if (isCatch) {
              caughtHearts += 1
            } else {
              missedHearts += 1
            }
          } else if (isCatch) {
            hitThorns += 1
          }

          continue
        }

        nextItems.push({
          ...item,
          row: movedRow,
        })
      }

      if (Math.random() < 0.82) {
        nextItems.push({
          id: giftDropIdRef.current++,
          lane: Math.floor(Math.random() * GIFT_GAME_LANES),
          row: 0,
          kind: Math.random() < 0.76 ? "heart" : "thorn",
        })
      }

      const nextScore = Math.max(0, current.score + caughtHearts - hitThorns)
      const nextMisses = current.misses + missedHearts + hitThorns
      const nextTimeLeft = Math.max(0, current.timeLeft - 1)

      let nextMode: GiftGameMode = "playing"
      if (nextScore >= GIFT_GAME_TARGET_SCORE) {
        nextMode = "won"
      } else if (nextMisses >= GIFT_GAME_MAX_MISSES || nextTimeLeft === 0) {
        nextMode = "lost"
      }

      const nextState: GiftGameState = {
        ...current,
        mode: nextMode,
        score: nextScore,
        misses: nextMisses,
        timeLeft: nextTimeLeft,
        items: nextItems,
      }

      giftGameRef.current = nextState
      setGiftGame(nextState)

      if (nextMode === "won") {
        setStatus("FINAL GIFT UNLOCKED")
        return
      }

      if (nextMode === "lost") {
        setStatus(nextTimeLeft === 0 ? "TIME UP - PRESS A" : "TOO MANY MISSES")
        return
      }

      if (caughtHearts > 0) {
        setStatus("HEART +1")
        return
      }

      if (hitThorns > 0) {
        setStatus("THORN -1")
        return
      }

      if (missedHearts > 0) {
        setStatus("MISSED HEART")
      }
    }, GIFT_GAME_TICK_MS)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [giftGame.mode, isPoweredOn, openedItem?.id, screenState])

  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const control = KEY_TO_CONTROL[event.key]
      if (!control) {
        return
      }

      if (!isPoweredOn && control !== "start") {
        return
      }

      event.preventDefault()
      setPressed(control, true)
      runControl(control, event.repeat)
      playBgm()
    }

    const onKeyUp = (event: KeyboardEvent) => {
      const control = KEY_TO_CONTROL[event.key]
      if (!control) {
        return
      }

      event.preventDefault()
      setPressed(control, false)
    }

    window.addEventListener("keydown", onKeyDown)
    window.addEventListener("keyup", onKeyUp)

    return () => {
      window.removeEventListener("keydown", onKeyDown)
      window.removeEventListener("keyup", onKeyUp)
    }
  }, [isPoweredOn, playBgm, runControl, setPressed])

  const handleControlDown = (control: Control) => () => {
    if (!isPoweredOn && control !== "start") {
      return
    }
    setPressed(control, true)
    runControl(control)
    playBgm()
  }

  const handleControlUp = (control: Control) => () => {
    setPressed(control, false)
  }

  const handleAudioError = () => {
    setTrackIndex((current) => {
      const next = current + 1
      if (next < bgmTracks.length) {
        setStatus("SWITCHING BGM SOURCE")
        return next
      }

      setStatus("BGM FILE NOT FOUND")
      setIsBgmEnabled(false)
      return current
    })
  }

  const isPressed = (control: Control) => pressedControls.has(control)

  return {
    audioRef,
    screenState,
    bootProgress,
    selectedIndex,
    openedItem,
    status,
    isBgmEnabled,
    typedWish,
    photoAlbum,
    videoAlbum,
    momentsTabIndex,
    momentsViewMode,
    activeMomentsTab,
    activePhotoIndex,
    activeVideoIndex,
    giftGameMode: giftGame.mode,
    giftPlayerLane: giftGame.playerLane,
    giftScore: giftGame.score,
    giftMisses: giftGame.misses,
    giftTimeLeft: giftGame.timeLeft,
    giftItems: giftGame.items,
    visibleBootLines,
    isBooting,
    showOffScreen,
    currentTrack,
    isPressed,
    handleControlDown,
    handleControlUp,
    handleAudioError,
  }
}

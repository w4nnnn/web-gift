"use client"

import * as React from "react"
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Gift,
  Heart,
  ImageIcon,
  Music2,
  Power,
  ScrollText,
  type LucideIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"

type Direction = "up" | "down" | "left" | "right"
type ActionControl = "a" | "b" | "start" | "select"
type Control = Direction | ActionControl
type ScreenState = "booting" | "menu" | "detail"

type MenuItem = {
  id: string
  title: string
  subtitle: string
  icon: LucideIcon
  notes: string[]
}

const KEY_TO_CONTROL: Record<string, Control> = {
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

const MENU_ITEMS: MenuItem[] = [
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
    subtitle: "potongan kenangan",
    icon: ImageIcon,
    notes: [
      "aku suka cara kamu tertawa waktu cerita receh sekalipun.",
      "aku suka obrolan panjang kita yang bikin waktu hilang.",
      "aku suka hal-hal kecil yang kamu lakukan dengan tulus.",
    ],
  },
  {
    id: "playlist",
    title: "Song Queue",
    subtitle: "lagu buat hari ini",
    icon: Music2,
    notes: [
      "01. lagu pembuka yang cerah untuk pagi ulang tahunmu.",
      "02. lagu nostalgia biar senyum-senyum sendiri.",
      "03. lagu penutup buat doa baik malam ini.",
    ],
  },
  {
    id: "gift",
    title: "Final Gift",
    subtitle: "hadiah utama",
    icon: Gift,
    notes: [
      "hadiah terbaikku: doa baik, waktu, dan perhatian yang terus ada.",
      "semoga kamu merasa dicintai, bukan cuma hari ini tapi selalu.",
      "press replay kapan pun kamu mau senyum lagi.",
    ],
  },
]

const BOOT_LINES = [
  "mounting birthday cartridge...",
  "loading pixel memories...",
  "syncing heart protocol...",
  "calibrating gift menu...",
  "ready: web boy birthday edition",
]

export function GameboyConsole() {
  const [screenState, setScreenState] = React.useState<ScreenState>("booting")
  const [bootProgress, setBootProgress] = React.useState(0)
  const [selectedIndex, setSelectedIndex] = React.useState(0)
  const [openedIndex, setOpenedIndex] = React.useState<number | null>(null)
  const [pressedControls, setPressedControls] = React.useState<Set<Control>>(
    () => new Set()
  )
  const [status, setStatus] = React.useState("INITIALIZING SYSTEM")

  const openedItem = openedIndex === null ? null : MENU_ITEMS[openedIndex]

  const visibleBootLines = React.useMemo(() => {
    const count = Math.min(
      BOOT_LINES.length,
      Math.ceil((bootProgress / 100) * BOOT_LINES.length)
    )
    return BOOT_LINES.slice(0, count)
  }, [bootProgress])

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

  const runControl = React.useCallback(
    (control: Control, isRepeat = false) => {
      if (control === "start") {
        if (isRepeat) {
          return
        }

        setScreenState("booting")
        setBootProgress(0)
        setOpenedIndex(null)
        setStatus("REBOOTING SYSTEM")
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
          setStatus("TIP: NAVIGATE WITH D-PAD, OPEN WITH A")
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
          setStatus(`OPEN ${item.title.toUpperCase()}`)
          return
        }

        if (control === "b") {
          setStatus("YOU ARE ALREADY ON MAIN MENU")
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

        setOpenedIndex(nextIndex)
        setSelectedIndex(nextIndex)
        setStatus(`OPEN ${item.title.toUpperCase()}`)
        return
      }

      if (control === "a") {
        setStatus("HAPPY BIRTHDAY")
      }
    },
    [cycleMenu, openedIndex, screenState, selectedIndex]
  )

  React.useEffect(() => {
    if (screenState !== "booting") {
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
  }, [screenState])

  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const control = KEY_TO_CONTROL[event.key]
      if (!control) {
        return
      }

      event.preventDefault()
      setPressed(control, true)
      runControl(control, event.repeat)
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
  }, [runControl, setPressed])

  const handleControlDown = (control: Control) => () => {
    setPressed(control, true)
    runControl(control)
  }

  const handleControlUp = (control: Control) => () => {
    setPressed(control, false)
  }

  const isPressed = (control: Control) => pressedControls.has(control)
  const isBooting = screenState === "booting"
  const activeMenu = openedItem ?? MENU_ITEMS[selectedIndex]
  const DetailIcon = openedItem?.icon

  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_16%_10%,color-mix(in_oklab,var(--color-gb-aura)_68%,transparent),transparent_38%),radial-gradient(circle_at_90%_0%,color-mix(in_oklab,var(--color-gb-screen)_42%,white),transparent_32%),linear-gradient(180deg,var(--color-gb-bg-top),var(--color-gb-bg-bottom))] px-4 py-10 md:px-6">
      <div className="pointer-events-none absolute inset-0 gb-noise" />

      <Card className="gb-console-boot relative mx-auto w-full max-w-4xl rounded-[2.2rem] border-4 border-gb-shell-edge bg-gb-shell py-6 shadow-[0_30px_80px_-20px_color-mix(in_oklab,var(--color-gb-shell-edge)_62%,black)]">
        <CardHeader className="pb-1">
          <div className="flex items-center justify-between gap-2">
            <div>
              <CardTitle className="font-heading text-xl tracking-[0.14em] text-gb-label md:text-2xl">
                Web Boy 01
              </CardTitle>
              <CardDescription className="text-[0.7rem] uppercase tracking-[0.26em] text-gb-label/80 md:text-[0.76rem]">
                Birthday Cartridge Firmware
              </CardDescription>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-gb-shell-edge/80 bg-gb-shell-inner px-3 py-1">
              <span
                className={cn(
                  "size-2.5 rounded-full transition-colors",
                  isBooting
                    ? "bg-amber-400 shadow-[0_0_12px_#facc15]"
                    : "bg-lime-400 shadow-[0_0_12px_#bef264]"
                )}
                aria-hidden
              />
              <span className="font-heading text-[0.58rem] uppercase tracking-[0.2em] text-gb-label/90">
                {isBooting ? "Boot" : "Ready"}
              </span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex flex-col gap-6 pb-5">
          <section className="rounded-[1.6rem] border-4 border-gb-bezel bg-gb-bezel-inner p-4 shadow-[inset_0_2px_14px_color-mix(in_oklab,var(--color-gb-shell-edge)_35%,black)] md:p-5">
            <div
              className="relative aspect-[10/7] overflow-hidden rounded-md border-2 border-gb-screen-frame bg-gb-screen p-2 shadow-[inset_0_0_0_2px_color-mix(in_oklab,var(--color-gb-screen)_80%,black)]"
              aria-label="gameboy-screen"
            >
              <div className="pointer-events-none absolute inset-0 gb-scanline opacity-45" />

              {isBooting ? (
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
                    A open | B back | Start reboot
                  </p>
                </div>
              ) : openedItem ? (
                <div className="relative flex h-full flex-col gap-3 rounded-[4px] border border-gb-grid/70 bg-[linear-gradient(180deg,color-mix(in_oklab,var(--color-gb-screen)_88%,white),color-mix(in_oklab,var(--color-gb-pixel-off)_74%,black))] p-3">
                  <header className="flex items-center gap-2 rounded-sm border border-gb-grid/50 bg-gb-pixel-off/80 px-2 py-1">
                    {DetailIcon ? (
                      <DetailIcon className="size-4 text-gb-screen-frame/90" />
                    ) : null}
                    <div className="flex flex-col leading-none">
                      <p className="font-heading text-[0.58rem] uppercase tracking-[0.17em] text-gb-screen-frame/95">
                        {openedItem.title}
                      </p>
                      <p className="text-[0.45rem] uppercase tracking-[0.13em] text-gb-screen-frame/80">
                        {openedItem.subtitle}
                      </p>
                    </div>
                  </header>

                  <div className="flex flex-1 flex-col justify-center gap-2">
                    {openedItem.notes.map((note) => (
                      <p
                        key={note}
                        className="rounded-sm border border-gb-grid/35 bg-gb-pixel-off/70 px-2 py-1 text-[0.53rem] uppercase tracking-[0.12em] text-gb-screen-frame/90"
                      >
                        {note}
                      </p>
                    ))}
                  </div>

                  <p className="text-[0.5rem] uppercase tracking-[0.15em] text-gb-screen-frame/80">
                    B menu | Left/Right next card
                  </p>
                </div>
              ) : null}
            </div>

            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-md bg-gb-shell-inner px-3 py-2 text-[0.62rem] uppercase tracking-[0.18em] text-gb-label/90 md:text-[0.7rem]">
              <span>Mode {screenState}</span>
              <span>{status}</span>
              <span>{activeMenu.title}</span>
            </div>
          </section>

          <section className="grid items-end gap-6 md:grid-cols-[1fr_auto_1fr]">
            <div className="flex flex-col gap-2">
              <p className="font-heading text-xs uppercase tracking-[0.24em] text-gb-label/85">
                D-Pad
              </p>
              <div className="grid w-fit grid-cols-3 grid-rows-3 gap-2">
                <Button
                  variant="secondary"
                  size="icon-lg"
                  aria-label="Move Up"
                  disabled={isBooting}
                  onPointerDown={handleControlDown("up")}
                  onPointerUp={handleControlUp("up")}
                  onPointerLeave={handleControlUp("up")}
                  onPointerCancel={handleControlUp("up")}
                  className={cn(
                    "col-start-2 row-start-1 rounded-xl border-2 border-gb-shell-edge bg-gb-key text-gb-label shadow-[0_4px_0_color-mix(in_oklab,var(--color-gb-shell-edge)_75%,black)]",
                    isPressed("up") && "translate-y-px bg-gb-key-active"
                  )}
                >
                  <ChevronUp />
                </Button>
                <Button
                  variant="secondary"
                  size="icon-lg"
                  aria-label="Move Left"
                  disabled={isBooting}
                  onPointerDown={handleControlDown("left")}
                  onPointerUp={handleControlUp("left")}
                  onPointerLeave={handleControlUp("left")}
                  onPointerCancel={handleControlUp("left")}
                  className={cn(
                    "col-start-1 row-start-2 rounded-xl border-2 border-gb-shell-edge bg-gb-key text-gb-label shadow-[0_4px_0_color-mix(in_oklab,var(--color-gb-shell-edge)_75%,black)]",
                    isPressed("left") && "translate-y-px bg-gb-key-active"
                  )}
                >
                  <ChevronLeft />
                </Button>
                <div className="col-start-2 row-start-2 flex size-11 items-center justify-center rounded-xl border-2 border-gb-shell-edge bg-gb-key inset-shadow-sm">
                  <span className="font-heading text-[0.55rem] tracking-[0.2em] text-gb-label/80">
                    NAV
                  </span>
                </div>
                <Button
                  variant="secondary"
                  size="icon-lg"
                  aria-label="Move Right"
                  disabled={isBooting}
                  onPointerDown={handleControlDown("right")}
                  onPointerUp={handleControlUp("right")}
                  onPointerLeave={handleControlUp("right")}
                  onPointerCancel={handleControlUp("right")}
                  className={cn(
                    "col-start-3 row-start-2 rounded-xl border-2 border-gb-shell-edge bg-gb-key text-gb-label shadow-[0_4px_0_color-mix(in_oklab,var(--color-gb-shell-edge)_75%,black)]",
                    isPressed("right") && "translate-y-px bg-gb-key-active"
                  )}
                >
                  <ChevronRight />
                </Button>
                <Button
                  variant="secondary"
                  size="icon-lg"
                  aria-label="Move Down"
                  disabled={isBooting}
                  onPointerDown={handleControlDown("down")}
                  onPointerUp={handleControlUp("down")}
                  onPointerLeave={handleControlUp("down")}
                  onPointerCancel={handleControlUp("down")}
                  className={cn(
                    "col-start-2 row-start-3 rounded-xl border-2 border-gb-shell-edge bg-gb-key text-gb-label shadow-[0_4px_0_color-mix(in_oklab,var(--color-gb-shell-edge)_75%,black)]",
                    isPressed("down") && "translate-y-px bg-gb-key-active"
                  )}
                >
                  <ChevronDown />
                </Button>
              </div>
            </div>

            <div className="hidden h-full items-end justify-center md:flex">
              <div className="flex flex-col gap-2 rounded-xl border border-gb-shell-edge/75 bg-gb-shell-inner p-3">
                <div className="h-1 w-20 rounded-full bg-gb-shell-edge/65" />
                <div className="h-1 w-20 rounded-full bg-gb-shell-edge/65" />
                <div className="h-1 w-20 rounded-full bg-gb-shell-edge/65" />
                <div className="h-1 w-20 rounded-full bg-gb-shell-edge/65" />
              </div>
            </div>

            <div className="flex flex-col gap-2 justify-self-end">
              <p className="text-right font-heading text-xs uppercase tracking-[0.24em] text-gb-label/85">
                Actions
              </p>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="secondary"
                  size="icon-lg"
                  aria-label="Button A"
                  disabled={isBooting}
                  onPointerDown={handleControlDown("a")}
                  onPointerUp={handleControlUp("a")}
                  onPointerLeave={handleControlUp("a")}
                  onPointerCancel={handleControlUp("a")}
                  className={cn(
                    "size-14 rounded-full border-2 border-gb-shell-edge bg-gb-action text-gb-action-foreground shadow-[0_4px_0_color-mix(in_oklab,var(--color-gb-shell-edge)_72%,black)]",
                    isPressed("a") && "translate-y-px bg-gb-action-active"
                  )}
                >
                  <Heart data-icon="inline-start" />A
                </Button>
                <Button
                  variant="secondary"
                  size="icon-lg"
                  aria-label="Button B"
                  disabled={isBooting}
                  onPointerDown={handleControlDown("b")}
                  onPointerUp={handleControlUp("b")}
                  onPointerLeave={handleControlUp("b")}
                  onPointerCancel={handleControlUp("b")}
                  className={cn(
                    "size-14 rounded-full border-2 border-gb-shell-edge bg-gb-action text-gb-action-foreground shadow-[0_4px_0_color-mix(in_oklab,var(--color-gb-shell-edge)_72%,black)]",
                    isPressed("b") && "translate-y-px bg-gb-action-active"
                  )}
                >
                  <ChevronLeft data-icon="inline-start" />B
                </Button>
              </div>
            </div>
          </section>
        </CardContent>

        <CardFooter className="justify-between gap-2 border-t border-gb-shell-edge/70 bg-transparent px-4 pt-5 pb-0">
          <p className="font-heading text-[0.62rem] uppercase tracking-[0.2em] text-gb-label/80 md:text-[0.7rem]">
            Arrow / Z / X / Enter / Shift
          </p>

          <ButtonGroup>
            <Button
              variant="outline"
              size="sm"
              aria-label="Select Help"
              onPointerDown={handleControlDown("select")}
              onPointerUp={handleControlUp("select")}
              onPointerLeave={handleControlUp("select")}
              onPointerCancel={handleControlUp("select")}
              className={cn(
                "rounded-full border-2 border-gb-shell-edge bg-gb-shell-inner px-4 font-heading text-[0.62rem] uppercase tracking-[0.16em] text-gb-label shadow-[0_3px_0_color-mix(in_oklab,var(--color-gb-shell-edge)_70%,black)]",
                isPressed("select") && "translate-y-px bg-gb-key-active"
              )}
            >
              Select
            </Button>
            <Button
              variant="outline"
              size="sm"
              aria-label="Start Reboot"
              onPointerDown={handleControlDown("start")}
              onPointerUp={handleControlUp("start")}
              onPointerLeave={handleControlUp("start")}
              onPointerCancel={handleControlUp("start")}
              className={cn(
                "rounded-full border-2 border-gb-shell-edge bg-gb-shell-inner px-4 font-heading text-[0.62rem] uppercase tracking-[0.16em] text-gb-label shadow-[0_3px_0_color-mix(in_oklab,var(--color-gb-shell-edge)_70%,black)]",
                isPressed("start") && "translate-y-px bg-gb-key-active"
              )}
            >
              <Power data-icon="inline-start" />
              Start
            </Button>
          </ButtonGroup>
        </CardFooter>
      </Card>
    </main>
  )
}

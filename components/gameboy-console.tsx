"use client"

import * as React from "react"
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Eraser,
  Paintbrush,
  Power,
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

const GRID_COLUMNS = 18
const GRID_ROWS = 12
const GRID_SIZE = GRID_COLUMNS * GRID_ROWS

type Direction = "up" | "down" | "left" | "right"
type ActionControl = "a" | "b" | "start" | "select"
type Control = Direction | ActionControl

type Cursor = {
  x: number
  y: number
}

const DEFAULT_CURSOR: Cursor = {
  x: Math.floor(GRID_COLUMNS / 2),
  y: Math.floor(GRID_ROWS / 2),
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

const MOVE_VECTOR: Record<Direction, { dx: number; dy: number }> = {
  up: { dx: 0, dy: -1 },
  down: { dx: 0, dy: 1 },
  left: { dx: -1, dy: 0 },
  right: { dx: 1, dy: 0 },
}

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value))

const toPixelKey = ({ x, y }: Cursor) => `${x}:${y}`

export function GameboyConsole() {
  const [cursor, setCursor] = React.useState<Cursor>(DEFAULT_CURSOR)
  const [activePixels, setActivePixels] = React.useState<Set<string>>(
    () => new Set()
  )
  const [pressedControls, setPressedControls] = React.useState<Set<Control>>(
    () => new Set()
  )
  const [status, setStatus] = React.useState("BOOT COMPLETE")
  const [powerOn, setPowerOn] = React.useState(true)

  const cells = React.useMemo(
    () => Array.from({ length: GRID_SIZE }, (_, index) => index),
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

  const moveCursor = React.useCallback((direction: Direction) => {
    const vector = MOVE_VECTOR[direction]
    setCursor((current) => ({
      x: clamp(current.x + vector.dx, 0, GRID_COLUMNS - 1),
      y: clamp(current.y + vector.dy, 0, GRID_ROWS - 1),
    }))
  }, [])

  const paintPixel = React.useCallback(() => {
    setActivePixels((current) => {
      const next = new Set(current)
      next.add(toPixelKey(cursor))
      return next
    })
  }, [cursor])

  const erasePixel = React.useCallback(() => {
    setActivePixels((current) => {
      const next = new Set(current)
      next.delete(toPixelKey(cursor))
      return next
    })
  }, [cursor])

  const runControl = React.useCallback(
    (control: Control, isRepeat = false) => {
      if (control === "start") {
        if (isRepeat) {
          return
        }
        setPowerOn((current) => {
          const next = !current
          setStatus(next ? "POWER ON" : "POWER OFF")
          if (!next) {
            setPressedControls(new Set())
          }
          return next
        })
        return
      }

      if (!powerOn) {
        return
      }

      if (control === "select") {
        if (isRepeat) {
          return
        }
        setActivePixels(new Set())
        setStatus("SCREEN CLEAR")
        return
      }

      if (control === "a") {
        paintPixel()
        setStatus("PIXEL DRAWN")
        return
      }

      if (control === "b") {
        erasePixel()
        setStatus("PIXEL ERASED")
        return
      }

      moveCursor(control)
      setStatus(`MOVE ${control.toUpperCase()}`)
    },
    [erasePixel, moveCursor, paintPixel, powerOn]
  )

  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const control = KEY_TO_CONTROL[event.key]
      if (!control) {
        return
      }

      if (!powerOn && control !== "start") {
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
  }, [powerOn, runControl, setPressed])

  const handleControlDown = (control: Control) => () => {
    if (!powerOn && control !== "start") {
      return
    }
    setPressed(control, true)
    runControl(control)
  }

  const handleControlUp = (control: Control) => () => {
    setPressed(control, false)
  }

  const isPressed = (control: Control) => pressedControls.has(control)

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
                Dot Matrix Interactive Screen
              </CardDescription>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-gb-shell-edge/80 bg-gb-shell-inner px-3 py-1">
              <span
                className={cn(
                  "size-2.5 rounded-full transition-colors",
                  powerOn ? "bg-lime-400 shadow-[0_0_12px_#bef264]" : "bg-zinc-500"
                )}
                aria-hidden
              />
              <span className="font-heading text-[0.58rem] uppercase tracking-[0.2em] text-gb-label/90">
                {powerOn ? "Power" : "Standby"}
              </span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex flex-col gap-6 pb-5">
          <section className="rounded-[1.6rem] border-4 border-gb-bezel bg-gb-bezel-inner p-4 shadow-[inset_0_2px_14px_color-mix(in_oklab,var(--color-gb-shell-edge)_35%,black)] md:p-5">
            <div
              className={cn(
                "relative aspect-[10/7] overflow-hidden rounded-md border-2 border-gb-screen-frame p-2 shadow-[inset_0_0_0_2px_color-mix(in_oklab,var(--color-gb-screen)_80%,black)]",
                powerOn ? "bg-gb-screen" : "bg-gb-screen-dim"
              )}
              aria-label="gameboy-screen"
            >
              {powerOn ? <div className="pointer-events-none absolute inset-0 gb-scanline opacity-50" /> : null}

              <div
                className="relative grid h-full w-full overflow-hidden rounded-[3px] border border-gb-grid/70"
                style={{
                  gridTemplateColumns: `repeat(${GRID_COLUMNS}, minmax(0, 1fr))`,
                }}
              >
                {cells.map((cell) => {
                  const x = cell % GRID_COLUMNS
                  const y = Math.floor(cell / GRID_COLUMNS)
                  const key = `${x}:${y}`
                  const lit = activePixels.has(key)
                  const cursorActive = powerOn && cursor.x === x && cursor.y === y

                  return (
                    <div
                      key={key}
                      className={cn(
                        "border border-gb-grid/25 transition-colors duration-100",
                        powerOn
                          ? lit
                            ? "bg-gb-pixel-on"
                            : "bg-gb-pixel-off"
                          : "bg-gb-screen-dim",
                        cursorActive
                          ? "bg-gb-cursor shadow-[0_0_0_1px_color-mix(in_oklab,var(--color-gb-cursor)_75%,black)]"
                          : null
                      )}
                    />
                  )
                })}
              </div>
            </div>

            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-md bg-gb-shell-inner px-3 py-2 text-[0.64rem] uppercase tracking-[0.18em] text-gb-label/90 md:text-[0.7rem]">
              <span>Pixels {activePixels.size.toString().padStart(3, "0")}</span>
              <span>{status}</span>
              <span>
                Cursor {cursor.x.toString().padStart(2, "0")}:
                {cursor.y.toString().padStart(2, "0")}
              </span>
            </div>
          </section>

          <section className="grid items-end gap-6 md:grid-cols-[1fr_auto_1fr]">
            <div className="space-y-2">
              <p className="font-heading text-xs uppercase tracking-[0.24em] text-gb-label/85">
                D-Pad
              </p>
              <div className="grid w-fit grid-cols-3 grid-rows-3 gap-2">
                <Button
                  variant="secondary"
                  size="icon-lg"
                  aria-label="Move Up"
                  disabled={!powerOn}
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
                  disabled={!powerOn}
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
                <Button
                  variant="secondary"
                  size="icon-lg"
                  aria-label="Move Right"
                  disabled={!powerOn}
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
                  disabled={!powerOn}
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
              <div className="space-y-2 rounded-xl border border-gb-shell-edge/75 bg-gb-shell-inner p-3">
                <div className="h-1 w-20 rounded-full bg-gb-shell-edge/65" />
                <div className="h-1 w-20 rounded-full bg-gb-shell-edge/65" />
                <div className="h-1 w-20 rounded-full bg-gb-shell-edge/65" />
                <div className="h-1 w-20 rounded-full bg-gb-shell-edge/65" />
              </div>
            </div>

            <div className="space-y-2 justify-self-end">
              <p className="text-right font-heading text-xs uppercase tracking-[0.24em] text-gb-label/85">
                Actions
              </p>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="secondary"
                  size="icon-lg"
                  aria-label="Button A"
                  disabled={!powerOn}
                  onPointerDown={handleControlDown("a")}
                  onPointerUp={handleControlUp("a")}
                  onPointerLeave={handleControlUp("a")}
                  onPointerCancel={handleControlUp("a")}
                  className={cn(
                    "size-14 rounded-full border-2 border-gb-shell-edge bg-gb-action text-gb-action-foreground shadow-[0_4px_0_color-mix(in_oklab,var(--color-gb-shell-edge)_72%,black)]",
                    isPressed("a") && "translate-y-px bg-gb-action-active"
                  )}
                >
                  <Paintbrush data-icon="inline-start" />A
                </Button>
                <Button
                  variant="secondary"
                  size="icon-lg"
                  aria-label="Button B"
                  disabled={!powerOn}
                  onPointerDown={handleControlDown("b")}
                  onPointerUp={handleControlUp("b")}
                  onPointerLeave={handleControlUp("b")}
                  onPointerCancel={handleControlUp("b")}
                  className={cn(
                    "size-14 rounded-full border-2 border-gb-shell-edge bg-gb-action text-gb-action-foreground shadow-[0_4px_0_color-mix(in_oklab,var(--color-gb-shell-edge)_72%,black)]",
                    isPressed("b") && "translate-y-px bg-gb-action-active"
                  )}
                >
                  <Eraser data-icon="inline-start" />B
                </Button>
              </div>
            </div>
          </section>
        </CardContent>

        <CardFooter className="justify-between gap-2 border-t border-gb-shell-edge/70 bg-transparent px-4 pt-5 pb-0">
          <p className="font-heading text-[0.62rem] uppercase tracking-[0.2em] text-gb-label/80 md:text-[0.7rem]">
            Arrow Keys / Z / X / Enter / Shift
          </p>

          <ButtonGroup>
            <Button
              variant="outline"
              size="sm"
              aria-label="Clear Screen"
              disabled={!powerOn}
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
              aria-label="Power Toggle"
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
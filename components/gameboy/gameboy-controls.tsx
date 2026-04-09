"use client"

import * as React from "react"
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Power,
  Volume2,
  VolumeX,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import { CardFooter } from "@/components/ui/card"
import type { Control } from "@/components/gameboy/types"
import { cn } from "@/lib/utils"

type ControlHandlers = {
  isPressed: (control: Control) => boolean
  handleControlDown: (control: Control) => () => void
  handleControlUp: (control: Control) => () => void
}

type GameboyPadControlsProps = ControlHandlers & {
  showOffScreen: boolean
  isBooting: boolean
}

type GameboySystemFooterProps = ControlHandlers & {
  showOffScreen: boolean
  currentTrack: string | null
  isBgmEnabled: boolean
  className?: string
}

export function GameboyPadControls({
  showOffScreen,
  isBooting,
  isPressed,
  handleControlDown,
  handleControlUp,
}: GameboyPadControlsProps) {
  return (
    <section className="mx-auto grid w-full max-w-[18rem] grid-cols-2 items-end gap-2 md:max-w-[20rem] md:gap-3">
      <div className="flex flex-col gap-2">
        <p className="font-heading text-[0.68rem] uppercase tracking-[0.2em] text-gb-label/85">
          D-Pad
        </p>
        <div className="grid w-fit grid-cols-3 grid-rows-3 gap-1.5">
          <Button
            variant="secondary"
            size="icon-sm"
            aria-label="Move Up"
            disabled={showOffScreen || isBooting}
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
            size="icon-sm"
            aria-label="Move Left"
            disabled={showOffScreen || isBooting}
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
            size="icon-sm"
            aria-label="Move Right"
            disabled={showOffScreen || isBooting}
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
            size="icon-sm"
            aria-label="Move Down"
            disabled={showOffScreen || isBooting}
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

      <div className="flex flex-col gap-2 justify-self-end">
        <p className="text-right font-heading text-[0.68rem] uppercase tracking-[0.2em] text-gb-label/85">
          Actions
        </p>
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="secondary"
            size="icon-sm"
            aria-label="Button A"
            disabled={showOffScreen || isBooting}
            onPointerDown={handleControlDown("a")}
            onPointerUp={handleControlUp("a")}
            onPointerLeave={handleControlUp("a")}
            onPointerCancel={handleControlUp("a")}
            className={cn(
              "size-11 rounded-full border-2 border-gb-shell-edge bg-gb-action text-gb-action-foreground shadow-[0_4px_0_color-mix(in_oklab,var(--color-gb-shell-edge)_72%,black)] md:size-12",
              isPressed("a") && "translate-y-px bg-gb-action-active"
            )}
          >
            A
          </Button>
          <Button
            variant="secondary"
            size="icon-sm"
            aria-label="Button B"
            disabled={showOffScreen || isBooting}
            onPointerDown={handleControlDown("b")}
            onPointerUp={handleControlUp("b")}
            onPointerLeave={handleControlUp("b")}
            onPointerCancel={handleControlUp("b")}
            className={cn(
              "size-11 rounded-full border-2 border-gb-shell-edge bg-gb-action text-gb-action-foreground shadow-[0_4px_0_color-mix(in_oklab,var(--color-gb-shell-edge)_72%,black)] md:size-12",
              isPressed("b") && "translate-y-px bg-gb-action-active"
            )}
          >
            B
          </Button>
        </div>
      </div>
    </section>
  )
}

export function GameboySystemFooter({
  showOffScreen,
  currentTrack,
  isBgmEnabled,
  isPressed,
  handleControlDown,
  handleControlUp,
  className,
}: GameboySystemFooterProps) {
  return (
    <CardFooter className={cn("justify-center gap-2 border-t border-gb-shell-edge/70 bg-transparent px-5 pt-5 pb-2 md:justify-between md:px-4 md:pt-4 md:pb-0", className)}>
      <p className="hidden font-heading text-[0.62rem] uppercase tracking-[0.2em] text-gb-label/80 md:block md:text-[0.7rem]">
        Arrow / Z / X / Enter / Shift
      </p>

      <ButtonGroup className="mx-auto md:mx-0">
        <Button
          variant="outline"
          size="xs"
          aria-label="Toggle Music"
          disabled={showOffScreen || !currentTrack}
          onPointerDown={handleControlDown("select")}
          onPointerUp={handleControlUp("select")}
          onPointerLeave={handleControlUp("select")}
          onPointerCancel={handleControlUp("select")}
          className={cn(
            "rounded-full border-2 border-gb-shell-edge bg-gb-shell-inner px-3 font-heading text-[0.58rem] uppercase tracking-[0.14em] text-gb-label shadow-[0_3px_0_color-mix(in_oklab,var(--color-gb-shell-edge)_70%,black)]",
            isPressed("select") && "translate-y-px bg-gb-key-active"
          )}
        >
          {isBgmEnabled ? (
            <Volume2 data-icon="inline-start" />
          ) : (
            <VolumeX data-icon="inline-start" />
          )}
          Music
        </Button>
        <Button
          variant="outline"
          size="xs"
          aria-label="Power Toggle"
          onPointerDown={handleControlDown("start")}
          onPointerUp={handleControlUp("start")}
          onPointerLeave={handleControlUp("start")}
          onPointerCancel={handleControlUp("start")}
          className={cn(
            "rounded-full border-2 border-gb-shell-edge bg-gb-shell-inner px-3 font-heading text-[0.58rem] uppercase tracking-[0.14em] text-gb-label shadow-[0_3px_0_color-mix(in_oklab,var(--color-gb-shell-edge)_70%,black)]",
            isPressed("start") && "translate-y-px bg-gb-key-active"
          )}
        >
          <Power data-icon="inline-start" />
          Power
        </Button>
      </ButtonGroup>
    </CardFooter>
  )
}

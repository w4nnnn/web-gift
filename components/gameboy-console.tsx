"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GameboyPadControls, GameboySystemFooter } from "@/components/gameboy/gameboy-controls"
import { GameboyScreen } from "@/components/gameboy/gameboy-screen"
import { useGameboyState } from "@/components/gameboy/use-gameboy-state"
import { cn } from "@/lib/utils"

export function GameboyConsole() {
  const {
    audioRef,
    currentTrack,
    handleAudioError,
    showOffScreen,
    isBooting,
    screenState,
    bootProgress,
    visibleBootLines,
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
    isPressed,
    handleControlDown,
    handleControlUp,
  } = useGameboyState()

  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_16%_10%,color-mix(in_oklab,var(--color-gb-aura)_68%,transparent),transparent_38%),radial-gradient(circle_at_90%_0%,color-mix(in_oklab,var(--color-gb-screen)_42%,white),transparent_32%),linear-gradient(180deg,var(--color-gb-bg-top),var(--color-gb-bg-bottom))] px-4 py-10 md:px-6">
      <audio
        ref={audioRef}
        src={currentTrack ?? undefined}
        loop
        preload="auto"
        onError={handleAudioError}
      />

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
                  showOffScreen
                    ? "bg-zinc-500"
                    : isBooting
                      ? "bg-amber-400 shadow-[0_0_12px_#facc15]"
                      : "bg-lime-400 shadow-[0_0_12px_#bef264]"
                )}
                aria-hidden
              />
              <span className="font-heading text-[0.58rem] uppercase tracking-[0.2em] text-gb-label/90">
                {showOffScreen ? "Off" : isBooting ? "Boot" : "Ready"}
              </span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex flex-col gap-6 pb-5">
          <GameboyScreen
            showOffScreen={showOffScreen}
            isBooting={isBooting}
            bootProgress={bootProgress}
            visibleBootLines={visibleBootLines}
            screenState={screenState}
            selectedIndex={selectedIndex}
            openedItem={openedItem}
            typedWish={typedWish}
            photoAlbum={photoAlbum}
            videoAlbum={videoAlbum}
            momentsTabIndex={momentsTabIndex}
            momentsViewMode={momentsViewMode}
            activeMomentsTab={activeMomentsTab}
            activePhotoIndex={activePhotoIndex}
            activeVideoIndex={activeVideoIndex}
            giftGameMode={giftGameMode}
            giftPlayerLane={giftPlayerLane}
            giftScore={giftScore}
            giftMisses={giftMisses}
            giftTimeLeft={giftTimeLeft}
            giftItems={giftItems}
            status={status}
            isBgmEnabled={isBgmEnabled}
            currentTrack={currentTrack}
          />

          <GameboyPadControls
            showOffScreen={showOffScreen}
            isBooting={isBooting}
            isPressed={isPressed}
            handleControlDown={handleControlDown}
            handleControlUp={handleControlUp}
          />
        </CardContent>

        <GameboySystemFooter
          showOffScreen={showOffScreen}
          currentTrack={currentTrack}
          isBgmEnabled={isBgmEnabled}
          isPressed={isPressed}
          handleControlDown={handleControlDown}
          handleControlUp={handleControlUp}
        />
      </Card>
    </main>
  )
}

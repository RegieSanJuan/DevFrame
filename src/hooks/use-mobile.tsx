import * as React from "react"

const MOBILE_BREAKPOINT = 1024
const MOBILE_MEDIA_QUERY = `(max-width: ${MOBILE_BREAKPOINT - 1}px)`

function subscribe(callback: () => void) {
  if (typeof window === "undefined") {
    return () => {}
  }

  const mediaQueryList = window.matchMedia(MOBILE_MEDIA_QUERY)
  mediaQueryList.addEventListener("change", callback)

  return () => mediaQueryList.removeEventListener("change", callback)
}

function getSnapshot() {
  if (typeof window === "undefined") {
    return false
  }

  return window.matchMedia(MOBILE_MEDIA_QUERY).matches
}

export function useIsMobile() {
  return React.useSyncExternalStore(subscribe, getSnapshot, () => false)
}

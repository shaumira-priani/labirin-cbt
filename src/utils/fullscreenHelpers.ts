// src/utils/fullscreenHelpers.ts
export function enterFullscreen(): void {
  try {
    const docEl = document.documentElement as HTMLElement & {
      webkitRequestFullscreen?: () => void;
      msRequestFullscreen?: () => void;
    };
    if (docEl.requestFullscreen) {
      docEl.requestFullscreen().catch(() => {});
    } else if (docEl.webkitRequestFullscreen) {
      docEl.webkitRequestFullscreen();
    } else if (docEl.msRequestFullscreen) {
      docEl.msRequestFullscreen();
    }
  } catch {
    // ignore — some browsers/contexts (e.g. iframes) block this silently
  }
}

export function exitFullscreen(): void {
  try {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
  } catch {
    // ignore
  }
}

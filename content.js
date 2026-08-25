// YouTube Enhanced - Content Script
// Skip ads by clicking the skip button when available.
// This avoids modifying video playback to reduce detection risk.

let isEnabled = true;

// Update state if toggled in the popup
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'local' && changes.enabled !== undefined) {
    isEnabled = changes.enabled.newValue;
  }
});

// Get initial state on load
chrome.storage.local.get(['enabled'], (result) => {
  if (result.enabled !== undefined) {
    isEnabled = result.enabled;
  }
});

function skipAds() {
  // If the extension is toggled off, do nothing
  if (!isEnabled) return;
  
  // We only want to act if we are on a watch page
  if (window.location.pathname !== '/watch') return;

  // Find the video element
  const video = document.querySelector('video');
  if (!video) return;

  // Click the skip button if it appears
  const skipButton = document.querySelector('.ytp-ad-skip-button, .ytp-ad-skip-button-modern, .ytp-skip-ad-button, .ytp-ad-skip-button-container, button.ytp-ad-skip-button-modern, .ytp-ad-skip-button-slot, .videoAdUiSkipButton, .ytp-ad-overlay-close-button');
  if (skipButton) {
    skipButton.click();
  }
}

// Check for skip button every 500 milliseconds
setInterval(skipAds, 500);

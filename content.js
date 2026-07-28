let isEnabled = true;
let lastAdId = ''; // Improved tracker to handle back-to-back ads

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
  if (video) {
    // Check for standard YouTube ad classes
    const isAd = document.querySelector('.ad-showing, .ad-interrupting, .ytp-ad-player-overlay, .ytp-ad-image-overlay');
    
    if (isAd) {
      // Calculate and save time
      if (!isNaN(video.duration) && video.duration > 0) {
        // Create a unique ID using the source AND duration so back-to-back ads are counted
        const currentAdId = video.src + '_' + video.duration;
        
        // Only add time if it's a new ad we haven't skipped yet
        if (currentAdId !== lastAdId) {
          lastAdId = currentAdId;
          const timeSaved = video.duration - video.currentTime;
          
          // Sanity check so we don't accidentally add crazy numbers
          if (timeSaved > 0 && timeSaved < 3600) {
            try {
              if (chrome.runtime?.id) { // Check if extension is still valid
                chrome.storage.local.get(['timeSaved'], (result) => {
                  const currentTotal = result.timeSaved || 0;
                  chrome.storage.local.set({ timeSaved: currentTotal + timeSaved });
                });
              }
            } catch (e) {
              console.log("Ad Skipper: Please refresh the page to reconnect the extension!");
            }
          }
        }
        
        // Fast forward to the end of the ad if possible
        video.playbackRate = 16.0; // Speed up the video drastically
        video.muted = true;        // Mute it
        video.currentTime = video.duration;
      }
    } else {
      // If we are watching a regular video, reset the ad tracker
      lastAdId = '';
    }
  }

  // Click the 'Skip Ad' button if it appears
  const skipButton = document.querySelector('.ytp-ad-skip-button, .ytp-ad-skip-button-modern, .ytp-skip-ad-button');
  if (skipButton) {
    skipButton.click();
  }
}

// Check for ads every 500 milliseconds
setInterval(skipAds, 500);

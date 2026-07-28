// Initialize default settings when the extension is installed
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get(['enabled', 'timeSaved'], (result) => {
    // If 'enabled' is not set, default to true
    if (result.enabled === undefined) {
      chrome.storage.local.set({ enabled: true });
    }
    // If 'timeSaved' is not set, default to 0
    if (result.timeSaved === undefined) {
      chrome.storage.local.set({ timeSaved: 0 });
    }
  });
});

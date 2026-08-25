// Initialize default settings when the extension is installed
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get(['enabled'], (result) => {
    // If 'enabled' is not set, default to true
    if (result.enabled === undefined) {
      chrome.storage.local.set({ enabled: true });
    }
  });
});

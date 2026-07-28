document.addEventListener('DOMContentLoaded', () => {
  const toggleBtn = document.getElementById('toggleBtn');
  const statusLabel = document.getElementById('statusLabel');
  const timeSavedEl = document.getElementById('timeSaved');

  // Load initial state
  chrome.storage.local.get(['enabled', 'timeSaved'], (result) => {
    toggleBtn.checked = result.enabled !== false; // Default to true if undefined
    updateStatusLabel(toggleBtn.checked);
    updateTimeSaved(result.timeSaved || 0);
  });

  // Handle toggle change
  toggleBtn.addEventListener('change', (e) => {
    const isEnabled = e.target.checked;
    chrome.storage.local.set({ enabled: isEnabled });
    updateStatusLabel(isEnabled);
  });

  function updateStatusLabel(isEnabled) {
    statusLabel.textContent = isEnabled ? 'Active' : 'Paused';
    statusLabel.style.color = isEnabled ? '#38bdf8' : '#94a3b8';
  }

  function updateTimeSaved(seconds) {
    if (seconds < 60) {
      timeSavedEl.textContent = Math.floor(seconds) + 's';
    } else if (seconds < 3600) {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = Math.floor(seconds % 60);
      timeSavedEl.textContent = `${minutes}m ${remainingSeconds}s`;
    } else {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      timeSavedEl.textContent = `${hours}h ${minutes}m`;
    }
  }

  // Listen for updates to storage in case an ad is skipped while popup is open
  chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'local' && changes.timeSaved) {
      updateTimeSaved(changes.timeSaved.newValue);
    }
  });

  // Open GitHub link
  const githubLink = document.getElementById('githubLink');
  if (githubLink) {
    githubLink.addEventListener('click', (e) => {
      e.preventDefault();
      chrome.tabs.create({ url: 'https://github.com/adwaith5354-hub' }); 
    });
  }
});

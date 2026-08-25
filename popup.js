document.addEventListener('DOMContentLoaded', () => {
  const toggleBtn = document.getElementById('toggleBtn');
  const statusLabel = document.getElementById('statusLabel');

  // Load initial state
  chrome.storage.local.get(['enabled'], (result) => {
    toggleBtn.checked = result.enabled !== false; // Default to true if undefined
    updateStatusLabel(toggleBtn.checked);
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

  // Listen for updates to storage in case the toggle is changed elsewhere
  chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'local' && changes.enabled) {
      updateStatusLabel(changes.enabled.newValue);
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

// popup.js

// Get references to DOM elements
const toggleButton = document.querySelector('.toggle input');
const serverSelect = document.getElementById('server-select');
const imdbButton = document.getElementById('imdb-button');
const gitButton = document.getElementById('git-button');
const bugButton = document.getElementById('bug-button');

// Load saved preferences when the popup is opened
document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.sync.get(['isToggleActive', 'selectedServerNumber'], (data) => {
        // Set the toggle button state
        toggleButton.checked = data.isToggleActive !== undefined ? data.isToggleActive : true; // Default to true

        // Set the selected server based on the saved server number
        if (data.selectedServerNumber) {
            const optionToSelect = Array.from(serverSelect.options).find((option) => option.getAttribute('server-number') === data.selectedServerNumber);
            if (optionToSelect) {
                serverSelect.value = optionToSelect.value;
            }
        }
    });
});

// Save toggle button state when changed
toggleButton.addEventListener('change', () => {
    const isToggleActive = toggleButton.checked;
    chrome.storage.sync.set({ isToggleActive });
});

// Save selected server number when changed
serverSelect.addEventListener('change', () => {
    const selectedOption = serverSelect.options[serverSelect.selectedIndex];
    const selectedServerNumber = selectedOption.getAttribute('server-number');
    chrome.storage.sync.set({ selectedServerNumber });
});

// Open TMDB Website
document.addEventListener('DOMContentLoaded', () => {
    imdbButton.addEventListener('click', () => {
        chrome.tabs.create({ url: 'https://www.imdb.com/' });
    });
});

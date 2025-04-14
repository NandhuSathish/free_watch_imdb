// Store the API token in chrome storage (called once, e.g., during installation)
function setApiToken() {
    const apiToken =
        'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzZmU4Njk2YjNjN2YyYTQ0OTlkNGU4YjAxYjIzZjU5OSIsIm5iZiI6MTc0NDMxNzkxMy44MjUsInN1YiI6IjY3ZjgyZGQ5MzE3NzUyNzZkNmQ5YmFkOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.GhKyngSEyOqNcHx05UeTy5KrGGibkm4aC1u1TV0Db4U';
    chrome.storage.local.set({ TMDB_TOKEN: apiToken }, function () {
        console.log('API Token saved !');
    });
}

setApiToken();

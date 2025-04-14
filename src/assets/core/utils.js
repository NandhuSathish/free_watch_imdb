// Utility function to extract TMDB ID from the URL
function getTmdbIdFromUrl(type) {
    const regex = new RegExp(`/${type}/(\\d+)(?:-|$)`);
    const match = window.location.pathname.match(regex);
    return match ? match[1] : null;
}

function getImdbIdFromUrl() {
    const regex = /\/title\/(tt\d+)\//;
    const match = window.location.pathname.match(regex);
    return match ? match[1] : null;
}

async function fetchTMDBData(params) {
    const result = {};

    try {
        let url;
        const headers = {
            'Authorization': `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwYTk1NzRmZDcxMjRkNmI5ZTUyNjA4ZWEzNWQ2NzdiNCIsIm5iZiI6MTczNzU5MDQ2NC4zMjUsInN1YiI6IjY3OTE4NmMwZThiNjdmZjgzM2ZhNjM4OCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.kWqK74FSN41PZO7_ENZelydTtX0u2g6dCkAW0vFs4jU`,
            'accept': 'application/json',
        };

        // url = `https://api.themoviedb.org/3/movie/${params.id}?language=en-US`;
        url = `https://api.themoviedb.org/3/find/${params.id}?external_source=imdb_id`;

        const response = await fetch(url, { method: 'GET', headers: headers });
        console.log('response', response);

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        // Detect media type
        if (data.movie_results && data.movie_results.length > 0) {
            result.media_type = 'movie';
            result.title = data.movie_results[0].title;
            result.data = data.movie_results[0];
        } else if (data.tv_results && data.tv_results.length > 0) {
            result.media_type = 'tv';
            result.title = data.tv_results[0].name;
            result.data = data.tv_results[0];
        } else if (data.person_results && data.person_results.length > 0) {
            result.media_type = 'person';
            result.title = data.person_results[0].name;
            result.data = data.person_results[0];
        } else {
            result.media_type = 'unknown';
            result.title = 'Not found';
        }

        return result;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error; // Re-throw the error if you want the caller to handle it
    }
}

// Function to fetch TV show data by ID
async function fetchTvShowData(tvId) {
    return new Promise((resolve, reject) => {
        // Get the API token from chrome storage
        chrome.storage.local.get(['TMDB_TOKEN'], async function (result) {
            const apiToken = result.TMDB_TOKEN;

            if (!apiToken) {
                console.error('API Token not found!');
                reject('API Token not found!');
                return;
            }

            const url = `https://api.themoviedb.org/3/tv/${tvId}?language=en-US`;
            const headers = {
                'Authorization': `Bearer ${apiToken}`,
                'accept': 'application/json',
            };

            try {
                const response = await fetch(url, { method: 'GET', headers: headers });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();

                // Extract the number of seasons and episode count per season
                const seasons = data.seasons;
                const seasonEpisodes = {};

                // Loop through the seasons and get the number of episodes per season
                for (const season of seasons) {
                    seasonEpisodes[season.season_number] = season.episode_count;
                }
                resolve(seasonEpisodes);
            } catch (error) {
                console.error('Error fetching TV show data:', error);
                reject(error);
            }
        });
    });
}

// Verify if IMDB is in mobile mode or screen width is smaller than 768
function isMobile() {
    const isMobileUserAgent = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Windows Phone|Mobile|Tablet|Kindle|Silk|PlayBook|KaiOS|Tizen|SMART-TV|Xbox/i.test(
        navigator.userAgent
    );
    const isSmallScreen = window.innerWidth <= 768;
    return isMobileUserAgent || isSmallScreen;
}

// Function to Retireve saved preference from popup
function savedPreferences() {
    return new Promise((resolve) => {
        chrome.storage.sync.get(['isToggleActive', 'selectedServerNumber'], (data) => {
            const isToggleActive = data.isToggleActive !== undefined ? data.isToggleActive : true;
            const selectedServerNumber = data.selectedServerNumber || '1';
            resolve({ isToggleActive, selectedServerNumber });
        });
    });
}

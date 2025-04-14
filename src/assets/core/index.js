(function () {
    async function addMovieButton() {
        const movieId = getImdbIdFromUrl();

        async function getMovieDetails(movieId) {
            const data = await fetchTMDBData({ id: movieId });
            return data;
        }

        const tmdbData = await getMovieDetails(movieId);

        let referenceButton = document.querySelector(`[data-testid="watched-button-${movieId}"]`);

        if (referenceButton) {
            // Create a new custom play button
            let customButton = document.createElement('button');
            customButton.textContent = 'Free Watch 🍿';

            customButton.style.cssText = `
                margin-top: 8px;
                width: 358.625px;
                height: 48px;
                background:rgb(0, 112, 255);
                color:rgb(250, 246, 246);
                border: none;
                cursor: pointer;
                border-radius: 24px ;
                font-family: Roboto, Helvetica, Arial, sans-serif;
                font-size: 14px;
                line-height: 20px;
                font-weight: 500;
                letter-spacing: 0.28px;
            `;

            // Add event listener to open the new link
            customButton.onclick = async function () {
                const preferences = await savedPreferences();
                let url = '';

                if (tmdbData.media_type === 'tv') {
                    url = `https://nandhusathish.github.io/free_watch_player/?type=tv&id=${movieId}&tmdbId=${tmdbData.data.id}&s=1&e=1&server=${preferences.selectedServerNumber}`;
                } else {
                    url = `https://nandhusathish.github.io/free_watch_player/?type=movie&id=${movieId}&tmdbId=${tmdbData.data.id}&server=${preferences.selectedServerNumber}`;
                }

                if (preferences.isToggleActive) {
                    window.open(url, '_blank');
                } else {
                    window.location.href = url;
                }
            };

            // Insert custom play Button
            if (isMobile()) {
                let buttonDiv = document.createElement('div');
                buttonDiv.className = 'custom-play-container';
                buttonDiv.style.width = '100%';
                buttonDiv.style.marginTop = '8px';
                buttonDiv.style.marginBottom = '8px';
                buttonDiv.style.textAlign = 'center';
                customButton.style.marginLeft = '0px';
                buttonDiv.appendChild(customButton);

                referenceButton?.parentElement?.insertBefore(customButton, referenceButton.nextSibling);
            } else {
                referenceButton.parentElement.insertBefore(customButton, referenceButton);
                // referenceButton.parentElement.appendChild(customButton);
            }
        }
    }

    // Run function after the page has loaded
    window.addEventListener('load', () => {
        addMovieButton().catch(console.error);
    });
})();

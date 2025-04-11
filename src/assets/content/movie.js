(function () {
    async function addMovieButton() {
        const movieid = getImdbIdFromUrl();

        async function getMovieDetails(movieId) {
            const data = await fetchTMDBData({ id: movieId });
            console.log('media type:', data.media_type);
            console.log('full data:', data);
            return data;
        }

        const tmdbData = await getMovieDetails(movieid); // ✅ Await and store the data here

        let referenceButton = document.querySelector(`[data-testid="watched-button-${movieid}"]`);

        if (!referenceButton) {
            referenceButton = document.querySelector('.watchlist');
        }

        if (referenceButton) {
            // Create a new custom play button
            let customButton = document.createElement('button');
            customButton.textContent = 'Free Watch 🍿';

            customButton.style.cssText = `
                margin-left: 25px;
                margin-top: 8px;
                width: 358.625px;
                height: 48px;
                background: #F5C518;
                color: #000000;
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
                    url = `https://tmdbplayer.nunesnetwork.com/?type=tv&id=${movieid}&tmdbId=${tmdbData.data.id}&s=1&e=1&server=${preferences.selectedServerNumber}`;
                } else {
                    url = `https://tmdbplayer.nunesnetwork.com/?type=movie&id=${movieid}&tmdbId=${tmdbData.data.id}&server=${preferences.selectedServerNumber}`;
                }

                if (preferences.isToggleActive) {
                    window.open(url, '_blank');
                } else {
                    window.location.href = url;
                }
            };

            // Insert custom play Button
            if (isMobile()) {
                let referenceElement = document.querySelector('div.trailer.ml-2');
                if (!referenceElement) {
                    referenceElement = document.querySelector('span.certification');
                }

                let buttonDiv = document.createElement('div');
                buttonDiv.className = 'custom-play-container';
                buttonDiv.style.width = '100%';
                buttonDiv.style.marginTop = '8px';
                buttonDiv.style.marginBottom = '8px';
                buttonDiv.style.textAlign = 'center';

                customButton.style.marginLeft = '0px';
                buttonDiv.appendChild(customButton);

                referenceElement?.parentElement?.insertBefore(buttonDiv, referenceElement.nextSibling);
            } else {
                referenceButton.parentElement.appendChild(customButton);
            }
        }
    }

    // Run function after the page has loaded
    window.addEventListener('load', () => {
        addMovieButton().catch(console.error);
    });
})();

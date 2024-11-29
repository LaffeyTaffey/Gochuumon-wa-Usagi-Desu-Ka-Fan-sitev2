document.addEventListener('DOMContentLoaded', () => {
    const tabButtons = document.querySelectorAll('.tab-button');
    const musicEmbedContainer = document.querySelector('.music-embed-container');
    const currentTrackElement = document.getElementById('current-track');
    const listeningTimeElement = document.getElementById('listening-time');
    const moodButtons = document.querySelectorAll('.mood-btn');

    const tracks = [
        "Gochiusa - Daydream café",
        "Koi - Gen Hoshino",
        "Gurenge - LiSA",
        "Yuru Camp - Shiny Days"
    ];

    const moodPlaylists = {
        'Creative': '5nQVTrkecpLuGIV5QOyWvH',
        'Coding': '37i9dQZF1DX5trt9i14X7j',
        'Relaxing': '37i9dQZF1DX4WYpdgoIcn6',
        'Gaming': '37i9dQZF1DWTyiBJ6yEqeu'
    };

    const recommendations = [
        { name: "K-ON! - Don't Say 'Lazy'", url: "https://open.spotify.com/track/77LQNv3wdUvN5sXG9v5H9u?si=43fbec43a0094c59" },
        { name: "シカ色デイズ", url: "https://open.spotify.com/track/65DUeMw4riBUibAjktAnZD?si=775a1d8c315242da" },
        { name: "cittan* WORKS from ”LAMUNATION!” & ”KIRAKIRA MONSTARS”", url: "https://open.spotify.com/album/6ZKuRTk5osD2YrEonSlDgz?si=_k_7eIOaSlihBamRqcEfSg" },
        { name: "guitar girl is gay: guitar girl and joy from the Guitar Girl game are gay and you can fight me on that", url: "https://open.spotify.com/playlist/4A6ZD9GoWRdB6avUex5dxr?si=1mBDGKXNT4WHjpeY_LSO_g" }
    ];

    let currentTrackIndex = 0;
    let listeningTime = 1234;

    function updateMusicContent(tab) {
        switch(tab) {
            case 'playlists':
                musicEmbedContainer.innerHTML = `
                    <div class="spotify-wrapper">
                        <iframe src="https://open.spotify.com/embed/playlist/5nQVTrkecpLuGIV5QOyWvH?utm_source=generator&theme=0" 
                            width="100%" height="450" frameBorder="0"
                            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy">
                        </iframe>
                    </div>`;
                break;
            case 'favorites':
                musicEmbedContainer.innerHTML = `
                    <div class="soundcloud-wrapper">
                        <iframe width="100%" height="166" scrolling="no" frameborder="no" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"  
                            src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/217167115&color=ff69b4">
                        </iframe>
                        <div class="track-info">
                            <a href="https://soundcloud.com/gochiusound" target="_blank" class="artist-link">
                                TVアニメ『ご注文はうさぎですか？？』
                            </a>
                            <span class="track-divider">·</span>
                            <a href="https://soundcloud.com/gochiusound/djblend-preview" target="_blank" class="track-link">
                                【試聴】8月12日発売「ごちうさDJブレンド／ご注文はうさぎですか?キャラクターソングメドレー」
                            </a>
                        </div>
                    </div>`;
                break;
            case 'recommendations':
            musicEmbedContainer.innerHTML = `
                <h3 class="recommendations-title">Recommended Tracks</h3>
                <div class="recommendations-grid">
                    <div class="spotify-wrapper">
                        <iframe style="border-radius:12px" 
                            src="https://open.spotify.com/embed/track/77LQNv3wdUvN5sXG9v5H9u?utm_source=generator" 
                            width="100%" height="352" frameBorder="0"
                            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy">
                        </iframe>
                    </div>
                    <div class="spotify-wrapper">
                        <iframe style="border-radius:12px" 
                            src="https://open.spotify.com/embed/track/65DUeMw4riBUibAjktAnZD?utm_source=generator" 
                            width="100%" height="352" frameBorder="0"
                            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy">
                        </iframe>
                    </div>
                    <div class="spotify-wrapper">
                        <iframe style="border-radius:12px" 
                            src="https://open.spotify.com/embed/album/6ZKuRTk5osD2YrEonSlDgz?utm_source=generator" 
                            width="100%" height="352" frameBorder="0"
                            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy">
                        </iframe>
                    </div>
                    <div class="spotify-wrapper">
                        <iframe style="border-radius:12px" 
                            src="https://open.spotify.com/embed/playlist/4A6ZD9GoWRdB6avUex5dxr?utm_source=generator" 
                            width="100%" height="352" frameBorder="0"
                            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy">
                        </iframe>
                    </div>
                </div>`;
            break;
    }
}

    function updateCurrentTrack() {
        currentTrackElement.textContent = tracks[currentTrackIndex];
        currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
    }

    function updateMusicStats() {
        listeningTime += Math.floor(Math.random() * 10);
        listeningTimeElement.textContent = `${listeningTime} hours this year`;
    }

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            updateMusicContent(button.getAttribute('data-tab'));
            musicEmbedContainer.scrollIntoView({ behavior: 'smooth' });
        });
    });

    moodButtons.forEach(button => {
        button.addEventListener('click', () => {
            const mood = button.getAttribute('data-mood');
            const playlistId = moodPlaylists[mood];
            musicEmbedContainer.innerHTML = `
                <div class="spotify-wrapper">
                    <iframe src="https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator&theme=0" 
                        width="100%" height="450" frameBorder="0"
                        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy">
                    </iframe>
                </div>`;
            musicEmbedContainer.scrollIntoView({ behavior: 'smooth' });
        });
    });

    setInterval(updateCurrentTrack, 5000);
    setInterval(updateMusicStats, 10000);

    // Initial content load
    updateMusicContent('playlists');
});
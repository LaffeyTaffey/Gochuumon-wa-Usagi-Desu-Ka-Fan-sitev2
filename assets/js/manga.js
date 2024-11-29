$(document).ready(() => {
    const mangaReader = new MangaReader();
});

class MangaReader {
    constructor() {
        this.currentVolume = 1;
        this.currentChapter = 1;
        this.currentPage = 1;
        this.totalPages = 0;
        this.volumeChapters = {
            1: Array.from({length: 14}, (_, i) => i),
            2: Array.from({length: 12}, (_, i) => i),
            3: Array.from({length: 9}, (_, i) => i + 1),
            4: Array.from({length: 17}, (_, i) => i),
            5: Array.from({length: 13}, (_, i) => i + 1),
            6: Array.from({length: 13}, (_, i) => i + 1),
            7: Array.from({length: 13}, (_, i) => i + 1),
            8: Array.from({length: 13}, (_, i) => i + 1),
            9: Array.from({length: 13}, (_, i) => i + 1),
            10: Array.from({length: 14}, (_, i) => i + 1),
            11: Array.from({length: 13}, (_, i) => i + 1)
        };
        // Add page counts for each chapter
        this.chapterPages = {
            1: {0: 8, 1: 8, 2: 8, 3: 8, 4: 8, 5: 10, 6: 8, 7: 8, 8: 8, 9: 10, 10: 8, 11: 8, 12: 8, 13: 12},
            2: {0: 8, 1: 9, 2: 10, 3: 8, 4: 8, 5: 8, 6: 8, 7: 8, 8: 8, 9: 10, 10: 8, 11: 8},
            3: {1: 8, 2: 9, 3: 10, 4: 10, 5: 12, 6: 10, 7: 9, 8: 9, 9: 9},
            4: {0: 8, 1: 8, 2: 8, 3: 8, 4: 8, 5: 8, 6: 8, 7: 9, 8: 9, 9: 8, 10: 8, 11: 8, 12: 8, 13: 8, 14: 10, 15: 8, 16: 10},
            5: {1: 9, 2: 8, 3: 8, 4: 10, 5: 10, 6: 10, 7: 10, 8: 8, 9: 10, 10: 8, 11: 8, 12: 10, 13: 10},
            6: {1: 9, 2: 8, 3: 10, 4: 8, 5: 9, 6: 11, 7: 11, 8: 9, 9: 9, 10: 9, 11: 11, 12: 11, 13: 10},
            7: {1: 9, 2: 9, 3: 9, 4: 9, 5: 9, 6: 10, 7: 9, 8: 9, 9: 9, 10: 9, 11: 8, 12: 10, 13: 9},
            8: {1: 12, 2: 10, 3: 13, 4: 10, 5: 11, 6: 14, 7: 10, 8: 10, 9: 11, 10: 12, 11: 12, 12: 10, 13: 13},
            9: {1: 12, 2: 8, 3: 10, 4: 8, 5: 10, 6: 8, 7: 8, 8: 10, 9: 10, 10: 8, 11: 8, 12: 8, 13: 14},
            10: {1: 9, 2: 10, 3: 9, 4: 9, 5: 8, 6: 9, 7: 8, 8: 8, 9: 8, 10: 8, 11: 10, 12: 9, 13: 15, 131: 15},
            11: {1: 8, 2: 8, 3: 8, 4: 10, 5: 9, 6: 9, 7: 9, 8: 9, 9: 11, 10: 9, 11: 9, 12: 9, 13: 11}
        };
        this.initializeReader();
        this.initializeEntryLinks();
        this.initializePageCounter();
        this.bindEvents();
        this.initializeSwipeSupport();
    }

    initializePageCounter() {
    Object.keys(this.volumeChapters).forEach(volume => {
        let totalPages = 0;
        let totalImages = 0;
        const chapters = this.volumeChapters[volume];
        
        chapters.forEach(chapter => {
            if (this.chapterPages[volume] && this.chapterPages[volume][chapter]) {
                totalPages += this.chapterPages[volume][chapter];
                totalImages += this.chapterPages[volume][chapter]; // Assuming each page is an image
            }
        });

        const entryMetaElement = $(`[data-volume="${volume}"] .entry-meta`);
        const firstChapter = Math.min(...chapters);
        const lastChapter = Math.max(...chapters);
        
        entryMetaElement.text(
            `Chapters: ${firstChapter}-${lastChapter} • Total Pages: ${totalPages} • Images: ${totalImages}`
        );
    });
}

    updateEntryMeta(volume) {
    let totalPages = 0;
    let totalImages = 0;
    const chapters = this.volumeChapters[volume];
    chapters.forEach(chapter => {
        if (this.chapterPages[volume] && this.chapterPages[volume][chapter]) {
            totalPages += this.chapterPages[volume][chapter];
            totalImages += this.chapterPages[volume][chapter]; // Assuming each page is an image
        }
    });
    const entryMetaElement = $(`[data-volume="${volume}"] .entry-meta`);
    entryMetaElement.text(
        `Chapters: ${chapters.length} • Total Pages: ${totalPages} • Images: ${totalImages}`
    );
}


initializeReader() {
    const readerSection = `
        <section id="read-manga" class="section container-fluid py-5" data-aos="fade-up">
            <div class="row justify-content-center" data-aos="fade-up">
                <div class="col-12 col-lg-10" data-aos="fade-up">
                <h2 data-aos="fade-up">Manga Reader</h2>
                    <div class="card manga-reader-card" data-aos="fade-up">
                        <div class="card-header bg-pink">
                            <div class="d-flex justify-content-between align-items-center">
                                <h2 class="manga-title mb-0">Volume ${this.currentVolume} - Chapter ${this.currentChapter}</h2>
                                <div class="d-flex gap-3">
                                    <div class="dropdown">
                                        <button class="btn btn-light dropdown-toggle" type="button" id="volumeDropdown" data-bs-toggle="dropdown">
                                            Volume ${this.currentVolume}
                                        </button>
                                        <ul class="dropdown-menu" aria-labelledby="volumeDropdown">
                                            ${Object.keys(this.volumeChapters).map(vol => 
                                                `<li><a class="dropdown-item volume-select" data-volume="${vol}">Volume ${vol}</a></li>`
                                            ).join('')}
                                        </ul>
                                    </div>
                                    <div class="dropdown">
                                        <button class="btn btn-light dropdown-toggle" type="button" id="chapterDropdown" data-bs-toggle="dropdown">
                                            Chapter ${this.currentChapter}
                                        </button>
                                        <ul class="dropdown-menu chapter-list" aria-labelledby="chapterDropdown">
                                            ${this.volumeChapters[this.currentVolume].map(chapter => 
                                                `<li><a class="dropdown-item chapter-select" data-chapter="${chapter}" style="cursor: pointer;">
                                                    ${chapter === 0 ? 'Prologue' : `Chapter ${chapter}`}
                                                </a></li>`
                                            ).join('')}
                                        </ul>
                                    </div>
                                    <button class="btn btn-light enter-fullscreen">
                                        <i class="fas fa-expand"></i>
                                    </button>
                                    <button class="btn btn-light download-page">
                                        <i class="fas fa-download"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div class="card-body p-0 bg-dark">
                            <div class="manga-content position-relative">
                                <img class="manga-page img-fluid" src="" alt="Manga page">
                                <div class="navigation-overlay">
                                    <div class="prev-area" title="Previous Page"></div>
                                    <div class="next-area" title="Next Page"></div>
                                </div>
                            </div>
                        </div>
                        <div class="card-footer custom-bg">
                            <div class="d-flex justify-content-between align-items-center">
                                <button class="btn btn-pink prev-page">
                                    <i class="fas fa-chevron-left"></i> Previous
                                </button>
                                <span class="page-counter">Page ${this.currentPage}</span>
                                <button class="btn btn-pink next-page">
                                    Next <i class="fas fa-chevron-right"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Fullscreen Reader -->
        <div id="fullscreenReader" class="fullscreen-reader">
            <div class="reader-header">
                <h2 class="reader-title">Manga Reader</h2>
                <div class="reader-controls">
                    <span class="page-info">Volume ${this.currentVolume} Chapter ${this.currentChapter} - Page ${this.currentPage}</span>
                    <button class="reader-btn download-page-fs">
                        <i class="fas fa-download"></i> Download
                    </button>
                    <button class="reader-btn exit-fullscreen">
                        <i class="fas fa-compress"></i> Exit
                    </button>
                </div>
            </div>
            <div class="reader-content">
                <img class="manga-page-fs" src="" alt="Manga page">
            </div>
        </div>
    `;

    // Insert the reader section after the entries section
    $('#entries').after(readerSection);
    this.bindEvents();
}

    initializeEntryLinks() {
        // Add click handlers to manga entry cards
        $('.entry-card').each((index, card) => {
            const $card = $(card);
            if ($card.closest('#manga').length) {
                $card.css('cursor', 'pointer');
                $card.on('click', (e) => {
                    e.preventDefault();
                    const volumeMatch = $card.find('h3').text().match(/Vol\. (\d+)/);
                    if (volumeMatch) {
                        const volume = parseInt(volumeMatch[1]);
                        // Get the first chapter of the selected volume
                        const firstChapter = this.volumeChapters[volume][0];
                        
                        // Load the chapter
                        this.loadChapter(volume, firstChapter);
                        
                        // Smooth scroll to the reader section
                        $('html, body').animate({
                            scrollTop: $('#read-manga').offset().top - 100
                        }, 800);
                    }
                });

                // Add hover effect to show it's clickable
                $card.hover(
                    function() { $(this).addClass('entry-card-hover'); },
                    function() { $(this).removeClass('entry-card-hover'); }
                );
            }
        });
    }

    async loadChapter(volume, chapter) {
    this.currentVolume = volume;
    this.currentChapter = chapter;
    this.currentPage = 1;

    // Get total pages from chapterPages
    this.totalPages = this.chapterPages[volume][chapter] || 0;

    // Update dropdowns and UI
    $('#volumeDropdown').text(`Volume ${volume}`);
    $('#chapterDropdown').text(`Chapter ${chapter}`);
    this.updateChapterList();
    this.updatePage();
    this.updateFullscreenInfo();
    
    // Update the entry meta for this volume
    this.updateEntryMeta(volume);
}

    updateChapterList() {
    // Get all chapters for the current volume, including decimal chapters
    const chapters = Object.keys(this.chapterPages[this.currentVolume]).sort((a, b) => {
        return parseFloat(a) - parseFloat(b);
    });

    // Create the chapter list HTML
    const chapterList = chapters.map(chapter => 
        `<li><a class="dropdown-item chapter-select" data-chapter="${chapter}" style="cursor: pointer;">
            ${chapter === '0' ? 'Prologue' : `Chapter ${chapter}`}
        </a></li>`
    ).join('');

    $('.chapter-list').html(chapterList);
}

    updatePage() {
    console.log(`Updating page to: ${this.currentPage}`);
    console.log(`Current chapter before path construction: ${this.currentChapter}`);

    // Convert decimal chapter numbers (e.g., "13.1") to a format without the decimal point (e.g., "131")
    let chapterForPath;
    if (this.currentChapter.toString().includes('.')) {
        // For decimal chapters, replace the decimal point with an empty string
        chapterForPath = this.currentChapter.toString().replace('.', '');
        console.log(`Chapter for path (decimal): ${chapterForPath}`); // Debug log
    } else {
        // For regular chapters, pad with zeros
        chapterForPath = this.currentChapter.toString().padStart(3, '0');
        console.log(`Chapter for path (regular): ${chapterForPath}`); // Debug log
    }

    // Construct the page path
    const pagePath = `assets/img/Manga/Volume-${this.currentVolume}/v${this.currentVolume}c${chapterForPath}/${this.currentPage.toString().padStart(3, '0')}.jpg`;

    console.log(`Loading image from path: ${pagePath}`); // Debug log
    
    $('.manga-page, .manga-page-fs').attr('src', pagePath);
    $('.page-counter').text(`Page ${this.currentPage}/${this.totalPages}`);
    $('.manga-title').text(`Volume ${this.currentVolume} - Chapter ${this.currentChapter}`);
    this.updateFullscreenInfo();
    console.log(`Page updated to: ${this.currentPage}`);
}

    // Add this new method for preloading
    preloadAdjacentPages() {
        // Preload next page
        if (this.currentPage < this.totalPages) {
            const nextPage = new Image();
            nextPage.src = `assets/img/Manga/Volume-${this.currentVolume}/v${this.currentVolume}c${this.currentChapter.toString().padStart(3, '0')}/${(this.currentPage + 1).toString().padStart(3, '0')}.jpg`;
        }

        // Preload previous page
        if (this.currentPage > 1) {
            const prevPage = new Image();
            prevPage.src = `assets/img/Manga/Volume-${this.currentVolume}/v${this.currentVolume}c${this.currentChapter.toString().padStart(3, '0')}/${(this.currentPage - 1).toString().padStart(3, '0')}.jpg`;
        }
    }

    // Add swipe support for mobile devices
    initializeSwipeSupport() {
        let touchStartX = 0;
        let touchEndX = 0;

        $('.manga-content, .reader-content').on('touchstart', (e) => {
            touchStartX = e.originalEvent.touches[0].clientX;
        });

        $('.manga-content, .reader-content').on('touchend', (e) => {
            touchEndX = e.originalEvent.changedTouches[0].clientX;
            const swipeDistance = touchEndX - touchStartX;

            if (Math.abs(swipeDistance) > 50) { // Minimum swipe distance
                if (swipeDistance > 0) {
                    this.prevPage();
                } else {
                    this.nextPage();
                }
            }
        });
    }

    bindEvents() {
    $(document).on('click', '.volume-select', (e) => {
        e.preventDefault();
        const volume = parseInt($(e.currentTarget).data('volume'));
        this.loadChapter(volume, this.volumeChapters[volume][0]);
    });

    // Chapter selection
    $(document).on('click', '.chapter-select', (e) => {
        e.preventDefault();
        const chapter = $(e.currentTarget).data('chapter');
        const parsedChapter = chapter.toString().includes('.') ? chapter : parseFloat(chapter);
        this.loadChapter(this.currentVolume, parsedChapter);
    });

    // Fullscreen controls
    $('.enter-fullscreen').click(() => this.enterFullscreen());
    $('.exit-fullscreen').click(() => this.exitFullscreen());
    $('.download-page, .download-page-fs').click(() => this.downloadCurrentPage());

    // Navigation in fullscreen
    $('#fullscreenReader').on('click', '.reader-content', (e) => {
        const clickX = e.clientX;
        const width = window.innerWidth;
        if (clickX < width / 2) {
            this.prevPage();
        } else {
            this.nextPage();
        }
    });

    // Unbind existing events to prevent multiple bindings
    $(document).off('click', '.prev-page, .next-page, .prev-area, .next-area');

    $(document).on('click', '.prev-page', (e) => {
        e.preventDefault();
        this.prevPage();
    });

    $(document).on('click', '.next-page', (e) => {
        e.preventDefault();
        this.nextPage();
    });

    // Add click handlers for navigation areas
    $(document).on('click', '.prev-area', (e) => {
        e.preventDefault();
        this.prevPage();
    });

    $(document).on('click', '.next-area', (e) => {
        e.preventDefault();
        this.nextPage();
    });

    // Keydown events for arrow keys
    $(document).off('keydown').on('keydown', (e) => {
        if ($('#fullscreenReader').is(':visible') || $('#read-manga').is(':visible')) {
            switch(e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    this.prevPage();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    this.nextPage();
                    break;
                case 'Escape':
                    if ($('#fullscreenReader').is(':visible')) {
                        this.exitFullscreen();
                    }
                    break;
            }
        }
    });

        // Fullscreen controls
    $('.enter-fullscreen').click(() => this.enterFullscreen());
    $('.exit-fullscreen').click(() => this.exitFullscreen());
    $('.download-page, .download-page-fs').click(() => this.downloadCurrentPage());

    // Navigation in fullscreen
    $('#fullscreenReader').on('click', '.reader-content', (e) => {
        const clickX = e.clientX;
        const width = window.innerWidth;
        if (clickX < width / 2) {
            this.prevPage();
        } else {
            this.nextPage();
        }
    });
    }



enterFullscreen() {
    const currentPage = $('.manga-page').attr('src');
    $('.manga-page-fs').attr('src', currentPage);
    $('#fullscreenReader').fadeIn(300);
    $('body').addClass('no-scroll');
    this.updateFullscreenInfo();

    // Hide the sign-board and related elements
    $('.sign-board, .chain-system, .mounting-bracket').hide();
}

exitFullscreen() {
    $('#fullscreenReader').fadeOut(300);
    $('body').removeClass('no-scroll');

    // Show the sign-board and related elements again
    $('.sign-board, .chain-system, .mounting-bracket').show();
}

updateFullscreenInfo() {
    $('.page-info').text(`Volume ${this.currentVolume} Chapter ${this.currentChapter} - Page ${this.currentPage}/${this.totalPages}`);
}

debounce(func, delay) {
    let timeout;
    return function(...args) {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), delay);
    };
}

prevPage = this.debounce(function() {
    if (this.currentPage > 1) {
        console.log(`Going to previous page: ${this.currentPage - 1}`); // Debug log
        this.currentPage--;
        this.updatePage();
    } else {
        console.log("Already on the first page."); // Debug log
    }
}, 300);

nextPage = this.debounce(function() {
    if (this.currentPage < this.totalPages) {
        console.log(`Going to next page: ${this.currentPage + 1}`); // Debug log
        this.currentPage++;
        this.updatePage();
    } else {
        console.log("Already on the last page."); // Debug log
    }
}, 300);

updatePage() {
    console.log(`Updating page to: ${this.currentPage}`); // Debug log
    const pagePath = `assets/img/Manga/Volume-${this.currentVolume}/v${this.currentVolume}c${this.currentChapter.toString().padStart(3, '0')}/${this.currentPage.toString().padStart(3, '0')}.jpg`;
    $('.manga-page, .manga-page-fs').attr('src', pagePath);
    $('.page-counter').text(`Page ${this.currentPage}/${this.totalPages}`);
    $('.manga-title').text(`Volume ${this.currentVolume} - Chapter ${this.currentChapter}`);
    this.updateFullscreenInfo();
}

downloadCurrentPage() {
    const pagePath = `assets/img/Manga/Volume-${this.currentVolume}/v${this.currentVolume}c${this.currentChapter.toString().padStart(3, '0')}/${this.currentPage.toString().padStart(3, '0')}.jpg`;
    const link = document.createElement('a');
    link.href = pagePath;
    link.download = `GochiUsa_Vol${this.currentVolume}_Ch${this.currentChapter}_Page${this.currentPage}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    }

populateChapterDropdown() {
    const chapterSelect = $('#chapterSelect');
    chapterSelect.empty();
    
    const chapters = Object.keys(this.chapterPages[this.currentVolume]).sort((a, b) => {
        return parseFloat(a) - parseFloat(b);
    });

    chapters.forEach(chapter => {
        const option = $('<option></option>')
            .attr('value', chapter)
            .text(`Chapter ${chapter}`);
        chapterSelect.append(option);
    });

    chapterSelect.val(this.currentChapter);
    }
}


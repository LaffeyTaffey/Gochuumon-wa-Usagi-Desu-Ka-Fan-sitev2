AOS.init({
    duration: 1000,
    once: true,
    offset: 100,
    disable: false,
    startEvent: 'DOMContentLoaded',
    initClassName: 'aos-init',
    animatedClassName: 'aos-animate',
    useClassNames: false,
    disableMutationObserver: false,
    throttleDelay: 99,
    debounceDelay: 50
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Character card hover effect
const characterCards = document.querySelectorAll('.character-card');
characterCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'scale(1.05) translateY(-10px)';
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'scale(1) translateY(0)';
    });
});

// Gallery lightbox
const galleryItems = document.querySelectorAll('.gallery-item');
galleryItems.forEach(item => {
    item.addEventListener('click', () => {
        // Implement lightbox functionality
    });
});

$(document).on('click', '.share', function() {
    const postLink = $(this).data('link');

    if (navigator.share) {
        navigator.share({
            title: 'Check out this post!',
            url: postLink,
        }).then(() => {
            console.log('Post shared successfully!');
        }).catch((error) => {
            console.error('Error sharing the post:', error);
        });
    } else {
        // Fallback for browsers that do not support the share API
        const tempInput = document.createElement('input');
        tempInput.value = postLink;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
        alert('Link copied to clipboard!');
    }
});

$(document).ready(function() {
    const rssUrl = '/reddit-proxy';
    let postsArray = [];
    let displayedPostsCount = 6; // Number of posts to initially display

    function extractPostDetails($entry) {
        const description = $entry.find('content').text();
        const tempDiv = $('<div>').html(description);
        const matches = description.match(/\[link\]\((.*?)\).*?(\d+) comments/);
        
        return {
            title: $entry.find('title').text(),
            link: $entry.find('link').attr('href'),
            imgSrc: tempDiv.find('img').attr('src'),
            postLink: matches ? matches[1] : null,
            commentCount: matches ? parseInt(matches[2]) : 0,
            author: $entry.find('author name').text(),
            published: $entry.find('published').text(),
            upvotes: Math.floor(Math.random() * 1000), // Random dummy data
            createdTime: new Date($entry.find('published').text()).getTime(), // Timestamp for sorting
        };
    }

    function displayPosts(posts) {
        let postsHtml = '';
        const postsToShow = posts.slice(0, displayedPostsCount); // Show only the first 'displayedPostsCount' posts
        postsToShow.forEach(post => {
            postsHtml += createPostCard(post);
        });
        $('#posts-container').html(postsHtml);

        // Show or hide the "Show More" and "Show Less" buttons
        if (posts.length > displayedPostsCount) {
            $('#show-more').show();
        } else {
            $('#show-more').hide();
        }

        if (displayedPostsCount > 6) {
            $('#show-less').show();
        } else {
            $('#show-less').hide();
        }
    }

    function sortPosts(criteria) {
        let sortedPosts = [...postsArray];

        switch (criteria) {
            case 'hot':
                sortedPosts.sort((a, b) => b.upvotes - a.upvotes);
                break;
            case 'new':
                sortedPosts.sort((a, b) => b.createdTime - a.createdTime);
                break;
            case 'top':
                sortedPosts.sort((a, b) => b.upvotes - a.upvotes);
                break;
            case 'rising':
                sortedPosts.sort((a, b) => {
                    return (b.upvotes / (Date.now() - b.createdTime)) - (a.upvotes / (Date.now() - a.createdTime));
                });
                break;
            default:
                break;
        }

        displayPosts(sortedPosts);
    }

    $.ajax({
        url: rssUrl,
        dataType: 'xml',
        success: function(data) {
            $('#loading').hide();
            const uniquePosts = new Map();

            $(data).find('entry').each(function() {
                const $entry = $(this);
                const post = extractPostDetails($entry);

                if (post.imgSrc && !uniquePosts.has(post.imgSrc)) {
                    uniquePosts.set(post.imgSrc, post);
                }
            });

            postsArray = Array.from(uniquePosts.values());
            displayPosts(postsArray);
        },
        error: function() {
            $('#loading').hide();
            alert('Failed to load posts. Please try again later.');
        }
    });

    $('#sort-select').on('change', function() {
        const selectedSort = $(this).val();
        sortPosts(selectedSort);
    });

    $('#show-more').on('click', function() {
        displayedPostsCount += 6; // Increase the count by 6
        displayPosts(postsArray); // Redisplay posts with the updated count
    });

    $('#show-less').on('click', function() {
        displayedPostsCount = Math.max(displayedPostsCount - 6, 6); // Decrease the count by 6 but not below 6
        displayPosts(postsArray); // Redisplay posts with the updated count
    });

    $(document).on('click', '.upvote', function() {
        const upvoteCountElement = $(this).find('.rss-upvote-count');
        let currentVotes = parseInt(upvoteCountElement.text());
        currentVotes += 1;
        upvoteCountElement.text(currentVotes);
        $(this).data('votes', currentVotes);
    });

    $(document).on('click', '.downvote', function() {
        const downvoteCountElement = $(this).find('.rss-downvote-count');
        let currentVotes = parseInt(downvoteCountElement.text());
        currentVotes += 1;
        downvoteCountElement.text(currentVotes);
        $(this).data('votes', currentVotes);
    });

    $(document).on('click', '.comment-toggle', function() {
        $(this).closest('.rss-post-interactions').find('.comment-section').toggle();
    });

    $(document).on('click', '.submit-comment', function() {
        const commentInput = $(this).siblings('.comment-input');
        const commentText = commentInput.val();
        if (commentText) {
            const commentsList = $(this).siblings('.comments-list');
            const newComment = $(`<div class="comment">${commentText}</div>`).hide();
            commentsList.append(newComment);
            newComment.fadeIn(300);
            commentInput.val('');
        }
    });

    function formatNumber(num) {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'm';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
        return num;
    }

    function createPostCard(post) {
    if (!post.imgSrc) return '';

    const publishDate = new Date(post.published);
    const relativeTime = formatRelativeTime(publishDate);
    const imgElement = new Image();
imgElement.src = post.imgSrc;
imgElement.onload = function() {
    // Once the image is loaded, remove the shimmer effect and show the image
    const shimmer = document.querySelector('.rss-post-image .shimmer');
    shimmer.style.display = 'none'; // Hide the shimmer
    const postImage = document.querySelector('.rss-post-image img');
    postImage.classList.add('loaded'); // Add loaded class to fade in the image
};

    return `
        <div class="rss-post-container" data-aos="zoom-in" data-aos-delay="50">
            <a href="${post.link}" class="rss-post-link" target="_blank">
                <div class="rss-post-header">
                    <h5 class="rss-post-title">${post.title}</h5>
                    <div class="rss-post-meta">
                        <span class="rss-post-author">
                            <i class="fas fa-user"></i> ${post.author}
                        </span>
                        <span class="rss-post-date">
                            <i class="fas fa-clock"></i> ${relativeTime}
                        </span>
                    </div>
                </div>
                <div class="rss-post-image">
                    <div class="shimmer"></div>
                    <img src="${post.imgSrc}" alt="Post image" loading="lazy" class="post-image" onload="this.classList.add('loaded'); this.previousElementSibling.style.display='none';">
                </div>
            </a>
            <div class="rss-post-interactions">
                <div class="rss-interaction-container">
                    <div class="rss-interaction-item upvote" data-votes="0">
                        <i class="fas fa-arrow-up"></i> 
                        <span class="rss-upvote-count">0</span>
                    </div>
                    <div class="rss-interaction-item downvote" data-votes="0">
                        <i class="fas fa-arrow-down"></i>
                        <span class="rss-downvote-count">0</span>
                    </div>
                    <div class="rss-interaction-item share" data-link="${post.link}">
                        <i class="fas fa-share-alt"></i> Share
                    </div>
                    <div class="rss-interaction-item comment-toggle">
                        <i class="fas fa-comment"></i> Comment
                    </div>
                </div>
                <div class="comment-section" style="display: none;">
                    <textarea class="comment-input" placeholder="Add a comment..."></textarea>
                    <button class="submit-comment">Submit</button>
                    <div class="comments-list"></div>
                </div>
            </div>
        </div>
    `;
}

    function formatRelativeTime(date) {
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);
        
        const intervals = [
            { label: 'year', seconds: 31536000 },
            { label: 'month', seconds: 2592000 },
            { label: 'week', seconds: 604800 },
            { label: 'day', seconds: 86400 },
            { label: 'hour', seconds: 3600 },
            { label: 'minute', seconds: 60 },
            { label: 'second', seconds: 1 }
        ];

        for (let interval of intervals) {
            const count = Math.floor(diffInSeconds / interval.seconds);
            if (count >= 1) {
                return count === 1 
                    ? `1 ${interval.label} ago` 
                    : `${count} ${interval.label}s ago`;
            }
        }

        return 'just now';
    }

    $.ajax({
        url: rssUrl,
        dataType: 'xml',
        success: function(data) {
            $('#loading').hide();
            let postsHtml = '';
            const uniquePosts = new Map();

            $(data).find('entry').each(function() {
                const $entry = $(this);
                const post = extractPostDetails($entry);

                if (post.imgSrc && !uniquePosts.has(post.imgSrc)) {
                    uniquePosts.set(post.imgSrc, post);
                }
            });

            // Randomize and limit posts
            const shuffledPosts = Array.from(uniquePosts.values())
                .sort(() => 0.5 - Math.random())
                .slice(0, 12);

            shuffledPosts.forEach(post => {
                postsHtml += createPostCard(post);
            });

            $('#posts-container').html(postsHtml);

            // Post animation
        const postElements = document.querySelectorAll('.rss-post-container');
        postElements.forEach((post, index) => {
            post.style.animationDelay = `${index * 100}ms`;
            post.classList.add('post-enter');
        });
        },
        error: function(jqXHR, textStatus, errorThrown) {
            $('#loading').html(`
                <div class="alert alert-danger" data-aos="fade-in">
                    Error loading content: ${textStatus}
                </div>
            `);
        }
    });
});
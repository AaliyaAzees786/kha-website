const spaceId = 'wv6uydlm1qhl';
const accessToken = 'tOgS7tqVk2csnqP8jpTP6exImf9R7lNloU6Ba1gqVZw';

// Fetch gallery data from Contentful
async function fetchGallery() {
    try {
        const response = await fetch(
            `https://cdn.contentful.com/spaces/${spaceId}/entries?content_type=khaGallery`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
        const data = await response.json();
        displayGallery(data);
    } catch (error) {
        console.error('Error fetching gallery data:', error);
    }
}

// Display the fetched gallery images
function displayGallery(data) {
    const gallery = document.getElementById('gallery');
    const assets = data.includes.Asset;

    // Generate HTML for gallery images
    const html = assets.map(asset => {
        const imageUrl = 'https:' + asset.fields.file.url;
        const title = asset.fields.title || 'Gallery Image';
        return `
            <div class="gallery-item">
                <img src="${imageUrl}" alt="${title}">
            </div>
        `;
    }).join('');

    gallery.innerHTML = html;

    // Initialize lightbox functionality after gallery images are added
    initializeLightbox();
}

// Initialize lightbox functionality
function initializeLightbox() {
    const gallery = document.getElementById('gallery');
    const lightbox = document.querySelector('.lightbox');
    const lightboxImg = lightbox.querySelector('img');
    const closeBtn = document.querySelector('.close-lightbox');
    const prevBtn = document.querySelector('.prev-button');
    const nextBtn = document.querySelector('.next-button');
    let currentIndex = 0;

    const images = Array.from(gallery.querySelectorAll('.gallery-item img'));

    // Show lightbox when an image is clicked
    gallery.addEventListener('click', function (e) {
        const clickedImg = e.target.closest('.gallery-item img');
        if (!clickedImg) return;

        currentIndex = images.indexOf(clickedImg);
        showImage(currentIndex);
        lightbox.classList.add('active');
    });

    // Close the lightbox
    closeBtn.addEventListener('click', function () {
        lightbox.classList.remove('active');
    });

    // Navigate to the previous image
    prevBtn.addEventListener('click', function () {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        showImage(currentIndex);
    });

    // Navigate to the next image
    nextBtn.addEventListener('click', function () {
        currentIndex = (currentIndex + 1) % images.length;
        showImage(currentIndex);
    });

    // Show the selected image in the lightbox
    function showImage(index) {
        const selectedImage = images[index];
        lightboxImg.src = selectedImage.src;
        lightboxImg.alt = selectedImage.alt;
    }

    // Close lightbox with the Escape key
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            lightbox.classList.remove('active');
        }
    });
}

// Fetch gallery on page load
fetchGallery();

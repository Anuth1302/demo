document.addEventListener('DOMContentLoaded', () => {
    const mainImage = document.getElementById('main-image');
    const thumbnails = document.getElementById('thumbnails');
    const loadingIndicator = document.getElementById('loading');
    const leftArrow = document.getElementById('prev-btn');
    const rightArrow = document.getElementById('next-btn');
    const addToCartBtn = document.querySelector('.add-to-cart-btn');
    const confirmationMessage = document.getElementById('confirmation-message');
    
    let images = [];
    let currentIndex = 0;

    const API_URL = 'https://picsum.photos/v2/list?page=1&limit=5';
    async function fetchImages() {
        try {
            loadingIndicator.style.display = 'block';
            const response = await fetch(API_URL);
            const data = await response.json();
            images = data.map(item => item.download_url);
            renderCarousel(images);
        } catch (error) {
            console.error('Error fetching images:', error);
        }
    }

    
    function renderCarousel(images) {
        loadingIndicator.style.display = 'none';
        mainImage.src = images[currentIndex];
        
        thumbnails.innerHTML = ''; 
        images.forEach((img, index) => {
            const thumb = document.createElement('img');
            thumb.src = img;
            thumb.classList.add('thumbnail');
            if (index === currentIndex) {
                thumb.classList.add('active');
            }
            thumb.addEventListener('click', () => updateMainImage(index));
            thumbnails.appendChild(thumb);
        });
    }

    
    function updateMainImage(index) {
        currentIndex = index;
        mainImage.src = images[currentIndex];
        document.querySelectorAll('.thumbnail').forEach((thumb, i) => {
            thumb.classList.toggle('active', i === index);
        });
    }

    leftArrow.addEventListener('click', () => navigateCarousel(-1));
    rightArrow.addEventListener('click', () => navigateCarousel(1));

    function navigateCarousel(direction) {
        currentIndex = (currentIndex + direction + images.length) % images.length;
        updateMainImage(currentIndex);
    }

    let startX = 0;

    mainImage.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
    });

    mainImage.addEventListener('touchend', (e) => {
        const endX = e.changedTouches[0].clientX;
        if (startX - endX > 50) {
            navigateCarousel(1)
        } else if (endX - startX > 50) {
            navigateCarousel(-1)
        }
    });

    addToCartBtn.addEventListener('click', () => {
        confirmationMessage.classList.remove('hidden');
        setTimeout(() => {
            confirmationMessage.classList.add('hidden');
        }, 2000);
    });

    fetchImages();
});

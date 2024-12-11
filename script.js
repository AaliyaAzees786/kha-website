// Navbar active state
const navLinks = document.querySelectorAll('.nav-item');

navLinks.forEach(link => {
  link.addEventListener('click', () => {
    navLinks.forEach(link => link.classList.remove('active'));
    link.classList.add('active');
  });
});

// Hamburger Menu toggle
function toggleMenu() {
  const navLinks = document.querySelector('.nav-links');
  navLinks.classList.toggle('active');
}

// Slider functionality
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');
let currentSlide = 0;

function showSlide(index) {
  // Hide all slides and remove active class from dots
  slides.forEach(slide => slide.classList.remove('active'));
  dots.forEach(dot => dot.classList.remove('active'));

  // Show the selected slide and activate the corresponding dot
  slides[index].classList.add('active');
  dots[index].classList.add('active');
}

function nextSlide() {
  currentSlide = (currentSlide + 1) % slides.length; // Loop back to the first slide
  showSlide(currentSlide);
}

// Auto-slide every 5 seconds
setInterval(nextSlide, 5000);

// Dot navigation
dots.forEach((dot, index) => {
  dot.addEventListener('click', () => {
    currentSlide = index;
    showSlide(currentSlide);
  });
});

// Initialize the first slide
showSlide(currentSlide);

document.addEventListener('DOMContentLoaded', function() {
  const gallery = document.querySelector('.gallery-grid');
  const lightbox = document.querySelector('.lightbox');
  const lightboxImg = lightbox.querySelector('img');
  const closeBtn = document.querySelector('.close-lightbox');
  const prevBtn = document.querySelector('.prev-button');
  const nextBtn = document.querySelector('.next-button');
  let currentIndex = 0;
  const images = document.querySelectorAll('.gallery-item img');

  gallery.addEventListener('click', function(e) {
      const clickedImg = e.target.closest('.gallery-item img');
      if (!clickedImg) return;

      currentIndex = Array.from(images).indexOf(clickedImg);
      showImage(currentIndex);
      lightbox.classList.add('active');
  });

  closeBtn.addEventListener('click', function() {
      lightbox.classList.remove('active');
  });

  prevBtn.addEventListener('click', function() {
      currentIndex = (currentIndex - 1 + images.length) % images.length;
      showImage(currentIndex);
  });

  nextBtn.addEventListener('click', function() {
      currentIndex = (currentIndex + 1) % images.length;
      showImage(currentIndex);
  });

  function showImage(index) {
      lightboxImg.src = images[index].src;
      lightboxImg.alt = images[index].alt;
  }

  // Close lightbox with escape key
  document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
          lightbox.classList.remove('active');
      }
  });
});

const rotatingText = document.getElementById('rotating-text');
const phrases = ['Preserving Tradition', 'Celebrating Culture'];
let currentPhraseIndex = 0;

setInterval(() => {
  currentPhraseIndex = (currentPhraseIndex + 1) % phrases.length;
  rotatingText.textContent = phrases[currentPhraseIndex];
}, 3000); // Change every 3 seconds

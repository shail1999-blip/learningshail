const openPopupBtn = document.querySelector('.open-popup-btn');
const backdrop = document.querySelector('.backdrop');
const closeBtn = document.querySelector('.close-btn');

// Open popup
openPopupBtn.addEventListener('click', () => {
    backdrop.style.display = 'flex';
});

// Close popup
closeBtn.addEventListener('click', () => {
    backdrop.style.display = 'none';
});

// Close popup when clicking outside of it
backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) {
        backdrop.style.display = 'none';
    }
});

const showModalBtn = document.querySelector('.show-modal-btn');
const overlay = document.querySelector('.overlay');
const dismissBtn = document.querySelector('.dismiss-btn');

// Open popup
showModalBtn.addEventListener('click', () => {
    overlay.style.display = 'flex';
});

// Close popup
dismissBtn.addEventListener('click', () => {
    overlay.style.display = 'none';
});

// Close popup when clicking outside of it
overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
        overlay.style.display = 'none';
    }
});


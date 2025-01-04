// Initialize animations
document.addEventListener('DOMContentLoaded', () => {

    // Add hover effect to buttons
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('mouseover', () => {
            button.style.transform = 'scale(1.05)';
        });
        button.addEventListener('mouseout', () => {
            button.style.transform = 'scale(1)';
        });
    });
});

// Add smooth scroll for Get Started button
document.querySelector('.get-started-btn').addEventListener('click', () => {
    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth'
    });
});


const loginBtn = document.querySelector('.login-btn');
const signupBtn = document.querySelector('.signup-btn');
const modalOverlay = document.querySelector('.modal-overlay');
const modal = document.querySelector('.modal');
const signupModal = document.querySelector('.signup-modal');
const loginModal = document.querySelector('.login-modal');
const tabs = document.querySelectorAll('.tab');


// Open modal
loginBtn.addEventListener('click', () => {
    modalOverlay.style.display = 'flex';
    loginModal.style.display = 'block';
    signupModal.style.display = 'none';
    tabs[0].classList.add('active');
    tabs[1].classList.remove('active');
});

signupBtn.addEventListener('click', () => {
    modalOverlay.style.display = 'flex';
    loginModal.style.display = 'none';
    signupModal.style.display = 'block';
    tabs[1].classList.add('active');
    tabs[0].classList.remove('active');
});

tabs[0].addEventListener('click', () => {
    loginModal.style.display = 'block';
    signupModal.style.display = 'none';
});

tabs[1].addEventListener('click', () => {
    loginModal.style.display = 'none';
    signupModal.style.display = 'block';
});

// Close modal when clicking outside
modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
        closeModal();
    }
});

// Handle tab switching
tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
    });
});


function closeModal() {
    const modalOverlay = document.querySelector('.modal-overlay');
    modalOverlay.style.display = 'none';
}
ScrollReveal({
    reset: true,
    distance: '100px',
    duration:2000,
    delay: 250

});

ScrollReveal().reveal(' .nav-item,.topic', { origin: 'top' });
ScrollReveal().reveal('.icon-image,.icon-money,.icon-bar-chart,.icon-date_range', { origin: 'bottom' });

ScrollReveal().reveal(' .card, .test', { origin: 'left' });
ScrollReveal().reveal('  ', { origin: 'right' });
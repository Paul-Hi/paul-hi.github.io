document.addEventListener('DOMContentLoaded', function () {

    // gtag

    window.dataLayer = window.dataLayer || [];

    function gtag() {
        dataLayer.push(arguments);
    }

    gtag('js', new Date());

    gtag('config', 'G-PYVRSFMDRL');

    // aos

    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1000,
            once: true
        });
    }

    // fade-in animation
    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(function(el) {
        el.style.opacity = '1';
    });

    // scroll arrows

    const projectScrollElements = document.querySelectorAll('.project-scroll');
    projectScrollElements.forEach(function(el) {
        el.addEventListener('click', function (e) {
            const aboutElement = document.getElementById('about');
            if (aboutElement) {
                const offsetTop = aboutElement.getBoundingClientRect().top + window.scrollY;
                window.scrollTo({ top: offsetTop, behavior: 'smooth' });
            }
        });
    });

    const toStartElements = document.querySelectorAll('.to-start');
    toStartElements.forEach(function(el) {
        el.addEventListener('click', function (e) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });

    // modal url

    if (window.location.hash) {
        const projectCardsElement = document.getElementById('project-cards');
        if (projectCardsElement) {
            const offsetTop = projectCardsElement.getBoundingClientRect().top + window.scrollY;
            window.scrollTo({ top: offsetTop, behavior: 'smooth' });
        }
        if (typeof bootstrap !== 'undefined' && bootstrap.Modal) {
            new bootstrap.Modal(window.location.hash, {}).show();
        }
    }

    // project card clicks
    const projectCardElements = document.querySelectorAll('.project-card');
    projectCardElements.forEach(function(el) {
        el.addEventListener('click', function () {
            const href = el.getAttribute('href');
            if (href) { window.location.hash = href; }
        });
    });

    function revertToOriginalURL() {
        var original = window.location.href.substring(0, window.location.href.indexOf('#'))
        history.replaceState({}, document.title, original);
    }
    
    const modalElements = document.querySelectorAll('.modal');
    modalElements.forEach(function(el) {
        el.addEventListener('hidden.bs.modal', function () {
            revertToOriginalURL();
        });
    });
});


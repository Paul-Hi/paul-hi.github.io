$(document).ready(function () {

    // gtag

    window.dataLayer = window.dataLayer || [];

    function gtag() {
        dataLayer.push(arguments);
    }

    gtag('js', new Date());

    gtag('config', 'G-PYVRSFMDRL');

    // aos

    AOS.init({
        duration: 1000
    });

    // scroll arrows

    $('.project-scroll').on('click', function (e) {
        $('html, body').animate({
            scrollTop: $("#about").offset().top
        }, 1000);
    });
    $('.to-start').on('click', function (e) {
        $('html, body').animate({
            scrollTop: $(window).scrollTop(0)
        }, 1000);
    });

    // modal url

    if (window.location.hash) {
        $('html, body').animate({
            scrollTop: $("#project-cards").offset().top
        }, 1000);
        new bootstrap.Modal(window.location.hash, {}).show();
    }

    $('.project-card').click(function () {
        window.location.hash = $(this).attr('href');
    });

    function revertToOriginalURL() {
        var original = window.location.href.substring(0, window.location.href.indexOf('#'))
        history.replaceState({}, document.title, original);
    }
    $('.modal').on('hidden.bs.modal', function () {
        revertToOriginalURL();
    });

    // mouse blob

    const mouseBlob = document.getElementById("blob");

    window.onpointermove = event => {
        const { clientX, clientY } = event;

        blob.animate({
            left: `${clientX}px`,
            top: `${clientY}px`
        }, { duration: 1000, fill: "forwards" });
    }
});


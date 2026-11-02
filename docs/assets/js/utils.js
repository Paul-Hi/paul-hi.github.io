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

    const toStartElements = document.querySelectorAll('.to-start');
    toStartElements.forEach(function(el) {
        el.addEventListener('click', function (e) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });

    // BibTeX copy button with fallback for insecure origins (e.g. 0.0.0.0)
    function copyText(text) {
        if (navigator.clipboard && window.isSecureContext) {
            return navigator.clipboard.writeText(text);
        }
        return new Promise(function (resolve, reject) {
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed';
            textarea.style.top = '-9999px';
            textarea.style.left = '-9999px';
            textarea.setAttribute('readonly', '');
            document.body.appendChild(textarea);
            textarea.focus();
            textarea.select();
            try {
                const successful = document.execCommand('copy');
                document.body.removeChild(textarea);
                if (successful) {
                    resolve();
                } else {
                    reject(new Error('Copy command failed'));
                }
            } catch (err) {
                document.body.removeChild(textarea);
                reject(err);
            }
        });
    }

    const copyBibtexButtons = document.querySelectorAll('.copy-bibtex-btn');
    copyBibtexButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            const container = button.closest('.position-relative');
            const codeEl = container ? container.querySelector('code') : document.getElementById('bibtex');
            if (!codeEl) return;

            const textToCopy = (codeEl.textContent || codeEl.innerText || '').trim();
            copyText(textToCopy).then(function () {
                const icon = button.querySelector('i');
                const textSpan = button.querySelector('.copy-text');
                if (icon) icon.className = 'fa-solid fa-check';
                if (textSpan) textSpan.textContent = 'Copied!';
                setTimeout(function () {
                    if (icon) icon.className = 'fa-regular fa-copy';
                    if (textSpan) textSpan.textContent = 'Copy';
                }, 2000);
            }).catch(function (err) {
                console.error('Failed to copy BibTeX: ', err);
            });
        });
    });
});


// 1. Опції Fancybox (виносимо в константу один раз)
const fancyboxOptions = {
    Toolbar: {
        display: {
            right: ["zoom", "slideshow", "fullScreen", "close"],
        },
    },
    showClass: "fancybox-fadeIn",
    hideClass: "fancybox-fadeOut",
    Images: {
        Panzoom: {
            maxScale: 1,
        },
        fit: "contain",
    },
    margin: 50,
};

// 2. Функція анімації цифр
function animateNumber(el, target) {
    let start = 0;
    const duration = 2000;
    const step = (timestamp) => {
        if (!start) start = timestamp;
        const progress = Math.min((timestamp - start) / duration, 1);
        el.innerText = Math.floor(progress * target);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// 3. Чекаємо ПОВНОГО завантаження сторінки та картинок
window.addEventListener('load', function() {
    
    // ІНІЦІАЛІЗАЦІЯ RELLAX (Паралакс)
    // Робимо це тут, коли всі висоти блоків вже стабільні
    if (document.querySelector('.rellax')) {
        var rellax = new Rellax('.rellax', {
            center: true,
            round: true,
            vertical: true,
            horizontal: false
        });
        console.log("Rellax initialized");
    }

    // Ініціалізація Fancybox
    Fancybox.bind("[data-fancybox='gallery']", fancyboxOptions);

    // Intersection Observer для появи секцій
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.01, rootMargin: '0px 0px 600px 0px' });

    document.querySelectorAll('.section-fade').forEach(section => {
        observer.observe(section);
    });

    // Анімація цифр при скролі
    const observerStats = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = +counter.getAttribute('data-target');
                animateNumber(counter, target);
                observerStats.unobserve(counter);
            }
        });
    }, { threshold: 1 });

    document.querySelectorAll('.stat-number').forEach(n => observerStats.observe(n));

    // Фільтрація Портфоліо
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            filterButtons.forEach(button => button.classList.remove('active'));
            this.classList.add('active');

            const filterValue = this.getAttribute('data-filter');

            portfolioItems.forEach(item => {
                item.classList.add('item-hidden');
                item.classList.remove('item-show');
            });

            setTimeout(() => {
                let visibleCount = 0;
                portfolioItems.forEach((item) => {
                    const isAll = filterValue === 'all';
                    const isCategory = item.getAttribute('data-category') === filterValue;

                    if (isAll || isCategory) {
                        item.style.display = 'block';
                        setTimeout(() => {
                            item.classList.remove('item-hidden');
                            item.classList.add('item-show');
                        }, visibleCount * 100);
                        visibleCount++;
                    } else {
                        item.style.display = 'none';
                    }
                });

                // Оновлюємо Fancybox після фільтрації
                Fancybox.unbind("[data-fancybox='gallery']");
                Fancybox.bind("[data-fancybox='gallery']", fancyboxOptions);
                
                // ВАЖЛИВО: Оновлюємо Rellax, бо висота сторінки змінилася після приховування карток
                if(rellax) rellax.refresh();

            }, 400);
        });
    });

    // Відгуки (Dots)
    const dots = document.querySelectorAll('.dot');
    const testimonialItems = document.querySelectorAll('.testimonial-item');

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            dots.forEach(d => d.classList.remove('active'));
            testimonialItems.forEach(item => item.classList.remove('active'));
            dot.classList.add('active');
            if(testimonialItems[index]) {
                testimonialItems[index].classList.add('active');
            }
        });
    });
});

// Функція для блогу (поза завантаженням, бо викликається з HTML)
function showPage(pageNumber) {
    const pages = document.querySelectorAll('.blog-page');
    const dots = document.querySelectorAll('.blog-dots .dot');

    pages.forEach(page => {
        page.classList.remove('active', 'fade-in');
        page.style.display = 'none';
    });

    dots.forEach(dot => dot.classList.remove('active'));

    const selectedPage = document.getElementById('page-' + pageNumber);
    if (selectedPage) {
        selectedPage.style.display = 'block';
        setTimeout(() => {
            selectedPage.classList.add('active');
            selectedPage.classList.add('fade-in');
        }, 20);
    }

    if (dots[pageNumber - 1]) {
        dots[pageNumber - 1].classList.add('active');
    }
}

const hamburger = document.querySelector('.hamburger');
const menu = document.querySelector('.menu');

hamburger.addEventListener('click', () => {
    menu.classList.toggle('active');
    // Опціонально: анімація самого гамбургера
    hamburger.classList.toggle('is-active');
});

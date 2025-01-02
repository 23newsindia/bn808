// Gallery Carousel Implementation
class GalleryCarousel {
    constructor(element, options = {}) {
        this.carousel = element;
        this.options = {
            nav: options.nav ?? true,
            navText: options.navText ?? ['<i class="fa fa-chevron-left" aria-hidden="true"></i>', '<i class="fa fa-chevron-right" aria-hidden="true"></i>'],
            margin: options.margin ?? 0,
            center: options.center ?? true,
            loop: options.loop ?? false,
            autoHeight: options.autoHeight ?? true,
            items: options.items ?? 1,
            stagePadding: options.stagePadding ?? 0,
            dots: options.dots ?? true,
            ...options
        };
        
        this.currentSlide = 0;
        this.init();
    }

    init() {
        if (!this.carousel) return;
        
        // Get all direct children as slides
        this.slides = Array.from(this.carousel.children);
        if (!this.slides.length) return;

        this.setupStructure();
        this.setupNavigation();
        this.setupDots();
        this.setupStyles();
        this.bindEvents();
        this.update();
    }

    setupStructure() {
        // Create wrapper and track
        this.wrapper = document.createElement('div');
        this.track = document.createElement('div');
        this.wrapper.className = 'owl-wrapper';
        this.track.className = 'owl-track';

        // Wrap slides
        this.slides.forEach((slide, index) => {
            const item = document.createElement('div');
            item.className = 'owl-item';
            item.style.margin = `0 ${this.options.margin}px`;
            item.appendChild(slide);
            this.track.appendChild(item);
        });

        // Build carousel structure
        this.carousel.appendChild(this.wrapper);
        this.wrapper.appendChild(this.track);
    }

    setupStyles() {
        this.wrapper.style.overflow = 'hidden';
        this.track.style.display = 'flex';
        this.track.style.transition = 'transform 0.3s ease';
        
        if (this.options.center) {
            this.track.style.justifyContent = 'center';
        }
    }

    setupNavigation() {
        if (!this.options.nav) return;

        // Create nav container
        this.navContainer = document.createElement('div');
        this.navContainer.className = 'owl-nav';
        
        // Create prev button
        const prevBtn = document.createElement('button');
        prevBtn.type = 'button';
        prevBtn.role = 'button';
        prevBtn.className = 'owl-prev';
        prevBtn.setAttribute('aria-label', 'Go to the previous item');
        prevBtn.innerHTML = this.options.navText[0];
        
        // Create next button
        const nextBtn = document.createElement('button');
        nextBtn.type = 'button';
        nextBtn.role = 'button';
        nextBtn.className = 'owl-next';
        nextBtn.setAttribute('aria-label', 'Go to the next item');
        nextBtn.innerHTML = this.options.navText[1];
        
        // Add event listeners
        prevBtn.addEventListener('click', () => this.prev());
        nextBtn.addEventListener('click', () => this.next());
        
        // Append buttons to nav container
        this.navContainer.appendChild(prevBtn);
        this.navContainer.appendChild(nextBtn);
        
        // Append nav container to carousel
        this.carousel.appendChild(this.navContainer);
    }

    setupDots() {
        if (!this.options.dots) return;

        // Create dots container
        this.dotsContainer = document.createElement('div');
        this.dotsContainer.className = 'owl-dots';
        this.dotsContainer.setAttribute('aria-label', 'Go to slide');

        // Create dot for each slide
        this.slides.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.role = 'button';
            dot.className = 'owl-dot' + (index === 0 ? ' active' : '');
            dot.setAttribute('aria-label', 'Go to slide');
            
            const span = document.createElement('span');
            dot.appendChild(span);
            
            dot.addEventListener('click', () => this.goTo(index));
            this.dotsContainer.appendChild(dot);
        });

        this.carousel.appendChild(this.dotsContainer);
    }

    updateNavigation() {
        if (!this.options.nav) return;

        const prevBtn = this.navContainer.querySelector('.owl-prev');
        const nextBtn = this.navContainer.querySelector('.owl-next');

        // Update disabled state
        prevBtn.classList.toggle('disabled', !this.options.loop && this.currentSlide === 0);
        nextBtn.classList.toggle('disabled', !this.options.loop && this.currentSlide === this.slides.length - 1);
        
        // Update nav container disabled state
        this.navContainer.classList.toggle('disabled', this.slides.length <= 1);
    }

    updateDots() {
        if (!this.options.dots) return;

        // Update active dot
        const dots = this.dotsContainer.querySelectorAll('.owl-dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentSlide);
        });

        // Update dots container disabled state
        this.dotsContainer.classList.toggle('disabled', this.slides.length <= 1);
    }

    update() {
        const itemWidth = this.getItemWidth();
        const offset = this.options.center ? 
            (this.wrapper.offsetWidth - itemWidth) / 2 : 0;
        
        const translateX = -(this.currentSlide * itemWidth) + offset + 
            (this.options.stagePadding || 0);

        this.track.style.transform = `translateX(${translateX}px)`;
        
        // Update navigation and dots
        this.updateNavigation();
        this.updateDots();
    }

    getItemWidth() {
        const firstItem = this.track.querySelector('.owl-item');
        return firstItem ? firstItem.offsetWidth + (this.options.margin * 2) : 0;
    }

    next() {
        if (this.currentSlide < this.slides.length - 1) {
            this.currentSlide++;
        } else if (this.options.loop) {
            this.currentSlide = 0;
        }
        this.update();
    }

    prev() {
        if (this.currentSlide > 0) {
            this.currentSlide--;
        } else if (this.options.loop) {
            this.currentSlide = this.slides.length - 1;
        }
        this.update();
    }

    goTo(index) {
        if (index >= 0 && index < this.slides.length) {
            this.currentSlide = index;
            this.update();
        }
    }

    bindEvents() {
        // Resize handler
        window.addEventListener('resize', () => this.update());

        // Touch events
        let startX, moveX;
        const threshold = 50;

        this.wrapper.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });

        this.wrapper.addEventListener('touchmove', (e) => {
            moveX = e.touches[0].clientX;
        });

        this.wrapper.addEventListener('touchend', () => {
            if (!startX || !moveX) return;
            
            if (startX - moveX > threshold) {
                this.next();
            } else if (moveX - startX > threshold) {
                this.prev();
            }
        });
    }
}

// Initialize galleries when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize main gallery
    document.querySelectorAll('.king-gallery-01').forEach(gallery => {
        new GalleryCarousel(gallery, {
            nav: true,
            margin: 0,
            center: true,
            stagePadding: 0,
            items: 1,
            autoHeight: true,
            loop: false,
            dots: true
        });
    });

    // Initialize gallery-04
    document.querySelectorAll('.king-gallery-04').forEach(gallery => {
        const options = {
            nav: true,
            margin: 10,
            center: false,
            loop: false,
            autoWidth: true,
            items: window.innerWidth < 1000 ? 1 : 'auto',
            responsive: true,
            dots: true
        };

        if (window.innerWidth < 1000) {
            options.center = true;
            options.autoWidth = false;
            options.autoHeight = true;
        }

        new GalleryCarousel(gallery, options);
    });
});
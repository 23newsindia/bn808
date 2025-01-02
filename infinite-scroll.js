import { CategoryLoader } from './utils/category-loader.js';

class KingInfiniteScroll {
    constructor() {
        this.container = document.getElementById('king-pagination-01');
        if (!this.container) return;

        this.isCategory = document.body.classList.contains('category');
        this.loader = this.isCategory ? new CategoryLoader() : null;
        this.itemsList = this.container.querySelector('.king-posts');
        
        this.initObserver();
    }

    async loadMoreItems() {
        const nextLink = document.querySelector('.nav-previous a')?.href;
        if (!nextLink) return;

        try {
            // Show loading indicator
            this.showLoader();

            // Load content
            const doc = this.isCategory 
                ? await this.loader.loadNextPage(nextLink)
                : await this.loadRegularPage(nextLink);

            if (!doc) return;

            // Append new items
            this.appendItems(doc);
            
            // Update navigation
            this.updateNavigation(doc);

        } catch (error) {
            console.error('Error:', error);
        } finally {
            this.hideLoader();
        }
    }

    async loadRegularPage(url) {
        const response = await fetch(url);
        const text = await response.text();
        return new DOMParser().parseFromString(text, 'text/html');
    }

    appendItems(doc) {
        const items = doc.querySelectorAll('.king-post-item');
        const fragment = document.createDocumentFragment();

        items.forEach(item => {
            const clone = item.cloneNode(true);
            fragment.appendChild(clone);
        });

        this.itemsList.appendChild(fragment);
        this.initializeImages(items);
    }

    updateNavigation(doc) {
        const newNav = doc.querySelector('.nav-previous');
        const currentNav = this.container.querySelector('.nav-previous');
        
        if (newNav) {
            currentNav.innerHTML = newNav.innerHTML;
        } else {
            currentNav.remove();
        }
    }

    initializeImages(items) {
        requestAnimationFrame(() => {
            items.forEach(item => {
                const images = item.querySelectorAll('[data-king-img-src]');
                images.forEach(img => {
                    if (img.dataset.kingImgSrc) {
                        img.src = img.dataset.kingImgSrc;
                        delete img.dataset.kingImgSrc;
                    }
                });
            });
        });
    }

    showLoader() {
        const loader = this.container.querySelector('.switch-loader');
        if (loader) loader.style.display = 'block';
    }

    hideLoader() {
        const loader = this.container.querySelector('.switch-loader');
        if (loader) loader.style.display = 'none';
    }

    initObserver() {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.loadMoreItems();
                    }
                });
            },
            { rootMargin: '100px' }
        );

        const nav = this.container.querySelector('.nav-previous');
        if (nav) observer.observe(nav);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new KingInfiniteScroll();
});
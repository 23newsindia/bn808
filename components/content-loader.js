// Content loading and handling 2
import { parseHTML, buildNextPageUrl } from '../utils/url-utils.js';
import { isCategory } from '../utils/dom-utils.js';

export class ContentLoader {
    constructor(container) {
        this.container = container;
        this.itemsList = container.querySelector('.king-posts');
    }

    async fetchNextPage(url) {
        const nextUrl = isCategory() ? buildNextPageUrl(url) : url;
        const response = await fetch(nextUrl, {
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        });
        return parseHTML(response);
    }

    appendItems(doc) {
        const newItems = Array.from(doc.querySelectorAll('.king-post-item'));
        const fragment = document.createDocumentFragment();
        
        newItems.forEach(item => {
            const clone = item.cloneNode(true);
            fragment.appendChild(clone);
        });
        
        this.itemsList.appendChild(fragment);
        return newItems;
    }

    updateNavigation(doc) {
        const newNav = doc.querySelector('.nav-previous');
        const currentNav = this.container.querySelector('.nav-previous');
        
        if (newNav) {
            currentNav.innerHTML = newNav.innerHTML;
            return true;
        } else {
            currentNav.remove();
            return false;
        }
    }

    initializeNewContent(items) {
        if (!items || !items.length) return;

        items.forEach(item => {
            // Initialize lazy loading
            const lazyImages = item.querySelectorAll('[data-king-img-src]');
            lazyImages.forEach(img => {
                const src = img.getAttribute('data-king-img-src');
                if (src) {
                    img.src = src;
                    img.removeAttribute('data-king-img-src');
                }
            });
        });

        // Notify other components
        document.dispatchEvent(
            new CustomEvent('kingNewContentLoaded', { 
                detail: { items } 
            })
        );
    }
}
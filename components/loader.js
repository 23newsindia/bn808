// Loader component for handling loading states
export class LoaderUI {
    constructor(container) {
        this.container = container;
        this.createLoader();
    }

    createLoader() {
        // Create loader element
        this.loader = document.createElement('div');
        this.loader.className = 'switch-loader';
        this.loader.innerHTML = '<span class="loader"></span>';
        this.loader.style.display = 'none';
        
        // Insert loader before navigation
        const nav = this.container.querySelector('.nav-links');
        if (nav) {
            nav.parentNode.insertBefore(this.loader, nav);
            // Hide the navigation text initially
            nav.style.visibility = 'hidden';
        }
    }

    show() {
        this.loader.style.display = 'block';
        const nav = this.container.querySelector('.nav-links');
        if (nav) {
            nav.style.visibility = 'hidden';
        }
    }

    hide() {
        this.loader.style.display = 'none';
        const nav = this.container.querySelector('.nav-links');
        if (nav) {
            nav.style.visibility = 'visible';
        }
    }
}
// Loading state management new
class LoadingState {
    constructor(container) {
        this.loading = false;
        this.finished = false;
        this.container = container;
        
        this.elements = {
            loading: this.createLoadingElement(),
            noMore: this.createNoMoreElement()
        };
    }

    createLoadingElement() {
        const el = document.createElement('div');
        el.className = 'switch-loader';
        el.innerHTML = '<span class="loader"></span>';
        el.style.display = 'none';
        this.container.appendChild(el);
        return el;
    }

    createNoMoreElement() {
        const el = document.createElement('div');
        el.className = 'load-nomore';
        el.innerHTML = '<span>No more content to load</span>';
        el.style.display = 'none';
        this.container.appendChild(el);
        return el;
    }

    startLoading() {
        this.loading = true;
        this.elements.loading.style.display = 'block';
    }

    stopLoading() {
        this.loading = false;
        this.elements.loading.style.display = 'none';
    }

    finish() {
        this.finished = true;
        this.elements.noMore.style.display = 'block';
    }
}

export { LoadingState };
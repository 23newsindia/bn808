// Specialized loader for category pages
export class CategoryLoader {
    constructor() {
        this.pageCache = new Map();
        this.currentPage = 1;
        this.isLoading = false;
    }

    async loadNextPage(url) {
        if (this.isLoading) return null;
        
        try {
            this.isLoading = true;
            const nextUrl = this.buildUrl(url);
            
            // Check cache
            if (this.pageCache.has(nextUrl)) {
                return this.pageCache.get(nextUrl);
            }

            const response = await fetch(nextUrl, {
                headers: { 'X-Requested-With': 'XMLHttpRequest' }
            });

            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            
            // Cache the result
            this.pageCache.set(nextUrl, doc);
            this.currentPage++;
            
            return doc;
        } catch (error) {
            console.error('Loading error:', error);
            return null;
        } finally {
            this.isLoading = false;
        }
    }

    buildUrl(baseUrl) {
        const url = new URL(baseUrl);
        url.searchParams.set('paged', this.currentPage + 1);
        return url.toString();
    }
}
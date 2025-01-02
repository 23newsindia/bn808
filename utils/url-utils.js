// URL handling utilities 2
export const buildNextPageUrl = (url) => {
    const urlObj = new URL(url);
    const pageParam = urlObj.searchParams.get('paged') || urlObj.searchParams.get('page');
    
    if (pageParam) {
        urlObj.searchParams.set('paged', parseInt(pageParam) + 1);
    } else {
        urlObj.searchParams.append('paged', '2');
    }
    
    return urlObj.toString();
};

export const parseHTML = async (response) => {
    const text = await response.text();
    const parser = new DOMParser();
    return parser.parseFromString(text, 'text/html');
};
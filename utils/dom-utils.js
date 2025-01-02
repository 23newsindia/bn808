// DOM utility functions
export const createElement = (html) => {
    const div = document.createElement('div');
    div.innerHTML = html.trim();
    return div.firstChild;
};

export const getNextPageLink = () => {
    return document.querySelector('.nav-previous a')?.href;
};

export const isCategory = () => {
    return document.body.classList.contains('category');
};
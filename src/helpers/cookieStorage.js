const COOKIE_MAX_AGE = 10800;
const COOKIE_NAME = 'saved_colors_collection';

export const setColorsCookie = (value) => {
    const date = new Date();
    date.setTime(date.getTime() + (COOKIE_MAX_AGE * 1000));
    const expires = "; expires=" + date.toUTCString();
    document.cookie = COOKIE_NAME + "=" + encodeURIComponent(JSON.stringify(value)) + expires + "; path=/; SameSite=Strict";
};

export const getColorsCookie = () => {
    const nameEQ = COOKIE_NAME + "=";
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        let c = cookies[i].trim();
        if (c.indexOf(nameEQ) === 0) {
            try {
                return JSON.parse(decodeURIComponent(c.substring(nameEQ.length, c.length)));
            } catch (e) {
                return null;
            }
        }
    }
    return null;
};

export const defaultColors = [
    { id: 1, name: 'YELLOWGREEN', activeType: 'RGB', codes: { RGB: '154, 205, 50' } },
    { id: 2, name: 'DARKCYAN', activeType: 'RGBA', codes: { RGBA: '0, 139, 139, 1', HEX: '#008B8B' } },
    { id: 3, name: 'ORANGERED', activeType: 'HEX', codes: { HEX: '#FF4500', RGB: '255, 69, 0', RGBA: '255, 69, 0, 1' } }
];

export const getCssColor = (color) => {
    if (!color) return 'transparent';
    if (color.codes && color.activeType && color.codes[color.activeType]) {
        const code = color.codes[color.activeType];
        if (color.activeType === 'HEX') return code;
        if (color.activeType === 'RGB') return `rgb(${code})`;
        if (color.activeType === 'RGBA') return `rgba(${code})`;
    }
    return 'transparent';
};

export const USER_DATA_KEY = 'USER_DATA';
export const TOKEN_KEY = 'TOKEN_KEY';

export function getToken() {
    return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
    localStorage.setItem(TOKEN_KEY, token);
}
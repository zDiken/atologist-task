export const setAuthState = (userData) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('authUser', JSON.stringify({ ...userData, isLoggedIn: true, loginTime: new Date().toISOString() }));
    }
};

export const getAuthState = () => {
    if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('authUser');
        return stored ? JSON.parse(stored) : null;
    }
    return null;
};

export const isLoggedIn = () => {
    if (typeof window !== 'undefined') {
        const auth = localStorage.getItem('authUser');
        return auth ? JSON.parse(auth).isLoggedIn === true : false;
    }
    return false;
};

export const logout = () => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('authUser');
    }
};

function getCookie(cookieName) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${cookieName}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

axios.interceptors.request.use(config => {
    const csrfToken = getCookie('csrfToken');
    console.log('CSRF 토큰:', csrfToken);
    if (csrfToken) {
        config.headers['X-CSRF-TOKEN'] = csrfToken;
    }
    config.withCredentials = true; 
    return config;
}, error => {
    return Promise.reject(error);
});
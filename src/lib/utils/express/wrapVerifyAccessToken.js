exports.wrapVerifyAccessToken = (middleware) => {
    return (socket, next) => {
        const req = socket.request;
        
        const cookieHeader = socket.handshake.headers?.cookie || '';
        req.cookies = parseCookie(cookieHeader);

        middleware(req, {}, next);
    };
};

function parseCookie(cookieString) {
    return cookieString.split(';').reduce((cookies, item) => {
        const [key, value] = item.trim().split('=');
        if (key && value) cookies[key] = decodeURIComponent(value);
        return cookies;
    }, {});
}
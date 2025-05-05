document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const res = await axios.post('/api/v1/auth/login', { 
            email, password 
        }, {
            headers: {
                'Content-Type': 'application/json'
                }
        });
        const token = res.data.accessToken;
        sessionStorage.setItem('accessToken', token);
        alert('로그인 성공');
        window.location.href = '/my-chats'; 
    } catch (error) {
        alert('로그인 실패, 다시 시도해주세요.');
        console.error(error);
    }
});
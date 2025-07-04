let socket;

// JWT에서 사용자 ID 추출 
function getUserIdFromAccessToken(token) {
    try {
        const payload = token.split('.')[1];
        const decoded = JSON.parse(atob(payload));
        return decoded.id;
    } catch (error) {
        console.error('JWT 토큰 파싱 실패', error);
        return null;
    }
}

// 초기 데이터 세팅 
const token = sessionStorage.getItem('accessToken'); 
const projectId = window.location.pathname.split('/')[2]; 
let lastChatId = null; 
let currentUser = getUserIdFromAccessToken(token); 
const renderChatIds = new Set();  

function renderChatMessage(data, currentUser, prepend = false) {    
    const isTemp = typeof data.chatId === 'string' && data.chatId.startsWith('temp-');

    const chatBox = document.getElementById('chat-box');
    const messageDiv = document.createElement('div');
    messageDiv.dataset.id = data.chatId;
    messageDiv.textContent = `${data.userId}: ${data.message}`;

    if (isTemp) messageDiv.dataset.temp = 'true';
    
    messageDiv.classList.add('chat-message'); 

    // 업로드 순서대로 이미지 렌더링
    const urls = Array.isArray(data.imageUrls) ? data.imageUrls : [];
    if (urls) {
        urls.forEach(url => {
            const image = document.createElement('img');
            image.src = url;
            image.style.maxWidth = '200px';
            messageDiv.appendChild(image);
        });
    }

    // 본인 메시지에만 삭제 버튼 렌더링 
    if (data.userId && currentUser && String(data.userId) === String(currentUser) && !isTemp) { 
        
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '삭제';
        deleteBtn.style.marginLeft = '10px';
        deleteBtn.style.cursor = 'pointer';

        deleteBtn.addEventListener('click', async () => {
            try {
                chatBox.removeChild(messageDiv); 

                socket.emit('deleteChat', {
                    chatId: data.chatId,
                    projectId
                });
            } catch (error) {
                console.error('채팅 삭제 실패', error);
                alert('채팅 삭제를 실패했습니다.');
            }
        });

        messageDiv.appendChild(deleteBtn);
    }

    // 과거 채팅인지 아닌지 boolean으로 확인
    if (prepend) {  
        chatBox.prepend(messageDiv); 
    } else {
        chatBox.appendChild(messageDiv);
    }
}

// 프로젝트 채팅 초기화 
async function initChat() {
    try {
        // 권한 확인 
        await axios.get(`/api/v1/projects/${projectId}/chats/enter`);

        // 초기 채팅 100개 로드 
        const res = await axios.get(`/api/v1/projects/${projectId}/chats?limit=100`);
        const projectChatResponses = res.data; 

         // 소켓 연결 및 인증 정보 전송
        socket = io('/project-chat', {    
            auth: { 
                token,   
                projectId
            }
        });

        // 소켓 연결 성공 시 메시지 렌더링  
        socket.on('connect', () => {
            console.log('소켓 연결 성공:', socket.id);

            projectChatResponses.forEach(projectChat => {
                renderChatMessage({      
                    chatId: projectChat.id,
                    userId: projectChat.senderId,
                    message: projectChat.message,
                    imageUrls: Array.isArray(projectChat.imageUrls) ? projectChat.imageUrls : [] 
                }, currentUser);
            });
            
            if (projectChatResponses.length > 0) {
                lastChatId = projectChatResponses[projectChatResponses.length - 1].id; 
    
            // 입장 알림 메시지 렌더링 
            socket.on('join', (data) => {
                const chatBox = document.getElementById('chat-box');
                const message = document.createElement('div');
                message.textContent = `[${data.user}]: ${data.chat}`; 
                chatBox.appendChild(message);
            });
        }
    });   
    
        // 서버에서 온 채팅 수신 이벤트 처리 
        socket.on('chat', (data) => {
            try { 
                // 채팅 렌더링 중복 방지 
                if (renderChatIds.has(data.chatId)) return;
                    renderChatIds.add(data.chatId);

                    // optimistic UI = 동일 메시지 제거 (임시 ID로 화면에 렌더링했던 채팅 메시지 제거)  
                    const tempMessages = Array.from(document.querySelectorAll('[data-temp="true"]'));
                    const targetTempMessage = tempMessages.reverse().find(element =>
                        element.textContent === `${currentUser}: ${data.message}`
                    );
                    if (targetTempMessage) targetTempMessage.remove();
    
                    renderChatMessage(data, currentUser);
                } catch (error) {
                    console.error('채팅 메시지 수신 실패', error);
                }
    });

        // 채팅 전송 이벤트 처리 
        document.getElementById('chat-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const input = document.getElementById('chat-input');
            const imageInput = document.getElementById('chat-image');
            const message = input.value.trim();
            let imageUrls = []; 

            // 5장 초과 시 alert 
            if (imageInput.files.length > 5) {
                alert('이미지는 최대 5장까지만 업로드할 수 있습니다.');
                return;
            }

            // 메시지와 이미지 둘 다 비어 있으면 return 
            if (!message && imageInput.files.length === 0) return;

            // optimistic UI - 임시 메시지 먼저 화면에 렌더링 / 이미지 없이 텍스트만 먼저 띄워주기
            renderChatMessage({
                chatId: `temp-${Date.now()}`, 
                userId: currentUser,
                message,
                imageUrls: []  
            }, currentUser);

            // 이미지가 있다면 이미지 업로드  
            if (imageInput.files.length > 0) {
                const form = new FormData(); 
                // 선택된 모든 파일을 images라는 필드로 append 
                Array.from(imageInput.files).forEach(file =>
                    form.append('images', file)
                );

                // 업로드 라우터 경로 - 응답 data는 서버에서 내려준 URL 문자열 배열(resizedKey URLs) 
                const { data } = await axios.post(
                    `/api/v1/projects/${projectId}/chats/upload`, 
                    form, 
                    { headers: { 'Content-Type': 'multipart/form-data' }
                });
                
                imageUrls = Array.isArray(data) ? data : []; 
            }

            // 서버에 전송 - 소켓으로 메시지 + 이미지 URL 한 번에 전송
            socket.emit('chat', { 
                message, 
                userId: currentUser,
                imageUrls    
            }); 
            // 전송 후 입력 초기화 
            input.value = '';
            imageInput.value = '';
        });

        // 과거 채팅 무한스크롤 로딩 
        document.getElementById('chat-box').addEventListener('scroll', async function() {
            if (this.scrollTop === 0 && lastChatId) {
                try {
                    const res = await axios.get(`/api/v1/projects/${projectId}/chats`, {
                        params: { limit: 100, beforeId: lastChatId }
                    });
                    const oldProjectChatResponses = res.data;

                    oldProjectChatResponses.forEach(oldProjectChat => {
                        if (renderChatIds.has(oldProjectChat.id)) return;  
                        renderChatIds.add(oldProjectChat.id);              

                        renderChatMessage({                
                            chatId: oldProjectChat.id,
                            userId: oldProjectChat.senderId,
                            message: oldProjectChat.message,
                            imageUrls: Array.isArray(oldProjectChat.imageUrls) ? oldProjectChat.imageUrls : [] 
                    }, currentUser, true)});

                    if (oldProjectChatResponses.length > 0) {
                        lastChatId = oldProjectChatResponses[oldProjectChatResponses.length - 1].id;
                    } else {
                        console.log('더 이상 채팅을 불러올 수 없습니다.');
                    }
                } catch (error) {
                    console.error('이전 채팅 불러오기에 실패했습니다.', error);
                }
            }
        });
        
        // 삭제 이벤트 수신 시 해당 메시지 제거 
        socket.on('deleteChat', ({ chatId }) => {
            const target = document.querySelector(`.chat-message[data-id="${chatId}"]`);
            if (target) {
                target.remove();
            }
        })
    } catch (error) {
        console.error('채팅방 입장 실패', error);
        alert('채팅방 입장에 실패했습니다. 다시 로그인하거나 권한을 확인해주세요.');
    }
}

initChat();
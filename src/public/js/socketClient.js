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
        const projectChats = res.data; 

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

            projectChats.forEach(projectChat => {
                renderChatMessage({      
                    chatId: projectChat.id,
                    userId: projectChat.senderId,
                    message: projectChat.message
                }, currentUser) 
            });
            
            if (projectChats.length > 0) {
                lastChatId = projectChats[projectChats.length - 1].id; 
    
            // 입장 알림 메시지 렌더링 
            socket.on('join', (data) => {
                const chatBox = document.getElementById('chat-box');
                const message = document.createElement('div');
                message.textContent = `[${data.user}]: ${data.chat}`; 
                chatBox.appendChild(message);
            });
        }
    });   
    
        // 채팅 수신 이벤트 처리 
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
            const message = input.value.trim();

            if (!message) return;

            // optimistic UI - 임시 메시지 먼저 화면에 렌더링 
            renderChatMessage({
                chatId: `temp-${Date.now()}`, 
                userId: currentUser,
                message
            }, currentUser)


            // 서버에 전송 
            socket.emit('chat', { 
                message, 
                userId: currentUser 
            }); 
            input.value = '';
        });

        // 과거 채팅 무한스크롤 로딩 
        document.getElementById('chat-box').addEventListener('scroll', async function() {
            if (this.scrollTop === 0 && lastChatId) {
                try {
                    const res = await axios.get(`/api/v1/projects/${projectId}/chats`, {
                        params: { limit: 100, beforeId: lastChatId }
                    });
                    const oldProjectChats = res.data;

                    oldProjectChats.forEach(oldProjectChat => {
                        if (renderChatIds.has(oldProjectChat.id)) return;  
                        renderChatIds.add(oldProjectChat.id);              

                        renderChatMessage({                
                            chatId: oldProjectChat.id,
                            userId: oldProjectChat.senderId,
                            message: oldProjectChat.message
                    }, currentUser, true)});

                    if (oldProjectChats.length > 0) {
                        lastChatId = oldProjectChats[oldProjectChats.length - 1].id;
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
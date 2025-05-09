const { Server } = require('socket.io');
const { sendProjectChat: sendProjectChatService  } = require('../services/projectChatService');
const { wrapVerifyAccessToken } = require('../lib/utils/express/wrapVerifyAccessToken');
const { verifyAccessToken } = require('../middlewares/authMiddleware');
const { deleteMyChat: deleteMyChatService } = require('../services/projectChatService');

module.exports = (server, app) => {
    // Socket.IO 서버 초기화 및 네임스페이스 설정
    const io = new Server(server, { path: '/socket.io' });
    app.set('io', io);

    const chat = io.of('/project-chat'); 

    // Socket.IO 전용 JWT 인증 미들웨어 
    chat.use(wrapVerifyAccessToken(verifyAccessToken));

    // 클라이언트 소켓 연결 처리 
    chat.on('connection', (socket) => {
        console.log('project-chat 네임스페이스 접속'); 

        const projectId = socket.handshake.auth.projectId;
        const projectRoom = `project:${projectId}`;
        
        // 클라이언트를 해당 프로젝트 채팅방에 join 
        socket.join(projectRoom);                 

        // 참여자 전체에게 입장 메시지 브로드캐스트 
        chat.in(projectRoom).emit('join', {
            user: 'system',
            chat: `${socket.request.user.id} 님이 입장했습니다.`
        });
        
        // 채팅 메시지 수신 및 저장 처리 - 클라이언트에서 chat 이벤트 수신 -> DB 저장 후 프로젝트 방에 메시지 브로드캐스트 
        socket.on('chat', async (data) => {  
            try {
                const savedProjectChat = await sendProjectChatService({ message: data.message, imageUrls: data.imageUrls }, projectId, socket.request.user.id); 
                
                // 저장된 메시지 같은 방 참여자에게 전송(브로드캐스트) 
                chat.to(projectRoom).emit('chat', {
                    userId: savedProjectChat.sender_id,    
                    message: savedProjectChat.message,
                    chatId: savedProjectChat.id ,
                    imageUrls: savedProjectChat.image_urls ? JSON.parse(savedProjectChat.image_urls) : [] 
                }); 
        } catch (error) {
            console.error('소켓 채팅 전송 실패', error);
        }
    });

    // 채팅 삭제 처리 - 본인메시지만 삭제 가능, 삭제 후 프로젝트 방에 deleteChat 이벤트 전송 
    socket.on('deleteChat', async ({ chatId }) => {
        try {
            await deleteMyChatService(projectId, chatId, socket.request.user.id); 
            chat.to(projectRoom).emit('deleteChat', { chatId });
        } catch (error) {
            console.error('채팅 삭제 실패', error);
        }
    });
});

};

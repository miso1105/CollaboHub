module.exports = {
    UNATHORIZED: {
        status: 401,
        message: '인증이 필요합니다.',
        code: 'ERR_UNATHORIZED',
    }, 
    FORBIDDEN: {
        status: 403,
        message: '접근 권한이 없습니다.',
        code: 'ERR_FORBIDDEN',
    },
    NOT_FOUND: {
        status: 404,
        message: '요청한 리소스를 찾을 수 없습니다.',
        code: 'ERR_NOT_FOUND',
    },
    BAD_REQUEST: {
        status: 400,
        message: '잘못된 요청입니다.',
        code: 'ERR_BAD_REQUEST',
    },
    VALIDATION_ERROR: {
        status: 400,
        message: '입력 값이 유효하지 않습니다.',
        code: 'ERR_VALIDATION',
    },
    INTERNAL_SERVER_ERROR: {
        status: 500,
        message: '서버 내부 오류',
        code: 'ERR_INTERNER_SERVER',
    },
    DB_CONNECTION_ERROR: {
        status: 503,
        message: '데이터베이스 연결에 실패했습니다.',
        code: 'ERR_DB_CONNECTION',
    },
    DB_QUERY_ERROR: {
        status: 500,
        message: 'DB 쿼리 처리 중 오류가 발생했습니다.',
        code: 'ERR_DB_QUERY',
    },
    FILE_TOO_LARGE: {
        status: 400,
        message: '업로드 가능한 파일의 크기를 초과했습니다.',
        code: 'ERR_FILE_TOO_LARGE',
    },
    FILE_TYPE_NOT_ALLOWED: {
        status: 400,
        message: '허용되지 않은 파일 형식입니다.',
        code: 'ERR_FILE_TYPE_NOT_ALLOWED',
    },
    SOCKET_CONNECTION_ERROR: {
        status: 500,
        message: '소켓 연결에 실패했습니다.',
        code: 'ERR_SOCKET_CONNECTION',
    },
    TOKEN_EXPIRED_ERROR: {
        status: 419,
        message: '토큰이 만료되었습니다.',
        code: 'ERR_TOKEN_EXPIRED',
    },
    INVALID_TOKEN_ERROR: {
        status: 401,
        message: '유효하지 않은 토큰입니다.',
        code: 'ERR_INVALID_TOKEN',
    },
};
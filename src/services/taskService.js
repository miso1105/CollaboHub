const CustomError = require('../lib/errors/CustomError');
const { ERROR_CODES } = require('../lib/errors/error-codes');
const { withTransaction } = require('../lib/utils/service/withTransaction');
const { validateTask } = require('../lib/utils/validation/validateTask');
const { createTask: createTaskRepo, getTasksByProjectId: getTasksByProjectIdRepo, updateTask: updateTaskRepo, deleteTask: deleteTaskRepo } = require('../repositories/taskRepository');
const { checkTaskExists } = require('../lib/utils/validation/checkTaskExists');
const TaskResponseDTO = require('../dtos/task/TaskResponseDTO');

// verifyCollaborator 미들웨어에서 verifyProject와 verifyUser를 활용해 프로젝트와 유저의 존재 여부 검증(서비스 코드에 두 validation 메서드 사용하지 않음) 
// Tasks API 는 verifyCollaborator 미들웨어를 통해 같은 프로젝트 멤버만 접근 가능 

// [POST] 작업 생성 
exports.createTask = async (dto, userId, projectId) => {
    return withTransaction(async (connection) => {
        const { title, deadline, priority, status, description } = dto;       

        if (!title || !deadline || !priority || !status) {
            throw new CustomError(ERROR_CODES.BAD_REQUEST, '작업 제목, 마감일, 우선순위, 상태를 모두 작성해주세요.');        
        }
        
        if (!['low', 'medium', 'high'].includes(priority)) {
            throw new CustomError(ERROR_CODES.BAD_REQUEST, '우선 순위는 "low", "medium", "high" 중 선택해주세요.');
        }

        if (!['not_started', 'in_progress', 'completed'].includes(status)) {
            throw new CustomError(ERROR_CODES.BAD_REQUEST, '작업 상태는 "not_started", "in_progress", "completed" 중 선택해주세요.');
        }

        const task = await createTaskRepo(connection, userId, projectId, title, deadline, priority, status, description);
        const responseDto = new TaskResponseDTO(task);
        return responseDto;
    });
};

// [GET] 해당 프로젝트 내 작업 전체 조회   
exports.getTasksByProjectId = async (projectId) => {
    return withTransaction(async (connection) => {
        const tasks = await getTasksByProjectIdRepo(connection, projectId);
        return tasks;
    });
};

// [GET] 작업 단건 조회 
exports.getTaskById = async (taskId) => {
    return withTransaction(async (connection) => {
        const task = await validateTask(connection, taskId);
        const responseDto = new TaskResponseDTO(task);
        return responseDto;
    });
};

// [PATCH] 작업 수정 
exports.updateTask = async (dto, userId, taskId) => {
    return withTransaction(async (connection) => {
        const { title, deadline, priority, status, description } = dto;       
        if (!title || !deadline || !priority || !status) {
            throw new CustomError(ERROR_CODES.BAD_REQUEST, '작업 제목, 마감일, 우선순위, 상태를 모두 작성해주세요.');        
        }
        
        if (!['low', 'medium', 'high'].includes(priority)) {
            throw new CustomError(ERROR_CODES.BAD_REQUEST, '우선 순위는 "low", "medium", "high" 중 선택해주세요.');
        }
        
        if (!['not_started', 'in_progress', 'completed'].includes(status)) {
            throw new CustomError(ERROR_CODES.BAD_REQUEST, '작업 상태는 "not_started", "in_progress", "completed" 중 선택해주세요.');
        }

        await validateTask(connection, taskId); 

        // 유저가 해당 작업의 작성자인지 확인 
        await checkTaskExists(connection, taskId, userId);
        const task = await updateTaskRepo(connection, taskId, title, deadline, priority, status, description);
        const responseDto = new TaskResponseDTO(task);
        return responseDto;
    });
};


// [DELETE] 작업 삭제 
exports.deleteTask = async (taskId, userId) => {
    return withTransaction(async (connection) => {
        // 유저가 해당 작업의 작성자인지 확인 
        await checkTaskExists(connection, taskId, userId);
        await deleteTaskRepo(connection, taskId, userId);
    });
};


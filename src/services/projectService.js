const ProjectResponseDTO = require('../dtos/project/ProjectResponseDTO');
const CustomError = require('../lib/errors/CustomError');
const { ERROR_CODES } = require('../lib/errors/error-codes');
const { withTransaction } = require('../lib/utils/service/withTransaction');
const { validateProject } = require('../lib/utils/validation/validateProject');
const { validateDate } = require('../lib/utils/validation/validateRequest');
const { validateUser } = require('../lib/utils/validation/validateUser');
const { validateRecruit } = require('../lib/utils/validation/validateRecruit');
const { updateRecruitmentProjectId } = require('../repositories/recruitRepository');
const { createProject: createProjectRepo, getAllProjects: getAllProjectsRepo, getMyProjects: getMyProjectsRepo, getProjectById: getProjectByIdRepo, updateProject: updateProjectRepo, deleteProject: deleteProjectRepo } = require('../repositories/projectRepository');
const { createCollaborators } = require('../repositories/collaboratorRepository');

exports.createProject = async(dto, userId) => {
    return withTransaction(async (connection) => {
        const { projectName, content, deadline, recruitId } = dto;
        if (!projectName || !content || !deadline) {
            throw new CustomError(ERROR_CODES.BAD_REQUEST, '프로젝트 명, 프로젝트 내용, 프로젝트의 마감일을 모두 작성해주세요.');
        }
        await validateDate(deadline);
        await validateUser(connection, userId);
        const project = await createProjectRepo(connection, projectName, content, deadline, userId);

        // 프로젝트 생성 시 collaborators에 리더 등록
        await createCollaborators(connection, {
            userId,
            projectId: project.id,
            role: 'leader',
        });

        // 모집 공고에 연결되는 프로젝트 id 등록
        const recruit = await validateRecruit(connection, recruitId);
        if (recruit.writer !== userId || project.leader_id !== userId) { 
            throw new CustomError(ERROR_CODES.FORBIDDEN, '본인이 작성한 공고와 본인이 작성한 프로젝트만 연결할 수 있습니다.');
        }
        await updateRecruitmentProjectId(connection, recruitId, project.id);

        const responseDto = new ProjectResponseDTO(project);
        return responseDto;
    });
};

exports.getAllProjects = async() => {
    return withTransaction(async (connection) => {
        const projects = await getAllProjectsRepo(connection);
        return projects;
    });
};


exports.getMyProjects = async(userId) => {
    return withTransaction(async (connection) => {
        const myProjects = await getMyProjectsRepo(connection, userId);
        return myProjects;
    });
};

exports.updateProject = async(dto, projectId, userId) => {
    return withTransaction(async (connection) => {
        const { projectName, content, deadline } = dto; 
        if (!projectName || !content || !deadline) {
            throw new CustomError(ERROR_CODES.BAD_REQUEST, '프로젝트 명, 내용, 마감일을 모두 작성해주세요.');
        }
        await validateProject(connection, projectId);
        await validateUser(connection, userId);
        const project = await updateProjectRepo(connection, projectName, content, deadline, projectId, userId);
        const responseDto = new ProjectResponseDTO(project);
        return responseDto;
    });
};

exports.deleteProject = async(projectId, userId) => {
    return withTransaction(async (connection) => {
        await validateProject(connection, projectId);
        await validateUser(connection, userId);
        await deleteProjectRepo(connection, projectId, userId)
    });
};
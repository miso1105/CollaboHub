const ProjectRequestDTO = require("../dtos/project/ProjectRequestDTO");
const ProjectResponseDTO = require("../dtos/project/ProjectResponseDTO");
const { asyncHandler } = require("../lib/utils/express/asyncHandler");
const { createProject: createProjectService, getAllProjects: getAllProjectsService, getMyProjects: getMyProjectsService, getProjectById: getProjectByIdService, updateProject: updateProjectService, deleteProject: deleteProjectService } = require('../services/projectService');

// 프로젝트 생성 컨트롤러
exports.createProject = asyncHandler(async (req, res, next) => {
    const requestDto =  new ProjectRequestDTO(req.body);
    const userId = req.user.id;
    const responseDto = await createProjectService(requestDto, userId);
    return res.status(201).json(responseDto.toJson());
});

// 프로젝트 전체 조회 컨트롤러 
exports.getAllProjects = asyncHandler(async (req, res, next) => {
    const projects = await getAllProjectsService();
    return res.status(200).json({
        projects: ProjectResponseDTO.fromList(projects).map(p => p.toJson())
    });
});

// 내 프로젝트 조회 컨트롤러  
exports.getMyProjects = asyncHandler(async (req, res, next) => {
    const userId = req.user.id;
    const myProjects = await getMyProjectsService(userId);
    return res.status(200).json({
        myProjects: ProjectResponseDTO.fromList(myProjects).map(p => p.toJson())
    });
});

// 프로젝트 단건 조회 컨트롤러 
exports.getProjectById = asyncHandler(async (req, res, next) => {
    const projectId = req.params.id;
    const responseDto = await getProjectByIdService(projectId);
    return res.status(200).json(responseDto.toJson());
});

// 프로젝트 수정 컨트롤러 
exports.updateProject = asyncHandler(async (req, res, next) => {
    const requestDto = new ProjectRequestDTO(req.body);
    const projectId = req.params.id;
    const userId = req.user.id;
    const responseDto = await updateProjectService(requestDto, projectId, userId);
    return res.status(200).json(responseDto.toJson());
});

// 프로젝트 삭제 컨트롤러 
exports.deleteProject = asyncHandler(async (req, res, next) => {
    const projectId = req.params.id;
    const userId = req.user.id;
    await deleteProjectService(projectId, userId);
    return res.status(200).json({
        deletedProjectId: projectId,
    });
});
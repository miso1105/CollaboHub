const { createTask: createTaskService, getTasksByProjectId: getTasksByProjectIdService, getTaskById: getTaskByIdService, updateTask: updateTaskService, deleteTask: deleteTaskService } = require('../services/taskService');
const { asyncHandler } = require('../lib/utils/express/asyncHandler');
const TaskRequestDTO = require('../dtos/task/TaskRequestDTO');
const TaskResponseDTO = require('../dtos/task/TaskResponseDTO');

exports.createTask = asyncHandler(async (req, res, next) => {
    const requestDto = new TaskRequestDTO(req.body);
    const userId = req.user.id;
    const projectId = req.params.projectId;
    const responseDto = await createTaskService(requestDto, userId, projectId);
    res.status(201).json(responseDto.toJson());
});

exports.getTasksByProjectId = asyncHandler(async (req, res, next) => {
    const projectId = req.params.projectId;
    const tasks = await getTasksByProjectIdService(projectId);
    res.status(200).json({
        projectId,
        tasks: TaskResponseDTO.fromList(tasks).map(t => t.toJson())
    })
});

exports.getTaskById = asyncHandler(async (req, res, next) => {
    const taskId = req.params.taskId;
    const responseDto = await getTaskByIdService(taskId);
    res.status(200).json({
        taskId,
        task: responseDto.toJson()
    });
});

exports.updateTask = asyncHandler(async (req, res, next) => {
    const requestDto = new TaskRequestDTO(req.body);
    const taskId = req.params.taskId;
    const userId = req.user.id;
    const responseDto = await updateTaskService(requestDto, userId, taskId);
    res.status(200).json(responseDto.toJson());
});

exports.deleteTask = asyncHandler(async (req, res, next) => {
    const taskId = req.params.taskId;
    const userId = req.user.id;
    await deleteTaskService(taskId, userId);
    res.status(200).json({
        deletedTaskId: taskId
    })
});

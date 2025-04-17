const { findTaskById } = require("../../../repositories/taskRepository");
const CustomError = require("../../errors/CustomError");
const { ERROR_CODES } = require("../../errors/error-codes");

exports.validateTask = async (connection, taskId) => {
    const task = await findTaskById(connection, taskId);
    if (!task) {
        throw new CustomError(ERROR_CODES.NOT_FOUND, '해당 작업이 없습니다.');
    }
    return task;
};
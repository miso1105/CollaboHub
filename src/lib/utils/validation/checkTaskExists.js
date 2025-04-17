const { findTaskByTaskIdAndUserId } = require("../../../repositories/taskRepository");
const CustomError = require("../../errors/CustomError");
const { ERROR_CODES } = require("../../errors/error-codes");

exports.checkTaskExists = async (connection, taskId, userId) => {
    const task = await findTaskByTaskIdAndUserId(connection, taskId, userId);
    if (!task) {
        throw new CustomError(ERROR_CODES.FORBIDDEN, '해당 작업의 작성자가 아닙니다.');
    }
};
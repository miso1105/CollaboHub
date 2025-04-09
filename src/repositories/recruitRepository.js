const { handleDbError } = require('../lib/utils/db/handleDbError');

exports.createRecruit = async(connection, userId, projectName, content, deadline, recruitmentField) => {
    try {
        const query = `INSERT INTO recruitments (writer, project_name, content, deadline, recruitment_field) VALUES (?, ?, ?, ?, ?)`;
        const [result] = await connection.execute(query, [userId, projectName, content, deadline, recruitmentField]);
        const recruitId = result.insertId;
        const findRecruitQuery = `SELECT * FROM recruitments WHERE id = ?`;
        const [rows] = await connection.execute(findRecruitQuery, [recruitId]);
        return rows[0];
    } catch (error) {
        handleDbError(error);
    }
};

exports.findRecruitById = async(connection, recruitId) => {
    try {
        const query = `SELECT * FROM recruitments WHERE id = ?`;
        const [rows] = await connection.execute(query, [recruitId]);
        return rows[0];
    } catch (error) {
        handleDbError(error);
    }
};

exports.getAllRecruits = async(connection) => {
    try {
    const query = `SELECT * FROM recruitments`;
    const [rows] = await connection.execute(query);
    return rows;
    } catch (error) {
        handleDbError(error);
    }
};

exports.getMyRecruits = async(connection, userId) => {
    try {
        const query = `SELECT * FROM recruitments WHERE writer = ?`;
        const [rows] = await connection.execute(query, [userId]);
        return rows;
    } catch (error) {
        handleDbError(error);
    }
};

exports.updateRecruit = async(connection, projectName, content, deadline, recruitmentField, userId, recruitId) => {
    try {
        const query = `UPDATE recruitments SET writer = ?, project_name = ?, content= ?, deadline = ?, recruitment_field = ? WHERE id = ?`;
        await connection.execute(query, [userId, projectName, content, deadline, recruitmentField, recruitId]);
        const findRecruitQuery = `SELECT * FROM recruitments WHERE id = ?`;
        const [rows] = await connection.execute(findRecruitQuery, [recruitId]);
        return rows[0];
    } catch (error) {
        handleDbError(error);
    }
};

exports.deleteRecruit = async(connection, userId, recruitId) => {
    try {
        const query = `DELETE FROM recruitments WHERE writer = ? AND id = ?`;
        await connection.execute(query, [userId, recruitId]);
    } catch (error) {
        handleDbError(error);
    }
};
exports.createRecruit = async(connection, userId, projectName, content, deadline, recruitmentField) => {
    const query = `INSERT INTO recruitments (writer, project_name, content, deadline, recruitment_field) VALUES (?, ?, ?, ?, ?)`;
    const [result] = await connection.execute(query, [userId, projectName, content, deadline, recruitmentField]);
    const recruitId = result.insertId;
    const findRecruitQuery = `SELECT * FROM recruitments WHERE id = ?`;
    const [rows] = await connection.execute(findRecruitQuery, [recruitId]);
    return rows[0];
};

exports.findRecruitById = async (connection, recruitId) => {
    const query = `SELECT * FROM recruitments WHERE id = ?`;
    const [rows] = await connection.execute(query, [recruitId]);
    return rows[0];
};

exports.getAllRecruits = async (connection) => {
    const query = `SELECT * FROM recruitments`;
    const [rows] = await connection.execute(query);
    return rows;
};

exports.getMyRecruits = async (connection, userId) => {
    const query = `SELECT * FROM recruitments WHERE writer = ?`;
    const [rows] = await connection.execute(query, [userId]);
    return rows;
};

exports.updateRecruit = async (connection, projectName, content, deadline, recruitmentField, userId, recruitId) => {
    const query = `UPDATE recruitments SET writer = ?, project_name = ?, content= ?, deadline = ?, recruitment_field = ? WHERE id = ?`;
    await connection.execute(query, [userId, projectName, content, deadline, recruitmentField, recruitId]);
    const findRecruitQuery = `SELECT * FROM recruitments WHERE id = ?`;
    const [rows] = await connection.execute(findRecruitQuery, [recruitId]);
    return rows[0];
};

exports.deleteRecruit = async (connection, userId, recruitId) => {
    const query = `DELETE FROM recruitments WHERE writer = ? AND id = ?`;
    await connection.execute(query, [userId, recruitId]);
};

exports.updateRecruitmentProjectId = async (connection, recruitId, projectId) => {
    const query = `UPDATE recruitments SET project_id = ? WHERE id = ?`;
    await connection.execute(query, [projectId, recruitId]);
};
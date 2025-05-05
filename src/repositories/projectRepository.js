exports.findProjectById = async (connection, projectId) => {
    const query = `SELECT * FROM projects WHERE id = ?`;
    const [rows] = await connection.execute(query, [projectId]);
    return rows[0];
};

exports.createProject = async (connection, projectName, content, deadline, userId) => {
    const query = `INSERT INTO projects (project_name, content, deadline, leader_id) VALUES (?, ?, ?, ?)`;
    const [result] = await connection.execute(query, [projectName, content, deadline, userId]);
    const insertId = result.insertId;
    const selectQuery = `SELECT * FROM projects WHERE id = ?`;
    const [rows] = await connection.execute(selectQuery, [insertId]);
    return rows[0];
};

exports.getAllProjects = async (connection) => {
    const query = `SELECT * FROM projects`;
    const [rows] = await connection.execute(query);
    return rows;
};

exports.getMyProjects = async (connection, userId) => {
    const query = `SELECT  * FROM projects WHERE leader_id = ?`;
    const [rows] = await connection.execute(query, [userId]);
    return rows;
};

exports.updateProject = async (connection, projectName, content, deadline, projectId, userId) => {
    const query = `UPDATE projects SET project_name = ?, content = ?, deadline = ? WHERE id = ? AND leader_id = ?`;
    await connection.execute(query, [projectName, content, deadline, projectId, userId]);
    const selectQuery = `SELECT * FROM projects WHERE id = ?`;
    const [rows] = await connection.execute(selectQuery, [projectId]);
    return rows[0];
};

exports.deleteProject = async (connection, projectId, userId) => {
    const query = `DELETE FROM projects WHERE id = ? AND leader_id = ?`;
    await connection.execute(query, [projectId, userId]);
};

exports.getInvitedProjects = async (connection, userId) => {
    const query = `
        SELECT p.id, p.project_name 
        FROM projects p
        JOIN collaborators c ON p.id = c.project_id
        WHERE c.user_id = ? AND c.deleted_at IS NULL;
    `;
    const [rows] = await connection.execute(query, [userId]);
    return rows;
};
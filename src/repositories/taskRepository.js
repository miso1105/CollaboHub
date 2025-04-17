exports.createTask = async (connection, userId, projectId, title, deadline, priority, status, description) => {
    const query = `INSERT INTO tasks (assigner_id, project_id, title, deadline, priority, status, description) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const [result] = await connection.execute(query, [userId, projectId, title, deadline, priority, status, description]);
    const insertId = result.insertId;
    const findTaskQuery = `SELECT * FROM tasks WHERE id = ?`;
    const [rows] = await connection.execute(findTaskQuery, [insertId]);
    return rows[0];
};

exports.getTasksByProjectId = async (connection, projectId) => {
    const query = `SELECT * FROM tasks WHERE project_id = ?`;
    const [rows] = await connection.execute(query, [projectId]);
    return rows;
};

exports.findTaskById = async (connection, taskId) => {
    const query = `SELECT * FROM tasks WHERE id = ?`;
    const [rows] = await connection.execute(query, [taskId]);
    return rows[0];
};

exports.updateTask = async (connection, taskId, title, deadline, priority, status, description) => {
    const query = `UPDATE tasks SET title = ?, deadline = ?, priority = ?, status = ?, description = ? WHERE id = ?`;
    await connection.execute(query, [title, deadline, priority, status, description, taskId]);
    const findTaskQuery = `SELECT * FROM tasks WHERE id = ?`;
    const [rows] = await connection.execute(findTaskQuery, [taskId]);
    return rows[0];
};

exports.findTaskByTaskIdAndUserId = async (connection, taskId, userId) => {
    const query = `SELECT * FROM tasks WHERE id = ? AND assigner_id = ?`;
    const [rows] = await connection.execute(query, [taskId, userId])
    return rows[0];
};

exports.deleteTask = async (connection, taskId, userId) => {
    const query = `DELETE FROM tasks WHERE id = ? AND assigner_id = ?`;
    await connection.execute(query, [taskId, userId]);
};
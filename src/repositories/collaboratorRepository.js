exports.createCollaborators = async (connection, { userId, projectId, role }) => {
    const query = `INSERT INTO collaborators (user_id, project_id, role) VALUES (?, ?, ?)`;
    await connection.execute(query, [userId, projectId, role]);
};

exports.findCollaboratorByUserIdAndProjectId =  async (connection, userId, projectId) => {
    const query = `SELECT * FROM collaborators WHERE user_id = ? AND project_id = ?`;
    const [result] = await connection.execute(query, [userId, projectId]);
    return result;
};
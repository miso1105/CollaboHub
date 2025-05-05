exports.createProjectChat = async (connection, message, projectId, userId) => {
    const query = `INSERT INTO project_chats (project_id, sender_id, message) VALUES (?, ?, ?)`;
    const [result] = await connection.execute(query, [projectId, userId, message]);
    const insertId = result.insertId;
    const findprojectChatQuery = `SELECT * FROM project_chats WHERE id = ?`;
    const [rows] = await connection.execute(findprojectChatQuery, [insertId]);
    return rows[0];
};

exports.findProjectChatById = async(connection, chatId) => {
    const query = `SELECT * FROM project_chats WHERE id = ?`;
    [rows] = await connection.execute(query, [chatId]);
    return rows[0];
};

exports.deleteMyChat = async (connection, chatId, userId) => {
    const query = `DELETE FROM project_chats WHERE id = ? AND sender_id = ?`;
    await connection.execute(query, [chatId, userId]);
};

exports.findProjectChatByChatIdAndUserId = async (connection, chatId, userId) => {
    const query = `SELECT * FROM project_chats WHERE id = ? AND sender_id = ?`;
    const [rows] = await connection.execute(query, [chatId, userId]);
    return rows[0];
};

exports.getChatHistory = async (connection, projectId, safeLimit, beforeId) => {
    let query = `SELECT * FROM project_chats WHERE project_id = ?`;
    let params = [projectId];

    if (beforeId !== null && beforeId !== undefined && !isNaN(beforeId)) {
        query += ` AND id < ?`;
        params.push(beforeId);
    }

    query += ` ORDER BY id LIMIT ${safeLimit}`;

    const [rows] = await connection.execute(query, params);
    return rows;
};
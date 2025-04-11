// const { handleDbError } = require('../lib/utils/db/handleDbError');

exports.createComment = async (connection, content, parentId, userId, recruitId) => {
    const query = `INSERT INTO comments (content, parent_comment_id, commenter_id, recruitment_id) VALUES (?, ?, ?, ?)`;
    const [result] = await connection.execute(query, [content, parentId, userId, recruitId]);
    const commentId = result.insertId;
    const findCommentQuery = `SELECT * FROM comments WHERE id = ?`;
    const [rows] = await connection.execute(findCommentQuery, [commentId]);
    return rows[0];    
};

exports.getComment = async (connection, commentId) => {
    const query = `SELECT * FROM comments WHERE id = ?`;
    const [rows] = await connection.execute(query, [commentId]);
    return rows[0];
};

exports.getCommentsByRecruitId = async(connection, recruiId) => {
    const query = `SELECT * FROM comments WHERE recruitment_id = ?`;
    const [rows] = await connection.execute(query, [recruiId]);
    return rows;
};

exports.findCommentById = async(connection, commentId) => {
    const query = `SELECT * FROM comments WHERE id = ?`;
    const [rows] = await connection.execute(query, [commentId]);
    return rows[0];
};

exports.updateComment = async (connection, content, commentId) => {
    const query = `UPDATE comments SET content = ? WHERE id = ?`;
    await connection.execute(query, [content, commentId]);
    const findCommentQuery = `SELECT * FROM comments WHERE id = ?`;
    const [rows] = await connection.execute(findCommentQuery, [commentId]);
    return rows[0];    
};

exports.deleteComment = async(connection, userId, commentId) => {
    const query = `DELETE FROM comments WHERE commenter_id = ? AND id = ?`;
    await connection.execute(query, [userId, commentId]);
};
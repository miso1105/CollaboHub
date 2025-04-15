const CustomError = require("../lib/errors/CustomError");
const { ERROR_CODES } = require("../lib/errors/error-codes");

exports.createInvite = async (connection, userId, recruitId, commenterId, projectId) => {
    const query = `INSERT INTO project_invites (sender_id, receiver_id, recruit_id, project_id) VALUES (?, ?, ?, ?)`;
    const [result] = await connection.execute(query, [userId, commenterId, recruitId, projectId]);
    const insertId = result.insertId;
    const selectQuery =  `SELECT * FROM project_invites WHERE id = ?`;
    const [rows] = await connection.execute(selectQuery, [insertId]);
    return rows[0];
};

exports.findInviteById = async (connection, inviteId) => {
    const query = `SELECT * FROM project_invites WHERE id = ?`;
    const [rows] = await connection.execute(query, [inviteId]);
    return rows[0];
};

exports.getSentInvites = async (connection, senderId) => {
    const query = `SELECT 
        pi.id AS invite_id,
        pi.sender_id,
        pi.receiver_id, 
        pi.recruit_id,
        pi.status,
        pi.created_at AS sent_at,

        sender.email AS sender_email,
        receiver.email AS receiver_email,

        r.project_name AS recruit_title

    FROM project_invites pi 
    JOIN users sender ON pi.sender_id = sender.id
    JOIN users receiver ON pi.receiver_id = receiver.id
    JOIN recruitments r ON pi.recruit_id = r.id 
    WHERE pi.sender_id = ?`;
    const [rows] = await connection.execute(query, [senderId]);
    return rows
};

exports.getInvitesByUserId = async (connection, userId) => {
    const query = `SELECT 
        pi.id AS invite_id,
        pi.sender_id,
        pi.receiver_id, 
        pi.recruit_id,
        pi.status,
        pi.created_at AS sent_at,

        sender.email AS sender_email,
        receiver.email AS receiver_email,

        r.project_name AS recruit_title

    FROM project_invites pi 
    JOIN users sender ON pi.sender_id = sender.id
    JOIN users receiver ON pi.receiver_id = receiver.id
    JOIN recruitments r ON pi.recruit_id = r.id 
    WHERE pi.receiver_id = ?`;
    const [rows] = await connection.execute(query, [userId]);
    return rows;
};

exports.updateInviteStatus = async(connection, inviteId, inviteStatus) => {
    const query = `UPDATE project_invites SET status = ?, responded_at = NOW() WHERE id = ? AND status = 'pending'`;
    await connection.execute(query, [inviteStatus, inviteId]);
}; 

exports.deleteInvite = async (connection, inviteId, userId) => {
    const query = `DELETE FROM project_invites WHERE id = ? AND sender_id = ?`;
    const [result] = await connection.execute(query, [inviteId, userId]);
    if (result.affectedRows === 0) {
        throw new CustomError(ERROR_CODES.NOT_FOUND, '삭제할 초대가 존재하지 않습니다.')
    }
};
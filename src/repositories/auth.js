const { handleDbError } = require('../lib/utils/handleDbError');

exports.findUserByEmail = async (connection, email) => {
    try {
        const query = `SELECT * FROM users WHERE email = ? AND deleted_at IS NULL`;
        const [rows] = await connection.query(query, [email]);
        return rows[0];
    } catch (error) {
        handleDbError(error);
    }
};

exports.findUserByUserName = async (connection, userName) => {
    try {
        const query = `SELECT * FROM users WHERE username = ? AND deleted_at IS NULL`;
        const [rows] = await connection.query(query, [userName]);
        return rows[0];
    } catch (error) {
        handleDbError(error);
    }
};

exports.createUser = async (connection, userName, email, developmentField, hashedPassword) => {
    const query = `INSERT INTO users (username, email, development_field, password) VALUES (?, ?, ?, ?)`; 
    const [result] = await connection.execute(query, [userName, email, developmentField, hashedPassword]);
    return result;
};

exports.updateRefreshToken = async(connection, userId, refreshToken) => {
    try {
        const query = `UPDATE users SET refresh_token = ? WHERE id = ?`;
        await connection.execute(query, [refreshToken, userId]);
    } catch(error) {
        handleDbError(error);
    }
};

exports.findUserById = async (connection, userId) => {
    try {
        const query = `SELECT * FROM users WHERE id = ? AND deleted_at IS NULL`;
        const [rows] = await connection.query(query, [userId]);
        return rows[0];
    } catch (error) {
        handleDbError(error);
    }
};

exports.removeRefreshToken = async (connection, userId) => {
    try {
        const query = `UPDATE users SET refresh_token = ? WHERE id = ?`;
        await connection.execute(query, [null, userId]);
    } catch (error) {
        handleDbError(error);
    }
};

exports.deleteUser = async (connection, userId) => {
    try {
        const query = `UPDATE users SET deleted_at = NOW() WHERE id = ? AND deleted_at IS NULL`;
        await connection.query(query, [userId]);
    } catch (error) {
        handleDbError(error);
    }
};
exports.findUserByEmail = async (connection, email) => {
    const query = `SELECT * FROM users WHERE email = ? AND deleted_at IS NULL`;
    const [rows] = await connection.execute(query, [email]);
    return rows[0];
};

exports.findUserByUserName = async (connection, userName) => {
    const query = `SELECT * FROM users WHERE username = ? AND deleted_at IS NULL`;
    const [rows] = await connection.execute(query, [userName]);
    return rows[0];
};

exports.createUser = async (connection, userName, email, developmentField, hashedPassword) => {
const query = `INSERT INTO users (username, email, development_field, password) VALUES (?, ?, ?, ?)`; 
const [result] = await connection.execute(query, [userName, email, developmentField, hashedPassword]);
return result;
};

exports.updateRefreshToken = async(connection, userId, refreshToken) => {
    const query = `UPDATE users SET refresh_token = ? WHERE id = ?`;
    await connection.execute(query, [refreshToken, userId]);
};

exports.findUserById = async (connection, userId) => {
    const query = `SELECT * FROM users WHERE id = ? AND deleted_at IS NULL`;
    const [rows] = await connection.execute(query, [userId]);
    return rows[0];
};

exports.removeRefreshToken = async (connection, userId) => {
    const query = `UPDATE users SET refresh_token = ? WHERE id = ?`;
    await connection.execute(query, [null, userId]);
};

exports.deleteUser = async (connection, userId) => {
    const query = `UPDATE users SET deleted_at = NOW() WHERE id = ? AND deleted_at IS NULL`;
    await connection.execute(query, [userId]);
};